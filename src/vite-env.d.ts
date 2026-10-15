declare module 'path' {
  export function dirname(path: string): string
  export function basename(path: string, ext?: string): string
  export function extname(path: string): string
  export function join(...paths: string[]): string
}
