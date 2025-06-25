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
    const lastBtn = canvas.getByRole<HTMLButtonElement>("button", {
      name: "Load last page",
    });

    expect(firstBtn).toBeDisabled();
    expect(lastBtn).not.toBeDisabled();
  },
};

export const LastPageActive: Story = {
  args: {
    count: 3,
    current: 3,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstBtn = canvas.getByRole<HTMLButtonElement>("button", {
      name: "Load first page",
    });
    const lastBtn = canvas.getByRole<HTMLButtonElement>("button", {
      name: "Load last page",
    });

    expect(firstBtn).not.toBeDisabled();
    expect(lastBtn).toBeDisabled();
  },
};

export const NonCompactButtons: Story = {
  args: {
    count: 3,
    current: 2,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page1Btn = canvas.getByRole<HTMLButtonElement>("button", {
      name: "Load page 1",
    });
    const page2Btn = canvas.getByRole<HTMLButtonElement>("button", {
      name: "Load page 2",
    });
    const page3Btn = canvas.getByRole<HTMLButtonElement>("button", {
      name: "Load page 3",
    });
    const prevBtn = canvas.queryByRole<HTMLButtonElement>("button", {
      name: "Load previous page",
    });

    expect(page1Btn).not.toBeDisabled();
    expect(page2Btn).toBeDisabled();
    expect(page3Btn).not.toBeDisabled();
    expect(prevBtn).not.toBeInTheDocument();
  },
};

export const CompactButtons: Story = {
  args: {
    count: 5,
    current: 2,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const prevBtn = canvas.getByRole<HTMLButtonElement>("button", {
      name: "Load previous page",
    });

    expect(prevBtn).toBeInTheDocument();
  },
};
