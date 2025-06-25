import type { Meta, StoryObj } from "@storybook/react-vite";
import Pagination from "./Pagination";

const meta = {
  title: "Components/Pagination",
  component: Pagination,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
  args: {
    count: 3,
    current: 1,
  },
};
