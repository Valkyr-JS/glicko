import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import Home from "./Home";

const meta = {
  title: "Pages/Home",
  component: Home,
  args: {
    changeFiltersHandler: fn(),
    continueTournamentHandler: fn(),
    inProgress: false,
    newTournamentHandler: fn(),
  },
} satisfies Meta<typeof Home>;

export default meta;
type Story = StoryObj<typeof meta>;

/** If no tournament is in progress, no "Continue" option should be available. */
export const NotInProgress: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const continueBtn = canvas.queryByRole<HTMLButtonElement>("button", {
      name: "Continue tournament",
    });
    await expect(continueBtn).not.toBeInTheDocument();
  },
};

/** If a tournament is in progress, a "Continue" option should be available at the top of the list. */
export const InProgress: Story = {
  args: {
    inProgress: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const continueBtn = canvas.queryByRole<HTMLButtonElement>("button", {
      name: "Continue tournament",
    });
    await expect(continueBtn).toBeInTheDocument();

    const allBtns = canvas.getAllByRole<HTMLButtonElement>("button");
    await expect(allBtns[0].textContent).toBe("Continue tournament");
  },
};
