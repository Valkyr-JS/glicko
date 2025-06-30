const basePath = "/plugin/glicko/assets/app/" as const;

export const GLICKO = {
  DEVIATION_DEFAULT: 350,
  RATING_DEFAULT: 1500,
  VOLATILITY_DEFAULT: 0.06,
} as const;

export const PATH = {
  ABOUT: basePath + "about",
  SETTINGS: basePath + "settings",
  HOME: basePath,
  TOURNAMENT: basePath + "tournament",
} as const;

export const RECOMMENDED_MINIMUM_MATCHES = 15 as const;

export const DEFAULT_PERFORMER_FILTERS: PerformerFilters = {
  genders: [],
};

export const DEFAULT_ALLOW_ARROW_KEYS = true;
export const DEFAULT_BOARD_WIDTH = 1100;
export const DEFAULT_IMAGE_QUALITY = "thumbnail";
export const DEFAULT_MAX_PROGRESS_BOARD_ROWS = 5;
export const DEFAULT_MINIMAL_HISTORY = false;

export const DEFAULT_USER_SETTINGS: UserSettings = {
  arrowKeys: DEFAULT_ALLOW_ARROW_KEYS,
  boardWidth: DEFAULT_BOARD_WIDTH,
  imageQuality: DEFAULT_IMAGE_QUALITY,
  minimalHistory: DEFAULT_MINIMAL_HISTORY,
  progressMaxRows: DEFAULT_MAX_PROGRESS_BOARD_ROWS,
};
