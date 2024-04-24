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
  Section,
  TextInput,
  TextInputChangeEvent,
  Theme,
  ThemeCode,
} from 'carbon-components-qwik';
import { countries } from '~/data/countries';
import { Country } from '~/model/country';
import { Region } from '~/model/region';
import { regions } from '~/data/regions';
import { LocalAuthority } from '~/model/local-authority';
import { localAuthorities } from '~/data/local-authorities';
import { Reset, Search } from 'carbon-icons-qwik';
import { columns } from '~/model/columns';
import style from './wards.scss?inline';
import { WardsList } from './wards-list';
import { ThemeOption } from './theme-option';

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
  const textSearchObj: TextSearch = { wardName: undefined, startsWith: false };
  const textSearch = useStore(textSearchObj);
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
  const countryCodeColumn = 'Country Code';
  const regionCodeColumn = 'Region Code';
  const selectedColumns = useSignal(
    columnOptions.filter(
      column => column !== countryCodeColumn && column !== regionCodeColumn && column !== 'Ward Type',
    ),
  );
  const selectedLocalAuthorityCode = selection.localAuthority?.code;
  const wards = useSignal<any[]>();
  const themes: Item[] = ['white', 'g10', 'g90', 'g100'];
  const theme = useSignal<ThemeCode>('white');
  return (
    <CarbonRoot>
      <Theme theme={theme.value} class="wrapper">
        <Section>
          <Form>
            <Grid>
              <Column lg={14} md={7} sm={3}>
                <Heading text="Electoral Ward Search" />
              </Column>
              <Column lg={2} md={1} sm={1}>
                <Dropdown
                  label="Theme"
                  type="inline"
                  size="sm"
                  items={themes}
                  itemToElement={ThemeOption}
                  renderSelectedItem={ThemeOption}
                  selectedItem={theme.value}
                  onSelect$={(item: Item) => (theme.value = item as unknown as ThemeCode)}
                />
              </Column>
            </Grid>
          </Form>
          <Form>
            <Section>
              <Grid>
                <Column lg={16} md={8} sm={4}>
                  <Heading text="Search by Local Authority" />
                </Column>
                <Column lg={3} md={3} sm={2}>
                  <Dropdown
                    label="Country"
                    items={countryOptions}
                    selectedItem={selection.country}
                    onSelect$={(item: Item) => {
                      selection.country = item as ViewCountry;
                      selection.localAuthority = undefined;
                    }}
                    size="sm"
                  />
                </Column>
                <Column lg={4} md={3} sm={2}>
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
                <Column lg={4} md={3} sm={2}>
                  <Dropdown
                    label="Local authority"
                    items={filteredLocalAuthorities.value}
                    selectedItem={selection.localAuthority}
                    onSelect$={(item: Item) => {
                      selection.localAuthority = item as ViewLocalAuthority;
                    }}
                    size="sm"
                  />
                </Column>
                <Column lg={4} md={3} sm={2} class="vert bottom" style="margin-left: 1rem">
                  <div>
                    <Button
                      size="sm"
                      type="button"
                      renderIcon={Search}
                      onClick$={async () => {
                        const response = await fetch(
                          `/api/ward?localAuthority=${encodeURIComponent(selectedLocalAuthorityCode!)}`,
                        );
                        const json = await response.json();
                        wards.value = json.results;
                      }}
                      disabled={!(selection.country && selection.region && selection.localAuthority)}
                    >
                      Search
                    </Button>
                    <Button
                      size="sm"
                      type="button"
                      renderIcon={Reset}
                      hasIconOnly={true}
                      onClick$={() => {
                        selection.country = undefined;
                        selection.region = undefined;
                        selection.localAuthority = undefined;
                      }}
                      disabled={!selection.country && !selection.region && !selection.localAuthority}
                      style="margin-left: 1rem"
                      title="Reset country, region and local authority"
                    ></Button>
                  </div>
                </Column>
              </Grid>
              <Grid>
                <Column lg={16} md={8} sm={4}>
                  <Heading text="Search by Name" />
                </Column>
                <Column lg={4} md={2} sm={2}>
                  <TextInput
                    labelText="Ward name"
                    value={textSearch.wardName ?? ''}
                    onChange$={async (event: TextInputChangeEvent) => {
                      textSearch.wardName = event.value.trim();
                    }}
                    helperText="Case-sensitive"
                    renderSize="sm"
                  />
                </Column>
                <Column lg={5} md={4} sm={3} class="vert center">
                  <div style="display:flex; flex-direction: row; justify-content: flex-start">
                    <Checkbox
                      labelText="Starts with"
                      checked={textSearch.startsWith}
                      onChange$={(event: Event) => {
                        const checkbox = event.target as HTMLInputElement;
                        textSearch.startsWith = checkbox.checked;
                      }}
                      class="no-fill"
                    />
                    <Button
                      size="sm"
                      type="button"
                      renderIcon={Search}
                      onClick$={async () => {
                        const response = await fetch(
                          `/api/ward?wardName=${encodeURIComponent(textSearch.wardName!)}&startsWith=${textSearch.startsWith}`,
                        );
                        const json = await response.json();
                        wards.value = json.results;
                      }}
                      disabled={!textSearch.wardName}
                    >
                      Search
                    </Button>
                    <Button
                      size="sm"
                      type="button"
                      renderIcon={Reset}
                      hasIconOnly={true}
                      onClick$={() => {
                        textSearch.wardName = undefined;
                        textSearch.startsWith = false;
                      }}
                      disabled={!textSearch.wardName}
                      style="margin-left: 1rem"
                      title="Reset ward name"
                    ></Button>
                  </div>
                </Column>
                <Column lg={4} md={4} sm={4} style="padding-right: 2rem">
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
        <WardsList columns={columns} selectedColumns={selectedColumns.value} wards={wards.value} />
      </Theme>
    </CarbonRoot>
  );
});

type Selection = {
  country?: ViewCountry;
  region?: ViewRegion;
  localAuthority?: ViewLocalAuthority;
};

type TextSearch = {
  wardName?: string;
  startsWith: boolean;
};

type ViewCountry = Country & Labelled;
type ViewRegion = Region & Labelled;
type ViewLocalAuthority = LocalAuthority & Labelled;

const sortByName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name);
