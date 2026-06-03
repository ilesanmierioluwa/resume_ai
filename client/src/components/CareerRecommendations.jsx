/**
 * Displays AI recommended roles in a responsive card grid.
 *
 * @param {{recommendations: Array<{role: string, explanation: string}>}} props - Career recommendations.
 * @returns {React.ReactElement|null} Career recommendation UI.
 */
export default function CareerRecommendations({ recommendations = [] }) {
  if (!recommendations.length) {
    return null;
  }

  return (
    <section className="animate-fadeIn">
      <h2 className="text-2xl font-bold text-blue-600">Career Recommendations</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {recommendations.map((item, index) => (
          <article key={`${item.role}-${index}`} className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-start gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 font-bold text-white">
                {index + 1}
              </span>
              <div>
                <h3 className="font-bold text-slate-900">{item.role}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.explanation}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
