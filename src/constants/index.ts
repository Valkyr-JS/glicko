const basePath = "/plugin/glicko/assets/app/" as const;

export const PATH = {
  ABOUT: basePath + "about",
  SETTINGS: basePath + "settings",
  HOME: basePath,
  TOURNAMENT: basePath + "tournament",
} as const;
