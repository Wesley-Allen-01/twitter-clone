import React, { useEffect, useState } from 'react';

const HomePage = () => {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');

            try {
                const res = await fetch('http://localhost:3000/me', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = await res.json();

                if (res.ok) {
                    setUsername(data.username);
                } else {
                    setError(data.message || 'Failed to fetch user');
                }
            } catch (err) {
                setError('Server error');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div style={{ padding: 20 }}>
            <h2>Welcome, {username}!</h2>
        </div>
    );
};

export default HomePage;
