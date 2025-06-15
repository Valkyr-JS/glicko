import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import MatchBoard from "./MatchBoard";
import { getStashContent } from "../../../.storybook/tools";
import { DEFAULT_USER_SETTINGS } from "@/constants";

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
    boardWidth: undefined,
    changeImageHandler: fn(),
    clickSelectHandler: fn(),
    clickSkipHandler: fn(),
    clickStopHandler: fn(),
    clickSubmitHandler: fn(),
    clickUndoHandler: fn(),
    imageQuality: undefined,
    matchIndex: 0,
    match,
    userSettings: DEFAULT_USER_SETTINGS,
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

export const ResetCoverImage: Story = {
  args: {
    match: [
      { ...match[0], imageID: 109147 },
      { ...match[1], imageID: 124071 },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const image = canvas.getByAltText<HTMLImageElement>("Danielle");
    const resetBtn = canvas.getByRole<HTMLButtonElement>("button", {
      name: "Reset to Danielle's cover image",
    });

    await userEvent.click(resetBtn);
    await expect(image.src).toBe(match[0].coverImg);
  },
};

export const ResetCoverImageDisabled: Story = {
  args: {
    match: [
      { ...match[0], imagesAvailable: false },
      { ...match[1], imagesAvailable: true, imageID: undefined },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const resetBtnA = canvas.getByRole<HTMLButtonElement>("button", {
      name: "Reset to Danielle's cover image",
    });
    const resetBtnB = canvas.getByRole<HTMLButtonElement>("button", {
      name: "Reset to Lily's cover image",
    });

    expect(resetBtnA).toBeDisabled();
    expect(resetBtnB).toBeDisabled();
  },
};
