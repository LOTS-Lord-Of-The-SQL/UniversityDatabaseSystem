import React, { useState } from "react";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Typography,
  Modal,
  Box,
  Fab,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add"; // "+" icon
import PersonIcon from "@mui/icons-material/Person"; // Person icon for profile picture
import "./App.css";

const App = () => {
  const [posts, setPosts] = useState([]); // List of posts
  const [content, setContent] = useState(""); // Content of the new post
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility

  // Add a new post
  const addPost = () => {
    if (content.trim() === "") return; // Prevent empty content
    const newPost = {
      id: posts.length + 1,
      author: "Lord of the SQL",
      avatar: <PersonIcon />, // Default profile icon
      description: "Best Team of All",
      content,
    };
    setPosts([newPost, ...posts]);
    setContent("");
    setIsModalOpen(false);
  };

  return (
    <div className="app-container">
      {/* Fixed Header Section */}
      <header className="header">
        <Typography variant="h4" className="header-title">
          TOBB Media
        </Typography>
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setIsModalOpen(true)}
          className="header-button"
        >
          <AddIcon />
        </Fab>
      </header>

      {/* Scrollable Posts Section */}
      <div className="post-container">
        {posts.length === 0 ? (
          <Typography color="text.secondary" textAlign="center">
            No posts yet.
          </Typography>
        ) : (
          posts.map((post) => (
            <Card key={post.id} variant="outlined" className="post-card">
              <CardHeader
                avatar={<Avatar>{post.avatar}</Avatar>} // Use the Person icon as avatar
                title={post.author}
                subheader={post.description}
              />
              <CardContent>
                <Typography>{post.content}</Typography>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal for Post Creation */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="create-post-modal"
        aria-describedby="create-post-modal-description"
      >
        <Box className="modal-box">
          <Typography variant="h6" marginBottom={2}>
            Create a Post
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Box className="modal-actions">
            <button className="submit-button" onClick={addPost}>
              Post
            </button>
            <button
              className="cancel-button"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default App;
