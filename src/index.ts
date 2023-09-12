interface TokenizerOpts {
  source: string;
}

const SKIP = Symbol("SKIP_TOKEN");

interface Lex {
  type: string;
  regex: RegExp;
  ret?: (matched: string) => any;
}

const lexicon: Lex[] = [
  {
    type: "NUMBER",
    regex: /^\d+/,
    ret: Number,
  },
  {
    type: "whitespace",
    regex: /^\s+/,
    ret: () => SKIP,
  },
  {
    type: "OPERATOR",
    regex: /^[+\-*/]/,
  },
];

export class Tokenizer {
  currentIndex = 0;
  source = "";

  constructor({ source }: TokenizerOpts) {
    this.source = source;
  }

  getCurrentChar() {
    if (this.currentIndex >= this.source.length) {
      throw RangeError("Out of boudns: " + this.currentIndex);
    }

    return this.source[this.currentIndex];
  }

  hasRemaining() {
    return this.source.length > this.currentIndex;
  }

  next() {
    if (!this.hasRemaining()) {
      return;
    }

    for (const lex of lexicon) {
      const remaining = this.source.slice(this.currentIndex);
      const match = lex.regex.exec(remaining);

      if (match) {
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
    const tokens: any[] = [];

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
