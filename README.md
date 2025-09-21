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

### Before TSC (best)

TSCousin will rewrite paths from ./itm and then TSC will transpile ./itm into ./out and also rewrite .ts imports into .js imports

```bash
cp -r ./src/. ./itm && tscousin ./itm && tsc
```

```json
{
  "compilerOptions": {
    "baseUrl": "./itm",
    "paths": {
      "@/*": ["./*"]
    } ,
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "outDir": "./out",
    "declaration": true,
    "rewriteRelativeImportExtensions": true
  },
  "include": [
    "./itm/**/*"
  ],
  "exclude": []
}
```

### After TSC (compatibility)

TSC will transpile ./src into ./out and then TSCousin will rewrite paths from ./out but you will still have .js or .ts imports

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

### In-place (not recommended)

TSCousin will destructively rewrite paths from ./src

```bash
tscousin ./src
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