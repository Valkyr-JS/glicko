import type { Meta, StoryObj } from "@storybook/react-vite";
import TournamentPage from "./Tournament";
import { WithMemoryRouter } from "../../../.storybook/decorators";
import mockPerformers from "../../mocks/Performers.json";
import { Glicko2 } from "glicko2";
import { getStashContent } from "../../../.storybook/tools";
import { createRoundRobinMatchList } from "@/helpers/gameplay";
import { fn } from "storybook/internal/test";

const tournament = new Glicko2();
const matchList = createRoundRobinMatchList(mockPerformers.length);

const meta = {
  title: "Pages/Tournament",
  component: TournamentPage,
  decorators: [WithMemoryRouter],
  args: {
    declareDrawHandler: fn(),
    matchIndex: 0,
    matchList,
    players: mockPerformers.map((p) => {
      return {
        ...p,
        coverImg: getStashContent(p.coverImg),
        glicko: tournament.makePlayer(1500),
      };
    }),
    selectWinnerHandler: fn(),
    undoMatchHandler: fn(),
    wipeTournamentHandler: fn(),
  },
} satisfies Meta<typeof TournamentPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NewTournament: Story = {};
