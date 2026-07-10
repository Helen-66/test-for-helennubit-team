export type PetType = '猫' | '狗' | '鸟' | '兔' | '爬行类' | '鱼类' | '其他';

export type ServiceStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface PetCareRegistration {
  id: string;
  ownerName: string;
  phone: string;
  address: string;
  petName: string;
  petType: PetType;
  petCount: number;
  serviceDate: string;
  serviceTime: string;
  duration: number; // 服务天数
  feedingInstructions: string;
  specialNotes: string;
  emergencyContact: string;
  status: ServiceStatus;
  createdAt: string;
  updatedAt: string;
}

export type PetCareDraft = Omit<PetCareRegistration, 'id' | 'createdAt' | 'updatedAt'>;

export const PET_TYPE_OPTIONS: PetType[] = [
  '猫',
  '狗',
  '鸟',
  '兔',
  '爬行类',
  '鱼类',
  '其他',
];

export const STATUS_LABELS: Record<ServiceStatus, string> = {
  pending: '待确认',
  confirmed: '已确认',
  completed: '已完成',
  cancelled: '已取消',
};

export const STATUS_ORDER: ServiceStatus[] = [
  'pending',
  'confirmed',
  'completed',
  'cancelled',
];
