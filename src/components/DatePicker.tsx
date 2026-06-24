interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export default function DatePicker({ value, onChange }: DatePickerProps) {
  return (
    <div className="date-picker">
      <label htmlFor="watch-date">观影日期</label>
      <input
        id="watch-date"
        type="date"
        value={value}
        max={new Date().toISOString().split('T')[0]}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
