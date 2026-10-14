import { BadRequestException } from '@nestjs/common';

export function requireBody(body: any): void {
  if (body == null || typeof body !== 'object' || Array.isArray(body)) {
    throw new BadRequestException('El cuerpo de la petición debe ser un objeto JSON');
  }
}

export function parseId(value: string, field: string = 'id'): number {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new BadRequestException(`El parámetro '${field}' debe ser un número entero positivo`);
  }
  return id;
}

export function requireString(value: any, field: string, maxLength: number): string {
  if (value === undefined || value === null) {
    throw new BadRequestException(`El campo '${field}' es obligatorio`);
  }
  if (typeof value !== 'string') {
    throw new BadRequestException(`El campo '${field}' debe ser texto`);
  }
  const text = value.trim();
  if (text.length == 0) {
    throw new BadRequestException(`El campo '${field}' no puede estar vacío`);
  }
  if (text.length > maxLength) {
    throw new BadRequestException(`El campo '${field}' no puede tener más de ${maxLength} caracteres`);
  }
  return text;
}

export function requireEnum(value: any, field: string, allowed: string[]): string {
  if (value === undefined || value === null || value === '') {
    throw new BadRequestException(`El campo '${field}' es obligatorio`);
  }
  if (typeof value !== 'string' || !allowed.includes(value)) {
    throw new BadRequestException(`El campo '${field}' solo acepta: ${allowed.join(', ')}`);
  }
  return value;
}

export function requireSequence(value: any, field: string): string {
  if (value === undefined || value === null) {
    throw new BadRequestException(`El campo '${field}' es obligatorio`);
  }
  if (typeof value !== 'string') {
    throw new BadRequestException(`El campo '${field}' debe ser texto`);
  }
  if (!/^[ACGT]+$/.test(value)) {
    throw new BadRequestException(
      `El campo '${field}' solo puede contener las letras A, C, G y T en mayúscula, sin espacios, y no puede estar vacío`,
    );
  }
  return value;
}