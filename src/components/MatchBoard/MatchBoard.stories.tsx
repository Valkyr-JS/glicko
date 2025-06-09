import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import MatchBoard from "./MatchBoard";
import { getStashContent } from "../../../.storybook/tools";
import { RECOMMENDED_MINIMUM_MATCHES } from "@/constants";

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

export const FirstMatchUndoDisabled: Story = {
  args: {
    matchIndex: 0,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const undoBtn = canvas.getByRole<HTMLButtonElement>("button", {
      name: "Undo match",
    });
    expect(undoBtn).toBeDisabled();
  },
};

export const NotFirstMatchUndoEnabled: Story = {
  args: {
    matchIndex: 5,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const undoBtn = canvas.getByRole<HTMLButtonElement>("button", {
      name: "Undo match",
    });
    expect(undoBtn).not.toBeDisabled();
  },
};

export const RecommendedMatchCountNotMet: Story = {
  args: {
    matchIndex: RECOMMENDED_MINIMUM_MATCHES - 1,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const submitBtn = canvas.getByRole<HTMLButtonElement>("button", {
      name: "Submit",
    });

    await userEvent.click(submitBtn);
    const modal = canvas.queryByRole("dialog", {
      name: "Too few matches played",
    });
    await expect(modal).toBeInTheDocument();
  },
};

export const RecommendedMatchCountMet: Story = {
  args: {
    matchIndex: RECOMMENDED_MINIMUM_MATCHES,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const submitBtn = canvas.getByRole<HTMLButtonElement>("button", {
      name: "Submit",
    });

    await userEvent.click(submitBtn);
    const modal = canvas.queryByRole("dialog", {
      name: "Submit results?",
    });
    await expect(modal).toBeInTheDocument();
  },
};
