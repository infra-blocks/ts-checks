import type { Nullable } from "@infra-blocks/types";
import {
  InvalidArrayTypeError,
  InvalidTypeError,
  NullValueError,
} from "./error.js";
import type { Message } from "./message.js";

/**
 * Checks that a value is not null or undefined, and return that one if so.
 *
 * If the value is undefined or null, this function will throw a {@link NullValueError}.
 * Otherwise, the non null value is returned to the caller, for convenient one-liners.
 *
 * Optionally, the user may provide more information to the error message. This is accomplished
 * in one of two ways:
 * - Pass a message format string as a 2nd argument and a variable amount of arguments to populate
 *   the format. Those are passed directly to the {@link util.format} function.
 * - Pass a provider function that will return a string.
 *
 * In any case, the message is only constructed in the event of a failure. The custom message is
 * appended to the provided one.
 *
 * @param value - The value to test.
 * @param messageStuff - A provider that returns a string, or a format string
 * (as described by util.format).
 * @param messageArguments - Varargs to be passed to util.format. This only makes sense if
 * the second argument is a format string.
 *
 * @returns The value, if it's not null.
 */
export function checkNotNull<T>(value: Nullable<T>): T;
export function checkNotNull<T>(
  value: Nullable<T>,
  messageFormat: string,
  ...messageArguments: unknown[]
): T;
export function checkNotNull<T>(
  value: Nullable<T>,
  messageProvider: () => string,
): T;
export function checkNotNull<T>(
  value: Nullable<T>,
  message?: Message,
  ...messageArguments: unknown[]
): T {
  if (value != null) {
    return value;
  }
  throw new NullValueError(message, ...messageArguments);
}

/**
 * A mapping of native Javascript types where the key is the identifier
 * returned by `typeof` and the value is the corresponding Typescript type.
 */
export interface Type {
  undefined: undefined;
  boolean: boolean;
  number: number;
  string: string;
  bigint: bigint;
  symbol: symbol;
  object: object; // Beware that typeof null === "object"
  // biome-ignore lint/complexity/noBannedTypes: Function is the valid type here.
  function: Function;
}

/**
 * Checks that the value is of the provided type, and returns the typed value if the test succeeds.
 *
 * The check leverages typeof to do its bidding and support all the possible values that typeof might
 * return. In the event that the type check fails, an {@link InvalidTypeError} is thrown.
 *
 * @param value The value to check.
 * @param type The string describing the type, as would be returned by typeof.
 * @param messageStuff - A provider that returns a string, or a format string
 * (as described by util.format).
 * @param messageArguments - Varargs to be passed to util.format. This only makes sense if
 * the second argument is a format string.
 *
 * @returns The value, properly typed if the check succeeded.
 */
export function checkType<K extends keyof Type>(
  value: unknown,
  type: K,
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
  messageProvider: () => string,
): Type[K];
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

  throw new InvalidTypeError(
    { expected: type, value },
    messageStuff,
    ...messageArguments,
  );
}

/**
 * Checks that the value is an array of the provided type, and returns the typed array value if the test succeeds.
 *
 * The check leverages typeof to do its bidding and support all the possible values that typeof might
 * return. In the event that the type check fails, an {@link InvalidTypeError} is thrown.
 *
 * @param value The value to check.
 * @param type The string describing the type, as would be returned by typeof.
 * @param messageStuff - A provider that returns a string, or a format string
 * (as described by util.format).
 * @param messageArguments - Varargs to be passed to util.format. This only makes sense if
 * the second argument is a format string.
 *
 * @returns The value, properly typed if the check succeeded.
 */
export function checkArrayOfType<K extends keyof Type>(
  value: unknown,
  type: K,
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
  messageProvider: () => string,
): Array<Type[K]>;
// TODO: unit test
export function checkArrayOfType<K extends keyof Type>(
  value: unknown,
  type: K,
  messageStuff?: Message,
  ...messageArguments: unknown[]
): Array<Type[K]> {
  function fail(): never {
    throw new InvalidArrayTypeError(
      { expected: type, value },
      messageStuff,
      ...messageArguments,
    );
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
