import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import HistoryList from '../components/HistoryList.jsx';
import NewAnalysis from '../components/NewAnalysis.jsx';
import { apiRequest, clearSession } from '../utils/api.js';

/**
 * Protected dashboard page containing analysis and history workflows.
 *
 * @returns {React.ReactElement} Dashboard page UI.
 */
export default function Dashboard() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('new');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [analyses, setAnalyses] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [loadedAnalysis, setLoadedAnalysis] = useState(null);
  const [loadedMessages, setLoadedMessages] = useState([]);

  /**
   * Loads the user's analysis history from the backend.
   *
   * @returns {Promise<void>} Resolves after history is fetched.
   */
  async function loadHistory() {
    setHistoryLoading(true);
    setHistoryError('');

    try {
      const data = await apiRequest('/api/history');
      setAnalyses(data.analyses || []);
    } catch (err) {
      setHistoryError(err.message);
    } finally {
      setHistoryLoading(false);
    }
  }

  useEffect(() => {
    if (activeView === 'history') {
      loadHistory();
    }
  }, [activeView]);

  /**
   * Loads one saved analysis and switches back to the analysis view.
   *
   * @param {string} id - Analysis document id.
   * @returns {Promise<void>} Resolves after analysis details are fetched.
   */
  async function viewAnalysis(id) {
    setHistoryError('');

    try {
      const data = await apiRequest(`/api/history/${id}`);
      setLoadedAnalysis(data.analysis);
      setLoadedMessages(data.messages || []);
      setActiveView('new');
      setMobileOpen(false);
    } catch (err) {
      setHistoryError(err.message);
    }
  }

  /**
   * Changes dashboard view and closes the mobile menu.
   *
   * @param {string} view - Selected dashboard view id.
   * @returns {void}
   */
  function selectView(view) {
    setActiveView(view);
    setMobileOpen(false);
    if (view === 'new') {
      setLoadedAnalysis(null);
      setLoadedMessages([]);
    }
  }

  /**
   * Logs the user out and redirects to the landing page.
   *
   * @returns {void}
   */
  function logout() {
    clearSession();
    navigate('/');
  }

  return (
    <DashboardLayout
      activeView={activeView}
      userName={localStorage.getItem('resumeai_name')}
      mobileOpen={mobileOpen}
      onToggleMobile={() => setMobileOpen((current) => !current)}
      onSelectView={selectView}
      onLogout={logout}
    >
      {activeView === 'history' ? (
        <HistoryList
          analyses={analyses}
          loading={historyLoading}
          error={historyError}
          onView={viewAnalysis}
          onDismissError={() => setHistoryError('')}
        />
      ) : (
        <NewAnalysis loadedAnalysis={loadedAnalysis} loadedMessages={loadedMessages} />
      )}
    </DashboardLayout>
  );
}

