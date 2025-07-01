import { Result } from "neverthrow";

export namespace ResponseResult {
  export function fromResult<T, E>(result: Result<T, E>): ResponseResult<T, E> {
    if (result.isOk()) {
      return { ok: true, value: result.value };
    } else {
      return { ok: false, error: result.error };
    }
  }
}
export type ResponseResult<T, E> = Ok<T> | Err<E>;

export interface Ok<T> {
  ok: true;
  value: T;
}
export interface Err<E> {
  ok: false;
  error: E;
}
