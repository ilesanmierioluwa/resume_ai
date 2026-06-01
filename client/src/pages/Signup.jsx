import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm.jsx';
import { apiRequest, saveSession } from '../utils/api.js';

/**
 * Signup page for creating a new ResumeAI account.
 *
 * @returns {React.ReactElement} Signup page UI.
 */
export default function Signup() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Updates signup form state as the user types.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - Input change event.
   * @returns {void}
   */
  function handleChange(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  /**
   * Submits signup details to create a user account.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - Form submit event.
   * @returns {Promise<void>} Resolves after signup succeeds or fails.
   */
  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiRequest('/api/auth/signup', {
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
      title="Create your account"
      subtitle="Sign up to analyze resumes and save your career advice history."
      fields={[
        { name: 'name', label: 'Full Name', type: 'text' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'password', label: 'Password', type: 'password' }
      ]}
      values={values}
      error={error}
      loading={loading}
      submitLabel="Sign Up"
      footerText="Already have an account?"
      footerLink="/login"
      footerLinkText="Login"
      onChange={handleChange}
      onSubmit={handleSubmit}
      onDismissError={() => setError('')}
    />
  );
}

