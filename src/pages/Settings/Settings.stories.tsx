import type { Meta, StoryObj } from "@storybook/react-vite";
import Settings from "./Settings";
import { fn } from "storybook/internal/test";

const meta = {
  title: "Pages/Settings",
  component: Settings,
  args: {
    saveSettingsHandler: fn(),
    setActivePage: fn(),
    settings: {},
  },
} satisfies Meta<typeof Settings>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
