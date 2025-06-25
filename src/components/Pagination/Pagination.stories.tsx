import type { Meta, StoryObj } from "@storybook/react-vite";
import Pagination from "./Pagination";
import { expect, fn, within } from "storybook/test";

const meta = {
  title: "Components/Pagination",
  component: Pagination,
  args: {
    setCurrent: fn(),
  },
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstPageActive: Story = {
  args: {
    count: 3,
    current: 1,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstBtn = canvas.getByRole<HTMLButtonElement>("button", {
      name: "Load first page",
    });

    expect(firstBtn).toBeDisabled();
  },
};

export const FirstPageNotActive: Story = {
  args: {
    count: 3,
    current: 2,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstBtn = canvas.getByRole<HTMLButtonElement>("button", {
      name: "Load first page",
    });

    expect(firstBtn).not.toBeDisabled();
  },
};
