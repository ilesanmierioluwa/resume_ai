import { Link, Navigate } from 'react-router-dom';
import { getToken } from '../utils/api.js';

/**
 * Landing page for unauthenticated users.
 *
 * @returns {React.ReactElement} Home page UI.
 */
export default function Landing() {
  if (getToken()) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
        <span className="text-2xl font-extrabold text-blue-600">ResumeAI</span>
        <div className="flex gap-3">
          <Link to="/login" className="rounded-lg px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50">
            Login
          </Link>
          <Link to="/signup" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-700">
            Sign Up
          </Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-[1.05fr_0.95fr] md:py-24">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-emerald-500">AI-Powered Resume Analyzer</p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight text-slate-950 md:text-6xl">
            Build a stronger resume and plan your next career move.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            ResumeAI reviews resume structure, content quality, keyword strength, and recommends career roles based on the uploaded PDF.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/signup" className="rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-white shadow-md hover:bg-blue-700">
              Sign Up
            </Link>
            <Link to="/login" className="rounded-lg border border-blue-200 bg-white px-6 py-3 text-center font-semibold text-blue-600 shadow-md hover:bg-blue-50">
              Login
            </Link>
          </div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
            <div className="h-3 w-24 rounded bg-blue-600" />
            <div className="mt-6 space-y-3">
              <div className="h-3 rounded bg-slate-200" />
              <div className="h-3 w-5/6 rounded bg-slate-200" />
              <div className="h-3 w-3/4 rounded bg-slate-200" />
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {['Structure', 'Keywords', 'Career Fit', 'Chat Advice'].map((item) => (
                <div key={item} className="rounded-xl bg-white p-4 shadow-md">
                  <div className="mb-3 h-8 w-8 rounded-full bg-emerald-500" />
                  <p className="font-semibold text-slate-800">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

