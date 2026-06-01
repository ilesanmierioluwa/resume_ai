import { Link } from 'react-router-dom';
import AlertBanner from './AlertBanner.jsx';

/**
 * Reusable authentication form for signup and login pages.
 *
 * @param {object} props - Form configuration and state handlers.
 * @returns {React.ReactElement} Authentication form UI.
 */
export default function AuthForm({
  title,
  subtitle,
  fields,
  values,
  error,
  loading,
  submitLabel,
  footerText,
  footerLink,
  footerLinkText,
  onChange,
  onSubmit,
  onDismissError
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        <Link to="/" className="text-xl font-extrabold text-blue-600">
          ResumeAI
        </Link>
        <h1 className="mt-8 text-2xl font-bold text-slate-900">{title}</h1>
        <p className="mt-2 text-sm text-slate-600">{subtitle}</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <AlertBanner message={error} onClose={onDismissError} />
          {fields.map((field) => (
            <label key={field.name} className="block text-sm font-semibold text-slate-700">
              {field.label}
              <input
                type={field.type}
                name={field.name}
                value={values[field.name]}
                onChange={onChange}
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                required
              />
            </label>
          ))}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Please wait...' : submitLabel}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          {footerText}{' '}
          <Link to={footerLink} className="font-semibold text-blue-600">
            {footerLinkText}
          </Link>
        </p>
      </section>
    </main>
  );
}

