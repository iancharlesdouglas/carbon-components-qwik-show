import { component$, useSignal, useStore, useStyles$, useTask$ } from '@builder.io/qwik';
import {
  Button,
  CarbonRoot,
  Checkbox,
  Column,
  Dropdown,
  Form,
  Grid,
  Heading,
  Item,
  Labelled,
  MultiSelect,
  Row,
  Section,
  TextInput,
} from 'carbon-components-qwik';
import { countries } from '~/data/countries';
import { Country } from '~/model/country';
import { Region } from '~/model/region';
import { regions } from '~/data/regions';
import { LocalAuthority } from '~/model/local-authority';
import { localAuthorities } from '~/data/local-authorities';
import { Search } from 'carbon-icons-qwik';
import { columns } from '~/model/columns';
import style from './wards.scss?inline';

/**
 * Tool to search for UK electoral wards
 */
export const ElectoralWardSearch = component$(() => {
  useStyles$(style);
  const countryOptions: ViewCountry[] = countries
    .map(country => ({ ...country, label: country.name }))
    .sort(sortByName);
  const regionOptions: ViewRegion[] = regions
    .map(region => ({
      ...region,
      label: region.name,
    }))
    .sort(sortByName);
  const localAuthorityOptions: ViewLocalAuthority[] = localAuthorities
    .map(authority => ({ ...authority, label: authority.name }))
    .sort(sortByName);
  const selectionObj: Selection = { country: undefined, region: undefined, localAuthority: undefined };
  const selection = useStore(selectionObj);
  const filteredRegions = useSignal<ViewRegion[]>();
  const filteredLocalAuthorities = useSignal<ViewLocalAuthority[]>();
  useTask$(({ track }) => {
    track(selection);
    filteredRegions.value = regionOptions.filter(region => region.country === selection.country?.code);
    if (filteredRegions.value.length === 1) {
      selection.region = filteredRegions.value[0];
    }
    filteredLocalAuthorities.value = localAuthorityOptions.filter(
      authority => authority.region === selection.region?.code,
    );
    if (filteredLocalAuthorities.value.length === 1) {
      selection.localAuthority = filteredLocalAuthorities.value[0];
    }
  });
  const columnOptions: Item[] = Array.from(columns.values());
  const wardCodeColumn = 'Ward Code';
  const wardNameColumn = 'Ward Name';
  const selectedColumns = useSignal(
    columnOptions.filter(column => column === wardCodeColumn || column === wardNameColumn),
  );
  return (
    <CarbonRoot>
      <Section>
        <Grid>
          <Column lg={16} md={8} sm={4}>
            <Heading text="Electoral Ward Search" />
          </Column>
        </Grid>
        <Form>
          <Section>
            <Grid>
              <Column lg={16} md={8} sm={4}>
                <Heading text="Search by Local Authority" />
              </Column>
              <Column lg={3} md={2} sm={1}>
                <Dropdown
                  label="Country"
                  items={countryOptions}
                  selectedItem={selection.country}
                  onSelect$={(item: Item) => {
                    selection.country = item as ViewCountry;
                  }}
                  size="sm"
                />
              </Column>
              <Column lg={4} md={2} sm={1}>
                <Dropdown
                  label="Region"
                  items={filteredRegions.value}
                  selectedItem={selection.region}
                  onSelect$={(item: Item) => {
                    selection.region = item as ViewRegion;
                    selection.localAuthority = undefined;
                  }}
                  size="sm"
                />
              </Column>
              <Column lg={4} md={2} sm={1}>
                <Dropdown
                  label="Local authority"
                  items={filteredLocalAuthorities.value}
                  selectedItem={selection.localAuthority}
                  size="sm"
                />
              </Column>
              <Column lg={2} md={1} sm={1} class="vert bottom" style="margin-left: 1rem">
                <Button
                  size="sm"
                  type="button"
                  renderIcon={Search}
                  onClick$={async () => {
                    const response = await fetch('/api/ward');
                    const json = await response.json();
                  }}
                >
                  Search
                </Button>
              </Column>
            </Grid>
            <Grid>
              <Column lg={16} md={8} sm={4}>
                <Heading text="Search by Name" />
              </Column>
              <Column lg={4} md={2} sm={1}>
                <TextInput labelText="Ward name" helperText="Case-sensitive" renderSize="sm" />
              </Column>
              <Column lg={3} md={2} sm={1} class="vert center">
                <div style="display:flex; flex-direction: row">
                  <Checkbox
                    labelText="Starts with"
                    onChange$={(event: Event) => console.log('event received - starts with', event)}
                  />
                  <Button
                    size="sm"
                    type="button"
                    renderIcon={Search}
                    onClick$={async () => {
                      const response = await fetch('/api/ward');
                      const json = await response.json();
                    }}
                  >
                    Search
                  </Button>
                </div>
              </Column>
              <Column lg={3} md={2} sm={2}>
                <MultiSelect
                  label="Columns"
                  title="Select columns"
                  items={columnOptions}
                  selectedItems={selectedColumns.value}
                  onChange$={(userSelection: Item[], item?: Item) => {
                    selectedColumns.value = userSelection;
                    if (
                      (item === wardCodeColumn || item === wardNameColumn) &&
                      !userSelection.some(sel => `${sel}` === `${item}`)
                    ) {
                      selectedColumns.value = [...selectedColumns.value, item];
                    }
                  }}
                  size="sm"
                />
              </Column>
            </Grid>
          </Section>
        </Form>
      </Section>
    </CarbonRoot>
  );
});

type Selection = {
  country?: ViewCountry;
  region?: ViewRegion;
  localAuthority?: ViewLocalAuthority;
};

type ViewCountry = Country & Labelled;
type ViewRegion = Region & Labelled;
type ViewLocalAuthority = LocalAuthority & Labelled;

const sortByName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name);
