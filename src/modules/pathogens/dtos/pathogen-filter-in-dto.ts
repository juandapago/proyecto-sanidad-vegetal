import { PathogenType } from '../enums/pathogen-type.enum.js';

export class PathogenFilterInDto {
  name?: string;
  pathogenType?: PathogenType;
  transmissionMode?: string;
}