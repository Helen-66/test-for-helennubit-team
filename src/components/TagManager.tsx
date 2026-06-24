import { useState } from 'react';
import type { Tag } from '../types/diary';
import { TAG_PRESET_COLORS } from '../types/diary';
import {
  getAllTags,
  createTag,
  updateTag,
  deleteTag,
  reorderTags,
} from '../services/tagStorage';

interface TagManagerProps {
  onClose: () => void;
}

export default function TagManager({ onClose }: TagManagerProps) {
  const [tags, setTags] = useState<Tag[]>(() => getAllTags());
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState<string>(TAG_PRESET_COLORS[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const refresh = () => setTags(getAllTags());

  const handleCreate = () => {
    const name = newName.trim();
    if (!name) return;
    if (tags.some((t) => t.name === name)) return;
    createTag(name, newColor);
    setNewName('');
    setNewColor(TAG_PRESET_COLORS[0]);
    refresh();
  };

  const handleDelete = (id: string) => {
    deleteTag(id);
    refresh();
  };

  const startEdit = (tag: Tag) => {
    setEditingId(tag.id);
    setEditName(tag.name);
    setEditColor(tag.color);
  };

  const handleUpdate = () => {
    if (!editingId) return;
    const name = editName.trim();
    if (!name) return;
    updateTag(editingId, { name, color: editColor });
    setEditingId(null);
    refresh();
  };

  const handleDragStart = (idx: number) => {
    setDragIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === targetIdx) return;
    const reordered = [...tags];
    const [moved] = reordered.splice(dragIdx, 1);
    reordered.splice(targetIdx, 0, moved);
    setTags(reordered);
    setDragIdx(targetIdx);
  };

  const handleDragEnd = () => {
    setDragIdx(null);
    reorderTags(tags.map((t) => t.id));
  };

  return (
    <div className="tag-manager">
      <div className="tag-manager__header">
        <h2>标签管理</h2>
        <button type="button" className="btn btn--secondary" onClick={onClose}>
          返回
        </button>
      </div>

      <div className="tag-manager__create">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="新标签名称"
          maxLength={20}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
        />
        <div className="color-picker">
          {TAG_PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              className={`color-swatch ${newColor === c ? 'color-swatch--active' : ''}`}
              style={{ background: c }}
              onClick={() => setNewColor(c)}
              aria-label={`颜色 ${c}`}
            />
          ))}
        </div>
        <button type="button" className="btn btn--primary" onClick={handleCreate}>
          添加标签
        </button>
      </div>

      <div className="tag-manager__list">
        {tags.map((tag, idx) => (
          <div
            key={tag.id}
            className={`tag-manager__item ${dragIdx === idx ? 'tag-manager__item--dragging' : ''}`}
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDragEnd={handleDragEnd}
          >
            <span className="tag-manager__drag-handle">⠿</span>
            {editingId === tag.id ? (
              <div className="tag-manager__edit">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  maxLength={20}
                  onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
                />
                <div className="color-picker color-picker--small">
                  {TAG_PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`color-swatch color-swatch--sm ${editColor === c ? 'color-swatch--active' : ''}`}
                      style={{ background: c }}
                      onClick={() => setEditColor(c)}
                      aria-label={`颜色 ${c}`}
                    />
                  ))}
                </div>
                <div className="tag-manager__edit-actions">
                  <button type="button" className="btn btn--primary" onClick={handleUpdate}>
                    保存
                  </button>
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => setEditingId(null)}
                  >
                    取消
                  </button>
                </div>
              </div>
            ) : (
              <>
                <span
                  className="tag-manager__color-dot"
                  style={{ background: tag.color }}
                />
                <span className="tag-manager__name">{tag.name}</span>
                <div className="tag-manager__actions">
                  <button
                    type="button"
                    className="btn btn--secondary btn--sm"
                    onClick={() => startEdit(tag)}
                  >
                    编辑
                  </button>
                  <button
                    type="button"
                    className="btn btn--danger btn--sm"
                    onClick={() => handleDelete(tag.id)}
                  >
                    删除
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        {tags.length === 0 && (
          <p className="empty-state">暂无标签，创建一个吧！</p>
        )}
      </div>
    </div>
  );
}
