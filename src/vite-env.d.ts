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
