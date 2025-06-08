import type { Meta, StoryObj } from "@storybook/react-vite";
import StashVersionReport from "./StashVersionReport";
import { expect, within } from "storybook/test";

const meta = {
  title: "Components/Stash Version Report",
  component: StashVersionReport,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof StashVersionReport>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Connecting to Stash successful. */
export const Connected: Story = {
  args: {
    request: {
      loading: false,
      data: {
        version: {
          version: "v0.28.1",
          hash: "cc6917f2",
          build_time: "2025-03-19 23:01:38",
        },
      },
      error: undefined,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const connectStatusText =
      canvas.getByText<HTMLElement>(/Connected to Stash/i);
    expect(connectStatusText).toBeInTheDocument();
  },
};
