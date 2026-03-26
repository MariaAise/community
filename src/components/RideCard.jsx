export default function RideCard({ post, onDelete }) {
  const isOffering = post.type === 'offering';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isOffering
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {isOffering ? 'Offering a ride' : 'Need a ride'}
            </span>
            {post.payment && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                {post.payment === 'can-pay'
                  ? 'Can pay'
                  : post.payment === 'want-pay'
                  ? 'Expects payment'
                  : 'Free / share costs'}
              </span>
            )}
          </div>

          <h3 className="font-semibold text-gray-900 mb-1">{post.name}</h3>

          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <span className="font-medium">From:</span> {post.from?.name || 'Not set'}
            </p>
            <p>
              <span className="font-medium">To:</span> {post.to?.name || 'Not set'}
            </p>
            {post.departureTime && (
              <p>
                <span className="font-medium">Departs:</span> {post.departureTime}
              </p>
            )}
            <p>
              <span className="font-medium">Days:</span>{' '}
              {post.days?.join(', ') || 'Flexible'}
            </p>
            <p>
              <span className="font-medium">Notice:</span> {post.notice || 'Any time'}
            </p>
          </div>

          {post.notes && (
            <p className="mt-2 text-sm text-gray-500 italic">{post.notes}</p>
          )}
        </div>

        {onDelete && (
          <button
            onClick={() => onDelete(post.id)}
            className="text-gray-400 hover:text-red-500 transition-colors text-sm"
            title="Delete"
          >
            Remove
          </button>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-3">
        Posted {new Date(post.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}
