import { describe, expect, test } from "bun:test";
import { Tokenizer } from ".";

describe("tokenize", () => {
  test("integers", () => {
    const t = new Tokenizer({ source: "8" });
    expect(t.next()).toEqual(["NUMBER", 8]);
  });
});
