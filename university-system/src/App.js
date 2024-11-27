import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./UserContext"; // UserContext dosyasından provider'ı içe aktarın
import Login from "./Login"; // Login bileşenini ayrı bir dosyaya taşıyabilirsiniz
import Home from "./Home"; 
import Profile from "./Profile";
import { SelectedProvider } from "./SelectedContext";

const App = () => {
  return (
    <UserProvider>
      <SelectedProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} /> {/* Giriş ekranı */}
          <Route path="/home" element={<Home />} /> {/* Home ekranı */}
          <Route path="/profile" element={<Profile />} /> {/* Profil ekranı */}
        </Routes>
      </Router>
      </SelectedProvider>
    </UserProvider>
  );
};

export default App;
