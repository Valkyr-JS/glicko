import type { Meta, StoryObj } from "@storybook/react-vite";
import NumberInput from "./NumberInput";

const meta = {
  title: "Components/Forms/NumberInput",
  component: NumberInput,
  args: {
    id: "numberInput",
    initialValue: 1,
    label: "My number input",
    name: "my-number-input",
  },
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
