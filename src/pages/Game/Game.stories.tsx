import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import GamePage from "./Game";
import { getStashContent } from "../../../.storybook/tools";
import { RECOMMENDED_MINIMUM_MATCHES } from "@/constants";

const slimData: StashSlimPerformerData[] = [
  {
    id: 59,
    name: "Alyssia",
  },
  {
    id: 100,
    name: "Kayla",
  },
  {
    id: 11,
    name: "Lissy",
  },
  {
    id: 27,
    name: "Von",
  },
  {
    id: 26,
    name: "Kym",
  },
  {
    id: 33,
    name: "Ryana",
  },
  {
    id: 103,
    name: "Valentina",
  },
  {
    id: 88,
    name: "Lelu",
  },
  {
    id: 81,
    name: "Sophia",
  },
  {
    id: 28,
    name: "Sophie",
  },
];

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
  title: "Pages/Game",
  component: GamePage,
  args: {
    changeImageHandler: fn(),
    gameError: undefined,
    match,
    matchIndex: 0,
    performerData: slimData,
    processingResults: false,
    results: [],
    setActivePage: fn(),
    setDrawHandler: fn(),
    setWinnerHandler: fn(),
    submitHandler: fn(),
    undoMatchHandler: fn(),
    wipeResultsHandler: fn(),
  },
} satisfies Meta<typeof GamePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AltImagesAvailable: Story = {
  args: {
    match: [
      {
        ...match[0],
        imagesAvailable: true,
      },
      {
        ...match[1],
        imagesAvailable: true,
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const imgButton = canvas.getByRole<HTMLButtonElement>("button", {
      name: "Change image for Danielle",
    });

    expect(imgButton).not.toBeDisabled();
  },
};

export const AltImagesUnavailable: Story = {
  args: {
    match: [
      {
        ...match[0],
        imagesAvailable: false,
      },
      {
        ...match[1],
        imagesAvailable: false,
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const imgButton = canvas.getByRole<HTMLButtonElement>("button", {
      name: "No alternative images available for Danielle",
    });

    expect(imgButton).toBeDisabled();
  },
};

export const RecommendedMatchCountNotMet: Story = {
  args: {
    matchIndex: RECOMMENDED_MINIMUM_MATCHES - 2,
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
    matchIndex: RECOMMENDED_MINIMUM_MATCHES - 1,
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

export const AbandonSession: Story = {
  args: {
    matchIndex: RECOMMENDED_MINIMUM_MATCHES - 2,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const abandonBtn = canvas.getByRole<HTMLButtonElement>("button", {
      name: "Abandon progress",
    });

    await userEvent.click(abandonBtn);
    const modal = canvas.queryByRole("dialog", {
      name: "Abandon session?",
    });
    await expect(modal).toBeInTheDocument();
  },
};
