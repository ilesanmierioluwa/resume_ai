import { Link, Navigate } from 'react-router-dom';
import { getToken } from '../utils/api.js';

const features = [
  {
    title: 'Resume analysis',
    description: 'Get structured feedback on formatting, content quality, keyword strength, weaknesses, and improvements.'
  },
  {
    title: 'Career recommendations',
    description: 'See suitable roles based on the skills, projects, education, and experience already present in the resume.'
  },
  {
    title: 'Resume-aware chat',
    description: 'Ask follow-up career questions and continue the conversation from saved history whenever you return.'
  }
];

const steps = ['Upload PDF', 'Analyze resume', 'Review feedback', 'Ask follow-up questions'];

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
    <main className="min-h-screen bg-[#f7f9fc] text-zinc-950">
      <Header />
      <Hero />
      <FeatureStrip />
      <Workflow />
      <CTA />
    </main>
  );
}

/**
 * Displays the public navigation header.
 *
 * @returns {React.ReactElement} Header UI.
 */
function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-600 text-sm font-black text-white">R</span>
          <span className="text-xl font-black tracking-tight text-zinc-950">ResumeAI</span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link to="/login" className="rounded-md px-4 py-2 text-sm font-bold text-zinc-700 hover:bg-zinc-100">
            Login
          </Link>
          <Link to="/signup" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">
            Sign Up
          </Link>
        </nav>
      </div>
    </header>
  );
}

/**
 * Displays the main landing hero and product preview.
 *
 * @returns {React.ReactElement} Hero UI.
 */
function Hero() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 pb-14 pt-16 md:pb-20 md:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mx-auto w-fit rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
            AI-powered resume feedback for students and job seekers
          </p>
          <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-zinc-950 md:text-6xl">
            Understand your resume before employers judge it.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-600">
            Upload a PDF resume and get clear feedback, role recommendations, and a saved chat that helps you improve your next application.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/signup" className="rounded-md bg-blue-600 px-6 py-3 text-center text-sm font-black text-white hover:bg-blue-700">
              Analyze Resume
            </Link>
            <Link to="/login" className="rounded-md border border-zinc-300 bg-white px-6 py-3 text-center text-sm font-black text-zinc-800 hover:bg-zinc-50">
              Open Dashboard
            </Link>
          </div>
        </div>

        <div className="mt-12">
          <ProductMockup />
        </div>
      </div>
    </section>
  );
}

/**
 * Displays a clean application preview for ResumeAI.
 *
 * @returns {React.ReactElement} Product mockup UI.
 */
