import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import StashEndpointFilter from "./StashEndpoint";
import { WithFormSubmission } from "../../../../.storybook/decorators";

const meta = {
  title: "Filters/StashEndpoint",
  component: StashEndpointFilter,
  decorators: [WithFormSubmission],
  args: {
    endpointFilter: undefined,
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

export const Loading: Story = {
  args: {
    stashConfig: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const loading = canvas.getByText("Loading...");
    expect(loading).toBeInTheDocument();
  },
};

export const RadioForEachOption: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const stashDBCheck = canvas.getByRole("radio", {
      name: "StashDB",
    });
    const fansDBCheck = canvas.getByRole("radio", {
      name: "FansDB",
    });

    expect(stashDBCheck).toBeInTheDocument();
    expect(fansDBCheck).toBeInTheDocument();
  },
};

export const RadioForNone: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const noneCheck = canvas.getByRole("radio", {
      name: "No endpoint",
    });

    expect(noneCheck).toBeInTheDocument();
  },
};

export const RadioForAny: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const noneCheck = canvas.getByRole("radio", {
      name: "Any endpoint",
    });

    expect(noneCheck).toBeInTheDocument();
  },
};

export const RadioForNoCheck: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const noneCheck = canvas.getByRole("radio", {
      name: "Don't check",
    });

    expect(noneCheck).toBeInTheDocument();
  },
};

export const PreSelected: Story = {
  args: {
    endpointFilter: { modifier: "IS_NULL" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const noneCheck = canvas.getByRole("radio", {
      name: "No endpoint",
    });

    expect(noneCheck).toBeChecked();
  },
};
