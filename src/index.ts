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
    if (!this.lookahead || this.lookahead.type !== type) {
      console.log("index:", this.tokenizer.currentIndex);
      console.error(this.tokenizer.tokenize({ all: true }));
      console.error(this.tokenizer.source);
      throw new SyntaxError(`Expected token: '${type}' but got '${this.lookahead?.type}'`);
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

  ParenExpression() {
    this._eat("(");
    const x = this.Expression();
    this._eat(")");

    return x;
  }

  ParenOrNumber() {
    switch (this.lookahead?.type) {
      case "Number":
        return this.Number();
      case "(":
        return this.ParenExpression();
      default:
        throw new SyntaxError("Not a paren or number");
    }
  }

  // NOTE: The code is hard to read IMO, but there is a heirarchy. Infix
  // operator is responsible for itself but also for anything with lower
  // prcedence. In which case there is no right hand side or operator, we just
  // return the left.
  InfixOperator() {
    let left = this.ParenOrNumber() as any;

    // - if there is no lookahead, then we're done
    // - if there is lookahead, then it's probably binary operator, due to the simplicity of our math DSL
    // - if mult or division then we change the order of operations
    while (this.lookahead?.type === "InfixOperator") {
      const t = this._eat("InfixOperator");
      const assocLeft = t.value === "*" || t.value === "/";
      const right = assocLeft ? this.ParenOrNumber() : this.Expression();
      left = {
        type: "InfixOperator",
        op: t.value,
        left,
        right,
      };
    }

    return left;
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
