import type { Meta, StoryObj } from "@storybook/react-vite";
import Modal from "./Modal";
import { fn } from "storybook/test";

const meta = {
  args: {
    buttons: [],
    closeModalHandler: fn(),
    show: true,
    title: "Modal title",
    children: (
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum omnis nobis
        exercitationem fugit laborum perferendis ad. Animi minus, accusamus illo
        ullam culpa amet iusto distinctio nam nostrum unde ad saepe!
      </p>
    ),
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

export const Default: Story = {};
