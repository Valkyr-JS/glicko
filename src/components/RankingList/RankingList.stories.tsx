import type { Meta, StoryObj } from "@storybook/react-vite";
import RankingList from "./RankingList";
import allPerformers from "../../mocks/allPerformers.json" with {type: "json"}
import { formatPerformersToRanked } from "@/helpers/gameplay";

const stashPerformers = allPerformers.data.findPerformers.performers.map(p => ({
        ...p,
        id: +p.id
    }))

const rankedPerformers = formatPerformersToRanked(stashPerformers).map(p => ({
  ...p,
  recentOpponent: {
    ...p.recentOpponent,
    // Add static name to fulfil accessibility report.
    name: "Opponent name"
  }
}))

const meta = {
  title: "Components/RankingList",
  component: RankingList,
  args: {
    performers: rankedPerformers,
    sessionHistory: [new Date("2025-06-15T16:14:53.809Z")],
  },
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof RankingList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
