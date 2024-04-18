import { RequestHandler } from '@builder.io/qwik-city';

export const onGet: RequestHandler = async ({ json, query }) => {
  const url = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/georef-united-kingdom-local-authority-district/records?select=rgn_code%20AS%20region%2C%20rgn_name%20AS%20regionName%2C%20ctyua_code%20AS%20city%2C%20ctyua_name%20AS%20cityName%2C%20lad_code%20AS%20code%2C%20lad_name%20AS%20name%2C%20lad_type%20AS%20localAuthType&where=regionName%20!%3D%20%27London%27&limit=100`;
  const response = await fetch(url);
  if (response.ok) {
    const body = await response.json();
    json(200, body);
  }
  // fetch()
  // json(200, getWards(query))
  /**
   * WHERE
   * lad_code = 'x'
   * OR: startswith(wed_name , 'Brix')
   * https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/georef-united-kingdom-ward-electoral-division/records?where=startswith(wed_name%20%2C%20%27Brix%27)&limit=20
   *
   * SELECT
   * lad_code, lad_name, wed_code, wed_name, wed_type
   *
   * ctry_code, ctry_name, rgn_code, rgn_name, ctya_code, ctyua_name, lad_code, lad_name, wed_code, wed_name, wed_type
   *
   * https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/georef-united-kingdom-ward-electoral-division/records?select=rgn_code%2C%20rgn_name%2C%20ctyua_code%2C%20ctyua_name%2C%20lad_code%2C%20lad_name%2C%20wed_code%2C%20wed_name%2C%20wed_type&where=lad_code%20%3D%20%22E09000022%22&limit=20
   */
};
