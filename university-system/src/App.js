import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./UserContext"; // UserContext dosyasından provider'ı içe aktarın
import Login from "./Login"; // Login bileşenini ayrı bir dosyaya taşıyabilirsiniz
import Home from "./Home";
import Profile from "./Profile";
import { SelectedProvider } from "./SelectedContext";
import { ContextProvider } from "./CoursesContext";
import EnrollCourse from "./EnrollCourses";
import EnrollCommunity from "./EnrollCommunity";
import ReserveFacilities from "./ReserveFacilities";
import Library from "./Library";
import { SelectedCommunityProvider } from "./SelectedCommunityContext";


const App = () => {
  return (
    <SelectedCommunityProvider>
      <ContextProvider>
        <UserProvider>
          <SelectedProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Login />} /> {/* Giriş ekranı */}
                <Route path="/home" element={<Home />} /> {/* Home ekranı */}
                <Route path="/profile" element={<Profile />} /> {/* Profil ekranı */}
                <Route path="/enrollcourse" element={<EnrollCourse />} />
                <Route path="/enrollcommunity" element={<EnrollCommunity />} />
                <Route path="/reservefacility" element={<ReserveFacilities />} />
                <Route path="/reservefacility/:facility_id" element={<Library />} />
              </Routes>
            </Router>
          </SelectedProvider>
        </UserProvider>
      </ContextProvider>
    </SelectedCommunityProvider>
  );
};

export default App;
