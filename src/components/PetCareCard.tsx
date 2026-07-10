import type { PetCareRegistration } from '../types/petCare';
import { STATUS_LABELS } from '../types/petCare';

interface PetCareCardProps {
  registration: PetCareRegistration;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function PetCareCard({
  registration,
  onEdit,
  onDelete,
}: PetCareCardProps) {
  const r = registration;

  return (
    <div className={`pet-card pet-card--${r.status}`}>
      <div className="pet-card__header">
        <div className="pet-card__title-wrap">
          <h3 className="pet-card__title">{r.petName}</h3>
          <span className="pet-card__type">
            {r.petType} · {r.petCount} 只
          </span>
        </div>
        <span className={`pet-card__status pet-card__status--${r.status}`}>
          {STATUS_LABELS[r.status]}
        </span>
      </div>

      <div className="pet-card__schedule">
        <span className="pet-card__schedule-item">📅 {r.serviceDate}</span>
        <span className="pet-card__schedule-item">⏰ {r.serviceTime}</span>
        <span className="pet-card__schedule-item">🔁 {r.duration} 天</span>
      </div>

      <div className="pet-card__contact">
        <div className="pet-card__contact-row">
          <span className="pet-card__contact-label">联系人</span>
          <span className="pet-card__contact-value">{r.ownerName}</span>
        </div>
        <div className="pet-card__contact-row">
          <span className="pet-card__contact-label">电话</span>
          <span className="pet-card__contact-value">{r.phone}</span>
        </div>
        <div className="pet-card__contact-row">
          <span className="pet-card__contact-label">地址</span>
          <span className="pet-card__contact-value">{r.address}</span>
        </div>
        {r.emergencyContact && (
          <div className="pet-card__contact-row">
            <span className="pet-card__contact-label">紧急联系</span>
            <span className="pet-card__contact-value">{r.emergencyContact}</span>
          </div>
        )}
      </div>

      {r.feedingInstructions && (
        <div className="pet-card__note">
          <span className="pet-card__note-label">喂养说明</span>
          <p className="pet-card__note-text">{r.feedingInstructions}</p>
        </div>
      )}

      {r.specialNotes && (
        <div className="pet-card__note">
          <span className="pet-card__note-label">注意事项</span>
          <p className="pet-card__note-text">{r.specialNotes}</p>
        </div>
      )}

      <div className="pet-card__actions">
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => onEdit(r.id)}
        >
          编辑
        </button>
        <button
          type="button"
          className="btn btn--danger"
          onClick={() => onDelete(r.id)}
        >
          删除
        </button>
      </div>
    </div>
  );
}
