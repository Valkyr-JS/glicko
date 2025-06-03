import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
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

export const CancelChangedSettings: Story = {
  args: {
    filters: {
      genders: ["FEMALE"],
      limit: 69,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cancelBtn = canvas.getByRole<HTMLButtonElement>("button", {
      name: "Cancel",
    });

    await userEvent.click(cancelBtn);

    const modal = canvas.getByRole("dialog", {
      name: "Changes will not be saved",
    });
    await expect(modal).toBeInTheDocument();
  },
};
