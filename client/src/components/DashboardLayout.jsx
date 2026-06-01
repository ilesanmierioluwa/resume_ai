/**
 * Dashboard shell with responsive sidebar navigation.
 *
 * @param {object} props - Layout props.
 * @returns {React.ReactElement} Dashboard layout UI.
 */
export default function DashboardLayout({
  activeView,
  userName,
  mobileOpen,
  onToggleMobile,
  onSelectView,
  onLogout,
  children,
}) {
  const navItems = [
    { id: "new", label: "New Analysis" },
    { id: "history", label: "My History" },
  ];

  /**
   * Renders one sidebar navigation button.
   *
   * @param {{id: string, label: string}} item - Navigation item.
   * @returns {React.ReactElement} Navigation button.
   */
  function renderNavButton(item) {
    const isActive = activeView === item.id;

    return (
      <button
        key={item.id}
        type="button"
        onClick={() => onSelectView(item.id)}
        className={`w-full rounded-lg px-4 py-3 text-left text-sm font-semibold transition ${
          isActive
            ? "bg-blue-600 text-white shadow-md"
            : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
        }`}
      >
        {item.label}
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 shadow-sm md:hidden">
        <button
          type="button"
          onClick={onToggleMobile}
          className="rounded-lg border border-slate-200 px-3 py-2 text-slate-700"
        >
          Menu
        </button>
        <span className="text-lg font-extrabold text-blue-600">ResumeAI</span>
      </header>

      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          onClick={onToggleMobile}
          className="fixed inset-0 z-20 bg-slate-900/30 md:hidden"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-56 flex-col bg-white p-6 shadow-sm transition-transform md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-blue-600">
              ResumeAI
            </span>
            <button
              type="button"
              onClick={onToggleMobile}
              className="rounded-lg px-3 py-2 text-slate-500 md:hidden"
            >
              Close
            </button>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Welcome, {userName || "Student"}
          </p>
        </div>
        <nav className="mt-8 space-y-3">{navItems.map(renderNavButton)}</nav>

        <button
          type="button"
          onClick={onLogout}
          className="mt-auto w-full rounded-md border border-red-100 px-3 py-2 text-left text-sm font-semibold text-red-500 hover:bg-red-50"
        >
          Logout
        </button>
      </aside>

      <main className="px-4 py-6 md:ml-56 md:px-8 md:py-8">
        <div className="mx-auto max-w-5xl">
          <div className="bg-white rounded-xl p-6 shadow">{children}</div>
        </div>
      </main>
    </div>
  );
}
