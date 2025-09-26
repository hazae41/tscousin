import { find } from "@/libs/find/mod.ts";
import { redot } from "@/libs/redot/mod.ts";
import { walkSync } from "@/libs/walk/mod.ts";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

export namespace Cousin {

  export interface Config {
    readonly compilerOptions: {

      readonly outDir: string

      readonly paths: Record<string, string[]>

    }
  }

}

export class Cousin {

  constructor(
    readonly config: Cousin.Config
  ) { }

  rewrite() {
    for (const file of walkSync(this.config.compilerOptions.outDir)) {
      if (![".js", ".cjs", ".mjs", ".ts", ".tsx", ".jsx"].some(ext => file.endsWith(ext)))
        continue
      const original = readFileSync(file, "utf-8")

      const replaced = original
        .replaceAll(/import ["'](.+?)["']/g, (_, target) => `import "${this.#rewrite(file, target)}"`)
        .replaceAll(/export ["'](.+?)["']/g, (_, target) => `export "${this.#rewrite(file, target)}"`)
        .replaceAll(/import (.+) from ["'](.+)["']/g, (_, specifier, target) => `import ${specifier} from "${this.#rewrite(file, target)}"`)
        .replaceAll(/export (.+) from ["'](.+)["']/g, (_, specifier, target) => `export ${specifier} from "${this.#rewrite(file, target)}"`)
        .replaceAll(/require\(["'](.+)["']\)/g, (_, target) => `require("${this.#rewrite(file, target)}")`)
        .replaceAll(/import\(["'](.+)["']\)/g, (_, target) => `import("${this.#rewrite(file, target)}")`)

      if (original === replaced)
        continue

      writeFileSync(file, replaced)
    }
  }

  #rewrite(file: string, target: string) {
    for (const from in this.config.compilerOptions.paths) {
      for (const to of this.config.compilerOptions.paths[from]) {
        if (from.endsWith("*")) {
          if (!target.startsWith(from.slice(0, -1)))
            continue

          if (to.endsWith("*")) {
            const retarget = find(file, path.resolve(this.config.compilerOptions.outDir, to.slice(0, -1), target.slice(from.slice(0, -1).length)))

            if (retarget != null)
              return redot(path.relative(path.dirname(file), retarget))

            continue
          } else {
            const retarget = find(file, path.resolve(this.config.compilerOptions.outDir, to))

            if (retarget != null)
              return redot(path.relative(path.dirname(file), retarget))

            continue
          }
        } else {
          if (target !== from)
            continue

          if (to.endsWith("*"))
            throw new Error("Cannot rewrite non-wildcard to wildcard")

          const retarget = find(file, path.resolve(this.config.compilerOptions.outDir, to))

          if (retarget != null)
            return redot(path.relative(path.dirname(file), retarget))

          continue
        }
      }
    }

    const retarget = find(file, path.resolve(path.dirname(file), target))

    if (retarget != null)
      return redot(path.relative(path.dirname(file), retarget))

    return target
  }

}