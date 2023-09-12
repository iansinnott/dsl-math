import { describe, expect, test } from "bun:test";
import { Parser, Tokenizer } from ".";

describe("tokenize", () => {
  test("empty source", () => {
    const t = new Tokenizer({ source: "" });
    expect(t.next()).toBe(null);
  });

  test("integers", () => {
    const tt: [string, any][] = [
      ["8", ["Number", 8]],
      ["888", ["Number", 888]],
      ["23", ["Number", 23]],
    ];

    for (const [i, o] of tt) {
      const t = new Tokenizer({ source: i });
      expect(t.next()).toEqual(o);
    }
  });

  test("non-lazy", () => {
    const tt: [string, any][] = [
      ["8", [["Number", 8]]],
      ["888", [["Number", 888]]],
      ["23", [["Number", 23]]],
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
      [" 12", [["Number", 12]]],
      [
        "1 2  33               ",
        [
          ["Number", 1],
          ["Number", 2],
          ["Number", 33],
        ],
      ],
    ];

    for (const [i, o] of tt) {
      const t = new Tokenizer({ source: i });
      expect(t.tokenize()).toEqual(o);
    }
  });

  test("infix operators", () => {
    const tt: [string, any][] = [
      [
        "1 + 2 - 3",
        [
          ["Number", 1],
          ["InfixOperator", "+"],
          ["Number", 2],
          ["InfixOperator", "-"],
          ["Number", 3],
        ],
      ],
      [
        "4 * 4",
        [
          ["Number", 4],
          ["InfixOperator", "*"],
          ["Number", 4],
        ],
      ],
      [
        "4 / 4",
        [
          ["Number", 4],
          ["InfixOperator", "/"],
          ["Number", 4],
        ],
      ],
    ];

    for (const [i, o] of tt) {
      const t = new Tokenizer({ source: i });
      expect(t.tokenize()).toEqual(o);
    }
  });
});

describe("parse", () => {
  test("single nodes", () => {
    const tt = [
      [
        "12",
        {
          type: "Number",
          value: 12,
        },
      ],
    ];

    for (const [i, o] of tt) {
      expect(Parser.parseString(i as string)).toEqual(o);
    }
  });

  test("simple expressions", () => {
    const tt = [
      [
        "1 + 2",
        {
          type: "InfixOperator",
          op: "+",
          left: { type: "Number", value: 1 },
          right: { type: "Number", value: 2 },
        },
      ],
      [
        "112 - 2",
        {
          type: "InfixOperator",
          op: "-",
          left: { type: "Number", value: 112 },
          right: { type: "Number", value: 2 },
        },
      ],
    ];

    for (const [i, o] of tt) {
      expect(Parser.parseString(i as string)).toEqual(o);
    }
  });

  test("chained expressions", () => {
    const tt = [
      [
        "1 + 2 - 3",
        {
          type: "InfixOperator",
          op: "+",
          left: {
            type: "Number",
            value: 1,
          },
          right: {
            type: "InfixOperator",
            op: "-",
            left: {
              type: "Number",
              value: 2,
            },
            right: {
              type: "Number",
              value: 3,
            },
          },
        },
      ],
      [
        "1 + 1 + 1 + 1",
        {
          type: "InfixOperator",
          op: "+",
          left: {
            type: "Number",
            value: 1,
          },
          right: {
            type: "InfixOperator",
            op: "+",
            left: {
              type: "Number",
              value: 1,
            },
            right: {
              type: "InfixOperator",
              op: "+",
              left: {
                type: "Number",
                value: 1,
              },
              right: {
                type: "Number",
                value: 1,
              },
            },
          },
        },
      ],
    ];

    for (const [i, o] of tt) {
      expect(Parser.parseString(i as string)).toEqual(o);
    }
  });
});
