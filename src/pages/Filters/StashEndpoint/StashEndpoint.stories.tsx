import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import StashEndpointFilter from "./StashEndpoint";

const meta = {
  title: "Filters/StashEndpoint",
  component: StashEndpointFilter,
  args: {
    stashConfig: {
      general: {
        stashBoxes: [
          { endpoint: "https://stashdb.org/graphql", name: "StashDB" },
          {
            endpoint: "https://fansdb.cc/graphql",
            name: "FansDB",
          },
        ],
      },
    },
  },
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof StashEndpointFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CheckboxForEachOption: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const stashDBCheck = canvas.getByRole("checkbox", {
      name: "StashDB",
    });
    const fansDBCheck = canvas.getByRole("checkbox", {
      name: "FansDB",
    });

    expect(stashDBCheck).toBeInTheDocument();
    expect(fansDBCheck).toBeInTheDocument();
  },
};

export const CheckboxForEachNone: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const stashDBCheck = canvas.getByRole("checkbox", {
      name: "StashDB",
    });
    const noneCheck = canvas.getByRole("checkbox", {
      name: "No endpoint",
    });

    await step("An option for no endpoints should be available", () => {
      expect(noneCheck).toBeInTheDocument();
    });

    await step("Check the StashDB checkbox", async () => {
      userEvent.click(stashDBCheck);
      await expect(stashDBCheck).toBeChecked();
    });

    await step(
      "Check the no endpoint checkbox and expect the StashDB checkbox to be come unticked",
      async () => {
        userEvent.click(noneCheck);
        await expect(noneCheck).toBeChecked();
        await expect(stashDBCheck).not.toBeChecked();
      }
    );
  },
};
