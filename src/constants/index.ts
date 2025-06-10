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