function ProductMockup() {
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-emerald-500" />
        </div>
        <p className="text-xs font-bold text-zinc-500">ResumeAI Dashboard</p>
      </div>

      <div className="grid min-h-[520px] md:grid-cols-[220px_1fr]">
        <aside className="hidden border-r border-zinc-200 bg-zinc-50 p-4 md:block">
          <p className="text-sm font-black text-blue-600">ResumeAI</p>
          <div className="mt-6 space-y-2">
            <SidebarItem active label="New Analysis" />
            <SidebarItem label="My History" />
          </div>
          <div className="mt-8 rounded-md border border-zinc-200 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Current file</p>
            <p className="mt-2 text-sm font-bold text-zinc-800">resume.pdf</p>
            <span className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Analyzed</span>
          </div>
        </aside>

        <section className="p-4 md:p-6">
          <div className="flex flex-col justify-between gap-3 border-b border-zinc-200 pb-5 md:flex-row md:items-end">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-zinc-950">Analysis Result</h2>
              <p className="mt-1 text-sm text-zinc-500">Feedback generated from the uploaded PDF resume.</p>
            </div>
            <button type="button" className="w-fit rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white">
              New Upload
            </button>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <FeedbackCard title="Resume Structure" tone="blue" body="The resume has the right sections, but the summary should be shorter and the project section should be easier to scan." />
              <FeedbackCard title="Content Quality" tone="emerald" body="Add measurable outcomes to projects and make each bullet show the problem, action, and result." />
              <FeedbackCard title="Keyword Strength" tone="amber" body="Add role keywords such as React, API integration, authentication, MongoDB, Git, and deployment." />
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-sm font-black text-zinc-950">Recommended roles</p>
                <div className="mt-4 space-y-3">
                  {['Frontend Developer', 'Junior Full-Stack Developer', 'Technical Support Intern'].map((role, index) => (
                    <div key={role} className="flex items-center gap-3 rounded-md border border-zinc-200 bg-white p-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-xs font-black text-white">{index + 1}</span>
                      <p className="text-sm font-bold text-zinc-800">{role}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-zinc-200 bg-white p-4">
                <p className="text-sm font-black text-zinc-950">Chat preview</p>
                <div className="mt-4 space-y-3">
                  <p className="max-w-[90%] rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm leading-6 text-zinc-700">
                    What should I improve first?
                  </p>
                  <p className="ml-auto max-w-[90%] rounded-md bg-blue-600 px-3 py-2 text-sm leading-6 text-white">
                    Start with project bullets and add measurable results.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/**
 * Displays one sidebar navigation item in the product preview.
 *
 * @param {{label: string, active?: boolean}} props - Item label and active state.
 * @returns {React.ReactElement} Sidebar item UI.
 */
function SidebarItem({ label, active = false }) {
  return (
    <div className={`rounded-md px-3 py-2 text-sm font-bold ${active ? 'bg-blue-600 text-white' : 'text-zinc-600'}`}>
      {label}
    </div>
  );
}

/**
 * Displays one feedback card inside the product mockup.
 *
 * @param {{title: string, body: string, tone: string}} props - Feedback card data.
 * @returns {React.ReactElement} Feedback card UI.
 */
function FeedbackCard({ title, body, tone }) {
  const tones = {
    blue: 'border-l-blue-600 bg-blue-50',
    emerald: 'border-l-emerald-500 bg-emerald-50',
    amber: 'border-l-amber-500 bg-amber-50'
  };

  return (
    <article className={`rounded-lg border border-zinc-200 border-l-4 p-4 ${tones[tone]}`}>
      <h3 className="text-sm font-black text-zinc-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-700">{body}</p>
    </article>
  );
}

/**
 * Displays the feature value strip below the hero.
 *
 * @returns {React.ReactElement} Feature strip UI.
 */
function FeatureStrip() {
  return (
    <section className="border-y border-zinc-200 bg-[#f7f9fc]">
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-10 md:grid-cols-3">
        {features.map((feature) => (
          <article key={feature.title} className="rounded-lg border border-zinc-200 bg-white p-6">
            <h2 className="text-lg font-black text-zinc-950">{feature.title}</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-600">{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/**
 * Displays the product workflow.
 *
 * @returns {React.ReactElement} Workflow UI.
 */
function Workflow() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-blue-600">Simple workflow</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-zinc-950 md:text-5xl">
              From PDF resume to clear next steps.
            </h2>
            <p className="mt-4 text-base leading-8 text-zinc-600">
              The experience is intentionally direct: upload, analyze, review, and continue improving through chat.
            </p>
          </div>

          <div className="grid gap-3">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-600 text-sm font-black text-white">
                  {index + 1}
                </span>
                <p className="font-black text-zinc-900">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Displays the final call to action.
 *
 * @returns {React.ReactElement} CTA UI.
 */
function CTA() {
  return (
    <section className="bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-12 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white">Ready to review your resume?</h2>
          <p className="mt-2 max-w-2xl text-zinc-300">Create an account, upload your PDF, and let ResumeAI show you what to improve.</p>
        </div>
        <Link to="/signup" className="rounded-md bg-white px-6 py-3 text-sm font-black text-zinc-950 hover:bg-blue-50">
          Start Analysis
        </Link>
      </div>
    </section>
  );
}

