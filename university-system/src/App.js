import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './Home'; // Home bileşenini içe aktarın
import Profile from './Profile';



const App = () => {
  var currentUser;
  const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginMessage, setLoginMessage] = useState('');
    const navigate = useNavigate(); // useNavigate hook'unu kullanarak yönlendirme yapıyoruz
  
    const handleLogin = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:8000/login', {
          username: username,
          password: password,
        });
        currentUser = response.data.user;
        console.log("abc",currentUser);
        console.log(response.data.user);
  
        // Başarılı giriş yapılırsa
        setLoginMessage(`Login successful! Welcome, ${response.data.user.username}`);
        navigate('/home'); // Kullanıcıyı Home sayfasına yönlendir
      } catch (error) {
        // Hatalı giriş yapılırsa
        setLoginMessage('Invalid login information. Please try again.');
      }
    };
  
    return (
      <div style={{ margin: '2rem' }}>
        <h1>Login Page</h1>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              style={{ marginLeft: '0.5rem' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{ marginLeft: '0.5rem' }}
            />
          </label>
        </div>
        <button onClick={handleLogin} style={{ padding: '0.5rem 1rem' }}>
          Login
        </button>
        <div style={{ marginTop: '1rem', color: 'blue' }}>
          {loginMessage && <p>{loginMessage}</p>}
        </div>
      </div>
    );
  };
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Giriş ekranı */}
        <Route path="/home" element={<Home currentUser={currentUser}/>} /> {/* Home ekranı */}
        <Route path="/profile" element={<Profile currentUser={currentUser}/>} /> {/* Home ekranı */}
      </Routes>
    </Router>
  );
};

export default App;
