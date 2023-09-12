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

  test("non-lazy", () => {
    const tt: [string, any][] = [
      ["8", [["NUMBER", 8]]],
      ["888", [["NUMBER", 888]]],
      ["23", [["NUMBER", 23]]],
    ];

    for (const [i, o] of tt) {
      const t = new Tokenizer({ source: i });
      expect(t.tokenize()).toEqual(o);
    }
  });

  test("whitespace is ignored", () => {
    const tt: [string, any][] = [
      [" ", []],
      ["   ", []],
      ["  ", []],
    ];

    for (const [i, o] of tt) {
      const t = new Tokenizer({ source: i });
      expect(t.tokenize()).toEqual(o);
    }
  });

  test("multiple tokens", () => {
    const tt: [string, any][] = [
      [" 12", [["NUMBER", 12]]],
      [
        "1 2  33               ",
        [
          ["NUMBER", 1],
          ["NUMBER", 2],
          ["NUMBER", 33],
        ],
      ],
    ];

    for (const [i, o] of tt) {
      const t = new Tokenizer({ source: i });
      expect(t.tokenize()).toEqual(o);
    }
  });

  test("addition and subtraction", () => {
    const tt: [string, any][] = [
      [
        "1 + 2 - 3",
        [
          ["NUMBER", 1],
          ["OPERATOR", "+"],
          ["NUMBER", 2],
          ["OPERATOR", "-"],
          ["NUMBER", 3],
        ],
      ],
    ];

    for (const [i, o] of tt) {
      const t = new Tokenizer({ source: i });
      expect(t.tokenize()).toEqual(o);
    }
  });
});
