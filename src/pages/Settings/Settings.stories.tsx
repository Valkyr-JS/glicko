import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import Settings from "./Settings";

const defaultFilters = {
  genders: [],
  limit: 20,
};

const meta = {
  title: "Pages/Settings",
  component: Settings,
  args: {
    filters: defaultFilters,
    inProgress: false,
    saveSettingsHandler: fn(),
  },
} satisfies Meta<typeof Settings>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotInProgress: Story = {};

export const CancelChangedSettings: Story = {
  args: {
    filters: { ...defaultFilters, limit: 20 },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const cancelBtn = canvas.getByRole<HTMLButtonElement>("button", {
      name: "Cancel",
    });
    const input = canvas.getByRole<HTMLInputElement>("spinbutton", {
      name: "Performer limit",
    });

    await step("Check the initial value of the limit input.", () => {
      expect(input.value).toBe("20");
    });

    await step("Make a change to the limit value.", async () => {
      await userEvent.clear(input);
      await userEvent.type(input, "5");
      expect(input.value).toBe("5");
    });

    await step(
      "Click the 'Cancel' button and expect a modal to appear.",
      async () => {
        await userEvent.click(cancelBtn);
        const modal = canvas.getByRole("dialog", {
          name: "Changes will not be saved",
        });
        await expect(modal).toBeInTheDocument();
      }
    );
  },
};

export const CancelUnchangedSettings: Story = {
  args: {
    filters: { ...defaultFilters, limit: 20 },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const cancelBtn = canvas.getByRole<HTMLButtonElement>("button", {
      name: "Cancel",
    });
    const input = canvas.getByRole<HTMLInputElement>("spinbutton", {
      name: "Performer limit",
    });

    await step("Check the initial value of the limit input.", () => {
      expect(input.value).toBe("20");
    });

    await step(
      "Click the 'Cancel' button and expect no modal to appear.",
      async () => {
        await userEvent.click(cancelBtn);
        const modal = canvas.queryByRole("dialog", {
          name: "Changes will not be saved",
        });
        await expect(modal).not.toBeInTheDocument();
      }
    );
  },
};
