import React, { useState } from "react";

interface NumberInputProps {
  initialValue: number;
}

const NumberInput: React.FC<NumberInputProps> = (props) => {
  const [value, setValue] = useState(props.initialValue);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    setValue(+e.target.value);

  return (
    <div>
      <input type="number" value={value} onChange={handleChange} />
    </div>
  );
};

export default NumberInput;
