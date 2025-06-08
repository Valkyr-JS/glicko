import type { Meta, StoryObj } from "@storybook/react-vite";
import StashVersionReport from "./StashVersionReport";

const meta = {
  title: "Components/Stash Version Report",
  component: StashVersionReport,
  args: {
    version: "v0.28.1",
  },
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof StashVersionReport>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Expect the undo button to be disabled on start, otherwise enabled. */
export const FullyCompatible: Story = {};
