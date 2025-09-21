#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { argv } from "node:process";
import { Cousin } from "./mod.ts";

if (!existsSync("./tsconfig.json"))
  throw new Error("Missing tsconfig.json")

const tsconfig = JSON.parse(readFileSync("./tsconfig.json", "utf-8"))

new Cousin(argv[2], tsconfig).rewrite()