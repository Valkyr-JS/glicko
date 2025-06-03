import type { Preview } from "@storybook/react-vite";
import { INITIAL_VIEWPORTS } from "storybook/viewport";
import "./autodocs.css";
import "../src/index-84976af5.css";
import "../src/scss/global.scss";

const preview: Preview = {
  parameters: {
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      sort: "requiredFirst",
    },
    initialGlobals: {
      viewport: { value: "iphone5", isRotated: false },
    },
    layout: "fullscreen",
    viewport: {
      options: INITIAL_VIEWPORTS,
    },
  },
  tags: ["autodocs"],
};

export default preview;
