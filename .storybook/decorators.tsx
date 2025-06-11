import type { ReactRenderer } from "@storybook/react-vite";
import { useState } from "react";
import type { DecoratorFunction } from "storybook/internal/csf";

type Decorator =
  | DecoratorFunction<
      ReactRenderer,
      {
        [x: string]: unknown;
      }
    >
  | DecoratorFunction<
      ReactRenderer,
      {
        [x: string]: unknown;
      }
    >;

/** Storybook decorator which wraps the story in a form with a submit button.
 * The form response value is displayed in a code block beneath it. */
export const WithFormSubmission: Decorator = (Story) => {
  const [response, setResponse] = useState<{
    [k: string]: FormDataEntryValue;
  }>({});

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const formJson = Object.fromEntries(formData.entries());
    setResponse(formJson);
  };

  const responseEl = Object.keys(response).length ? (
    <code className="d-block mt-3" data-testid="form-response">
      {JSON.stringify(response)}
    </code>
  ) : null;

  return (
    <div>
      <form method="post" onSubmit={handleSubmit}>
        {Story()}
        <button type="submit" className="btn btn-primary mt-5">
          Submit form
        </button>
      </form>
      {responseEl}
    </div>
  );
};
