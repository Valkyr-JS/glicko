/** Returns each part of the Stash library version in an array */
export const getStashVersionBreakdown = (
  version: string
): [major: number, minor: number, patch: number] => {
  return version
    .substring(1)
    .split(".")
    .map((s) => +s) as [major: number, minor: number, patch: number];
};
