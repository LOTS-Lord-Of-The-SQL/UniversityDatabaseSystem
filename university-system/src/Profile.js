import React from "react";
import { Avatar, Typography, Box } from "@mui/material";

const Profile = ({ user }) => {
  return (
    <Box className="profile-container" textAlign="center" padding={4}>
      <Avatar src={user.profilePicture} alt={user.name} style={{ width: 100, height: 100, margin: "0 auto" }} />
      <Typography variant="h5">{user.name}</Typography>
      <Typography variant="body1">{user.title}</Typography>
      <Typography variant="body2" color="textSecondary">
        ID: {user.ID}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Department: {user.department}
      </Typography>
    </Box>
  );
};

export default Profile;
