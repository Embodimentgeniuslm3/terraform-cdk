import { TestDriver } from "../../test-helper";
import * as path from "path";
import * as fs from "fs";

describe("full integration test", () => {
  let driver: TestDriver;

  beforeAll(async () => {
    driver = new TestDriver(__dirname);
    await driver.setupTypescriptProject();
  });

  test("diff", () => {
    expect(driver.diff()).toMatchInlineSnapshot(`
      "Stack: [1mhello-deploy[22m
      [1mResources[22m
       [32m+ [39mNULL_RESOURCE       test                [90mnull_resource.test[39m


      [1mDiff: [22m1 to create, 0 to update, 0 to delete.
      "
    `);
  });

  test("deploy", () => {
    expect(driver.deploy()).toMatchInlineSnapshot(`
      " Deploying Stack: hello-deploy
      Resources
       ✔ NULL_RESOURCE       test                null_resource.test


      [1mSummary: [22m1 created, 0 updated, 0 destroyed.

      [1mOutput: [22moutput = hello
              output2 = <sensitive>
      "
    `);
  });

  test("output", () => {
    expect(driver.output()).toMatchInlineSnapshot(`
      "
      [1mOutput: [22moutput = hello
              output2 = <sensitive>
      "
    `);
  });

  it("deploy and output write the same outputs file", () => {
    const deployOutputsPath = path.resolve(
      driver.workingDirectory,
      "deploy.outputs.json"
    );
    const outputOutputsPath = path.resolve(
      driver.workingDirectory,
      "output.outputs.json"
    );

    driver.deploy(undefined, deployOutputsPath);
    const deployOutput = JSON.parse(fs.readFileSync(deployOutputsPath, "utf8"));
    driver.output(undefined, outputOutputsPath);
    const outputOutput = JSON.parse(fs.readFileSync(outputOutputsPath, "utf8"));

    expect(deployOutput).toMatchInlineSnapshot(`
      Object {
        "hello-deploy": Object {
          "output": "hello",
        },
      }
    `);
    expect(outputOutput).toEqual(deployOutput);
  });

  test("destroy", () => {
    expect(driver.destroy()).toMatchInlineSnapshot(`
      " Destroying Stack: hello-deploy
      Resources
       ✔ NULL_RESOURCE       test                null_resource.test


      [1mSummary: [22m1 destroyed.
      "
    `);
  });
});
