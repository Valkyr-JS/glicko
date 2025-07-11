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
  /** The stringified array of session dates. */
  sessionHistory?: string;
  /** The total number of performers with a Glicko rating. */
  totalPerformers?: number;
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
  LEADERBOARD = "LEADERBOARD",
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
  n: number;
}

interface RankedPerformer {
  /** The performer's Stash ID. */
  id: number;
  /** The total number of matches lost. */
  losses: number;
  /** The total number of matches played. */
  matches: number;
  /** The performer's name. */
  name: string;
  /** The performer's current rank. */
  rank: number;
  /** The performer's glicko rating. */
  rating: number;
  /** Data on the most recent match the performer played. */
  recentOpponent: {
    /** The ISO datetime string */
    date: Date;
    /** The opponent's Stash ID. */
    id: StashPerformer["id"];
    /** The opponent's name */
    name: StashPerformer["name"];
    /** The performer's outcome of the match, where 0 is a loss, 1 is a win, and
     * 0.5 is a tie. */
    outcome: 0 | 1 | 0.5;
  };
  /** The performer's two most recent session records. */
  sessions: [
    latest: PerformerSessionRecord,
    prev: PerformerSessionRecord | undefined
  ];
  /** The total number of matches tied. */
  ties: number;
  /** The total number of matches won. */
  wins: number;
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

type StashAppVersion = [major: number, minor: number, patch: number];

/** The user's game settings. */
interface UserSettings {
  /** Dictates whether selecting performers using the arrow keys is enabled. */
  arrowKeys?: boolean;
  /** The custom max-width of the match board. */
  boardWidth?: number;
  /** The quality of the image taken from Stash. */
  imageQuality?: "original" | "thumbnail";
  /** When enabled, only a performer's most recent match will be saved to
   * `glicko_match_history` and two most recent sessions will be saved to
   * `glicko_session_history`. */
  minimalHistory?: boolean;
  /** The maximum number of rows to display in the progress board shown
   * underneath the match board. */
  progressMaxRows?: number;
  /** If `true`, performer results will not be saved to the associated performer
   * custom fields in the Stash database. Plugin settings and filters will still
   * be saved to the config. */
  readOnly?: boolean;
}

/** A Stash performer's custom fields data, after fields have been parsed from
 * stringified JSON. */
interface StashPerformerCustomFieldsParsed {
  /** The performer's glicko rating deviation. `undefined` if they have not yet
   * been rated. */
  glicko_deviation?: number;
  /** The performer's glicko rating. `undefined` if they have not yet been
   * rated. */
  glicko_rating?: number;
  /** The performer's glicko rating volatility. `undefined` if they have not yet
   * been rated. */
  glicko_volatility?: number;
  /** The performer's total glicko match wins. `undefined` if they have not yet
   * been rated. */
  glicko_wins?: number;
  /** The performer's total glicko match losses. `undefined` if they have not yet
   * been rated. */
  glicko_losses?: number;
  /** The performer's total glicko match ties. `undefined` if they have not yet
   * been rated. */
  glicko_ties?: number;
  /** The performer's match history data after being parsed from a string.
   * `undefined` if they have not yet been rated. Only one item will be saved if
   * minimal match history is active, in order to support the recent match
   * columns in the leaderboard */
  glicko_match_history?: GlickoMatchResult[];
  /** The performer's session history after being parsed from a string.
   * `undefined` if they have not yet been rated. A maximum of two items will be
   * saved if minimal match history is active, in order to support leaderboard
   * position changes. */
  glicko_session_history?: PerformerSessionRecord[];
}
