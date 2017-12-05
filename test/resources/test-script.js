#!/usr/bin/env babel-node

// @flow

import { withCli } from "../../src";
import { object, boolean } from "validated/schema";

const configType = object({ foo: boolean, bar: boolean });

console.log(withCli(configType));
