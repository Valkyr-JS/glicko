import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import Settings from "./Settings";

const meta = {
  title: "Pages/Settings",
  component: Settings,
  args: {
    filters: {},
    inProgress: false,
    saveSettingsHandler: fn(),
  },
} satisfies Meta<typeof Settings>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotInProgress: Story = {};
