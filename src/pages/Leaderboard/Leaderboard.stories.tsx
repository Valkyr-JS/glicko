import type { Meta, StoryObj } from "@storybook/react-vite";
import LeaderboardPage from "./Leaderboard";
import allPerformers from "../../mocks/allPerformers.json" with {type: "json"}
import { fn } from "storybook/test";

const meta = {
  title: "Pages/Leaderboard",
  component: LeaderboardPage,
  args: {
    performers: allPerformers.data.findPerformers.performers.map (p => ({
        ...p,
        id: +p.id
    })),
    sessionHistory: [new Date("2025-06-15T16:14:53.809Z")],
    setActivePage: fn(),
  },
} satisfies Meta<typeof LeaderboardPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
