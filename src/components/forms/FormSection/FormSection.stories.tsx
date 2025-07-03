import type { Meta, StoryObj } from "@storybook/react-vite";
import FormSection from "./FormSection";

const meta = {
  title: "Components/FormSection",
  component: FormSection,
  args: {
    heading: "Heading",
  },
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof FormSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
