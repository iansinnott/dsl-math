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
  lookahead: Token | null;

  constructor({ tokenizer }: ParserOpts) {
    this.tokenizer = tokenizer;

    // Populate
    this.lookahead = tokenizer.next();
  }

  _eat(type: string, value?: any) {
    if (!this.lookahead) {
      console.error(this.tokenizer.tokenize({ all: true }), this.tokenizer.source);
      throw new SyntaxError(`Expected token: ${type}`);
    }

    if (this.lookahead.type !== type) {
      throw new SyntaxError(`Unexpected token type: ${type}`);
    }

    const t = this.lookahead;
    this.lookahead = this.tokenizer.next();
    return t;
  }

  Number() {
    const t = this._eat("Number");
    return {
      type: "Number",
      value: Number(t.value),
    };
  }

  ParenOrNumber() {
    switch (this.lookahead?.type) {
      case "Number":
        return this.Number();
      default:
        throw new SyntaxError("Not a paren or number");
    }
  }

  // NOTE: The code is hard to read IMO, but there is a heirarchy. Infix
  // operator is responsible for itself but also for anything with lower
  // prcedence. In which case there is no right hand side or operator, we just
  // return the left.
  InfixOperator() {
    const left = this.ParenOrNumber();

    if (!this.lookahead) {
      return left;
    }

    const op = this._eat("InfixOperator").value;
    const right = this.Expression();
    return {
      type: "InfixOperator",
      op,
      left,
      right,
    };
  }

  Expression() {
    if (!this.lookahead) {
      console.warn("Empty source");
      return;
    }

    return this.InfixOperator();
  }

  parse() {
    return this.Expression();
  }
}
