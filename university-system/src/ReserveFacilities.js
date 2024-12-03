import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Sayfa yönlendirme için
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton, Card, CardContent, CardActions, Grid
} from "@mui/material";
import { UserContext } from "./UserContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const ReserveFacilities = () => {
  const [facility, setFacilities] = useState([]);
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const listFacilities = async () => {
      try {
										 
        const response = await axios.get("http://127.0.0.1:8000/list-facilities");
		  
		  
        setFacilities(response.data.data);
																	   
      } catch (error) {
        console.error("Failed to fetch facilities:", error);
      }
    };

    listFacilities();
  }, [currentUser]);

	

  return (
    <Box>
        <AppBar position="sticky" color="primary" className="header">
        <Toolbar>
        <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            TOBB ETU
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Facility List */}
<Box p={3}>
  {/* Header for Reserve in a Facility */}
  <Card
    sx={{
      backgroundColor: "#f9f9f9", // Light background for the header
      boxShadow: 2, // Small shadow
      borderRadius: 2,
      padding: 1, // Padding around the content
      width: '100%', // Full width
      maxWidth: '350px', // Max width for the header card
      margin: "0 auto", // Center the header card horizontally
    }}
  >
    <CardContent>
      <Typography
        variant="h6"
        align="center"
        sx={{
          fontWeight: "bold",
          fontSize: '1.3rem', // Slightly larger font size
          color: "#1C2833", // Dark text color
        }}
        gutterBottom
      >
        Reserve in a Facility
      </Typography>
    </CardContent>
  </Card>

  {/* Displaying Facility Cards */}
  {facility.length === 0 ? (
    <Typography variant="body1" align="center" sx={{ marginTop: 3 }}>
      No facilities available to reserve.
    </Typography>
  ) : (
    <Grid container spacing={3} justifyContent="center" sx={{ marginTop: 3 }}>
      {facility.map((facilityItem) => (
        <Grid item xs={12} sm={6} md={4} key={facilityItem.facilities_id}>
          <Card
            sx={{
              maxWidth: 345,
              boxShadow: 3,
              borderRadius: 2,
              ":hover": { boxShadow: 6 }, // Hover effect
              backgroundColor: "#f9f9f9", // Card background color
              margin: "0 auto", // Center the cards
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                align="center"
                sx={{
                  fontWeight: "bold",
                  color: "#1C2833", // Dark text color
                  fontSize: "1.3rem", // Font size for the facility type
                }}
                gutterBottom
              >
                {facilityItem.type}
              </Typography>
              <Typography
                variant="body2"
                align="center"
                color="textSecondary"
                sx={{
                  fontSize: "1rem", // Font size for the facility ID
                  fontFamily: "'Roboto', sans-serif", // Consistent font family
                }}
                gutterBottom
              >
                Facility ID: {facilityItem.facilities_id}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                fullWidth
                endIcon={<ArrowForwardIosIcon />}
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  backgroundColor: "#1C2833", // Button background color
                  ":hover": { backgroundColor: "#566573" }, // Hover state color
                }}
                onClick={() => navigate(`/reservefacility/${facilityItem.facilities_id}`)} // Reserve action
              >
                Explore
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

export default ReserveFacilities;

     
