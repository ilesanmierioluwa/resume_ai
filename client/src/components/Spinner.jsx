/**
 * Renders a small animated loading spinner with optional text.
 *
 * @param {{message?: string}} props - Optional loading message.
 * @returns {React.ReactElement} Spinner UI.
 */
export default function Spinner({ message }) {
  return (
    <div className="flex items-center gap-3 text-sm font-medium text-blue-600">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
      {message ? <span>{message}</span> : null}
    </div>
  );
}

