import type { Meta, StoryObj } from "@storybook/react-vite";
import TournamentPage from "./Tournament";
import { WithMemoryRouter } from "../../../.storybook/decorators";
import mockPerformers from "../../mocks/Performers.json";
import { Glicko2 } from "glicko2";
import { getStashContent } from "../../../.storybook/tools";

const tournament = new Glicko2();

const meta = {
  title: "Pages/Tournament",
  component: TournamentPage,
  decorators: [WithMemoryRouter],
  args: {
    players: mockPerformers.map((p) => {
      return {
        ...p,
        coverImg: getStashContent(p.coverImg),
        glicko: tournament.makePlayer(1500),
      };
    }),
    matchIndex: 0,
  },
} satisfies Meta<typeof TournamentPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NewTournament: Story = {};
