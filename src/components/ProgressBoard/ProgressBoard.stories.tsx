import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import ProgressBoard from "./ProgressBoard";

const meta = {
  title: "Components/Progress board",
  component: ProgressBoard,
  args: {
    columnTitles: ["A", "B"],
    results: [
      [28, 38, 0],
      [7, 76, 1],
      [5, 6, 1],
      [2, 71, 0],
      [88, 4, 1],
      [59, 83, 0.5],
      [100, 77, 0],
      [70, 19, 0],
      [108, 13, 1],
      [12, 125, 0],
    ],
  },
} satisfies Meta<typeof ProgressBoard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Table data should be displayed in ascending order (first match at the top)
 * by default, with five rows of content. */
export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const cells = canvas.getAllByRole("cell");
    expect(cells[0].textContent).toBe("1");
    expect(cells[1].textContent).toBe(args.results[0][0]);
  },
};

/** If no table data is passed, render a warning. */
export const NoData: Story = {
  args: {
    results: [],
    title: "No table data",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cell = canvas.getByRole("cell");
    expect(cell).toBeInTheDocument();
    expect(cell.textContent?.length).toBeTruthy();
  },
};

/** Table data should be displayed in descending order (last match at the
 * top). */
export const Reverse: Story = {
  args: {
    reverse: true,
    title: "Recorded in reverse order",
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const cells = canvas.getAllByRole("cell");
    expect(cells[0].textContent).toBe("10");
    expect(cells[1].textContent).toBe(args.results[args.results.length - 1][0]);
  },
};

/** Table data should be displayed in ascending order (first match at the
 * top). */
export const NoReverse: Story = {
  args: {
    reverse: false,
    title: "Recorded in play order",
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const cells = canvas.getAllByRole("cell");
    expect(cells[0].textContent).toBe("1");
    expect(cells[1].textContent).toBe(args.results[0][0]);
  },
};

/** Five rows of results should be displayed by default. */
export const DefaultMaxRows: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cells = canvas.getAllByRole("cell");
    expect(cells.length).toBe(15);
  },
};

/** Up to the maximum number of rows should be displayed if set by the user. */
export const CustomMaxRows: Story = {
  args: {
    maxRows: 3,
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const cells = canvas.getAllByRole("cell");
    expect(cells.length).toBe(args.maxRows * 3);
  },
};
