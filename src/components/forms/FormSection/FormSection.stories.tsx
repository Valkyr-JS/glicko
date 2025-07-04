import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import {
  WithContainer,
  WithFormSubmission,
} from "../../../../.storybook/decorators";
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
  decorators: [WithFormSubmission, WithContainer],
} satisfies Meta<typeof FormSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FormToggleItem: Story = {
  args: {
    children: [
      <FormToggle
        id="formToggleItem"
        isActive={false}
        label='Enable "read-only" mode'
        name="form-toggle-item"
      >
        Read-only mode disables saving performer results to the Stash database.
        User settings and performer filters will still be saved to the Stash
        config.yml file as normal.
      </FormToggle>,
    ],
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const submit = canvas.getByRole<HTMLButtonElement>("button", {
      name: "Submit form",
    });
    const checkbox = canvas.getByRole("checkbox", {
      name: 'Enable "read-only" mode',
    });

    await step("Click on the toggle", () => {
      userEvent.click(checkbox);
    });

    await step("Get the response", async () => {
      await userEvent.click(submit);

      const response = canvas.getByTestId("form-response");
      expect(response.textContent).toBe(
        JSON.stringify({
          "form-toggle-item": "true",
        })
      );
    });

    await step("Click on the toggle again", () => {
      userEvent.click(checkbox);
    });

    await step("Get the response", async () => {
      await userEvent.click(submit);

      const response = canvas.getByTestId("form-response");
      expect(response.textContent).toBe(JSON.stringify({}));
    });
  },
};
