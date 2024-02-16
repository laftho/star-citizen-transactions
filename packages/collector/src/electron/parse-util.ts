export function bracket(parts: string[]) {
  return {
    get: (key: string) => {
      let item: string;

      if ((item = parts.find(v => v.startsWith(key + "[")))) {
        return item.substring(item.indexOf("["), item.lastIndexOf("]"));
      }
    }
  }
}

export function spaced(parts: string[]) {
  return {
    get: (key: string) => {
      return parts[parts.findIndex(v => v === key) + 1];
    }
  }
}
