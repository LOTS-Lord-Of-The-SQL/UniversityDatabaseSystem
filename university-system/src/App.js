import React, { useState, useEffect } from "react";
import {
  Avatar,
  TextField,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom"; // Router ve navigate ekledik
import Home from "./Home";
import Profile from "./Profile"; // Profil bileşeni eklendi
import "./App.css";

const default_user = {
  name: "Anonymous User",
  ID: "ID",
  department: "DepartmentName",
  profilePicture: "/path/to/profile.jpg",
  title: "Title",
};

const App = () => {
  const [currentUser, setCurrentUser] = useState(default_user);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("all");

  useEffect(() => {
    const fetchUser = () => {
      setCurrentUser({
        name: "UserName",
        ID: "UserID",
        department: "DepartmentName",
        profilePicture: "/path/to/profile.jpg",
        title: "Title",
      });
    };
    fetchUser();
  }, []);

  return (
    <Router>
      <div className="app-container">
        <header className="header">
          <Typography variant="h4" className="header-title" onClick={() => (window.location = "/")}>
            TOBB Media
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <TextField
              className="search"
              variant="outlined"
              size="small"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flexGrow: 1 }}
            />
            <FormControl variant="outlined" size="small">
              <Select
                className="search"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="author">Author</MenuItem>
                <MenuItem value="content">Content</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Box>
              <Typography variant="body2">{`#${currentUser.ID}`}</Typography>
              <Typography variant="body2">{currentUser.title}</Typography>
            </Box>
            <Box>
              <Typography variant="h6" className="header-title">
                {currentUser.name}
              </Typography>
              <Typography variant="body2">{currentUser.department}</Typography>
            </Box>
            <Avatar
              src={currentUser.profilePicture}
              alt={currentUser.name}
              style={{ cursor: "pointer" }}
              onClick={() => (window.location = "/profile")}
            />
          </Box>
        </header>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                searchQuery={searchQuery}
                searchType={searchType}
                currentUser={currentUser}
              />
            }
          />
          <Route
            path="/profile"
            element={<Profile currentUser={currentUser} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
