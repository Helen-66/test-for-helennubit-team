import { useState, useEffect } from 'react';
import type {
  PetCareDraft,
  PetCareRegistration,
  PetType,
  ServiceStatus,
} from '../types/petCare';
import { PET_TYPE_OPTIONS, STATUS_LABELS, STATUS_ORDER } from '../types/petCare';

interface PetCareFormProps {
  initial?: PetCareRegistration;
  onSubmit: (draft: PetCareDraft) => void;
  onCancel: () => void;
}

function emptyDraft(): PetCareDraft {
  return {
    ownerName: '',
    phone: '',
    address: '',
    petName: '',
    petType: '猫',
    petCount: 1,
    serviceDate: new Date().toISOString().split('T')[0],
    serviceTime: '09:00',
    duration: 1,
    feedingInstructions: '',
    specialNotes: '',
    emergencyContact: '',
    status: 'pending',
  };
}

const PET_ICONS: Record<PetType, string> = {
  猫: '🐱',
  狗: '🐶',
  鸟: '🐦',
  兔: '🐰',
  爬行类: '🦎',
  鱼类: '🐟',
  其他: '🐾',
};

export default function PetCareForm({ initial, onSubmit, onCancel }: PetCareFormProps) {
  const [draft, setDraft] = useState<PetCareDraft>(emptyDraft());

  useEffect(() => {
    if (initial) {
      const { id: _, createdAt: __, updatedAt: ___, ...rest } = initial;
      setDraft(rest);
    }
  }, [initial]);

  const set = <K extends keyof PetCareDraft>(key: K, val: PetCareDraft[K]) =>
    setDraft((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(draft);
  };

  const isValid =
    draft.ownerName.trim() !== '' &&
    draft.phone.trim() !== '' &&
    draft.address.trim() !== '' &&
    draft.petName.trim() !== '';

  return (
    <form className="pet-form" onSubmit={handleSubmit}>
      <h2>{initial ? '编辑预约' : '宠物上门喂养预约'}</h2>

      <fieldset className="form-section">
        <legend>联系人信息</legend>

        <div className="form-group">
          <label htmlFor="owner-name">联系人姓名 *</label>
          <input
            id="owner-name"
            type="text"
            value={draft.ownerName}
            onChange={(e) => set('ownerName', e.target.value)}
            placeholder="请输入您的姓名"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="owner-phone">联系电话 *</label>
          <input
            id="owner-phone"
            type="tel"
            value={draft.phone}
            onChange={(e) => set('phone', e.target.value)}
            placeholder="请输入手机号码"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="owner-address">上门地址 *</label>
          <input
            id="owner-address"
            type="text"
            value={draft.address}
            onChange={(e) => set('address', e.target.value)}
            placeholder="详细到门牌号"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="emergency-contact">紧急联系人</label>
          <input
            id="emergency-contact"
            type="text"
            value={draft.emergencyContact}
            onChange={(e) => set('emergencyContact', e.target.value)}
            placeholder="姓名及电话（可选）"
          />
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend>宠物信息</legend>

        <div className="form-group">
          <label htmlFor="pet-name">宠物名字 *</label>
          <input
            id="pet-name"
            type="text"
            value={draft.petName}
            onChange={(e) => set('petName', e.target.value)}
            placeholder="请输入宠物的名字"
            required
          />
        </div>

        <div className="form-group">
          <span className="form-group__label">宠物类型</span>
          <div className="pet-type-options">
            {PET_TYPE_OPTIONS.map((type) => (
              <button
                key={type}
                type="button"
                className={`pet-type-chip ${draft.petType === type ? 'pet-type-chip--active' : ''}`}
                onClick={() => set('petType', type)}
              >
                <span className="pet-type-chip__icon">{PET_ICONS[type]}</span>
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="pet-count">宠物数量</label>
          <input
            id="pet-count"
            type="number"
            min={1}
            value={draft.petCount}
            onChange={(e) => set('petCount', Math.max(1, Number(e.target.value) || 1))}
          />
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend>服务安排</legend>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="service-date">上门日期 *</label>
            <input
              id="service-date"
              type="date"
              value={draft.serviceDate}
              onChange={(e) => set('serviceDate', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="service-time">上门时间</label>
            <input
              id="service-time"
              type="time"
              value={draft.serviceTime}
              onChange={(e) => set('serviceTime', e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="duration">服务天数</label>
          <input
            id="duration"
            type="number"
            min={1}
            value={draft.duration}
            onChange={(e) => set('duration', Math.max(1, Number(e.target.value) || 1))}
          />
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend>喂养说明</legend>

        <div className="form-group">
          <label htmlFor="feeding-instructions">喂养说明</label>
          <textarea
            id="feeding-instructions"
            value={draft.feedingInstructions}
            onChange={(e) => set('feedingInstructions', e.target.value)}
            placeholder="喂食量、喂食时间、食物存放位置等"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="special-notes">特别注意事项</label>
          <textarea
            id="special-notes"
            value={draft.specialNotes}
            onChange={(e) => set('specialNotes', e.target.value)}
            placeholder="宠物健康状况、性格、忌讳等"
            rows={3}
          />
        </div>
      </fieldset>

      <div className="form-group">
        <span className="form-group__label">预约状态</span>
        <div className="status-options">
          {STATUS_ORDER.map((status) => (
            <button
              key={status}
              type="button"
              className={`status-chip status-chip--${status} ${draft.status === status ? 'status-chip--active' : ''}`}
              onClick={() => set('status', status as ServiceStatus)}
            >
              {STATUS_LABELS[status]}
            </button>
          ))}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn--primary" disabled={!isValid}>
          {initial ? '保存修改' : '提交预约'}
        </button>
        <button type="button" className="btn btn--secondary" onClick={onCancel}>
          取消
        </button>
      </div>
    </form>
  );
}
