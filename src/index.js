// @flow

import {
  type Node,
  ObjectNode,
  MaybeNode,
  BooleanNode,
  StringNode
} from "validated/schema";
import * as validated from "validated/schema";
import _ from "lodash";

export type Type<A> = Node<A>;

function unsupportedType<A, Void>(message: string, type: Type<A>): Void {
  throw new Error(`unsupported type: ${type.constructor.name} (${message})`);
}

const _defaultValue: any = type => {
  if (type instanceof ObjectNode) {
    const result: any = {};
    Object.keys(type.values).map(key => {
      result[key] = defaultValue(type.values[key]);
    });
    return result;
  } else if (type instanceof BooleanNode) {
    return false;
  } else if (type instanceof MaybeNode) {
    return null;
  } else if (type instanceof StringNode) {
    return "";
  } else {
    unsupportedType("defaultValue", type);
  }
};
export const defaultValue: <A>(Type<A>) => A = _defaultValue;

export function parseCliArguments<A>(type: Type<A>, args: Array<string>): A {
  if (type instanceof ObjectNode) {
    const result: A = defaultValue(type);
    const keys: Array<$Keys<typeof type.values>> = Object.keys(type.values);
    _.forEach(result, (value, key) => {
      const flag = `--${key}`;
      if (args.includes(flag)) {
        args = args.filter(arg => arg !== flag);
        (result: any)[key] = true;
      }
    });
    if (args.length !== 0) {
      throw new Error(
        args.map(invalidArg => `invalid argument: ${invalidArg}`).join("\n")
      );
    } else {
      return result;
    }
  } else {
    return unsupportedType("parseCliArguments", type);
  }
}

export function withCli<A>(type: Type<A>): A {
  return parseCliArguments(type, process.argv);
}

// re-exports

export const object = validated.object;
export const boolean = validated.boolean;
