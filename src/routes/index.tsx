import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { ElectoralWardSearch } from './uk-wards/uk-electoral-ward-search';

/**
 * Root page
 */
export default component$(() => {
  return (
    <>
      <ElectoralWardSearch />
    </>
  );
});

/**
 * Root page head
 */
export const head: DocumentHead = {
  title: 'UK Electoral Ward Search',
  meta: [
    {
      name: 'description',
      content: 'carbon-components-qwik Showcase',
    },
  ],
};
