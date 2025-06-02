import type { Meta, StoryObj } from "@storybook/react-vite";
import Settings from "./Settings";

const meta = {
  title: "Pages/Settings",
  component: Settings,
  args: {
    inProgress: false,
  },
} satisfies Meta<typeof Settings>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotInProgress: Story = {};
