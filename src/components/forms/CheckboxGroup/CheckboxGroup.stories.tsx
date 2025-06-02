import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { FormSubmissionDecorator } from "../../../../.storybook/decorators";
import CheckboxGroup from "./CheckboxGroup";

const meta = {
  title: "Components/Forms/CheckboxGroup",
  component: CheckboxGroup,
  args: {
    checkboxes: [
      {
        isChecked: false,
        id: "genderFemale",
        label: "Female",
        name: "gender_female",
      },
      {
        isChecked: false,
        id: "genderMale",
        label: "Male",
        name: "gender_male",
      },
    ],
  },
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof CheckboxGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [FormSubmissionDecorator],
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const submit = canvas.getByRole<HTMLButtonElement>("button", {
      name: "Submit form",
    });

    await step("Click on the 'Female' checkbox", () => {
      const checkbox = canvas.getByRole("checkbox", {
        name: "Female",
      });
      userEvent.click(checkbox);
    });

    await step("Get the response", async () => {
      await userEvent.click(submit);

      const response = canvas.getByTestId("form-response");
      expect(response.textContent).toBe(
        JSON.stringify({
          [args.checkboxes[0].name]: "true",
        })
      );
    });
  },
};
