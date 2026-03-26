import { useState } from 'react';
import { useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import LocationPicker from '../components/LocationPicker';
import DaySelector from '../components/DaySelector';
import { NOTICE_OPTIONS } from '../lib/constants';
import { createRide } from '../lib/store';
import { useAuth } from '../lib/AuthContext';

export default function NewPost() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'offering';
  const { user, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    type: initialType,
    name: '',
    from: null,
    to: null,
    days: [],
    departureTime: '08:00',
    payment: 'free',
    notice: 'same-day',
    notes: '',
  });

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      await createRide(form, user.id);
      navigate('/browse');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return null;
  if (!user) return <Navigate to="/auth" />;

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {form.type === 'offering' ? "I'm going — offer a ride" : 'I need a ride'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {/* Type toggle */}
        <div className="flex gap-2">
          {['offering', 'need'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => update('type', t)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                form.type === t
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t === 'offering' ? 'Offering a ride' : 'Need a ride'}
            </button>
          ))}
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your name
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="e.g. Maria"
          />
        </div>

        {/* Locations */}
        <LocationPicker
          label="From (pickup location)"
          value={form.from}
          onChange={(val) => update('from', val)}
        />
        <LocationPicker
          label="To (destination)"
          value={form.to}
          onChange={(val) => update('to', val)}
        />

        {/* Days */}
        <DaySelector
          value={form.days}
          onChange={(val) => update('days', val)}
        />

        {/* Departure time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Departure time
          </label>
          <input
            type="time"
            value={form.departureTime}
            onChange={(e) => update('departureTime', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        {/* Payment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment
          </label>
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'free', label: 'Free / share costs' },
              { value: 'can-pay', label: 'Can pay' },
              { value: 'want-pay', label: 'Expects payment' },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => update('payment', opt.value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  form.payment === opt.value
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notice time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            How much notice do you need?
          </label>
          <select
            value={form.notice}
            onChange={(e) => update('notice', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            {NOTICE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes (optional)
          </label>
          <textarea
            value={form.notes}
            onChange={(e) => update('notes', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="Any extra info — route preferences, number of seats, etc."
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50"
        >
          {submitting ? 'Posting...' : 'Post ride'}
        </button>
      </form>
    </div>
  );
}
