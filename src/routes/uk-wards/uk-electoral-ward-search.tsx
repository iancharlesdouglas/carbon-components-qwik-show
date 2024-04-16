import { component$ } from '@builder.io/qwik';
import { CarbonRoot, Column, Dropdown, Form, Grid } from 'carbon-components-qwik';
import { countries } from '~/model/countries';
import { regions } from '~/model/regions';

/**
 * Supports searching UK electoral wards
 */
export const ElectoralWardSearch = component$(() => {
  const countryOptions = countries
    .map(country => ({ ...country, label: country.name }))
    .sort((a, b) => a.name.localeCompare(b.name));
  const regionOptions = regions
    .map(region => ({
      ...region,
      label: region.name,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
  return (
    <CarbonRoot>
      <Form>
        <Grid>
          <Column lg={3} md={2} sm={1}>
            <Dropdown label="Country" items={countryOptions} size="sm" />
          </Column>
          <Column lg={4} md={2} sm={1}>
            <Dropdown label="Region" items={regionOptions} size="sm" />
          </Column>
        </Grid>
      </Form>
    </CarbonRoot>
  );
});
