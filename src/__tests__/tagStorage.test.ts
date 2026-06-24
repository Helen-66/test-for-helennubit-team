import { describe, it, expect, beforeEach } from 'vitest';
import {
  getAllTags,
  getTagById,
  getTagByName,
  createTag,
  updateTag,
  deleteTag,
  reorderTags,
} from '../services/tagStorage';

beforeEach(() => {
  localStorage.clear();
});

describe('tagStorage', () => {
  it('returns default tags when storage is empty', () => {
    const tags = getAllTags();
    expect(tags.length).toBeGreaterThan(0);
    expect(tags[0].name).toBe('经典');
  });

  it('creates a custom tag', () => {
    getAllTags(); // init defaults
    const tag = createTag('新标签', '#ff0000');
    expect(tag.name).toBe('新标签');
    expect(tag.color).toBe('#ff0000');
    expect(tag.id).toBeDefined();
    const all = getAllTags();
    expect(all.some((t) => t.name === '新标签')).toBe(true);
  });

  it('retrieves tag by id', () => {
    const tag = createTag('测试', '#00ff00');
    const found = getTagById(tag.id);
    expect(found).toBeDefined();
    expect(found!.name).toBe('测试');
  });

  it('retrieves tag by name', () => {
    createTag('按名查找', '#0000ff');
    const found = getTagByName('按名查找');
    expect(found).toBeDefined();
    expect(found!.color).toBe('#0000ff');
  });

  it('updates a tag', () => {
    const tag = createTag('原名', '#111111');
    const updated = updateTag(tag.id, { name: '新名', color: '#222222' });
    expect(updated).not.toBeNull();
    expect(updated!.name).toBe('新名');
    expect(updated!.color).toBe('#222222');
  });

  it('returns null when updating nonexistent tag', () => {
    expect(updateTag('fake-id', { name: 'x' })).toBeNull();
  });

  it('deletes a tag', () => {
    const tag = createTag('删除我', '#333333');
    expect(deleteTag(tag.id)).toBe(true);
    expect(getTagById(tag.id)).toBeUndefined();
  });

  it('returns false when deleting nonexistent tag', () => {
    expect(deleteTag('fake-id')).toBe(false);
  });

  it('reorders tags', () => {
    localStorage.clear();
    const t1 = createTag('A', '#aaa');
    const t2 = createTag('B', '#bbb');
    const t3 = createTag('C', '#ccc');
    reorderTags([t3.id, t1.id, t2.id]);
    const all = getAllTags();
    expect(all[0].id).toBe(t3.id);
    expect(all[1].id).toBe(t1.id);
    expect(all[2].id).toBe(t2.id);
  });
});
