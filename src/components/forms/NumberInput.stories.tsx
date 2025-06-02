import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
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
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Minimums: Story = {
  args: {
    initialValue: 20,
    min: 0,
    softMin: {
      value: 15,
      warning: "The recommended minimum is 15.",
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole<HTMLInputElement>("spinbutton", {
      name: "My number input",
    });

    await step("No warning message should be available", () => {
      const warning = canvas.queryByText("The recommended minimum is 15.");
      expect(warning).not.toBeInTheDocument();
    });

    await step(
      "A warning should appear on changing the input value to under the soft minimum.",
      async () => {
        await userEvent.clear(input);
        await userEvent.type(input, "14");
        const warning = canvas.getByText("The recommended minimum is 15.");
        expect(warning).toBeInTheDocument();
      }
    );

    await step(
      "The warning should disappear on changing the input value to the soft minimum.",
      async () => {
        await userEvent.clear(input);
        await userEvent.type(input, "15");
        const warning = canvas.queryByText("The recommended minimum is 15.");
        expect(warning).not.toBeInTheDocument();
      }
    );
  },
};

export const Maximums: Story = {
  args: {
    initialValue: 20,
    max: 50,
    softMax: {
      value: 25,
      warning: "The recommended maximum is 25.",
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole<HTMLInputElement>("spinbutton", {
      name: "My number input",
    });

    await step("No warning message should be available", () => {
      const warning = canvas.queryByText("The recommended maximum is 25.");
      expect(warning).not.toBeInTheDocument();
    });

    await step(
      "A warning should appear on changing the input value to over the soft maximum.",
      async () => {
        await userEvent.clear(input);
        await userEvent.type(input, "26");
        const warning = canvas.getByText("The recommended maximum is 25.");
        expect(warning).toBeInTheDocument();
      }
    );

    await step(
      "The warning should disappear on changing the input value to the soft maximum.",
      async () => {
        await userEvent.clear(input);
        await userEvent.type(input, "25");
        const warning = canvas.queryByText("The recommended maximum is 25.");
        expect(warning).not.toBeInTheDocument();
      }
    );
  },
};
