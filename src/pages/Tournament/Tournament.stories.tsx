import type { Meta, StoryObj } from "@storybook/react-vite";
import TournamentPage from "./Tournament";
import { WithMemoryRouter } from "../../../.storybook/decorators";
import mockPerformers from "../../mocks/Performers.json";
import { Glicko2 } from "glicko2";
import { getStashContent } from "../../../.storybook/tools";
import { createRoundRobinMatchList } from "@/helpers/gameplay";
import { expect, fn, within } from "storybook/test";

const tournament = new Glicko2();
const matchList = createRoundRobinMatchList(mockPerformers.length);
const players = mockPerformers.map((p) => ({
  ...p,
  coverImg: getStashContent(p.coverImg),
  glicko: tournament.makePlayer(1500),
  imagesAvailable: true,
}));

const meta = {
  title: "Pages/Tournament",
  component: TournamentPage,
  decorators: [WithMemoryRouter],
  args: {
    changeImageHandler: fn(),
    declareDrawHandler: fn(),
    matchIndex: 0,
    matchList,
    players,
    selectWinnerHandler: fn(),
    undoMatchHandler: fn(),
    wipeTournamentHandler: fn(),
  },
} satisfies Meta<typeof TournamentPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NewTournament: Story = {};

export const AltImagesAvailable: Story = {
  args: {
    matchList: createRoundRobinMatchList(2),
    players: [
      {
        ...players[0],
        imagesAvailable: true,
      },
      {
        ...players[1],
        imagesAvailable: true,
      },
    ],
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const imgButton = canvas.getByRole<HTMLButtonElement>("button", {
      name: "Change image for " + args.players[0].name,
    });

    expect(imgButton).not.toBeDisabled();
  },
};

export const AltImagesUnavailable: Story = {
  args: {
    matchList: createRoundRobinMatchList(2),
    players: [
      {
        ...players[0],
        imagesAvailable: false,
      },
      {
        ...players[1],
        imagesAvailable: false,
      },
    ],
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const imgButton = canvas.getByRole<HTMLButtonElement>("button", {
      name: "No alternative images available for " + args.players[0].name,
    });

    expect(imgButton).toBeDisabled();
  },
};
