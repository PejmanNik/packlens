import { ResponseResult } from "./Result";

export type DataType = Array<Record<PropertyKey, unknown>>;

export const requestTypes = {
  init_read: "init_read",
  load_page: "load_page",
} as const;

export type RequestInitRead = {
  type: typeof requestTypes.init_read;
  id: string;
  body: {
    pageSize: number;
    parserScript?: string;
  };
};

export type RequestLoadPage = {
  type: typeof requestTypes.load_page;
  id: string;
  body: {
    pageNumber: number;
  };
};

export type Request = RequestInitRead | RequestLoadPage;

export interface DataResponse {
  data: DataType[];
  pageNumber: number;
  isPageComplete: boolean;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalEntities: number;
  totalDecodedEntities: number;
}

export interface ErrorResponse {
  error: unknown;
  errorType: ErrorTypes;
}

export enum ErrorTypes {
  ParserSyntaxError = "ParserSyntaxError",
  ParserRuntimeError = "ParserRuntimeError",
  InvalidPageNumber = "InvalidPageNumber",
  StreamError = "StreamError",
}

export function newErrorResponse(
  error: unknown,
  errorType: ErrorTypes,
): ErrorResponse {
  return { error, errorType };
}

export const responseTypes = {
  init_read: "init_read_response",
  load_page: "load_page_response",
} as const;

export type Response =
  | {
      type: typeof responseTypes.init_read;
      id: string;
      body: ResponseResult<DataResponse, ErrorResponse>;
    }
  | {
      type: typeof responseTypes.load_page;
      id: string;
      body: ResponseResult<DataResponse, ErrorResponse>;
    };
