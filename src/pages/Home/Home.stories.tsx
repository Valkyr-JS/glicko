import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import Home from "./Home";

const meta = {
  title: "Pages/Home",
  component: Home,
} satisfies Meta<typeof Home>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    changeFiltersHandler: fn(),
    newTournamentHandler: fn(),
  },
};
