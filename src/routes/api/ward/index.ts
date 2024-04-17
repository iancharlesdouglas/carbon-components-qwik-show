import { RequestHandler } from '@builder.io/qwik-city';

export const onGet: RequestHandler = ({ json, query }) => {
  // fetch()
  // json(200, getWards(query))
  /**
   * WHERE
   * lad_code = 'x'
   * OR: startswith(wed_name , 'Brix')
   *
   * SELECT
   * lad_code, lad_name, wed_code, wed_name, wed_type
   *
   * ctry_code, ctry_name, rgn_code, rgn_name, ctya_code, ctyua_name, lad_code, lad_name
   */
};
