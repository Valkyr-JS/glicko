import type { Meta, StoryObj } from "@storybook/react-vite";
import RankingList from "./RankingList";

const meta = {
  title: "Components/RankingList",
  component: RankingList,
  args: {},
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof RankingList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
