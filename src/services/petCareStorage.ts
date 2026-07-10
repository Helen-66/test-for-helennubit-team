import { v4 as uuidv4 } from 'uuid';
import type { PetCareRegistration, PetCareDraft } from '../types/petCare';

const STORAGE_KEY = 'pet-care-registrations';

function readAll(): PetCareRegistration[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(regs: PetCareRegistration[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(regs));
}

export function getAllRegistrations(): PetCareRegistration[] {
  return readAll().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export function getRegistrationById(id: string): PetCareRegistration | undefined {
  return readAll().find((r) => r.id === id);
}

export function createRegistration(draft: PetCareDraft): PetCareRegistration {
  const now = new Date().toISOString();
  const reg: PetCareRegistration = {
    ...draft,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
  };
  const regs = readAll();
  regs.push(reg);
  writeAll(regs);
  return reg;
}

export function updateRegistration(
  id: string,
  draft: Partial<PetCareDraft>,
): PetCareRegistration | null {
  const regs = readAll();
  const idx = regs.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  regs[idx] = {
    ...regs[idx],
    ...draft,
    updatedAt: new Date().toISOString(),
  };
  writeAll(regs);
  return regs[idx];
}

export function deleteRegistration(id: string): boolean {
  const regs = readAll();
  const filtered = regs.filter((r) => r.id !== id);
  if (filtered.length === regs.length) return false;
  writeAll(filtered);
  return true;
}
