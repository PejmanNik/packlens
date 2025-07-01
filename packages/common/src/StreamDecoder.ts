import { decodeMultiStream } from "@msgpack/msgpack";
import { Result, err, ok } from "neverthrow";
import {
  DataType,
  DataResponse,
  ErrorResponse,
  ErrorTypes,
  newErrorResponse,
} from "./MessageTypes";
import { ReadableStream as WebReadableStream } from "stream/web";

export type Stream = ReadableStream<Uint8Array> | WebReadableStream;
type CustomParser = (data: Array<DataType>) => Array<DataType>;

const safeFunctionParse = Result.fromThrowable(
  (parserScript: string) =>
    new Function("data", `return ${parserScript};`) as CustomParser,
  (e) => newErrorResponse(e, ErrorTypes.ParserSyntaxError),
);

async function* webStreamToAsyncIterable(stream: Stream) {
  const reader = stream.getReader();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}

export class StreamDecoder {
  private pageSize: number;
  private entities: Array<DataType>;
  private currentIndex: number;
  private totalEntities: number;
  private totalDecodedEntities: number;
  private isDone: boolean;
  private customParser?: CustomParser;
  private reader: AsyncGenerator<DataType[], void, unknown>;

  private constructor(
    stream: Stream,
    pageSize: number,
    customParser?: CustomParser,
  ) {
    this.pageSize = pageSize;
    this.reader = this.buildReader(stream);
    this.entities = [];
    this.currentIndex = 0;
    this.totalEntities = 0;
    this.totalDecodedEntities = 0;
    this.isDone = false;
    this.customParser = customParser;
  }

  public static create(
    stream: ReadableStream<Uint8Array> | WebReadableStream,
    pageSize: number,
    parserScript?: string,
  ): Result<StreamDecoder, ErrorResponse> {
    const parser = !parserScript
      ? ok(undefined)
      : safeFunctionParse(parserScript);

    if (parser.isErr()) {
      return err(parser.error);
    }

    return ok(new StreamDecoder(stream, pageSize, parser.value));
  }

  private async *buildReader(stream: Stream) {
    let buffer = new Array<DataType>(this.pageSize);
    let index = 0;
    const entities = decodeMultiStream(webStreamToAsyncIterable(stream), {
      context: null,
      mapKeyConverter: (key) =>
        typeof key === "number" || typeof key === "string"
          ? key
          : JSON.stringify(key),
    });

    try {
      for await (const entity of entities) {
        buffer[index++] = entity as DataType;

        if (index === this.pageSize) {
          yield buffer;
          buffer = new Array<DataType>(this.pageSize);
          index = 0;
        }
      }

      if (index > 0) {
        yield buffer.slice(0, index);
      }
    } finally {
      // free the stream
      await entities.return();
    }
  }

  private buildResult(data: DataType[], pageNumber: number): DataResponse {
    const isPageComplete =
      this.getPageFromCache(pageNumber).length === this.pageSize;

    return {
      data,
      pageNumber: pageNumber,
      hasNextPage: !this.isDone,
      isPageComplete: isPageComplete,
      hasPreviousPage: this.currentIndex > this.pageSize,
      totalEntities: this.totalEntities,
      totalDecodedEntities: this.totalDecodedEntities,
    };
  }

  private parseData(
    data: Array<DataType>,
  ): Result<Array<DataType>, ErrorResponse> {
    try {
      if (!this.customParser) {
        return ok(data);
      }
      return ok(this.customParser(data));
    } catch (e) {
      return err(newErrorResponse(e, ErrorTypes.ParserRuntimeError));
    }
  }

  public async next(): Promise<Result<DataResponse, ErrorResponse>> {
    const result = await this.reader.next();
    const data = this.parseData(result.value ?? []);
    if (data.isErr()) {
      return err(data.error);
    }

    this.isDone = result.done ?? false;
    const pageNumber = Math.floor(this.currentIndex / this.pageSize) + 1;

    if (result.value) {
      this.totalDecodedEntities += result.value.length;
      this.currentIndex += data.value.length;
      this.totalEntities += data.value.length;
      this.entities.push(...data.value);
    }

    return ok(this.buildResult(data.value, pageNumber));
  }

  public async page(
    pageNumber: number,
  ): Promise<Result<DataResponse, ErrorResponse>> {
    if (
      pageNumber < 1 ||
      pageNumber * this.pageSize > this.currentIndex + this.pageSize
    ) {
      return err(
        newErrorResponse(
          `Invalid page number ${pageNumber}`,
          ErrorTypes.InvalidPageNumber,
        ),
      );
    }

    if (pageNumber * this.pageSize > this.currentIndex) {
      return this.next();
    }

    return ok(this.buildResult(this.getPageFromCache(pageNumber), pageNumber));
  }

  private getPageFromCache(pageNumber: number): DataType[] {
    const start = (pageNumber - 1) * this.pageSize;
    return this.entities.slice(start, start + this.pageSize);
  }

  public async destroy(): Promise<void> {
    await this.reader.return?.();
    this.entities = [];
    this.isDone = true;
  }
}
