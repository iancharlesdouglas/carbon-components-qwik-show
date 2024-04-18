import { Ward } from './ward';
import { WardDto } from './ward-dto';

/**
 * Transforms a WardDto object into a Ward object
 * @param wardDto DTO object
 * @returns Domain object
 */
export const transformWard: (wardDto: WardDto) => Ward = wardDto => ({
  wed_code: wardDto.wed_code[0],
  wed_name: wardDto.wed_name[0],
  wed_type: wardDto.wed_type,
  lad_code: wardDto.lad_code?.[0],
  lad_name: wardDto.lad_name?.[0],
  ctyua_code: wardDto.ctyua_code?.[0],
  ctyua_name: wardDto.ctyua_name?.[0],
  rgn_code: wardDto.rgn_code?.[0],
  rgn_name: wardDto.rgn_name?.[0],
  ctry_code: wardDto.ctry_code?.[0],
  ctry_name: wardDto.ctry_name?.[0],
});
