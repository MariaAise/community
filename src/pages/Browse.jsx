import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RideCard from '../components/RideCard';
import { getPosts, deletePost } from '../lib/store';

export default function Browse() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setPosts(getPosts());
  }, []);

  function handleDelete(id) {
    deletePost(id);
    setPosts(getPosts());
  }

  const filtered =
    filter === 'all' ? posts : posts.filter((p) => p.type === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Browse Rides</h1>
        <Link
          to="/new"
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
        >
          + Post a ride
        </Link>
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

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg mb-2">No rides posted yet</p>
          <Link to="/new" className="text-emerald-600 font-medium hover:underline">
            Be the first to post
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((post) => (
            <RideCard key={post.id} post={post} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
