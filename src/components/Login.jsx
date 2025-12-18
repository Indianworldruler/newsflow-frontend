import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  setError('');

  try {
    const response = await axios.post('https://newsflow-backend-jlfd.onrender.com/api/auth/login', {
      email,
      password
    });

    console.log('Login response:', response.data); // ADD THIS
    
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('userId', response.data.userId);
    
    console.log('Token stored:', localStorage.getItem('token')); // ADD THIS
    
    navigate('/preferences', { replace: true });
  } catch (err) {
    console.error('Login error:', err); // ADD THIS
    setError(err.response?.data?.message || 'Login failed');
  }
};
  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Login to NewsFlow</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Login
        </button>
      </form>
      <p style={{ marginTop: '20px' }}>
        Don't have an account?{' '}
        <button onClick={() => navigate('/signin')} style={{ cursor: 'pointer', color: 'blue', background: 'none', border: 'none', textDecoration: 'underline' }}>
          Sign Up
        </button>
      </p>
    </div>
  );
}

export default Login;
