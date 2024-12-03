import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Button,
  Grid,
  Alert,
  Collapse,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { UserContext } from "./UserContext";

const Library = () => {
  const [rooms, setRooms] = useState([]);
  const [alert, setAlert] = useState({ type: "", message: "", open: false });
  const { facility_id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.post("http://127.0.0.1:8000/list-activity-areas", {
          facilities_id: facility_id,
          user_id: currentUser.id,
        });
        setRooms(response.data);
      } catch (error) {
        console.error("Failed to fetch library rooms:", error);
        setAlert({ type: "error", message: "Failed to fetch rooms. Please try again.", open: true });
      }
    };

    fetchRooms();
  }, [facility_id]);

  const reserveRoom = async (room_id) => {
    try {
      await axios.post("http://127.0.0.1:8000/reserve-activity-area", {
        activity_area_id: room_id,
        user_id: currentUser.id,
      });

      setRooms((prevRooms) => prevRooms.filter((room) => room.room_id !== room_id));
      setAlert({ type: "success", message: "Room reserved successfully!", open: true });

      setTimeout(() => setAlert({ open: false }), 3000); // Alert'i 3 saniye sonra kapat
    } catch (error) {
      console.error("Failed to reserve room:", error);
      setAlert({ type: "error", message: "Failed to reserve the room. Please try again.", open: true });
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
            {facility_id === "4"
              ? "Library"
              : facility_id === "6"
              ? "Match Area"
              : "Music Room"}
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

      {/* Odalar */}
      <Box sx={{ padding: 3 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Available Rooms in{" "}
          {facility_id === "4"
            ? "Library"
            : facility_id === "6"
            ? "Match Area"
            : "Music Room"}
        </Typography>
        {rooms.length === 0 ? (
          <Typography variant="h6" align="center" color="textSecondary">
            No available rooms in the library.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {rooms.map((room) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={room.room_id}>
                <Card sx={{ maxWidth: 345, boxShadow: 3 }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={`https://via.placeholder.com/300x140.png?text=Room+${room.room_id}`}
                    alt={`Room ${room.room_name}`}
                  />
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {room.room_name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Capacity: {room.capacity}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      variant="contained"
                      fullWidth
                      onClick={() => reserveRoom(room.room_id)}
                    >
                      Reserve
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

export default Library;
