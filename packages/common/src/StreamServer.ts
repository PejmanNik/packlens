import { err } from "neverthrow";
import {
  RequestLoadPage,
  requestTypes,
  Request,
  Response,
  responseTypes,
  RequestInitRead,
} from "./MessageTypes";
import { ResponseResult } from "./Result";
import { Stream, StreamDecoder } from "./StreamDecoder";

export interface MessageMedium {
  postMessage(message: Response): Thenable<boolean> | void;
}

export class StreamServer {
  private streamDecoder?: StreamDecoder;
  private streamFactory: () => Stream;

  public constructor(streamFactory: () => Stream) {
    this.streamFactory = streamFactory;
  }

  public onDidReceiveMessage(message: Request, medium: MessageMedium): void {
    if (message.type === requestTypes.load_page) {
      this.processLoadPageMessage(message, medium);
    } else if (message.type === requestTypes.init_read) {
      this.processInitReadMessage(message, medium);
    }
  }

  private async processLoadPageMessage(
    message: RequestLoadPage,
    medium: MessageMedium,
  ) {
    if (!this.streamDecoder) {
      throw new Error("Stream decoder is not set.");
    }

    const data = await this.streamDecoder.page(message.body.pageNumber);
    medium.postMessage({
      type: responseTypes.load_page,
      id: message.id,
      body: ResponseResult.fromResult(data),
    });
  }

  private async processInitReadMessage(
    message: RequestInitRead,
    medium: MessageMedium,
  ) {
    await this.streamDecoder?.destroy();
    const streamDecoder = StreamDecoder.create(
      this.streamFactory(),
      message.body.pageSize,
      message.body.parserScript,
    );

    if (streamDecoder.isErr()) {
      postMessage({
        type: responseTypes.init_read,
        id: message.id,
        body: ResponseResult.fromResult(err(streamDecoder.error)),
      });

      return;
    }

    this.streamDecoder = streamDecoder.value;
    const data = await this.streamDecoder.page(1);
    medium.postMessage({
      type: responseTypes.init_read,
      id: message.id,
      body: ResponseResult.fromResult(data),
    });
  }

  public async dispose() {
    await this.streamDecoder?.destroy();
  }
}
