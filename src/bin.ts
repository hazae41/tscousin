#!/usr/bin/env node

import { Cousin } from "@/mods/tscousin/mod.ts";
import { existsSync, readFileSync } from "node:fs";

if (!existsSync("./tsconfig.json"))
  throw new Error("Missing tsconfig.json")

const tsconfig = JSON.parse(readFileSync("./tsconfig.json", "utf-8"))

new Cousin(tsconfig).rewrite()