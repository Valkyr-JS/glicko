import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import Home from "./Home";

const meta = {
  title: "Pages/Home",
  component: Home,
  args: {
    changeFiltersHandler: fn(),
    inProgress: false,
    newTournamentHandler: fn(),
  },
} satisfies Meta<typeof Home>;

export default meta;
type Story = StoryObj<typeof meta>;

/** By default, e.g. a fresh install, no "Continue" option should be available. */
export const NewTournament: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const continueBtn = canvas.queryByRole<HTMLButtonElement>("button", {
      name: "Continue tournament",
    });
    await expect(continueBtn).not.toBeInTheDocument();
  },
};
