interface TokenizerOpts {
  source: string;
}

const isNumber = (x: string) => {
  return /\d/.test(x);
};

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

  number() {
    let s = "";

    while (this.hasRemaining()) {
      const c = this.getCurrentChar();

      if (!isNumber(c)) {
        break;
      }

      s += c;
      this.currentIndex++;
    }

    return ["NUMBER", Number(s)];
  }

  next() {
    const currentChar = this.getCurrentChar();

    if (isNumber(currentChar)) {
      return this.number();
    }

    throw new Error("Unimplemented. Remaining source: " + this.source);
  }

  tokenize() {
    const tokens: any[] = [];

    while (true) {
      const x = this.next();

      if (!x) {
        break;
      }

      tokens.push(x);
    }

    return tokens;
  }
}
