import { isString, Provider } from "@infra-blocks/types";
import * as util from "util";

export type Message = string | Provider<string>;

export function getMessage(
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
