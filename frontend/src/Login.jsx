import React, { useState } from 'react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Data Submitted:", formData);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconContainer}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        </div>
        
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Login to access your secure inbox</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input 
            type="email" name="email" placeholder="Email Address" 
            value={formData.email} onChange={handleChange} required style={styles.input} 
          />

          <input 
            type="password" name="password" placeholder="Password" 
            value={formData.password} onChange={handleChange} required style={styles.input} 
          />

          <button type="submit" style={styles.button}>Log In</button>
        </form>

        <p style={styles.footerText}>
          Don't have an account? <a href="/signup" style={styles.link}>Sign Up</a>
        </p>
      </div>
    </div>
  );
};

// Same theme styles as Signup
const styles = {
  container: {
    backgroundColor: '#0f172a',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Arial, sans-serif',
    color: '#ffffff',
    padding: '20px'
  },
  card: {
    backgroundColor: '#1e293b',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center'
  },
  iconContainer: {
    marginBottom: '15px'
  },
  title: {
    margin: '0 0 5px 0',
    fontSize: '24px',
    fontWeight: 'bold'
  },
  subtitle: {
    margin: '0 0 25px 0',
    color: '#94a3b8',
    fontSize: '14px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  input: {
    backgroundColor: '#e2e8f0',
    border: 'none',
    padding: '12px 15px',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#0f172a',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box'
  },
  button: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px'
  },
  footerText: {
    marginTop: '20px',
    fontSize: '14px',
    color: '#94a3b8'
  },
  link: {
    color: '#3b82f6',
    textDecoration: 'none'
  }
};

export default Login;