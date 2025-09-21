export function dot(path: string) {
  return path.startsWith(".") ? path : `./${path}`
}