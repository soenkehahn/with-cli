//@flow

import {
  object,
  partialObject,
  maybe,
  string,
  boolean
} from "validated/schema";
import {
  defaultValue,
  parseCliArguments,
  type Type,
  CliArgumentError
} from ".";

describe("defaultValue", () => {
  it("returns false for boolean", () => {
    expect(defaultValue(boolean)).toEqual(false);
  });

  it("returns null for maybe types", () => {
    expect(defaultValue(maybe(string))).toEqual(null);
  });

  it("returns the empty string for string types", () => {
    expect(defaultValue(string)).toEqual("");
  });

  it("descends into object nodes", () => {
    expect(defaultValue(object({ foo: boolean }))).toEqual({ foo: false });
  });

  it("works for multiple fields", () => {
    expect(defaultValue(object({ foo: boolean, bar: string }))).toEqual({
      foo: false,
      bar: ""
    });
  });

  it("works for nested objects", () => {
    expect(defaultValue(object({ foo: object({ bar: boolean }) }))).toEqual({
      foo: { bar: false }
    });
  });

  it("works for partial object types", () => {
    expect(defaultValue(partialObject({ foo: boolean }))).toEqual({
      foo: false
    });
  });
});

describe("parseCliArguments", () => {
  let configType: Type<{| foo: boolean |}>;

  beforeEach(() => {
    configType = object({
      foo: boolean
    });
  });

  it("allows to parse a boolean flag", () => {
    const args = parseCliArguments(configType, ["--foo"]);
    expect(args).toEqual({ foo: true });
  });

  it("returns 'false' when boolean flags are not passed in", () => {
    const args = parseCliArguments(configType, []);
    expect(args).toEqual({ foo: false });
  });

  describe("multiple flags", () => {
    let configType;
    beforeEach(() => {
      configType = object({ foo: boolean, bar: boolean });
    });

    it("works for multiple flags", () => {
      expect(parseCliArguments(configType, ["--bar"])).toEqual({
        foo: false,
        bar: true
      });
      expect(parseCliArguments(configType, ["--foo", "--bar"])).toEqual({
        foo: true,
        bar: true
      });
    });

    it("detects flags out of order", () => {
      expect(parseCliArguments(configType, ["--bar", "--foo"])).toEqual({
        foo: true,
        bar: true
      });
    });
  });

  it("returns an error for invalid arguments", () => {
    expect(() => parseCliArguments(configType, ["--invalid"])).toThrow(
      CliArgumentError("invalid argument: --invalid")
    );
  });
});
