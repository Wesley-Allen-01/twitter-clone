import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); 

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (res.ok){
                alert('Login successful');
                localStorage.setItem('token', data.token); 
                console.log('User ID: ', data.userId);
                navigate('/home'); 
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError("Server error");
        }
    };

    return (
        <div style={{ padding: 20 }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br /><br />
        <button type="submit">Log In</button>
      </form>
    </div>
    );
};

export default LoginPage;

