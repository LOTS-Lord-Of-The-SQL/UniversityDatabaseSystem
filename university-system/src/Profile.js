import React from "react";
import { Box, Typography, Avatar } from "@mui/material";

const Profile = ({ currentUser }) => {
  return (
    <Box padding={3} display="flex" flexDirection="column" alignItems="center">
      <Avatar
        src={currentUser.profilePicture}
        alt={currentUser.name}
        style={{ width: 120, height: 120 }}
      />
      <Typography variant="h5" marginTop={2}>
        {currentUser.name}
      </Typography>
      <Typography variant="body1">{`ID: ${currentUser.ID}`}</Typography>
      <Typography variant="body2">{currentUser.title}</Typography>
      <Typography variant="body2">{currentUser.department}</Typography>
    </Box>
  );
};

export default Profile;
