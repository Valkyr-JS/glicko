import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { WithFormSubmission } from "../../../../.storybook/decorators";
import CheckboxGroup from "./RadioGroup";

const meta = {
  title: "Components/Forms/RadioGroup",
  component: CheckboxGroup,
  args: {
    title: "Radio group",
    name: "yesOrNo",
    radios: [
      {
        isChecked: false,
        id: "yes",
        label: "Yes",
        value: "yes",
      },
      {
        isChecked: false,
        id: "no",
        label: "No",
        value: "no",
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
  decorators: [WithFormSubmission],
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const submit = canvas.getByRole<HTMLButtonElement>("button", {
      name: "Submit form",
    });

    await step("Click on the 'Yes' checkbox", () => {
      const checkbox = canvas.getByRole("radio", {
        name: "Yes",
      });
      userEvent.click(checkbox);
    });

    await step("Get the response", async () => {
      await userEvent.click(submit);

      const response = canvas.getByTestId("form-response");
      expect(response.textContent).toBe(
        JSON.stringify({
          yesOrNo: "yes",
        })
      );
    });
  },
};
