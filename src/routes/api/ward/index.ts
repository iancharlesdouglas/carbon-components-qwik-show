import { RequestHandler } from '@builder.io/qwik-city';

/**
 * Retrieves wards from the remote endpoint
 * @param param0 Json and query string
 * @param param0.json Json
 * @param param0.query Query string
 */
export const onGet: RequestHandler = async ({ json, query }) => {
  const columns =
    // eslint-disable-next-line spellcheck/spell-checker
    'ctry_code, ctry_name, rgn_code, rgn_name, ctyua_code, ctyua_name, lad_code, lad_name, wed_code, wed_name, wed_type';

  const localAuthority = query.get('localAuthority');
  const wardName = query.get('wardName');
  const startsWith = query.get('startsWith') === 'true';

  const where = localAuthority
    ? `lad_code="${localAuthority}"`
    : startsWith
      ? `startswith(wed_name, "${wardName}")`
      : `wed_name = "${wardName}"`;

  const url = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/georef-united-kingdom-ward-electoral-division/records?select=${encodeURIComponent(columns)}&where=${encodeURIComponent(where)}&limit=100`;

  const response = await fetch(url);

  if (response.ok) {
    const body = await response.json();
    json(200, body);
  }
};
