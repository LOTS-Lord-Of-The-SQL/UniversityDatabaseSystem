import React from "react";
import {
  Avatar,
  AppBar,
  Toolbar,
  Typography,
  Box
} from "@mui/material";
import "./Home.css";
import { useContext} from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import { SelectedContext } from "./SelectedContext";

const Profile = () => {
  const navigate = useNavigate();
  const { selectedCourse, setSelectedCourse } = useContext(SelectedContext);
  const { currentUser } = useContext(UserContext);

  //Yakinda degisecek
  const courses = ["Bil 372","Yap 470"];
  //Yakinda degisecek

  const openCoursePage = (course) => {
    setSelectedCourse(course);
    navigate("/home");
  };

  console.log("Profile currentUser:", currentUser);

  return (

    <div className="app-container">
      <AppBar position="sticky" color="primary" className="header">
        <Toolbar>
          <Typography
            variant="h6"
            className="header-title"
            onClick={() =>
              openCoursePage(null)}
          >
            TOBB Media
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Box>
              <Typography variant="body2">{currentUser.username}</Typography>
              <Typography variant="body2">{`#${currentUser.id}`}</Typography>
            </Box>
            <Box>
              <Typography variant="body2">{currentUser.role}</Typography>
              <Typography variant="body2">{`#${currentUser.department}`}</Typography>
            </Box>
            <Avatar
              src={currentUser.profilePicture}
              alt={currentUser.username}
              style={{ cursor: "pointer" }}
              onClick={() => (window.location = "/profile")}
            />
          </Box>
        </Toolbar>
      </AppBar>

      <Box padding={3} display="flex" flexDirection="column" alignItems="center">
        <Avatar
          src={currentUser.profile_photo_path}
          alt={currentUser.username}
          style={{ width: 120, height: 120 }}
        />
        <Typography variant="h5" marginTop={2}>
          {currentUser.username}
        </Typography>
        <Typography variant="body1">{`ID: ${currentUser.id}`}</Typography>
        <Typography variant="body2">{currentUser.role}</Typography>
        <Typography variant="body2">{currentUser.department}</Typography>
        <ul>
        {courses.map((course, index) => (
          <li onClick={() =>
            openCoursePage(course)} key={index}>{course}</li>
        ))}
      </ul>
      </Box>
    </div>
  );
};

export default Profile;