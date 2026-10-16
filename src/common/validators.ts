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

export function requireId(value: any, field: string): number {
  if (value === undefined || value === null) {
    throw new BadRequestException(`El campo '${field}' es obligatorio`);
  }
  if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
    throw new BadRequestException(`El campo '${field}' debe ser un número entero positivo`);
  }
  return value;
}

export function requirePositiveNumber(value: any, field: string): number {
  if (value === undefined || value === null) {
    throw new BadRequestException(`El campo '${field}' es obligatorio`);
  }
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new BadRequestException(`El campo '${field}' debe ser un número`);
  }
  if (value <= 0) {
    throw new BadRequestException(`El campo '${field}' debe ser mayor que 0`);
  }
  return value;
}

export function todayInColombia(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bogota' });
}

export function requirePastDate(value: any, field: string): string {
  if (value === undefined || value === null || value === '') {
    throw new BadRequestException(`El campo '${field}' es obligatorio`);
  }
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new BadRequestException(`El campo '${field}' debe tener el formato YYYY-MM-DD`);
  }
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    throw new BadRequestException(`El campo '${field}' no es una fecha que exista`);
  }
  if (value > todayInColombia()) {
    throw new BadRequestException(`El campo '${field}' no puede ser posterior a hoy (${todayInColombia()})`);
  }
  return value;
}
