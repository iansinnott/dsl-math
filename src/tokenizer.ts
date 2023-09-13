export interface TokenizerOpts {
  source: string;
}

export type Lex = [RegExp, string | null];

const lexicon: Lex[] = [
  [/^\s+/, null], // whitespace
  [/^\d+/, "Number"],
  [/^\(/, "("],
  [/^\)/, ")"],
  [/^[+\-*/]/, "InfixOperator"],
];

export type Token = {
  type: string;
  value: string;
};

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

    for (const [regex, type] of lexicon) {
      const remaining = this.source.slice(this.currentIndex);
      const match = regex.exec(remaining);

      if (match) {
        if (match.index !== 0) {
          console.warn("[lex] matched at unexpected index. forgot to use prefix regex?", match);
        }

        const s = match[0];
        this.currentIndex += s.length;
        if (type === null) {
          return this.next();
        } else {
          return {
            type,
            value: s,
          };
        }
      }
    }

    throw new Error(
      "Unimplemented. Remaining source: `" + this.source.slice(this.currentIndex) + "`"
    );
  }

  tokenize({ all = false } = {}) {
    const tokens: Token[] = [];

    // Reset to the beginning if requested
    if (all) {
      this.currentIndex = 0;
    }

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
