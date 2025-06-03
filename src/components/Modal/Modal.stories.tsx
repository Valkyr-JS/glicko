import type { Meta, StoryObj } from "@storybook/react-vite";
import Modal from "./Modal";
import { fn } from "storybook/test";
import { faCircleQuestion } from "@fortawesome/pro-solid-svg-icons/faCircleQuestion";

const meta = {
  args: {
    show: true,
  },
  /** Ensure story is visible in the docs. */
  decorators: (Story) => (
    <div style={{ minHeight: "300px" }}>
      <Story />
    </div>
  ),
  title: "Components/Modal",
  component: Modal,
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Example: Story = {
  args: {
    buttons: [
      {
        element: "button",
        children: "Cancel",
        className: "btn btn-secondary",
        onClick: fn(),
        type: "button",
      },
      {
        element: "button",
        children: "Confirm",
        className: "btn btn-primary",
        onClick: fn(),
        type: "button",
      },
    ],
    icon: faCircleQuestion,
    title: "Example modal",
    children: (
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum omnis nobis
        exercitationem fugit laborum perferendis ad. Animi minus, accusamus illo
        ullam culpa amet iusto distinctio nam nostrum unde ad saepe!
      </p>
    ),
  },
};
