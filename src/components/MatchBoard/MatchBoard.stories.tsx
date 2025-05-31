import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import MatchBoard from "./MatchBoard";
// import { Glicko2 } from "glicko2";

// const url = import.meta.env.STORYBOOK_STASH_SERVER;
// const tournament = new Glicko2();

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
  },
} satisfies Meta<typeof MatchBoard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
