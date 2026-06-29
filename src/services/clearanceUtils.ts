import { RequiredItemTemplate } from '../types';

export const requiredItemsSeed: RequiredItemTemplate[] = [
  { id: 'RI-1', name: 'School Uniform', quantity: 2, description: 'Full school uniform set' },
  { id: 'RI-2', name: 'Sweater', quantity: 1 },
  { id: 'RI-3', name: 'Socks', quantity: 6, description: '6 pairs' },
  { id: 'RI-4', name: 'Shoes', quantity: 1, description: 'Black school shoes' },
  { id: 'RI-5', name: 'Blanket', quantity: 1 },
  { id: 'RI-6', name: 'Pillow', quantity: 1 },
  { id: 'RI-7', name: 'Soap', quantity: 6 },
  { id: 'RI-8', name: 'Toothpaste', quantity: 1 },
  { id: 'RI-9', name: 'Exercise Books', quantity: 10 },
  { id: 'RI-10', name: 'Towel', quantity: 2 },
  { id: 'RI-11', name: 'Bucket', quantity: 1 },
];

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateVerificationCode(): string {
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}

export function mockAiVerify(): { studentDetected: boolean; codeDetected: boolean; itemsDetected: boolean; confidence: number; approved: boolean } {
  const confidence = Math.round((88 + Math.random() * 10) * 10) / 10;
  return {
    studentDetected: true,
    codeDetected: true,
    itemsDetected: true,
    confidence,
    approved: confidence >= 85,
  };
}

export function generateClearanceNumber(seq: number): string {
  return `CLR-2026-${String(seq).padStart(6, '0')}`;
}

export function generateQrToken(): string {
  return `NV-${Date.now()}-${Math.random().toString(36).slice(2, 14)}`;
}
