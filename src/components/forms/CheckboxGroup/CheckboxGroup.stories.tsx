import type { Meta, StoryObj } from "@storybook/react-vite";
import CheckboxGroup from "./CheckboxGroup";

const meta = {
  title: "Components/Forms/CheckboxGroup",
  component: CheckboxGroup,
  args: {
    checkboxes: [
      { id: "genderFemale", label: "Female", value: "FEMALE" },
      { id: "genderMale", label: "Male", value: "MALE" },
    ],
  },
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof CheckboxGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
