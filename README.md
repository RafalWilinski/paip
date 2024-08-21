# paip

![paip](./assets/why.png)

Why?
> Because Pythons ecosystem sucks.

What?
> A CLI that uses an LLM to retry failed pip commands based on the output.

## Installation

`paip` is distributed as a single executable file.

### MacOS
```bash

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
```