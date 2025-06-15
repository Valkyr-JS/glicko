import NumberInput from "@/components/forms/NumberInput/NumberInput";
import { DEFAULT_BOARD_WIDTH } from "@/constants";
import React from "react";

interface BoardWidthProps {
  width?: UserSettings["boardWidth"];
}

const BoardWidth: React.FC<BoardWidthProps> = (props) => {
  return (
    <>
      <NumberInput
        id="boardWidth"
        initialValue={props.width ?? DEFAULT_BOARD_WIDTH}
        label="Maximum game board width"
        name="board-width"
        max={DEFAULT_BOARD_WIDTH}
        min={320}
      />
      <small>
        <p className="mt-2">
          If you find yourself needing to scroll up and down to see the whole
          game board, you can try reducing the size of the board for a better
          experience.
        </p>
        <p>
          This value is measured in pixels. The board cannot be increased beyond{" "}
          {DEFAULT_BOARD_WIDTH}px.
        </p>
      </small>
    </>
  );
};

export default BoardWidth;
