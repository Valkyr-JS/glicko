import type { Meta, StoryObj } from "@storybook/react-vite";
import { Glicko2 } from "glicko2";
import ResultsPage from "./ResultsPage";
import { getStashContent } from "../../../.storybook/tools";
import { createRoundRobinMatchList } from "@/helpers/gameplay";
import mockPerformers from "../../mocks/Performers.json";
import type { GlickoPlayer } from "@/types/global";
import { fn } from "storybook/internal/test";

const tournament = new Glicko2();
const matchList: [
  playerAIndex: number,
  playerBIndex: number,
  result: 0 | 1 | 0.5
][] = createRoundRobinMatchList(mockPerformers.length).map((m) => [
  ...m,
  Math.round(Math.random()) as 0 | 1,
]);
const players = mockPerformers.map((p) => ({
  ...p,
  coverImg: getStashContent(p.coverImg),
  glicko: tournament.makePlayer(1500) as GlickoPlayer,
  imagesAvailable: true,
  initialRating: p.custom_fields.glicko_rating,
}));

const fullMatchList: [GlickoPlayer, GlickoPlayer, 0 | 0.5 | 1][] =
  matchList.map((m) => [
    players[m[0]].glicko as GlickoPlayer,
    players[m[1]].glicko as GlickoPlayer,
    m[2],
  ]);

tournament.updateRatings(fullMatchList);

const meta = {
  title: "Pages/Results Page",
  component: ResultsPage,
  parameters: { layout: "padded" },
  args: {
    activePage: "RESULTS",
    matchList,
    players,
    setActivePage: fn(),
  },
} satisfies Meta<typeof ResultsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
