import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import GamePage from "./Game";
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
  title: "Pages/Game",
  component: GamePage,
  args: {
    changeImageHandler: fn(),
    match,
    matchIndex: 0,
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
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const imgButton = canvas.getByRole<HTMLButtonElement>("button", {
      name: "Change image for " + args.match[0].name,
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
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const imgButton = canvas.getByRole<HTMLButtonElement>("button", {
      name: "No alternative images available for " + args.match[0].name,
    });

    expect(imgButton).toBeDisabled();
  },
};
