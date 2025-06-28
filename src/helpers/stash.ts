import type { OperationVariables, QueryResult } from "@apollo/client";

/** Returns each part of the Stash library version in an array */
export const getStashVersionBreakdown = (version: string): StashAppVersion => {
  return version
    .substring(1)
    .split(".")
    .map((s) => +s) as StashAppVersion;
};

export const getStashUrl = (path: string) => {
  return (
    (import.meta.env.MODE === "development"
      ? import.meta.env.VITE_STASH_SERVER
      : "") + path
  );
};

/** Helper function to check for errors when querying Stash. Returns null if an
 * error is detected, otherwise returns the data. */
export const handleStashQueryError = <T>(
  res: QueryResult<T, OperationVariables>,
  setGameError: (value: React.SetStateAction<GameError | null>) => void,
  dataType: string
): T | null => {
  // Check for an error property on the result
  if (res.error) {
    setGameError({ ...res.error, details: res.error });
    return null;
  }

  // Check if the data property does not exist
  if (!res.data) {
    setGameError({
      name: dataType + " could not be found.",
      message: dataType + " could not be retrieved from Stash.",
      details: res,
    });
    return null;
  }

  return res.data;
};
