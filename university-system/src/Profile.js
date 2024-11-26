import React from "react";
import { Box, Typography, Avatar } from "@mui/material";

const Profile = ({ currentUser }) => {
  return (

    <div className="app-container">
    <header className="header">
        <Typography variant="h4" className="header-title" onClick={() => (window.location = "/")}>
          TOBB Media
        </Typography>
        
        <Box display="flex" alignItems="center" gap={2}>
          <Box>
            <Typography variant="body2">{`#${currentUser.id}`}</Typography>
            <Typography variant="body2">{currentUser.role}</Typography>
          </Box>
          <Box>
            <Typography variant="h6" className="header-title">
              {currentUser.username}
            </Typography>
            <Typography variant="body2">{currentUser.department}</Typography>
          </Box>
          <Avatar
            src={currentUser.profile_photo_path}
            alt={currentUser.username}
            style={{ cursor: "pointer" }}
            onClick={() => (window.location = "/profile")}
          />
        </Box>
      </header>

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
    </Box>
    </div>
  );
};

export default Profile;
