import { component$ } from '@builder.io/qwik';
import { ItemProps } from 'carbon-components-qwik';
import { Asleep, AsleepFilled, LightFilled, Sun } from 'carbon-icons-qwik';

/**
 * Renders a theme option as an icon
 */
export const ThemeOption = component$((props: ItemProps) => {
  const { item } = props;
  return (
    <div>
      {item === 'white' ? (
        <Sun size={12} />
      ) : item === 'g10' ? (
        <LightFilled size={12} />
      ) : item === 'g90' ? (
        <Asleep size={12} />
      ) : (
        <AsleepFilled size={12} />
      )}
    </div>
  );
});
