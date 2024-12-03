import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Alert,
  Collapse,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GroupIcon from "@mui/icons-material/Group";

import { UserContext } from "./UserContext";

const EnrollCommunity = () => {
  const [community, setCommunity] = useState([]);
  const [alert, setAlert] = useState({ type: "", message: "", open: false });
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const listCommunity = async () => {
      try {
										  
        const response = await axios.post("http://127.0.0.1:8000/list-communities", {
		   
          user_id: currentUser.id,
        });
		  

        setCommunity(response.data.non_joined_communities);
      } catch (error) {
        console.error("Failed to fetch communities:", error);
        setAlert({
          type: "error",
          message: "Failed to fetch communities. Please try again.",
          open: true,
        });
      }
    };

    listCommunity();
  }, [currentUser]);

  const enrollCommunity = async (communityId) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/join-community", {
        user_id: currentUser.id,
        community_id: communityId,
      });

      if (response.status === 200) {
																			  
        setCommunity((prevCommunity) =>
          prevCommunity.filter((community) => community.community_id !== communityId)
        );
        setAlert({
          type: "success",
          message: "Successfully enrolled in the community!",
          open: true,
        });

        setTimeout(() => setAlert({ open: false }), 3000); // Alert'i 3 saniye sonra kapat
      }
    } catch (error) {
      console.error("Failed to enroll community:", error);
      setAlert({
        type: "error",
        message: "Failed to enroll in the community. Please try again.",
        open: true,
      });
    }
  };

  return (
    <Box>
      {/* Üst Bar */}
      <AppBar position="sticky" color="primary" className="header">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Join in a Community
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Alert Mesajı */}
      <Collapse in={alert.open}>
        <Alert
          severity={alert.type}
          onClose={() => setAlert({ open: false })}
          sx={{ margin: 2 }}
        >
          {alert.message}
        </Alert>
      </Collapse>

      {/* Community List */}
<Box p={3}>
  {/* Header Card for Available Communities */}
  <Card
    sx={{
      backgroundColor: "#f9f9f9", // Light background
      boxShadow: 2, // Small shadow
      borderRadius: 2,
      padding: 1, // Some padding for aesthetics
      width: '100%', // Ensure it stretches to full width
      maxWidth: '350px', // Set max width
      margin: "0 auto", // Center it horizontally
    }}
  >
    <CardContent>
      <Typography
        variant="h6"
        align="center"
        sx={{
          fontWeight: "bold",
          fontSize: '1.3rem', // Slightly bigger font size
          color: "#1C2833", // Dark text color
        }}
        gutterBottom
      >
        Available Communities
      </Typography>
    </CardContent>
  </Card>

  {/* Displaying Community Cards */}
  {community.length === 0 ? (
    <Typography variant="body1" align="center" sx={{ marginTop: 3 }}>
      No communities available to enroll.
    </Typography>
  ) : (
    <Grid container spacing={3} justifyContent="center" sx={{ marginTop: 3 }}>
      {community.map((communityItem) => (
        <Grid item xs={12} sm={6} md={4} key={communityItem.community_id}>
          <Card
            sx={{
              maxWidth: 345,
              boxShadow: 3,
              borderRadius: 2,
              ":hover": { boxShadow: 6 }, // Hover effect
              backgroundColor: "#f9f9f9", // Light background for the card
              margin: "0 auto", // Centering the cards
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                align="center"
                sx={{
                  fontWeight: "bold",
                  color: "#1C2833", // Dark text color
                  fontSize: "1.3rem", // Font size for the course name
                }}
                gutterBottom
              >
                {communityItem.community_name}
              </Typography>
              <Typography
                variant="body2"
                align="center"
                color="textSecondary"
                sx={{
                  fontSize: "1rem", // Font size for the code
                  fontFamily: "'Roboto', sans-serif", // Font family
                }}
                gutterBottom
              >
                Code: {communityItem.community_code}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                fullWidth
                endIcon={<GroupIcon />}
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  backgroundColor: "#1C2833", // Button background
                  ":hover": { backgroundColor: "#566573" }, // Hover state
                }}
                onClick={() => enrollCommunity(communityItem.community_id)} // Join function
              >
                Join
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  )}
</Box>

    </Box>
  );
};

export default EnrollCommunity;
