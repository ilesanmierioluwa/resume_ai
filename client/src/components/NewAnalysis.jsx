import { useEffect, useRef, useState } from 'react';
import AlertBanner from './AlertBanner.jsx';
import AnalysisResults from './AnalysisResults.jsx';
import CareerRecommendations from './CareerRecommendations.jsx';
import ChatInterface from './ChatInterface.jsx';
import Spinner from './Spinner.jsx';
import { apiRequest } from '../utils/api.js';

/**
 * Provides the resume upload workflow and displays new analysis output.
 *
 * @param {{loadedAnalysis?: object, loadedMessages?: Array<object>}} props - Optional loaded history details.
 * @returns {React.ReactElement} New analysis view UI.
 */
export default function NewAnalysis({ loadedAnalysis, loadedMessages = [] }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysis, setAnalysis] = useState(loadedAnalysis || null);
  const [messages, setMessages] = useState(loadedMessages);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setAnalysis(loadedAnalysis || null);
    setMessages(loadedMessages);
    if (loadedAnalysis?._id) {
      localStorage.setItem('resumeai_active_analysis_id', loadedAnalysis._id);
    }
  }, [loadedAnalysis, loadedMessages]);

  /**
   * Validates and stores a selected PDF file.
   *
   * @param {File} file - Selected or dropped file.
   * @returns {void}
   */
  function chooseFile(file) {
    setError('');

    if (!file) {
      return;
    }

    if (file.type !== 'application/pdf') {
      setError('Only PDF files are accepted.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('The PDF file must not be larger than 5MB.');
      return;
    }

    setSelectedFile(file);
  }

  /**
   * Handles drag-over events for the drop area.
   *
   * @param {React.DragEvent<HTMLDivElement>} event - Drag event.
   * @returns {void}
   */
  function handleDragOver(event) {
    event.preventDefault();
  }

  /**
   * Handles PDF files dropped into the upload area.
   *
   * @param {React.DragEvent<HTMLDivElement>} event - Drop event.
   * @returns {void}
   */
  function handleDrop(event) {
    event.preventDefault();
    chooseFile(event.dataTransfer.files[0]);
  }

  /**
   * Sends the selected PDF to the backend for AI analysis.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - Form submit event.
   * @returns {Promise<void>} Resolves after upload and analysis complete.
   */
  async function handleSubmit(event) {
    event.preventDefault();

    if (!selectedFile) {
      setError('Please select a PDF resume before submitting.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', selectedFile);
    setLoading(true);
    setError('');

    try {
      const data = await apiRequest('/api/analyze', {
        method: 'POST',
        body: formData
      });
      setAnalysis(data.analysis);
      setMessages([]);
      localStorage.setItem('resumeai_active_analysis_id', data.analysis._id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <div>
        <h1 className="text-3xl font-extrabold text-slate-950">New Analysis</h1>
        <p className="mt-2 text-slate-600">Upload a text-based PDF resume and receive AI-powered feedback.</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
        <AlertBanner message={error} onClose={() => setError('')} />
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(event) => event.key === 'Enter' && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-200 bg-slate-50 px-4 py-8 text-center transition hover:border-blue-600 hover:bg-blue-50"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={(event) => chooseFile(event.target.files[0])}
            className="hidden"
          />
          <p className="text-lg font-bold text-blue-600">Drop your PDF resume here</p>
          <p className="mt-2 text-sm text-slate-600">or tap to browse. Maximum file size is 5MB.</p>
          {selectedFile ? <p className="mt-4 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">{selectedFile.name}</p> : null}
        </div>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {loading ? <Spinner message="Analyzing your resume, please wait..." /> : <span className="text-sm text-slate-500">PDF files only</span>}
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Analyzing...' : 'Analyze Resume'}
          </button>
        </div>
      </form>

      {analysis ? (
        <div className="mt-8 space-y-8">
          <AnalysisResults analysis={analysis} />
          <CareerRecommendations recommendations={analysis.careerRecommendations} />
          <ChatInterface analysisId={analysis._id} initialMessages={messages} />
        </div>
      ) : null}
    </section>
  );
}
