import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "./UserContext";
import { SelectedContext } from "./SelectedContext";
import { SelectedCommunityContext } from "./SelectedCommunityContext";

const Login = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext); // Context'teki kullanıcı güncelleme fonksiyonunu alın
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const navigate = useNavigate();
  
  const {setSelectedCourse } = useContext(SelectedContext);
  const {setselectedCommunity } = useContext(SelectedCommunityContext);


  const handleLogin = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/login", {
        username: username,
        password: password,
      });
      
      //setCurrentUser(response.data.user);
      setCurrentUser(response.data.user); // Kullanıcı bilgisini global olarak güncelleyin
      
      setLoginMessage(`Login successful! Welcome, ${response.data.user.username}`);
      setSelectedCourse(null);
      setselectedCommunity(null);
      navigate("/home"); // Kullanıcıyı Home sayfasına yönlendirin
    } catch (error) {
      setLoginMessage("Invalid login information. Please try again.");
    }
  };


  useEffect(() => {
    console.log("Current user updated:", currentUser);
  }, [currentUser]);
  return (
    <div
      style={{
        backgroundColor: "#1C2833",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)",
          maxWidth: "400px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "1.5rem", color: "#34495E" }}>Welcome Back</h1>
        <div style={{ marginBottom: "1rem", textAlign: "left" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "bold",
              color: "#2C3E50",
            }}
          >
            Username:
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            style={{
              width: "-webkit-fill-available",
              padding: "0.75rem",
              borderRadius: "8px",
              border: "1px solid #BDC3C7",
              transition: "border 0.3s ease",
            }}
            onFocus={(e) => (e.target.style.border = "1px solid #3498DB")}
            onBlur={(e) => (e.target.style.border = "1px solid #BDC3C7")}
          />
        </div>
        <div style={{ marginBottom: "1rem", textAlign: "left" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "bold",
              color: "#2C3E50",
            }}
          >
            Password:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            style={{
              width: "-webkit-fill-available",
              padding: "0.75rem",
              borderRadius: "8px",
              border: "1px solid #BDC3C7",
              transition: "border 0.3s ease",
            }}
            onFocus={(e) => (e.target.style.border = "1px solid #3498DB")}
            onBlur={(e) => (e.target.style.border = "1px solid #BDC3C7")}
          />
        </div>
        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#2980B9",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) =>
            (e.target.style.backgroundColor = "#1F618D")
          }
          onMouseOut={(e) =>
            (e.target.style.backgroundColor = "#2980B9")
          }
        >
          Login
        </button>
        <div style={{ marginTop: "1rem", color: loginMessage ? "#E74C3C" : "#3498DB" }}>
          {loginMessage && <p>{loginMessage}</p>}
        </div>
      </div>
    </div>
  );   
  
};
export default Login;
