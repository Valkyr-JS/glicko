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

enum PagesEnum {
  HOME = "HOME",
  RESULTS = "RESULTS",
  FILTERS = "FILTERS",
  TOURNAMENT = "TOURNAMENT",
}

type Pages = `${PagesEnum}`;

interface PageProps {
  setActivePage: (page: Pages) => void;
}

/** Filters that dictate what Stash performers qualify for the game. */
interface PerformerFilter {
  /** All specified genders will qualify for the game. All genders qualify if
   * `undefined`. */
  genders?: Gender[];
}
