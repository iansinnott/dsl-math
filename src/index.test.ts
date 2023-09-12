import { describe, expect, test } from "bun:test";
import { Tokenizer } from ".";

describe("tokenize", () => {
  test("integers", () => {
    const tt: [string, any][] = [
      ["8", ["NUMBER", 8]],
      ["888", ["NUMBER", 888]],
      ["23", ["NUMBER", 23]],
    ];

    for (const [i, o] of tt) {
      const t = new Tokenizer({ source: i });
      expect(t.next()).toEqual(o);
    }
  });
});
