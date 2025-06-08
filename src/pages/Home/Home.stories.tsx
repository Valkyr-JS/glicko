import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { ApolloError } from "@apollo/client";
import Home from "./Home";

const meta = {
  title: "Pages/Home",
  component: Home,
  args: {
    activePage: "HOME",
    fetchData: null,
    fetchError: null,
    fetchLoading: false,
    inProgress: false,
    setActivePage: fn(),
    startNewTournamentHandler: fn(),
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

/** If no tournament is in progress, no "Continue" option should be available. */
export const NotInProgress: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const continueBtn = canvas.queryByRole<HTMLButtonElement>("button", {
      name: "Continue tournament",
    });
    await expect(continueBtn).not.toBeInTheDocument();
  },
};

/** If a tournament is in progress, a "Continue" option should be available at
 * the top of the list. */
export const InProgress: Story = {
  args: {
    inProgress: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('The "Continue tournament" button should be available', () => {
      const continueBtn = canvas.getByRole<HTMLButtonElement>("button", {
        name: "Continue tournament",
      });
      expect(continueBtn).toBeInTheDocument();
    });

    await step(
      'The "Continue tournament" button should be the first button in the list',
      () => {
        const allBtns = canvas.getAllByRole<HTMLButtonElement>("button");
        expect(allBtns[0].textContent).toBe("Continue tournament");
      }
    );

    await step(
      'On clicking "New tournament", a modal should ask if you want to lose your existing progress',
      async () => {
        const newBtn = canvas.getByRole("button", {
          name: "New tournament",
        });
        await userEvent.click(newBtn);

        const modal = canvas.getByRole("dialog", {
          name: "Tournament in progress",
        });
        expect(modal).toBeInTheDocument();
      }
    );
  },
};

/** If a tournament is in progress, alert in a modal when clicking to change the
 * settings. */
export const InProgressChangeSettings: Story = {
  args: {
    inProgress: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const settingsBtn = canvas.getByRole("button", {
      name: "Tournament settings",
    });
    await userEvent.click(settingsBtn);

    const modal = canvas.getByRole("dialog", {
      name: "Tournament in progress",
    });
    expect(modal).toBeInTheDocument();
  },
};

export const IsLoading: Story = {
  args: {
    fetchLoading: true,
    inProgress: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const newBtn = canvas.getByRole("button", {
      name: "New tournament",
    });

    expect(newBtn).toBeDisabled();
  },
};

export const IsLoadingInProgress: Story = {
  args: {
    fetchLoading: true,
    inProgress: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const continueBtn = canvas.getByRole("button", {
      name: "Continue tournament",
    });

    expect(continueBtn).toBeDisabled();
  },
};

export const PerformersFetchError: Story = {
  args: {
    fetchError: {
      ...new ApolloError({}),
      name: "Apollo Error",
      message: "Response not successful: Received status code 422",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const newBtn = canvas.getByRole("button", {
      name: "New tournament",
    });

    await userEvent.click(newBtn);

    await waitFor(() => {
      const modal = canvas.getByRole("dialog", {
        name: "Apollo Error",
      });
      expect(modal).toBeInTheDocument();
    });
  },
};

export const NotEnoughPerformers: Story = {
  args: {
    fetchData: {
      findPerformers: {
        count: 1,
        performers: [],
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const newBtn = canvas.getByRole("button", {
      name: "New tournament",
    });

    await userEvent.click(newBtn);

    await waitFor(() => {
      const modal = canvas.getByRole("dialog", {
        name: "Not enough performers",
      });
      expect(modal).toBeInTheDocument();
    });
  },
};
