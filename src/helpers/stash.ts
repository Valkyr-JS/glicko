import {
  StashFindPerformersResultSchema,
  type StashFindPerformersResult,
  type StashPerformer,
} from "@/apollo/schema";
import type {
  FetchResult,
  MutationFunction,
  OperationVariables,
  QueryResult,
} from "@apollo/client";

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

/** Helper function to check for errors when mutating Stash. Returns null if an
 * error is detected, else returns the data or `undefined` if no data is
 * expected to be returned. */
export const handleStashMutationError = <T>(
  res: FetchResult<T>,
  setGameError: (value: React.SetStateAction<GameError | null>) => void,
  dataType: string
): T | null | undefined => {
  // Check for an error property on the result
  if (res.errors?.length) {
    setGameError({
      name: dataType + " mutation error",
      message: res.errors[0].message,
      details: res.errors,
    });
    return null;
  }

  return res.data;
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
      name: dataType + " could not be found",
      message: dataType + " could not be retrieved from Stash.",
      details: res,
    });
    return null;
  }

  return res.data;
};

const disallowedKeys = [
  "glicko_deviation",
  "glicko_rating",
  "glicko_volatility",
  "glicko_match_history",
  "glicko_session_history",
];

/** Helper function for wiping a performer's glicko custom field data. */
export const wipePerformerCustomFields = (
  p: StashPerformer,
  mutateStashPerformer: MutationFunction<StashPerformer>
) => {
  // If the performer doesn't have any custom fields in the first place, skip
  if (!Object.keys(p.custom_fields ?? {}).length) return;

  // Get the performer's custom fields, filtering out any Glicko-related
  // fields.
  const validKeys = Object.keys(p.custom_fields ?? {}).filter(
    (k) => !disallowedKeys.includes(k)
  );
  const custom_fields = validKeys.reduce(
    (obj, key) => ({
      ...obj,
      [key]: (p.custom_fields as { [key: string]: unknown })[key],
    }),
    {}
  );

  // Update the performer's custom fields with the filtered data
  mutateStashPerformer({
    variables: {
      input: {
        id: p.id,
        custom_fields: {
          full: {
            ...custom_fields,
          },
        },
      },
    },
  });
};

export const queryStashPerformersPage = async (
  res: QueryResult<StashFindPerformersResult, OperationVariables>,
  setGameError: (value: React.SetStateAction<GameError | null>) => void,
  setProcessing: (value: React.SetStateAction<boolean>) => void
): Promise<StashFindPerformersResult | null> => {
  // Check for errors
  const resVerified = handleStashQueryError(
    res,
    setGameError,
    "Bulk performer data"
  );
  if (!resVerified) {
    // Update the processing state
    setProcessing(false);
    return null;
  }

  StashFindPerformersResultSchema.safeParseAsync(resVerified).then((res) => {
    if (res.error) {
      setGameError({
        name: res.error.name,
        message: res.error.message,
        details: res.error,
      });
      setProcessing(false);
      return null;
    }
  });

  return resVerified;
};
