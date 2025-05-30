import type { StorybookConfig } from '@storybook/react-vite';
import path from "path";

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-onboarding",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest"
  ],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },
    async viteFinal(config) {
    return {
      ...config,
      resolve: {
        alias: {
          ...config.resolve?.alias,
          "@": path.resolve(__dirname, "../src"),
        },
      },
    };
  },

};
export default config;