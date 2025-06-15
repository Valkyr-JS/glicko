import type { Meta, StoryObj } from "@storybook/react-vite";
import RankingList from "./RankingList";

const meta = {
  title: "Components/RankingList",
  component: RankingList,
  args: {
    performers: [],
    sessionHistory: ["2025-06-15T16:14:53.809Z"],
  },
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof RankingList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
