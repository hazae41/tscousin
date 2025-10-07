#!/usr/bin/env node

import { Cousin } from "@/mods/tscousin/mod.ts";
import { existsSync, readFileSync } from "node:fs";

if (!existsSync("./tsconfig.json"))
  throw new Error("Missing tsconfig.json")

const tsconfig = JSON.parse(readFileSync("./tsconfig.json", "utf-8"))

if (tsconfig.compilerOptions.rootDir == null)
  throw new Error("Your TypeScript config doesn't have a rootDir defined")
if (tsconfig.compilerOptions.outDir == null)
  throw new Error("Your TypeScript config doesn't have an outDir defined")

new Cousin(tsconfig).rewrite()