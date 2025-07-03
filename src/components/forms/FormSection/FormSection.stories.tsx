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
  parameters: {
    layout: "padded",
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
        Read-only mode disables saving performer results to the Stash database.
        User settings and performer filters will still be saved to the Stash
        config.yml file as normal.
      </FormToggle>,
    ],
  },
};
