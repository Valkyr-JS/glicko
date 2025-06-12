import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import Settings from "./Settings";

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

export const ReadOnlyDefault: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole<HTMLInputElement>("checkbox", {
      name: 'Enable "read-only" mode',
    });
    expect(input).not.toBeChecked();
  },
};
