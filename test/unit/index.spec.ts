import * as util from "util";
import {
  checkNotNull,
  checkType,
  InvalidTypeError,
  NullValueError,
  Type,
} from "../../src/index.js";
import * as sinon from "sinon";
import { isString } from "@infra-blocks/types";
import { expect } from "@infra-blocks/test";

describe("index", function () {
  describe(checkNotNull.name, function () {
    describe("without message", function () {
      it("should throw when it's undefined", function () {
        expect(() => checkNotNull(undefined)).to.throw(
          NullValueError,
          "unexpected null value"
        );
      });
      it("should throw when it's null", function () {
        expect(() => checkNotNull(null)).to.throw(
          NullValueError,
          "unexpected null value"
        );
      });
      it("should return the provided value when it's not null", function () {
        const value = "I'm not null, I swear!";
        expect(checkNotNull(value)).to.be.equal(value);
      });
      it("should return the provided value when it's not null even if it's falsy", function () {
        expect(checkNotNull(0)).to.equal(0);
        expect(checkNotNull("")).to.equal("");
        expect(checkNotNull(false)).to.equal(false);
      });
    });
    describe("with string format parameters", function () {
      it("should respect the formatting requested", function () {
        expect(() =>
          checkNotNull(
            undefined,
            "%d is a %s you haven't %s",
            42,
            "number",
            "expected"
          )
        ).to.throw(
          NullValueError,
          "unexpected null value: 42 is a number you haven't expected"
        );
      });
      it("should throw a formatted error when it's null", function () {
        expect(() =>
          checkNotNull(null, "%d saucisses bien %s", 666, "cuites")
        ).to.throw(
          NullValueError,
          "unexpected null value: 666 saucisses bien cuites"
        );
      });
      it("should return the provided value when it's not null", function () {
        expect(checkNotNull(42, "where are my %d %s", 2, "keys")).to.equal(42);
      });
    });
    describe("with message provider", function () {
      it("should throw with the message provided by the provider when it's undefined", function () {
        expect(() => checkNotNull(undefined, () => "my message")).to.throw(
          NullValueError,
          "unexpected null value: my message"
        );
      });
      it("should throw with the message provided by the provider when it's null", function () {
        expect(() => checkNotNull(null, () => "boomsplosion")).to.throw(
          NullValueError,
          "unexpected null value: boomsplosion"
        );
      });
      it("should return the provided value when it's not null", function () {
        const messageFn = sinon.fake();
        expect(checkNotNull("null", messageFn)).to.equal("null");
        expect(messageFn).to.not.have.been.called;
      });
    });
  });
  describe(checkType.name, function () {
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
      describe(description, function () {
        describe("with proper type", function () {
          it("should work for undefined", function () {
            const value: unknown = undefined;
            // Check that it compiles with the proper type;
            const effective: undefined = checkType(
              value,
              "undefined",
              messageStuff[0] as string,
              ...messageStuff.slice(1)
            );
            expect(effective).to.equal(value);
          });
          it("should work for boolean", function () {
            const value: unknown = true;
            const effective: boolean = checkType(
              value,
              "boolean",
              messageStuff[0] as string,
              ...messageStuff.slice(1)
            );
            expect(effective).to.equal(value);
          });
          it("should work for number", function () {
            const value: unknown = 42;
            const effective: number = checkType(
              value,
              "number",
              messageStuff[0] as string,
              ...messageStuff.slice(1)
            );
            expect(effective).to.equal(value);
          });
          it("should work for string", function () {
            const value: unknown = "toto";
            const effective: string = checkType(
              value,
              "string",
              messageStuff[0] as string,
              ...messageStuff.slice(1)
            );
            expect(effective).to.equal(value);
          });
          it("should work for bigint", function () {
            const value: unknown = BigInt(123456789);
            const effective: bigint = checkType(
              value,
              "bigint",
              messageStuff[0] as string,
              ...messageStuff.slice(1)
            );
            expect(effective).to.equal(value);
          });
          it("should work for symbol", function () {
            const value: unknown = Symbol("mySymbol");
            const effective: symbol = checkType(
              value,
              "symbol",
              messageStuff[0] as string,
              ...messageStuff.slice(1)
            );
            expect(effective).to.equal(value);
          });
          it("should work for object", function () {
            const value: unknown = {};
            const effective: object = checkType(
              value,
              "object",
              messageStuff[0] as string,
              ...messageStuff.slice(1)
            );
            expect(effective).to.equal(value);
          });
          it("should work for null", function () {
            const value: unknown = null;
            const effective: object = checkType(
              value,
              "object",
              messageStuff[0] as string,
              ...messageStuff.slice(1)
            );
            expect(effective).to.equal(value);
          });
          it("should work for function", function () {
            const value: unknown = () => "toto";
            // eslint-disable-next-line @typescript-eslint/ban-types
            const effective: Function = checkType(
              value,
              "function",
              messageStuff[0] as string,
              ...messageStuff.slice(1)
            );
            expect(effective).to.equal(value);
          });
        });
        describe("with invalid type", function () {
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
            it(`should throw for invalid ${type}`, function () {
              let expected;
              const firstMessageArg = messageStuff[0];
              if (firstMessageArg == null) {
                expected = undefined;
              } else if (isString(firstMessageArg)) {
                expected = util.format(
                  firstMessageArg,
                  ...messageStuff.slice(1)
                );
              } else {
                expected = (firstMessageArg as () => string)();
              }

              expect(() =>
                checkType(
                  value,
                  type,
                  firstMessageArg as string,
                  ...messageStuff.slice(1)
                )
              ).to.throw(InvalidTypeError, expected);
            });
          }
        });
      });
    }
  });
});
