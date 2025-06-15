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

/** The Glicko plugin configuration object found in the Stash config. */
interface GlickoPluginConfig {
  /** The stringified PerformerFilters */
  performerFilters?: string;
  /** The stringified UserSettings */
  userSettings?: string;
}

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
  SETTINGS = "SETTINGS",
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

/** A record of a performer's past match. May need refinement. Keys are kept
 * short for storing as a string in custom fields. */
interface PerformerMatchRecord {
  /** The ISO datetime of the match. */
  d: string;
  /** The Stash ID of the opposing performer. */
  id: number;
  /** The outcome of the match for the performer, where 1 is a win, 0 is a loss,
   * and 0.5 is a draw. */
  r: 0 | 1 | 0.5;
  /** The datetime of the session that the match was part of. Used as an ID for
   * matching matches to sessions. */
  s: string;
}

/** A record of a performer's past sessions. May need refinement. Keys are kept
 * short for storing as a string in custom fields. */
interface PerformerSessionRecord {
  /** The ISO datetime of the session. */
  d: string;
  /** The Glicko rating of the performer at the end of the session. */
  g: number;
  /** The rank of the performer at the end of the session. */
  r: number;
}

interface StashConfigResult {
  general: {
    stashBoxes: StashBox[];
  };
  plugins: {
    glicko?: GlickoPluginConfig;
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

/** Only the essential performer data that needs to be saved in memory. */
interface StashSlimPerformerData {
  id: MatchPerformer["id"];
  name: MatchPerformer["name"];
}

/** The user's game settings. */
interface UserSettings {
  /** Dictates whether selecting performers using the arrow keys is enabled. */
  arrowKeys?: boolean;
  /** The custom max-width of the match board. */
  boardWidth?: number;
  /** The quality of the image taken from Stash. */
  imageQuality?: "original" | "thumbnail";
  /** The maximum number of rows to display in the progress board shown
   * underneath the match board. */
  progressMaxRows?: number;
  /** If `true`, performer results will not be saved to the associated performer
   * custom fields in the Stash database. Plugin settings and filters will still
   * be saved to the config. */
  readOnly?: boolean;
}
