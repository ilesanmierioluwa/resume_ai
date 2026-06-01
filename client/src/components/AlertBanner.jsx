/**
 * Displays a dismissible red error alert.
 *
 * @param {{message: string, onClose: () => void}} props - Alert message and close callback.
 * @returns {React.ReactElement|null} Alert UI or null when no message exists.
 */
export default function AlertBanner({ message, onClose }) {
  if (!message) {
    return null;
  }

  return (
    <div className="mb-4 flex items-start justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <p>{message}</p>
      <button type="button" onClick={onClose} className="font-semibold text-red-500">
        Dismiss
      </button>
    </div>
  );
}

