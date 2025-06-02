const basePath = "/plugin/glicko/assets/app/" as const;

export const PATH = {
  ABOUT: basePath + "about",
  FILTERS: basePath + "filters",
  HOME: basePath,
  TOURNAMENT: basePath + "tournament",
} as const;
