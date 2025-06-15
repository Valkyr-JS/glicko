/** Returns each part of the Stash library version in an array */
export const getStashVersionBreakdown = (version: string): StashAppVersion => {
  return version
    .substring(1)
    .split(".")
    .map((s) => +s) as StashAppVersion;
};
