import type { Meta, StoryObj } from "@storybook/react-vite";
import StashVersionReport from "./StashVersionReport";
import { expect, within } from "storybook/test";
import { ApolloError } from "@apollo/client";

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

export const Error: Story = {
  args: {
    request: {
      loading: false,
      data: undefined,
      error: {
        ...new ApolloError({}),
        name: "Apollo Error",
        message: "Response not successful: Received status code 422",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const connectStatusText = canvas.getByText<HTMLElement>(
      /Unable to connect to Stash. Please check your connection./i
    );
    expect(connectStatusText).toBeInTheDocument();
  },
};

export const Loading: Story = {
  args: {
    request: {
      loading: true,
      data: undefined,
      error: undefined,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const connectStatusText = canvas.getByText<HTMLElement>(
      /Attempting to connect to Stash.../i
    );
    expect(connectStatusText).toBeInTheDocument();
  },
};

export const VersionFullyCompatible: Story = {
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
    const connectStatusText = canvas.getByText<HTMLElement>(
      "This version is fully compatible with Glicko."
    );
    expect(connectStatusText).toBeInTheDocument();
  },
};

export const VersionPartiallyCompatible: Story = {
  args: {
    request: {
      loading: false,
      data: {
        version: {
          version: "v0.27.0",
          hash: "cc6917f2",
          build_time: "2025-03-19 23:01:38",
        },
      },
      error: undefined,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const connectStatusText = canvas.getByText<HTMLElement>(
      "This version is compatible with Glicko but with some limitations:"
    );
    expect(connectStatusText).toBeInTheDocument();
  },
};
