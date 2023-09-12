import assert from "assert";
import { Parser, Tokenizer } from ".";

interface CLIOpts {
  _cmdName: string;
  _args: string[];
  args: string[];
  flags: Record<string, string | boolean>;
}

type CLICommand = (opts: CLIOpts) => any;

const CLI: Record<string, CLICommand> = {
  // bun run src/cli.ts tokenize --source='123'
  tokenize: ({ args, flags }) => {
    assert(flags.source, "no source provided");
    const { source } = flags;
    const tokenizer = new Tokenizer({ source: source as string });
    console.log(tokenizer.tokenize());
  },

  parse: ({ args, flags }) => {
    assert(flags.source, "no source provided");
    const { source } = flags;
    console.log(Parser.parseString(source as string));
  },
};

const unimplemented: CLICommand = ({ _cmdName, args, flags }) => {
  console.error(`Unknown command: '${_cmdName}'`, {
    args,
    flags,
  });
};

const main = async () => {
  const _args = process.argv.slice(2);
  const args: string[] = [];
  const flags: Record<string, string | boolean> = {};

  for (const x of _args) {
    if (x.startsWith("-")) {
      const [k, v = true] = x.replace(/^-+/, "").split("=");
      flags[k] = v;
    } else {
      args.push(x);
    }
  }

  const cmd = CLI[args[0]] || unimplemented;

  return cmd({
    _cmdName: args[0],
    _args,
    args: args.slice(1),
    flags,
  });
};

main()
  .then(() => {
    // nothing to do here...
  })
  .catch((err) => {
    console.error(err);
  });
