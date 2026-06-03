import AlertBanner from './AlertBanner.jsx';
import Spinner from './Spinner.jsx';

/**
 * Displays the authenticated user's saved resume analysis history.
 *
 * @param {object} props - History list state and callbacks.
 * @returns {React.ReactElement} History list UI.
 */
export default function HistoryList({ analyses, loading, error, deletingId, onView, onDelete, onDismissError }) {
  return (
    <section>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-950">My History</h1>
          <p className="mt-2 text-slate-600">Review previous resume analyses and continue saved conversations.</p>
        </div>
      </div>

      <div className="mt-6">
        <AlertBanner message={error} onClose={onDismissError} />
        {loading ? <Spinner message="Loading history..." /> : null}
        {!loading && analyses.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-600">
            No resume analyses have been saved yet.
          </div>
        ) : null}
        <div className="space-y-4">
          {analyses.map((analysis) => (
            <article key={analysis._id} className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-bold text-slate-900">{analysis.resumeFileName}</h2>
                <p className="mt-1 text-sm text-slate-500">{new Date(analysis.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => onView(analysis._id)}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
                >
                  View
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(analysis)}
                  disabled={deletingId === analysis._id}
                  className="rounded-lg border border-red-200 px-5 py-2.5 font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deletingId === analysis._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
