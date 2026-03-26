import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRideCounts } from '../lib/store';
import { useAuth } from '../lib/AuthContext';

export default function Home() {
  const [counts, setCounts] = useState({ offering: 0, need: 0 });
  const { user } = useAuth();

  useEffect(() => {
    getRideCounts().then(setCounts).catch(() => {});
  }, []);

  return (
    <div className="text-center space-y-10">
      <div className="space-y-4 pt-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
          Share your commute<br />with neighbours
        </h1>
        <p className="text-lg text-gray-600 max-w-lg mx-auto">
          Offer or find rides to work in your neighbourhood. Save money, reduce
          traffic, and get to know the people around you.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {user ? (
          <>
            <Link
              to="/new?type=offering"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              I'm going &mdash; offer a ride
            </Link>
            <Link
              to="/new?type=need"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white text-emerald-700 font-semibold border-2 border-emerald-600 hover:bg-emerald-50 transition-colors"
            >
              I need a ride
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/auth"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              Sign up to get started
            </Link>
            <Link
              to="/browse"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white text-emerald-700 font-semibold border-2 border-emerald-600 hover:bg-emerald-50 transition-colors"
            >
              Browse rides
            </Link>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-3xl font-bold text-emerald-600">{counts.offering}</p>
          <p className="text-sm text-gray-500 mt-1">Rides offered</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-3xl font-bold text-blue-600">{counts.need}</p>
          <p className="text-sm text-gray-500 mt-1">Rides needed</p>
        </div>
      </div>

      {(counts.offering > 0 || counts.need > 0) && (
        <Link
          to="/browse"
          className="inline-block text-emerald-600 font-medium hover:underline"
        >
          Browse all rides
        </Link>
      )}
    </div>
  );
}
