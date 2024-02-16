export function absolute(relative: string, baseURL: URL): string {
  let prefix = "file://";

  if (process.platform === "win32") {
    prefix += "/";
  }

  return new URL(relative, baseURL).toString().split(prefix)[1];
}
