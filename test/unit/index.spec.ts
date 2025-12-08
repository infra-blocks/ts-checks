import * as util from "node:util";
import { expect } from "@infra-blocks/test";
import { isString } from "@infra-blocks/types";
import * as sinon from "sinon";
import {
  checkNotNull,
  checkType,
  InvalidTypeError,
  type Message,
  NullValueError,
  type Type,
} from "../../src/index.js";

describe("index", () => {
  describe(checkNotNull.name, () => {
    describe("without message", () => {
      it("should throw when it's undefined", () => {
        expect(() => checkNotNull(undefined)).to.throw(
          NullValueError,
          "unexpected null value",
        );
      });
      it("should throw when it's null", () => {
        expect(() => checkNotNull(null)).to.throw(
          NullValueError,
          "unexpected null value",
        );
      });
      it("should return the provided value when it's not null", () => {
        const value = "I'm not null, I swear!";
        expect(checkNotNull(value)).to.be.equal(value);
      });
      it("should return the provided value when it's not null even if it's falsy", () => {
        expect(checkNotNull(0)).to.equal(0);
        expect(checkNotNull("")).to.equal("");
        expect(checkNotNull(false)).to.equal(false);
      });
    });
    describe("with string format parameters", () => {
      it("should respect the formatting requested", () => {
        expect(() =>
          checkNotNull(
            undefined,
            "%d is a %s you haven't %s",
            42,
            "number",
            "expected",
          ),
        ).to.throw(
          NullValueError,
          "unexpected null value: 42 is a number you haven't expected",
        );
      });
      it("should throw a formatted error when it's null", () => {
        expect(() =>
          checkNotNull(null, "%d saucisses bien %s", 666, "cuites"),
        ).to.throw(
          NullValueError,
          "unexpected null value: 666 saucisses bien cuites",
        );
      });
      it("should return the provided value when it's not null", () => {
        expect(checkNotNull(42, "where are my %d %s", 2, "keys")).to.equal(42);
      });
    });
    describe("with message provider", () => {
      it("should throw with the message provided by the provider when it's undefined", () => {
        expect(() => checkNotNull(undefined, () => "my message")).to.throw(
          NullValueError,
          "unexpected null value: my message",
        );
      });
      it("should throw with the message provided by the provider when it's null", () => {
        expect(() => checkNotNull(null, () => "boomsplosion")).to.throw(
          NullValueError,
          "unexpected null value: boomsplosion",
        );
      });
      it("should return the provided value when it's not null", () => {
        const messageFn = sinon.fake();
        expect(checkNotNull("null", messageFn)).to.equal("null");
        expect(messageFn).to.not.have.been.called;
      });
    });
  });
  describe(checkType.name, () => {
    interface TestGroupParameter {
      description: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      messageStuff: [() => string] | unknown[];
    }
    const testsGroupsParameters: TestGroupParameter[] = [
      {
        description: "without message",
        messageStuff: [],
      },
      {
        description: "with string format parameters",
        messageStuff: ["boom %s is realz %d", "splosion", 42],
      },
      {
        description: "with message provider",
        messageStuff: [(): string => "herro"],
      },
    ];

    for (const { description, messageStuff } of testsGroupsParameters) {
      describe(description, () => {
        describe("with proper type", () => {
          it("should work for undefined", () => {
            const value: unknown = undefined;
            // Check that it compiles with the proper type;
            const effective: undefined = checkType(
              value,
              "undefined",
              messageStuff[0] as string,
              ...messageStuff.slice(1),
            );
            expect(effective).to.equal(value);
          });
          it("should work for boolean", () => {
            const value: unknown = true;
            const effective: boolean = checkType(
              value,
              "boolean",
              messageStuff[0] as string,
              ...messageStuff.slice(1),
            );
            expect(effective).to.equal(value);
          });
          it("should work for number", () => {
            const value: unknown = 42;
            const effective: number = checkType(
              value,
              "number",
              messageStuff[0] as string,
              ...messageStuff.slice(1),
            );
            expect(effective).to.equal(value);
          });
          it("should work for string", () => {
            const value: unknown = "toto";
            const effective: string = checkType(
              value,
              "string",
              messageStuff[0] as string,
              ...messageStuff.slice(1),
            );
            expect(effective).to.equal(value);
          });
          it("should work for bigint", () => {
            const value: unknown = BigInt(123456789);
            const effective: bigint = checkType(
              value,
              "bigint",
              messageStuff[0] as string,
              ...messageStuff.slice(1),
            );
            expect(effective).to.equal(value);
          });
          it("should work for symbol", () => {
            const value: unknown = Symbol("mySymbol");
            const effective: symbol = checkType(
              value,
              "symbol",
              messageStuff[0] as string,
              ...messageStuff.slice(1),
            );
            expect(effective).to.equal(value);
          });
          it("should work for object", () => {
            const value: unknown = {};
            const effective: object = checkType(
              value,
              "object",
              messageStuff[0] as string,
              ...messageStuff.slice(1),
            );
            expect(effective).to.equal(value);
          });
          it("should work for null", () => {
            const value: unknown = null;
            const effective: object = checkType(
              value,
              "object",
              messageStuff[0] as string,
              ...messageStuff.slice(1),
            );
            expect(effective).to.equal(value);
          });
          it("should work for function", () => {
            const value: unknown = () => "toto";
            // biome-ignore lint/complexity/noBannedTypes: Gotta deal with Function types sometimes...
            const effective: Function = checkType(
              value,
              "function",
              messageStuff[0] as string,
              ...messageStuff.slice(1),
            );
            expect(effective).to.equal(value);
          });
        });
        describe("with invalid type", () => {
          interface TestParameter {
            type: keyof Type;
            value: unknown;
          }

          const testsParameters: TestParameter[] = [
            {
              type: "undefined",
              value: null,
            },
            {
              type: "boolean",
              value: "toto",
            },
            {
              type: "number",
              value: true,
            },
            {
              type: "string",
              value: 42,
            },
            {
              type: "bigint",
              value: 12345,
            },
            {
              type: "symbol",
              value: undefined,
            },
            {
              type: "object",
              value: Symbol("toto"),
            },
            {
              type: "undefined",
              value: null, // Null has type object
            },
            {
              type: "function",
              value: false,
            },
          ];

          for (const { type, value } of testsParameters) {
            it(`should throw for invalid ${type}`, () => {
              let expected: Message | undefined;
              const firstMessageArg = messageStuff[0];
              if (firstMessageArg == null) {
                expected = undefined;
              } else if (isString(firstMessageArg)) {
                expected = util.format(
                  firstMessageArg,
                  ...messageStuff.slice(1),
                );
              } else {
                expected = (firstMessageArg as () => string)();
              }

              expect(() =>
                checkType(
                  value,
                  type,
                  firstMessageArg as string,
                  ...messageStuff.slice(1),
                ),
              ).to.throw(InvalidTypeError, expected);
            });
          }
        });
      });
    }
  });
});
