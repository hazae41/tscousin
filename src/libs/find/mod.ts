import { existsSync } from "node:fs";
import path from "node:path";

export function find(file: string, target: string) {
  if (existsSync(target))
    return target

  if (!/\.(m)?ts(x)?$/.test(target))
    return

  const cousin = path.join(path.dirname(target), `${path.basename(target, path.extname(target))}.js`)

  if (!existsSync(cousin))
    return

  if (file.endsWith(".d.ts"))
    return target

  return cousin
}