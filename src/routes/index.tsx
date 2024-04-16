import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { ElectoralWardSearch } from "./uk-wards/uk-electoral-ward-search";

export default component$(() => {
  return (
    <>
      <ElectoralWardSearch />
    </>
  );
});

export const head: DocumentHead = {
  title: "Electoral Ward Search",
  meta: [
    {
      name: "description",
      content: "carbon-components-qwik Showcase",
    },
  ],
};
