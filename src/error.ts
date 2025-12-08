import * as util from "node:util";
import { getMessage, type Message } from "./message.js";

export class NullValueError extends Error {
  constructor(message?: Message, ...messageArguments: unknown[]) {
    super(
      getMessage("unexpected null value", ": ", message, ...messageArguments),
    );
    this.name = NullValueError.name;
  }
}

export class InvalidTypeError extends Error {
  constructor(
    params: { expected: string; value: unknown },
    message?: Message,
    ...messageArguments: unknown[]
  ) {
    const { expected, value } = params;
    super(
      getMessage(
        `expected type ${expected} but value ${util.inspect(
          value,
        )} is of type ${typeof value}`,
        ": ",
        message,
        ...messageArguments,
      ),
    );
    this.name = InvalidTypeError.name;
  }
}

export class InvalidArrayTypeError extends Error {
  constructor(
    params: { expected: string; value: unknown },
    message?: Message,
    ...messageArguments: unknown[]
  ) {
    const { expected, value } = params;
    super(
      getMessage(
        `expected array of type ${expected} but got ${util.inspect(value)}`,
        ": ",
        message,
        ...messageArguments,
      ),
    );
    this.name = InvalidArrayTypeError.name;
  }
}
