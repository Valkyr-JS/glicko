import type { Meta, StoryObj } from "@storybook/react-vite";
import NumberInput from "./NumberInput";

const meta = {
  title: "Components/Forms/NumberInput",
  component: NumberInput,
  args: {
    initialValue: 1,
  },
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
