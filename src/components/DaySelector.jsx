import { DAYS } from '../lib/constants';

export default function DaySelector({ value = [], onChange }) {
  function toggle(day) {
    onChange(
      value.includes(day) ? value.filter((d) => d !== day) : [...value, day]
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Days of the week
      </label>
      <div className="flex gap-1.5 flex-wrap">
        {DAYS.map((day) => (
          <button
            key={day}
            type="button"
            onClick={() => toggle(day)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              value.includes(day)
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
}
