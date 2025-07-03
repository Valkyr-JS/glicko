import type { Meta, StoryObj } from "@storybook/react-vite";
import { WithContainer } from "../../../../.storybook/decorators";
import FormToggle from "../FormToggle/FormToggle";
import FormSection from "./FormSection";

const meta = {
  title: "Components/FormSection",
  component: FormSection,
  args: {
    heading: "Heading",
  },
  decorators: [WithContainer],
} satisfies Meta<typeof FormSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FormToggleItem: Story = {
  args: {
    children: [
      <FormToggle
        id="formToggleItem"
        isActive
        label='Enable "read-only" mode'
        name="form-toggle-item"
      >
        Abbreviate counters in cards and details view pages, for example "1831"
        will get formated to "1.8K".
      </FormToggle>,
    ],
  },
};
