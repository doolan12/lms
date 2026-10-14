import data from "./illustrations.json";

const have = new Set<string>(data.have);

/** Path of a generated course illustration, or undefined if it hasn't been made yet. */
export function illustration(name: string): string | undefined {
  return have.has(name) ? `/images/illustrations/${name}.jpg` : undefined;
}
