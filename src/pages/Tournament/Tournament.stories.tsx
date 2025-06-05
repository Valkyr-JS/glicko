import type { Meta, StoryObj } from "@storybook/react-vite";
import TournamentPage from "./Tournament";
import { WithMemoryRouter } from "../../../.storybook/decorators";

const meta = {
  title: "Pages/Tournament",
  component: TournamentPage,
  decorators: [WithMemoryRouter],
  args: {
    matchIndex: 0,
  },
} satisfies Meta<typeof TournamentPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NewTournament: Story = {};
