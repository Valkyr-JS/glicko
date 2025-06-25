import type { Meta, StoryObj } from "@storybook/react-vite";
import LoadingSpinner from "./LoadingSpinner";

const meta = {
  title: "Components/LoadingSpinner",
  component: LoadingSpinner,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof LoadingSpinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Example: Story = {};
