import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import ProgressBoard from "./ProgressBoard";
import { DEFAULT_MAX_PROGRESS_BOARD_ROWS } from "@/constants";

const performerData = [
  {
    id: 28,
    name: "Sophie",
  },
  {
    id: 38,
    name: "Danielle",
  },
  {
    id: 7,
    name: "Lily",
  },
  {
    id: 76,
    name: "Mia",
  },
  {
    id: 5,
    name: "Sophia",
  },
  {
    id: 6,
    name: "Kelly",
  },
  {
    id: 2,
    name: "Hannah",
  },
  {
    id: 71,
    name: "Tilly",
  },
  {
    id: 88,
    name: "Claire",
  },
  {
    id: 4,
    name: "Susan",
  },
  {
    id: 59,
    name: "Molly",
  },
  {
    id: 83,
    name: "Giselle",
  },
  {
    id: 100,
    name: "Aubrey",
  },
  {
    id: 77,
    name: "Kate",
  },
];

const meta = {
  title: "Components/Progress board",
  component: ProgressBoard,
  args: {
    columnTitles: ["A", "B"],
    performerData,
    results: [
      [28, 38, 0],
      [7, 76, 1],
      [5, 6, 1],
      [2, 71, 0],
      [88, 4, 1],
      [59, 83, 0.5],
      [100, 77, 0],
    ],
  },
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof ProgressBoard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Table data should be displayed in ascending order (first match at the top)
 * by default, with five rows of content. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cells = canvas.getAllByRole("cell");
    expect(cells[0].textContent).toBe("1");
    expect(cells.length).toBe(15);
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cells = canvas.getAllByRole("cell");
    expect(cells[0].textContent).toBe((performerData.length / 2).toString());
  },
};

/** Table data should be displayed in ascending order (first match at the
 * top). */
export const NoReverse: Story = {
  args: {
    reverse: false,
    title: "Recorded in play order",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cells = canvas.getAllByRole("cell");
    expect(cells[0].textContent).toBe("1");
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
    expect(cells.length).toBe(
      (args.maxRows ?? DEFAULT_MAX_PROGRESS_BOARD_ROWS) * 3
    );
  },
};
