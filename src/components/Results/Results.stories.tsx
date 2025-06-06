import type { Meta, StoryObj } from "@storybook/react-vite";
import { Glicko2 } from "glicko2";
import Results from "./Results";
import { getStashContent } from "../../../.storybook/tools";
import { createRoundRobinMatchList } from "@/helpers/gameplay";
import mockPerformers from "../../mocks/Performers.json";
import type { Match } from "@/types/global";

const tournament = new Glicko2();
const matchList: Match[] = createRoundRobinMatchList(mockPerformers.length).map(
  (m) => [...m, Math.round(Math.random()) as 0 | 1]
);
const players = mockPerformers.map((p) => ({
  ...p,
  coverImg: getStashContent(p.coverImg),
  glicko: tournament.makePlayer(1500),
  imagesAvailable: true,
}));

const meta = {
  title: "Components/Results Board",
  component: Results,
  args: {
    matchList,
    players,
  },
} satisfies Meta<typeof Results>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
