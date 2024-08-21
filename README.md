# paip

> A CLI that uses an AI to retry failed pip commands based on the output.

![paip](./assets/why.png)

## Installation

`paip` is distributed as a single executable file.

### MacOS

Using Homebrew:

```bash
brew tap RafalWilinski/paip https://github.com/RafalWilinski/paip.git
brew install paip
```

## Development

[Bun](https://bun.sh) is required.

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

To compile `paip` to a single executable file:

```bash
bun build --compile --minify index.ts --outfile paip

---

This project has been build in Cursor in ~30 minutes. Don't take it too seriously.
