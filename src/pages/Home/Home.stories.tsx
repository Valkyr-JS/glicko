import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { ApolloError } from "@apollo/client";
import Home from "./Home";

const meta = {
  title: "Pages/Home",
  component: Home,
  args: {
    clearGameError: fn(),
    gameError: undefined,
    gameLoading: false,
    setActivePage: fn(),
    startGameHandler: fn(),
    versionData: {
      version: {
        version: "v0.28.1",
        hash: "cc6917f2",
        build_time: "2025-03-19 23:01:38",
      },
    },
    versionError: undefined,
    versionLoading: false,
  },
} satisfies Meta<typeof Home>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GameReady: Story = {
  args: {
    gameError: null,
    gameLoading: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const startButton = canvas.getByRole("button", {
      name: "Start",
    });

    expect(startButton).not.toBeDisabled();
  },
};

export const GameLoading: Story = {
  args: {
    gameLoading: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const startButton = canvas.getByRole("button", {
      name: "Loading...",
    });

    expect(startButton).toBeDisabled();
  },
};

export const GameError: Story = {
  args: {
    gameError: {
      name: "Game Error",
      details: "Full error details",
      message: "A brief description of the error",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const startButton = canvas.getByRole("button", {
      name: "Start",
    });

    await userEvent.click(startButton);

    await waitFor(() => {
      const modal = canvas.getByRole("dialog", {
        name: "Game Error",
      });
      expect(modal).toBeInTheDocument();
    });
  },
};

export const ConnectedToStash: Story = {
  args: {
    versionError: undefined,
    versionLoading: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const startButton = canvas.getByRole("button", {
      name: "Start",
    });
    const filtersBtn = canvas.getByRole("button", {
      name: "Performer filters",
    });

    expect(startButton).not.toBeDisabled();
    expect(filtersBtn).not.toBeDisabled();
  },
};

export const ConnectingToStash: Story = {
  args: {
    versionLoading: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const startButton = canvas.getByRole("button", {
      name: "Start",
    });
    const filtersBtn = canvas.getByRole("button", {
      name: "Performer filters",
    });

    expect(startButton).toBeDisabled();
    expect(filtersBtn).toBeDisabled();
  },
};

export const UnableToConnect: Story = {
  args: {
    versionError: {
      ...new ApolloError({}),
      name: "Apollo Error",
      message: "Response not successful: Received status code 422",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const startButton = canvas.getByRole("button", {
      name: "Start",
    });
    const filtersBtn = canvas.getByRole("button", {
      name: "Performer filters",
    });

    expect(startButton).toBeDisabled();
    expect(filtersBtn).toBeDisabled();
  },
};
