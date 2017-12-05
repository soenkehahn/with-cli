// @flow

import { spawnSync } from "child_process";

describe("withCli", () => {
  it("allows to add CLIs to scripts", () => {
    const process = spawnSync(`${__dirname}/../test/resources/test-script.js`, [
      "--foo"
    ]);
    const stderr = process.stderr.toString();
    if (stderr !== "") {
      console.error(stderr);
      throw new Error("error");
    }
    expect(process.stdout.toString().trim()).toEqual(
      "{ foo: true, bar: false }"
    );
  });

  it("complains about invalid command line arguments", () => {
    const process = spawnSync(`${__dirname}/../test/resources/test-script.js`, [
      "--invalid"
    ]);
    expect(process.status).toEqual(42);
    expect(process.stdout.toString()).toEqual("invalid flag: --invalid");
  });
});
