import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RideCard from '../components/RideCard';
import { getRides, deleteRide } from '../lib/store';
import { useAuth } from '../lib/AuthContext';

export default function Browse() {
  const [rides, setRides] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadRides();
  }, [filter]);

  async function loadRides() {
    setLoading(true);
    try {
      const data = await getRides(filter);
      setRides(data);
    } catch {
      setRides([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    await deleteRide(id);
    loadRides();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Browse Rides</h1>
        {user && (
          <Link
            to="/new"
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            + Post a ride
          </Link>
        )}
      </div>

      <div className="flex gap-2 mb-6">
        {[
          { value: 'all', label: 'All' },
          { value: 'offering', label: 'Offering' },
          { value: 'need', label: 'Need a ride' },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === opt.value
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : rides.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg mb-2">No rides posted yet</p>
          {user ? (
            <Link to="/new" className="text-emerald-600 font-medium hover:underline">
              Be the first to post
            </Link>
          ) : (
            <Link to="/auth" className="text-emerald-600 font-medium hover:underline">
              Sign in to post a ride
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {rides.map((ride) => (
            <RideCard
              key={ride.id}
              post={ride}
              onDelete={user?.id === ride.userId ? handleDelete : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
