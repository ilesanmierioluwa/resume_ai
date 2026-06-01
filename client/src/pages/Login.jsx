import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm.jsx';
import { apiRequest, saveSession } from '../utils/api.js';

/**
 * Login page for existing ResumeAI users.
 *
 * @returns {React.ReactElement} Login page UI.
 */
export default function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Updates form state as the user types.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - Input change event.
   * @returns {void}
   */
  function handleChange(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  /**
   * Submits login credentials to the backend.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - Form submit event.
   * @returns {Promise<void>} Resolves after login succeeds or fails.
   */
  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(values)
      });
      saveSession(data.token, data.name);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthForm
      title="Welcome back"
      subtitle="Log in to view your resume analysis dashboard."
      fields={[
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'password', label: 'Password', type: 'password' }
      ]}
      values={values}
      error={error}
      loading={loading}
      submitLabel="Login"
      footerText="No account yet?"
      footerLink="/signup"
      footerLinkText="Create one"
      onChange={handleChange}
      onSubmit={handleSubmit}
      onDismissError={() => setError('')}
    />
  );
}

