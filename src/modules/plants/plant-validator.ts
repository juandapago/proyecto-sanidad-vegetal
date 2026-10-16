import { BadRequestException } from '@nestjs/common';
import { CreatePlantInDto } from './dtos/create-plant-in-dto.js';
import { UpdatePlantInDto } from './dtos/update-plant-in-dto.js';
import { PlantFilterInDto } from './dtos/plant-filter-in-dto.js';
import { CropType } from './enums/crop-type.enum.js';
import { requireBody, requireEnum, requireSequence, requireString } from '../../common/validators.js';

const CROP_TYPES: string[] = Object.values(CropType);

export function validateCreatePlant(body: any): CreatePlantInDto {
  requireBody(body);
  const dto = new CreatePlantInDto();
  dto.commonName = requireString(body.commonName, 'commonName', 100);
  dto.scientificName = requireString(body.scientificName, 'scientificName', 150);
  dto.botanicalFamily = requireString(body.botanicalFamily, 'botanicalFamily', 100);
  dto.cropType = requireEnum(body.cropType, 'cropType', CROP_TYPES) as CropType;
  dto.geneticSequence = requireSequence(body.geneticSequence, 'geneticSequence');
  return dto;
}

export function validateUpdatePlant(body: any): UpdatePlantInDto {
  requireBody(body);
  const dto = new UpdatePlantInDto();
  if (body.commonName !== undefined) {
    dto.commonName = requireString(body.commonName, 'commonName', 100);
  }
  if (body.scientificName !== undefined) {
    dto.scientificName = requireString(body.scientificName, 'scientificName', 150);
  }
  if (body.botanicalFamily !== undefined) {
    dto.botanicalFamily = requireString(body.botanicalFamily, 'botanicalFamily', 100);
  }
  if (body.cropType !== undefined) {
    dto.cropType = requireEnum(body.cropType, 'cropType', CROP_TYPES) as CropType;
  }
  if (body.geneticSequence !== undefined) {
    dto.geneticSequence = requireSequence(body.geneticSequence, 'geneticSequence');
  }
  if (Object.values(dto).every((value) => value === undefined)) {
    throw new BadRequestException('Debe enviar al menos un campo para modificar');
  }
  return dto;
}

export function validatePlantFilters(name?: string, cropType?: string, botanicalFamily?: string): PlantFilterInDto {
  const filters = new PlantFilterInDto();
  if (name !== undefined) {
    filters.name = requireString(name, 'name', 150);
  }
  if (cropType !== undefined) {
    filters.cropType = requireEnum(cropType, 'cropType', CROP_TYPES) as CropType;
  }
  if (botanicalFamily !== undefined) {
    filters.botanicalFamily = requireString(botanicalFamily, 'botanicalFamily', 100);
  }
  return filters;
}