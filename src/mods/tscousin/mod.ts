import { dot } from "@/libs/dot/mod.ts";
import { walkSync } from "@/libs/walk/mod.ts";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

// deno-lint-ignore no-namespace
export namespace Cousin {

  export interface Config {
    readonly compilerOptions: {
      readonly paths: Record<string, string[]>
    }
  }

}

export class Cousin {

  constructor(
    readonly target: string,
    readonly config: Cousin.Config
  ) { }

  rewrite() {
    for (const file of walkSync(this.target)) {
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
            const retarget = path.join(this.target, to.slice(0, -1), target.slice(from.slice(0, -1).length))

            if (!existsSync(path.dirname(retarget)))
              continue

            return dot(path.relative(path.dirname(file), retarget))
          } else {
            const retarget = path.join(this.target, to)

            if (!existsSync(path.dirname(retarget)))
              continue

            return dot(path.relative(path.dirname(file), retarget))
          }
        } else {
          if (target !== from)
            continue

          if (to.endsWith("*"))
            throw new Error("Cannot rewrite non-wildcard to wildcard")

          const retarget = path.join(this.target, to)

          if (!existsSync(path.dirname(retarget)))
            continue

          return dot(path.relative(path.dirname(file), retarget))
        }
      }
    }

    return target
  }

}