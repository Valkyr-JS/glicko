import React from "react";
import CheckboxGroup from "@/components/forms/CheckboxGroup/CheckboxGroup";

interface GenderFilterProps {
  genderFilter: PerformerFilters["genders"];
}

const GenderFilter: React.FC<GenderFilterProps> = (props) => {
  return (
    <CheckboxGroup
      title="Genders"
      checkboxes={[
        {
          isChecked: props.genderFilter.includes("MALE") ?? false,
          id: "genderMale",
          label: "Male",
          name: "gender-male",
        },
        {
          isChecked: props.genderFilter.includes("FEMALE") ?? false,
          id: "genderFemale",
          label: "Female",
          name: "gender-female",
        },
        {
          isChecked: props.genderFilter.includes("TRANSGENDER_MALE") ?? false,
          id: "genderTransgenderMale",
          label: "Transgender male",
          name: "gender-transgender_male",
        },
        {
          isChecked: props.genderFilter.includes("TRANSGENDER_FEMALE") ?? false,
          id: "genderTransgenderFemale",
          label: "Transgender Female",
          name: "gender-transgender_female",
        },
        {
          isChecked: props.genderFilter.includes("INTERSEX") ?? false,
          id: "genderIntersex",
          label: "Intersex",
          name: "gender-intersex",
        },
        {
          isChecked: props.genderFilter.includes("NON_BINARY") ?? false,
          id: "genderNonBinary",
          label: "Non-Binary",
          name: "gender-non_binary",
        },
      ]}
    >
      <small>
        <p className="mt-2">
          Select all the genders that qualify for the game. Selecting none will
          qualify any gender.
        </p>
      </small>
    </CheckboxGroup>
  );
};

export default GenderFilter;
