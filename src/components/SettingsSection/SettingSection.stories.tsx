import type { Meta, StoryObj } from "@storybook/react-vite";
import SettingSection from "./SettingSection";

const meta = {
  title: "Components/SettingSection",
  component: SettingSection,
  args: {},
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof SettingSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
