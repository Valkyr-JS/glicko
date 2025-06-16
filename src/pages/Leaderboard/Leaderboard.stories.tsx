import type { Meta, StoryObj } from "@storybook/react-vite";
import LeaderboardPage from "./Leaderboard";
import { fn } from "storybook/test";
import { WithApollo } from "../../../.storybook/decorators";

const meta = {
  title: "Pages/Leaderboard",
  component: LeaderboardPage,
  decorators: [WithApollo],
  args: {
    setActivePage: fn(),
  },
} satisfies Meta<typeof LeaderboardPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
