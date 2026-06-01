/**
 * Displays structured resume feedback cards returned by the AI.
 *
 * @param {{analysis: object}} props - Analysis object from the backend.
 * @returns {React.ReactElement|null} Analysis result UI.
 */
export default function AnalysisResults({ analysis }) {
  if (!analysis) {
    return null;
  }

  const paragraphCards = [
    { title: 'Resume Structure', content: analysis.structureFeedback },
    { title: 'Content Quality', content: analysis.contentQualityFeedback },
    { title: 'Keyword Strength', content: analysis.keywordStrengthFeedback }
  ];

  return (
    <section className="animate-fadeIn">
      <h2 className="text-2xl font-bold text-blue-600">Analysis Result</h2>
      <div className="mt-4 grid gap-4">
        {paragraphCards.map((card) => (
          <article key={card.title} className="rounded-xl border-l-4 border-blue-600 bg-blue-50 p-5 shadow-md">
            <h3 className="font-bold text-slate-900">{card.title}</h3>
            <p className="mt-2 leading-7 text-slate-700">{card.content}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <article className="rounded-xl bg-white p-5 shadow-md">
          <h3 className="font-bold text-red-500">Weaknesses Identified</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
            {(analysis.weaknesses || []).map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="rounded-xl bg-white p-5 shadow-md">
          <h3 className="font-bold text-emerald-600">Suggested Improvements</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
            {(analysis.improvements || []).map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}

