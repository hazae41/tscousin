import { dot } from "@/libs/dot/mod.ts";
import { rename } from "@/libs/ext/mod.ts";
import { walkSync } from "@/libs/walk/mod.ts";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

// deno-lint-ignore no-namespace
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
        .replaceAll(/import (.+?) from "(.+?)"/g, (_, specifier, target) => `import ${specifier} from "${this.#rewrite(file, target)}"`)
        .replaceAll(/export (.+?) from "(.+?)"/g, (_, specifier, target) => `export ${specifier} from "${this.#rewrite(file, target)}"`)
        .replaceAll(/require\("(.+?)"\)/g, (_, target) => `require("${this.#rewrite(file, target)}")`)
        .replaceAll(/import\("(.+?)"\)/g, (_, target) => `import("${this.#rewrite(file, target)}")`)

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
            const cousin = rename(file, path.resolve(this.config.compilerOptions.outDir, to.slice(0, -1), target.slice(from.slice(0, -1).length)))

            if (cousin != null)
              return dot(path.relative(path.dirname(file), cousin))

            continue
          } else {
            const cousin = rename(file, path.resolve(this.config.compilerOptions.outDir, to))

            if (cousin != null)
              return dot(path.relative(path.dirname(file), cousin))

            continue
          }
        } else {
          if (target !== from)
            continue

          if (to.endsWith("*"))
            throw new Error("Cannot rewrite non-wildcard to wildcard")

          const cousin = rename(file, path.resolve(this.config.compilerOptions.outDir, to))

          if (cousin != null)
            return dot(path.relative(path.dirname(file), cousin))

          continue
        }
      }
    }

    const cousin = rename(file, path.resolve(path.dirname(file), target))

    if (cousin != null)
      return dot(path.relative(path.dirname(file), cousin))

    return target
  }

}