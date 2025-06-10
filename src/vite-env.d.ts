/// <reference types="vite/client" />

declare const __APP_VERSION__: string;

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
