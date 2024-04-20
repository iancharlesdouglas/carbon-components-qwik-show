import { component$, useStyles$ } from '@builder.io/qwik';
import { Column, Grid, Heading, Item, Section } from 'carbon-components-qwik';
import style from './wards-list.scss?inline';

/**
 * Renders the list of wards as a table
 */
export const WardsList = component$((props: WardsListProps) => {
  useStyles$(style);
  const { columns, selectedColumns, wards } = props;
  const selectedColsMetadata = Array.from(columns.entries()).filter(([, name]) => selectedColumns.includes(name));
  const wardsFound = wards?.length && wards.length > 0;
  return (
    <Section>
      <Grid>
        <Column lg={16} md={8} sm={4}>
          {wardsFound && (
            <>
              <Heading text="Wards" />
              <table>
                <thead>
                  {selectedColsMetadata.map(([, name]) => (
                    <th>{name}</th>
                  ))}
                </thead>
                <tbody>
                  {wards?.map(ward => (
                    <tr>
                      {selectedColsMetadata.map(([key]) => (
                        <td>{ward[key]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </Column>
      </Grid>
    </Section>
  );
});

/**
 * Wards list props
 */
export type WardsListProps = {
  columns: Map<string, string>;
  selectedColumns: Item[];
  wards: any[] | undefined;
};
