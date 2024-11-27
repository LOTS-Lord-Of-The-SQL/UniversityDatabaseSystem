import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "./UserContext";

const Login = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext); // Context'teki kullanıcı güncelleme fonksiyonunu alın
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/login", {
        username: username,
        password: password,
      });
      
      //setCurrentUser(response.data.user);
      setCurrentUser(response.data.user); // Kullanıcı bilgisini global olarak güncelleyin
      
      console.log("abc", currentUser);
      setLoginMessage(`Login successful! Welcome, ${response.data.user.username}`);
      navigate("/home"); // Kullanıcıyı Home sayfasına yönlendirin
    } catch (error) {
      setLoginMessage("Invalid login information. Please try again.");
    }
  };


  useEffect(() => {
    console.log("Current user updated:", currentUser);
  }, [currentUser]);
  return (
    <div style={{ margin: "2rem" }}>
      <h1>Login Page</h1>
      <div style={{ marginBottom: "1rem" }}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            style={{ marginLeft: "0.5rem" }}
          />
        </label>
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            style={{ marginLeft: "0.5rem" }}
          />
        </label>
      </div>
      <button onClick={handleLogin} style={{ padding: "0.5rem 1rem" }}>
        Login
      </button>
      <div style={{ marginTop: "1rem", color: "blue" }}>
        {loginMessage && <p>{loginMessage}</p>}
      </div>
    </div>
  );
};

export default Login;
