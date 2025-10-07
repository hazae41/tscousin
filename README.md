# TSCousin

Zero-config supply-chain hardened TypeScript paths and extensions rewriter

```bash
npm install -D @hazae41/tscousin
```

```bash
deno install -gfn tscousin -RW jsr:@hazae41/tscousin/bin
```

[**📦 NPM**](https://www.npmjs.com/package/@hazae41/tscousin) • [**📦 JSR**](https://jsr.io/@hazae41/tscousin)

## Features

### Current features
- Uses your tsconfig.json
- No external dependency
- Clean and minimalist
- Works on Deno too

## Usage

TSC will transpile ./src into ./out and then TSCousin will rewrite paths from ./out and also rewrite .(m)ts(x) imports into .js imports

```bash
tsc && tscousin
```

```json
{
  "compilerOptions": {
    "rootDir": "./src",
    "paths": {
      "@/*": ["./*"]
    } ,
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "outDir": "./out",
    "declaration": true
  },
  "include": [
    "./src/**/*"
  ],
  "exclude": []
}
```