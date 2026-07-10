import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PetCareForm from '../components/PetCareForm';
import type { PetCareDraft } from '../types/petCare';

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.setSystemTime(new Date('2024-02-01T00:00:00Z'));
});

afterEach(() => {
  vi.useRealTimers();
});

const emptyRequired: PetCareDraft = {
  ownerName: '',
  phone: '',
  address: '',
  petName: '',
  petType: '猫',
  petCount: 1,
  serviceDate: '2024-02-01',
  serviceTime: '09:00',
  duration: 1,
  feedingInstructions: '',
  specialNotes: '',
  emergencyContact: '',
  status: 'pending',
};

describe('PetCareForm', () => {
  it('disables submit until required fields are filled', () => {
    render(<PetCareForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    const submit = screen.getByText('提交预约');
    expect(submit).toBeDisabled();
  });

  it('enables submit and submits the draft with required fields', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const onSubmit = vi.fn();
    render(<PetCareForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText('联系人姓名 *'), '张三');
    await user.type(screen.getByLabelText('联系电话 *'), '13800000000');
    await user.type(screen.getByLabelText('上门地址 *'), '朝阳区xx路1号');
    await user.type(screen.getByLabelText('宠物名字 *'), '小白');

    const submit = screen.getByText('提交预约');
    expect(submit).not.toBeDisabled();
    await user.click(submit);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const draft = onSubmit.mock.calls[0][0] as PetCareDraft;
    expect(draft.ownerName).toBe('张三');
    expect(draft.petName).toBe('小白');
    expect(draft.petType).toBe('猫');
    expect(draft.status).toBe('pending');
  });

  it('selects a pet type', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const onSubmit = vi.fn();
    render(<PetCareForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText('联系人姓名 *'), '张三');
    await user.type(screen.getByLabelText('联系电话 *'), '13800000000');
    await user.type(screen.getByLabelText('上门地址 *'), '朝阳区xx路1号');
    await user.type(screen.getByLabelText('宠物名字 *'), '旺财');
    await user.click(screen.getByText('狗'));

    await user.click(screen.getByText('提交预约'));
    const draft = onSubmit.mock.calls[0][0] as PetCareDraft;
    expect(draft.petType).toBe('狗');
  });

  it('prefills fields when given an initial registration', () => {
    render(
      <PetCareForm
        initial={{
          ...emptyRequired,
          ownerName: '李四',
          petName: '大黄',
          petType: '狗',
          status: 'confirmed',
          id: 'x',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        }}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(screen.getByText('编辑预约')).toBeInTheDocument();
    expect(screen.getByLabelText('联系人姓名 *')).toHaveValue('李四');
    expect(screen.getByLabelText('宠物名字 *')).toHaveValue('大黄');
    expect(screen.getByText('保存修改')).toBeInTheDocument();
  });

  it('calls onCancel when cancel is clicked', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const onCancel = vi.fn();
    render(<PetCareForm onSubmit={vi.fn()} onCancel={onCancel} />);
    await user.click(screen.getByText('取消'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
