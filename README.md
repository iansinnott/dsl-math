# dsl-math

A toy implementation of the usual math DSL (i.e. `1 + 2 * 3`) in TypeScript.

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run src/index.ts
```

To test:

```bash
bun test
```

Usage

```sh
# Tokenize
bun run src/cli.ts tokenize --source='1 * (2 - 3)'

# Parse
bun run src/cli.ts parse --source='1 * (2 - 3)'
```

```js
{
  type: "InfixOperator",
  op: "*",
  left: {
    type: "Number",
    value: 1
  },
  right: {
    type: "InfixOperator",
    op: "-",
    left: {
      type: "Number",
      value: 2
    },
    right: {
      type: "Number",
      value: 3
    }
  }
}
```

I did not implement an interpreter because I was more interested in the parsing for this particular exercise.
