import { existsSync } from "node:fs";
import path from "node:path";

export function find(file: string, target: string) {
  if (existsSync(target))
    return target

  const sibling = path.join(path.dirname(target), `${path.basename(target).split(".")[0]}.${path.basename(file).split(".").slice(1).join(".")}`)

  if (existsSync(sibling))
    return sibling

  const cousin = path.join(path.dirname(target), `${path.basename(target, path.extname(target))}.${path.extname(file).slice(1)}`)

  if (existsSync(cousin))
    return cousin

  return
}