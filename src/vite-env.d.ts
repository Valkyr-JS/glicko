/// <reference types="vite/client" />

declare const __APP_VERSION__: string;

enum CriterionModifierEnum {
  EQUALS = "EQUALS",
  NOT_EQUALS = "NOT_EQUALS",
  GREATER_THAN = "GREATER_THAN",
  LESS_THAN = "LESS_THAN",
  IS_NULL = "IS_NULL",
  NOT_NULL = "NOT_NULL",
  INCLUDES_ALL = "INCLUDES_ALL",
  INCLUDES = "INCLUDES",
  EXCLUDES = "EXCLUDES",
  MATCHES_REGEX = "MATCHES_REGEX",
  NOT_MATCHES_REGEX = "NOT_MATCHES_REGEX",
  BETWEEN = "BETWEEN",
  NOT_BETWEEN = "NOT_BETWEEN",
}
type CriterionModifier = `${CriterionModifierEnum}`;

enum GameModeEnum {
  INFINITE = "Infinite",
}
type GameMode = `${GameModeEnum}`;

enum GendersEnum {
  MALE = "MALE",
  FEMALE = "FEMALE",
  TRANSGENDER_MALE = "TRANSGENDER_MALE",
  TRANSGENDER_MALE = "TRANSGENDER_FEMALE",
  INTERSEX = "INTERSEX",
  NON_BINARY = "NON_BINARY",
}
type Gender = `${GendersEnum}`;

interface GameError {
  /** A short description of the error. */
  message: string;
  /** The name of the error. */
  name: string;
  /** The error code, if provided. */
  code?: string;
  /** Full details of the error, if provided. */
  details?: unknown;
}

/** A match that has not yet been completed. An array containing the Stash IDs
 * of the two performers. */
type GlickoMatch = [p1ID: number, p2ID: number, p1Outcome: 0 | 1 | 0.5];

/** A match that has been completed. An array containging the Stash IDs of the
 * two performers, and the outcome as it relates to player 1 - `0` is a loss,
 * `1` is a win, and `0.5` is a draw. */
type GlickoMatchResult = [p1ID: number, p2ID: number, p1Outcome: 0 | 1 | 0.5];

/** The data for the two performers in the current match. */
type Match = [MatchPerformer, MatchPerformer];

/** The data for a single performer in a match. */
interface MatchPerformer {
  /** The path to the performer profile image in Stash */
  coverImg: string;
  /** The player's Stash App performer ID. */
  id: number;
  /** Dictates whether alternative images featuring the performer can be
   * sourced. */
  imagesAvailable: boolean;
  /** The players' rating before the start of the tournament. */
  initialRating: number;
  /** The player's name. */
  name: string;
  /** The Stash ID of the image currently displayed for the performer. If
   * undefined, the cover image should be displayed instead. */
  imageID?: number;
}

enum PagesEnum {
  HOME = "HOME",
  FILTERS = "FILTERS",
  GAME = "GAME",
  RESULTS = "RESULTS",
}

type Pages = `${PagesEnum}`;

interface PageProps {
  setActivePage: (page: Pages) => void;
}

/** Filters that dictate what Stash performers qualify for the game. */
interface PerformerFilters {
  /** All specified genders will qualify for the game. All genders qualify if
   * the array is empty.. */
  genders: Gender[];
  endpoint?: StashIDCriterionInput;
}

interface StashConfigResult {
  general: {
    stashBoxes: StashBox[];
  };
}

interface StashBox {
  endpoint: string;
  name: string;
}

type StashIDCriterionInput = {
  modifier: CriterionModifier;
  endpoint?: string;
  stash_id?: string;
};
