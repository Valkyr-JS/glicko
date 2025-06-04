import type { Meta, StoryObj } from "@storybook/react-vite";
import { Glicko2 } from "glicko2";
import { expect, fn, within } from "storybook/test";
import MatchBoard from "./MatchBoard";
import { getStashContent } from "../../../.storybook/tools";

const tournament = new Glicko2();

const meta = {
  title: "Components/Match Board",
  component: MatchBoard,
  args: {
    changeImageHandler: fn(),
    clickPauseHandler: fn(),
    clickSelectHandler: fn(),
    clickSkipHandler: fn(),
    clickStopHandler: fn(),
    clickUndoHandler: fn(),
    matchIndex: 0,
    players: [
      {
        id: "12",
        coverImg: getStashContent("/image/109138/thumbnail?t=1745972299"),
        name: "Danielle",
        glicko: tournament.makePlayer(2019),
      },
      {
        id: "3",
        coverImg: getStashContent("/image/47763/thumbnail?t=1747431203"),
        name: "Jess",
        glicko: tournament.makePlayer(1976),
      },
    ],
  },
} satisfies Meta<typeof MatchBoard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Expect the undo button to be disabled on start, otherwise enabled. */
export const UndoButtonStatus: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const btn = canvas.getByRole<HTMLButtonElement>("button", {
      name: "Undo match",
    });
    if (args.matchIndex === 0) expect(btn).toBeDisabled();
    else expect(btn).not.toBeDisabled();
  },
};
