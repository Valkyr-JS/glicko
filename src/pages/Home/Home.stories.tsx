import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import Home from "./Home";
import { WithMemoryRouter } from "../../../.storybook/decorators";
import { ApolloError } from "@apollo/client";

const meta = {
  title: "Pages/Home",
  component: Home,
  decorators: [WithMemoryRouter],
  args: {
    inProgress: false,
    performersFetch: {
      loading: false,
    },
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
    inProgress: false,
    performersFetch: {
      loading: true,
    },
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
    inProgress: true,
    performersFetch: {
      loading: true,
    },
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
    inProgress: true,
    performersFetch: {
      error: {
        ...new ApolloError({}),
        name: "Apollo Error",
        message: "Response not successful: Received status code 422",
      },
      loading: false,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const modal = canvas.getByRole("dialog", {
      name: "Apollo Error",
    });
    expect(modal).toBeInTheDocument();
  },
};
