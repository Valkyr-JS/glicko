import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import MatchBoard from "./MatchBoard";
import { getStashContent } from "../../../.storybook/tools";

const match: [MatchPerformer, MatchPerformer] = [
  {
    coverImg: getStashContent("/performer/12/image"),
    id: 12,
    imagesAvailable: true,
    initialRating: 1769,
    name: "Danielle",
  },
  {
    coverImg: getStashContent("/performer/124/image"),
    id: 124,
    imagesAvailable: true,
    initialRating: 1824,
    name: "Lily",
  },
];

const meta = {
  title: "Components/Match Board",
  component: MatchBoard,
  parameters: {
    layout: "padded",
  },
  args: {
    changeImageHandler: fn(),
    clickSelectHandler: fn(),
    clickSkipHandler: fn(),
    clickStopHandler: fn(),
    clickSubmitHandler: fn(),
    clickUndoHandler: fn(),
    matchIndex: 0,
    match,
  },
} satisfies Meta<typeof MatchBoard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstMatch: Story = {
  args: {
    matchIndex: 0,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const submitBtn = canvas.getByRole<HTMLButtonElement>("button", {
      name: "Submit",
    });
    const undoBtn = canvas.getByRole<HTMLButtonElement>("button", {
      name: "Undo match",
    });
    expect(submitBtn).toBeDisabled();
    expect(undoBtn).toBeDisabled();
  },
};

export const NotFirstMatch: Story = {
  args: {
    matchIndex: 5,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const submitBtn = canvas.getByRole<HTMLButtonElement>("button", {
      name: "Submit",
    });
    const undoBtn = canvas.getByRole<HTMLButtonElement>("button", {
      name: "Undo match",
    });
    expect(submitBtn).not.toBeDisabled();
    expect(undoBtn).not.toBeDisabled();
  },
};
