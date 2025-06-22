import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import Settings from "./Settings";

const meta = {
  title: "Pages/Settings",
  component: Settings,
  args: {
    saveSettingsHandler: fn(),
    setActivePage: fn(),
    settings: {},
    wipeDataHandler: fn(),
  },
} satisfies Meta<typeof Settings>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CancelChangedSettings: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const cancelBtn = canvas.getByRole<HTMLButtonElement>("button", {
      name: "Cancel",
    });
    const input = canvas.getByRole<HTMLInputElement>("checkbox", {
      name: 'Enable "read-only" mode',
    });

    await step("Check the initial state of the checkbox.", () => {
      expect(input).not.toBeChecked();
    });

    await step("Click the checkbox.", async () => {
      await userEvent.click(input);
      expect(input).toBeChecked();
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
    const input = canvas.getByRole<HTMLInputElement>("checkbox", {
      name: 'Enable "read-only" mode',
    });

    await step("Check the initial state of the female gender checkbox.", () => {
      expect(input).not.toBeChecked();
    });

    await step("Click the checkbox.", async () => {
      await userEvent.click(input);
      expect(input).toBeChecked();
    });

    await step("Check the button is no longer disabled.", () => {
      expect(saveBtn).not.toBeDisabled();
    });
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

export const NotReadOnly: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole<HTMLInputElement>("checkbox", {
      name: 'Enable "read-only" mode',
    });
    const wipeBtn = canvas.getByRole<HTMLButtonElement>("button", {
      name: "Wipe performer data",
    });
    expect(input).not.toBeChecked();
    expect(wipeBtn).not.toBeDisabled();
  },
};

export const ReadOnlyDefault: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole<HTMLInputElement>("checkbox", {
      name: 'Enable "read-only" mode',
    });
    const wipeBtn = canvas.getByRole<HTMLButtonElement>("button", {
      name: "Wipe performer data",
    });

    await userEvent.click(input);

    await expect(input).toBeChecked();
    await expect(wipeBtn).toBeDisabled();
  },
};

export const ImageQualityDefault: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const originalInput = canvas.getByRole<HTMLInputElement>("radio", {
      name: "Original",
    });
    const thumbnailInput = canvas.getByRole<HTMLInputElement>("radio", {
      name: "Thumbnail",
    });
    expect(originalInput).not.toBeChecked();
    expect(thumbnailInput).toBeChecked();
  },
};
