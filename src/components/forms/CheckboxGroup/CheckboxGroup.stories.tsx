import type { Meta, StoryObj } from "@storybook/react-vite";
import CheckboxGroup from "./CheckboxGroup";

const meta = {
  title: "Components/Forms/CheckboxGroup",
  component: CheckboxGroup,
  args: {},
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof CheckboxGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
