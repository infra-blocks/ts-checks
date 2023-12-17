<<<<<<< HEAD
import * as util from "util";
import VError from "verror";
import { Nullable, isString } from "@infra-blocks/types";

type Message = string | (() => string);

export const NULL_VALUE_ERROR = "NullValueError";
export const INVALID_TYPE_ERROR = "InvalidTypeError";

export function checkNotNull<T>(value: Nullable<T>): T;
export function checkNotNull<T>(
  value: Nullable<T>,
  messageFormat: string,
  ...messageArguments: unknown[]
): T;
export function checkNotNull<T>(
  value: Nullable<T>,
  messageFunction: () => string
): T;

/**
 * Checks that a value is not null or undefined, and return that one if so.
 *
 * If the value is undefined or null, this function will throw a VError with the name exported
 * as {@link NULL_VALUE_ERROR}. Otherwise, the non null value is returned to the caller, for
 * convenient one-liners.
 *
 * Optionally, the user may provide more information to the error message. This is accomplished
 * in one of two ways:
 * - Pass a message format string as a 2nd argument and a variable amount of arguments to populate
 *   the format. Those are passed directly to the {@link util.format} function.
 * - Pass a lambda function that will return a string.
 *
 * In any case, the message is only constructed in the event of a failure. The custom message is
 * appended to the provided one.
 *
 * @param value - The value to test.
 * @param messageStuff - A lambda that returns a string, or a format string
 * (as described by util.format).
 * @param messageArguments - Varargs to be passed to util.format. This only makes sense if
 * the second argument is a format string.
 *
 * @returns The value, if it's not null.
 */
export function checkNotNull<T>(
  value: Nullable<T>,
  messageStuff?: Message,
  ...messageArguments: unknown[]
): T {
  if (value != null) {
    return value;
  }
  const message = getMessage(
    "unexpected null value",
    ": ",
    messageStuff,
    ...messageArguments
  );
  throw new VError({ name: NULL_VALUE_ERROR }, message);
}

export interface Type {
  undefined: undefined;
  boolean: boolean;
  number: number;
  string: string;
  bigint: bigint;
  symbol: symbol;
  object: object; // Beware that typeof null === "object"
  // eslint-disable-next-line @typescript-eslint/ban-types
  ["function"]: Function;
}
export function checkType<K extends keyof Type>(
  value: unknown,
  type: K
): Type[K];
export function checkType<K extends keyof Type>(
  value: unknown,
  type: K,
  messageFormat: string,
  ...messageArguments: unknown[]
): Type[K];
export function checkType<K extends keyof Type>(
  value: unknown,
  type: K,
  messageFunction: () => string
): Type[K];

/**
 * Checks that the value is of the provided type, and returns the typed value if the test succeeds.
 *
 * The check leverages typeof to do its bidding and support all the possible values that typeof might
 * return. In the event that the type check fails, an `INVALID_TYPE_ERROR` is raised.
 *
 * @param value The value to check.
 * @param type The string describing the type, as would be returned by typeof.
 * @param messageStuff - A lambda that returns a string, or a format string
 * (as described by util.format).
 * @param messageArguments - Varargs to be passed to util.format. This only makes sense if
 * the second argument is a format string.
 *
 * @returns The value, properly typed if the check succeeded.
 */
export function checkType<K extends keyof Type>(
  value: unknown,
  type: K,
  messageStuff?: Message,
  ...messageArguments: unknown[]
): Type[K] {
  const actualType = typeof value;
  if (actualType === type) {
    return value as Type[K];
  }

  const message = getMessage(
    `expected type ${type} but value is ${JSON.stringify(value)}`,
    ": ",
    messageStuff,
    ...messageArguments
  );
  throw new VError({ name: INVALID_TYPE_ERROR }, message);
}

export function checkArrayOfType<K extends keyof Type>(
  value: unknown,
  type: K
): Array<Type[K]>;
export function checkArrayOfType<K extends keyof Type>(
  value: unknown,
  type: K,
  messageFormat: string,
  ...messageArguments: unknown[]
): Array<Type[K]>;
export function checkArrayOfType<K extends keyof Type>(
  value: unknown,
  type: K,
  messageFunction: () => string
): Array<Type[K]>;
/**
 * Checks that the value is an array of the provided type, and returns the typed array value if the test succeeds.
 *
 * The check leverages typeof to do its bidding and support all the possible values that typeof might
 * return. In the event that the type check fails, an `INVALID_TYPE_ERROR` is raised.
 *
 * @param value The value to check.
 * @param type The string describing the type, as would be returned by typeof.
 * @param messageStuff - A lambda that returns a string, or a format string
 * (as described by util.format).
 * @param messageArguments - Varargs to be passed to util.format. This only makes sense if
 * the second argument is a format string.
 *
 * @returns The value, properly typed if the check succeeded.
 */
// TODO: unit test
export function checkArrayOfType<K extends keyof Type>(
  value: unknown,
  type: K,
  messageStuff?: Message,
  ...messageArguments: unknown[]
): Array<Type[K]> {
  function fail(): never {
    const message = getMessage(
      `expected array of type ${type} but value is ${JSON.stringify(value)}`,
      ": ",
      messageStuff,
      ...messageArguments
    );
    throw new VError({ name: INVALID_TYPE_ERROR }, message);
  }

  if (!Array.isArray(value)) {
    fail();
  }

  for (const item of value) {
    const actualType = typeof item;
    if (actualType !== type) {
      fail();
    }
  }

  return value as Array<Type[K]>;
}

function getMessage(
  prefix: string,
  joinedWith: string,
  messageStuff?: Message,
  ...messageArguments: unknown[]
): string {
  if (messageStuff == null) {
    return prefix;
  }
  if (isString(messageStuff)) {
    return `${prefix}${joinedWith}${util.format(
      messageStuff,
      ...messageArguments
    )}`;
  }
  return `${prefix}${joinedWith}${messageStuff()}`;
}
=======
export { testMe } from "./utils.js";
>>>>>>> template/master
