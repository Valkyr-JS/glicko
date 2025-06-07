import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import Settings from "./Settings";
import { WithMemoryRouter } from "../../../.storybook/decorators";

const defaultFilters = {
  genders: [],
  limit: 20,
};

const meta = {
  title: "Pages/Settings",
  component: Settings,
  decorators: [WithMemoryRouter],
  args: {
    activePage: "SETTINGS",
    filters: defaultFilters,
    inProgress: false,
    saveSettingsHandler: fn(),
    setActivePage: fn(),
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cancelBtn = canvas.getByRole<HTMLButtonElement>("button", {
      name: "Cancel",
    });

    await userEvent.click(cancelBtn);
    const modal = canvas.queryByRole("dialog", {
      name: "Changes will not be saved",
    });
    await expect(modal).not.toBeInTheDocument();
  },
};

export const SaveChangedSettings: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const saveBtn = canvas.getByRole<HTMLButtonElement>("button", {
      name: "Save",
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

    await step("Check the button is no longer disabled.", () => {
      expect(saveBtn).not.toBeDisabled();
    });
  },
};

export const SaveChangedSettingsInProgress: Story = {
  args: {
    inProgress: true,
  },
  play: async ({ context, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const saveBtn = canvas.getByRole<HTMLButtonElement>("button", {
      name: "Save",
    });

    if (SaveChangedSettings.play) await SaveChangedSettings.play(context);

    await step(
      "Click the 'Save' button and expect a modal to appear.",
      async () => {
        await userEvent.click(saveBtn);
        const modal = canvas.getByRole("dialog", {
          name: "Tournament progress will be lost",
        });
        await expect(modal).toBeInTheDocument();
      }
    );
  },
};

export const SaveUnchangedSettings: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const btn = canvas.getByRole<HTMLButtonElement>("button", {
      name: "Save",
    });
    expect(btn).toBeDisabled();
  },
};
