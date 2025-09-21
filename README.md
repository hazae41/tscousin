# TSCousin

Zero-config supply-chain hardened TypeScript relative paths rewriter

```bash
npm install @hazae41/tscousin
```

```bash
deno install jsr:@hazae41/tscousin
```

[**Node Package 📦**](https://www.npmjs.com/package/@hazae41/tscousin) [**JSR Package 📦**](https://jsr.io/@hazae41/tscousin)

## Features

### Current features
- Uses your tsconfig.json
- No external dependency
- Clean and minimalist
- Works on Deno too

## Usage

TSC will transpile ./src into ./out and then TSCousin will rewrite paths from ./out and also rewrite .ts imports into .js and .d.ts imports

```bash
tsc && tscousin ./out
```

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
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