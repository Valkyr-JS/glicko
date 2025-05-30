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
      ["Jay", "sammy", 0],
      ["Anna", "Serena", 1],
      ["Danni", "Maddy", 0],
      ["Melody", "Kelly", 0],
      ["Danielle", "Ryana", 0],
      ["Lizz", "Sophie", 1],
      ["Sammi", "Ginebra", 0],
    ],
    title: "Progress board",
  },
} satisfies Meta<typeof ProgressBoard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  /** Table data should be displayed in ascending order (match 1 at the top) by
   * default. */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstColumn = canvas.getAllByRole("cell");
    expect(firstColumn[0].textContent).toBe("1");
  },
};
