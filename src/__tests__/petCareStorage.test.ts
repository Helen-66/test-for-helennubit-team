import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getAllRegistrations,
  getRegistrationById,
  createRegistration,
  updateRegistration,
  deleteRegistration,
} from '../services/petCareStorage';
import type { PetCareDraft } from '../types/petCare';

const sampleDraft: PetCareDraft = {
  ownerName: '张三',
  phone: '13800000000',
  address: '北京市朝阳区xx路1号',
  petName: '小白',
  petType: '猫',
  petCount: 1,
  serviceDate: '2024-02-01',
  serviceTime: '09:00',
  duration: 3,
  feedingInstructions: '每天早晚各喂一次',
  specialNotes: '怕生，请勿强行抱起',
  emergencyContact: '李四 13900000000',
  status: 'pending',
};

beforeEach(() => {
  localStorage.clear();
});

describe('petCareStorage', () => {
  it('returns empty array when no registrations exist', () => {
    expect(getAllRegistrations()).toEqual([]);
  });

  it('creates a registration with generated id and timestamps', () => {
    const reg = createRegistration(sampleDraft);
    expect(reg.id).toBeDefined();
    expect(reg.petName).toBe('小白');
    expect(reg.status).toBe('pending');
    expect(reg.createdAt).toBeDefined();
    expect(reg.updatedAt).toBeDefined();
  });

  it('retrieves all registrations sorted by most recent', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));
    createRegistration({ ...sampleDraft, petName: 'First' });
    vi.setSystemTime(new Date('2024-01-02T00:00:00Z'));
    createRegistration({ ...sampleDraft, petName: 'Second' });
    vi.useRealTimers();
    const all = getAllRegistrations();
    expect(all).toHaveLength(2);
    expect(all[0].petName).toBe('Second');
  });

  it('retrieves a registration by id', () => {
    const reg = createRegistration(sampleDraft);
    const found = getRegistrationById(reg.id);
    expect(found).toBeDefined();
    expect(found!.petName).toBe('小白');
  });

  it('returns undefined for unknown id', () => {
    expect(getRegistrationById('nonexistent')).toBeUndefined();
  });

  it('updates an existing registration', () => {
    const reg = createRegistration(sampleDraft);
    const updated = updateRegistration(reg.id, { status: 'confirmed' });
    expect(updated).not.toBeNull();
    expect(updated!.status).toBe('confirmed');
    expect(updated!.petName).toBe('小白');
    expect(new Date(updated!.updatedAt).getTime()).toBeGreaterThanOrEqual(
      new Date(reg.updatedAt).getTime(),
    );
  });

  it('returns null when updating nonexistent registration', () => {
    expect(updateRegistration('fake', { status: 'completed' })).toBeNull();
  });

  it('deletes a registration', () => {
    const reg = createRegistration(sampleDraft);
    expect(deleteRegistration(reg.id)).toBe(true);
    expect(getAllRegistrations()).toHaveLength(0);
  });

  it('returns false when deleting nonexistent registration', () => {
    expect(deleteRegistration('fake')).toBe(false);
  });
});
