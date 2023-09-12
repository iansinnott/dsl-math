export { Tokenizer } from "./tokenizer";

import { Tokenizer, type Token } from "./tokenizer";

export interface ParserOpts {
  tokenizer: Tokenizer;
}

export class Parser {
  static parseString = (source: string) => {
    const tokenizer = new Tokenizer({ source });
    const parser = new Parser({ tokenizer });
    return parser.parse();
  };

  tokenizer: Tokenizer;
  current: Token | null;
  lookahead: Token | null;

  constructor({ tokenizer }: ParserOpts) {
    this.tokenizer = tokenizer;

    // Populate
    this.current = tokenizer.next();
    this.lookahead = tokenizer.next();
  }

  _eat(type: string, value?: any) {
    if (!this.current) {
      throw new SyntaxError(`Expected token: ${type}`);
    }

    if (this.current[0] !== type) {
      throw new SyntaxError(`Unexpected token type: ${type}`);
    }

    if (typeof value !== "undefined" && value !== this.current[1]) {
      throw new SyntaxError(`Unexpected token value: ${this.current[0]}:${this.current[1]}`);
    }

    this.current = this.lookahead;
    this.lookahead = this.tokenizer.next();
  }

  Number() {
    const t = this.current;
    this._eat("Number");
    return {
      type: "Number",
      value: t?.[1],
    };
  }

  InfixOperator() {
    // NOTE: We expect a number on the left. We consume it, then move forward
    const left = this.Number();
    const op = this.current?.[1];
    this._eat("InfixOperator");
    const right = this.Expression();
    return {
      type: "InfixOperator",
      op,
      left,
      right,
    };
  }

  Expression() {
    if (!this.current) {
      console.warn("Empty source");
      return;
    }

    // If there is no lookahead process the current token as is
    if (!this.lookahead) {
      // Assume the type has a method, if not this should through
      return this[this.current[0]]();
    }

    // Switch based on lookahead
    switch (this.lookahead[0]) {
      case "InfixOperator":
        return this.InfixOperator();
      case "Number":
        return this[this.current[0]]();
      default:
        throw new SyntaxError("unexpected token: " + this.lookahead);
    }
  }

  parse() {
    return this.Expression();
  }
}
