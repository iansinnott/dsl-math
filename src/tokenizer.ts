export interface TokenizerOpts {
  source: string;
}

const SKIP = Symbol("SKIP_TOKEN");

export interface Lex {
  type: string;
  regex: RegExp;
  ret?: (matched: string) => any;
}

const lexicon: Lex[] = [
  {
    type: "Number",
    regex: /^\d+/,
    ret: Number,
  },
  {
    type: "whitespace",
    regex: /^\s+/,
    ret: () => SKIP,
  },
  {
    type: "(",
    regex: /^\(/,
  },
  {
    type: ")",
    regex: /^\)/,
  },
  {
    type: "InfixOperator",
    regex: /^[+\-*/]/,
  },
];

export type Token = [type: string, any];

export class Tokenizer {
  currentIndex = 0;
  source = "";

  constructor({ source }: TokenizerOpts) {
    this.source = source;
  }

  hasRemaining() {
    return this.source.length > this.currentIndex;
  }

  next(): Token | null {
    if (!this.hasRemaining()) {
      return null;
    }

    for (const lex of lexicon) {
      const remaining = this.source.slice(this.currentIndex);
      const match = lex.regex.exec(remaining);

      if (match) {
        if (match.index !== 0) {
          console.warn("[lex] matched at unexpected index. forgot to use prefix regex?", match);
        }

        const s = match[0];
        const v = lex.ret ? lex.ret(s) : s;
        this.currentIndex += s.length;
        if (v === SKIP) {
          return this.next();
        } else {
          return [lex.type, v];
        }
      }
    }

    throw new Error(
      "Unimplemented. Remaining source: `" + this.source.slice(this.currentIndex) + "`"
    );
  }

  tokenize() {
    const tokens: Token[] = [];

    while (this.hasRemaining()) {
      const x = this.next();

      if (!x) {
        break;
      }

      tokens.push(x);
    }

    return tokens;
  }
}
