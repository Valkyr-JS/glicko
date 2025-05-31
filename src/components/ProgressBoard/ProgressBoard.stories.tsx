import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import ProgressBoard from "./ProgressBoard";

const meta = {
  title: "Components/Progress board",
  component: ProgressBoard,
  args: {
    columnTitles: ["A", "B"],
    tableData: [
      ["Mia", "Monique", 0],
      ["Jo", "Alyx", 1],
      ["Poppy", "Lotti", 1],
      ["Jay", "Sammy", 0],
      ["Anna", "Serena", 1],
      ["Danni", "Maddy", 0],
      ["Melody", "Kelly", 0],
      ["Danielle", "Ryana", 0],
      ["Lizz", "Sophie", 1],
      ["Sammi", "Ginebra", 0],
    ],
  },
} satisfies Meta<typeof ProgressBoard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Table data should be displayed in ascending order (first match at the top)
 * by default. */
export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const cells = canvas.getAllByRole("cell");
    expect(cells[0].textContent).toBe("1");
    expect(cells[1].textContent).toBe(args.tableData[0][0]);
  },
};

/** If no table data is passed, render a warning. */
export const NoData: Story = {
  args: {
    tableData: [],
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
    expect(cells[1].textContent).toBe(
      args.tableData[args.tableData.length - 1][0]
    );
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
    expect(cells[1].textContent).toBe(args.tableData[0][0]);
  },
};
