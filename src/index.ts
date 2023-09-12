export { Tokenizer } from "./tokenizer";

import { Tokenizer } from "./tokenizer";

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

  constructor({ tokenizer }: ParserOpts) {
    this.tokenizer = tokenizer;
  }

  parse() {
    throw new Error("TODO");
  }
}
