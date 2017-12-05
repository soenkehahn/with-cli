#!/usr/bin/env babel-node

// @flow

import { withCli, object, boolean } from "../../src";

const configType = object({ foo: boolean, bar: boolean });

console.log(withCli(configType));
