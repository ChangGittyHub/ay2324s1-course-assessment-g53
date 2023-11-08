import React, { useState, useEffect } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import TextEditor from "../components/TextEditor";
import DividerIcon from "@mui/icons-material/DragHandle";
import CodeExecutionComponent from "../components/CodeExecutionComponent";
import VideoCall from "../components/VideoCall";
import SaveSolutionButton from "../components/SaveSolutionButton";
import { useParams, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import {Button} from "@mui/material";
import ExitButton from "../components/ExitButton"


const Room = () => {
  const [dividerPosition, setDividerPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [question, setQuestion] = useState(null);
  const [userCode, setUserCode] = useState(null);
  const { id : roomId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const difficulty = queryParams.get("difficulty");
  const COLLAB_HOST = process.env.REACT_APP_COLLAB_HOST
    ? process.env.REACT_APP_COLLAB_HOST
    : "http://localhost:9000";
  const socket = io(COLLAB_HOST);
  const handleClick = () => {
    socket.emit("request-new-questions", {
      roomId: roomId,
      complexity: difficulty,
    });
  };

  const handleDividerDrag = (e) => {
    const newDividerPosition = Math.max(
      20,
      Math.min((e.clientX / window.innerWidth) * 100, 80)
    ); // Limiting the movement between 20% and 80%
    setDividerPosition(newDividerPosition);
  };

  const handleReceiveQuestions = (data) => {
    console.log("handlereceived reached");
    setQuestion(data.question);
  };

  const requestAndReceiveQuestions = () => {
    // Emit event to join the room
    socket.emit("join-question-room", roomId);
    console.log(roomId)

    // Emit event to request questions
    socket.emit("request-questions", {
      roomId: roomId,
      complexity: difficulty,
    });

    // Listen for the response with the question data
    socket.on("receive-questions", handleReceiveQuestions);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false)

    if (isDragging) {
      document.addEventListener('mousemove', handleDividerDrag)
      document.addEventListener('mouseup', handleMouseUp)
    }

    if (!question) {
      requestAndReceiveQuestions();
    }

    return () => {
      document.removeEventListener("mousemove", handleDividerDrag);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleDividerDrag, roomId, difficulty, question]);

  return (
    <Grid container spacing={3} style={{ position: 'relative', overflow: 'hidden' }}>

      {/* Problem Description Section */}
      <Grid item style={{ flex: `0 0 ${dividerPosition}%`, position: 'relative'}}>
        <Paper elevation={3} style={{ padding: '16px', height: '70%', display: 'flex', flexDirection: 'column'}}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <Typography variant="h5">Problem Title</Typography>
            <Typography variant="h5">
              {/* Rendering the title directly */}
              {question?.title}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Difficulty: {difficulty}
            </Typography>
            <Typography variant="body1" paragraph>
            {question?.description}
            </Typography>
            </div>
          <Button variant="contained" color="primary" sx={{ width: "150px", height: "50px"}} onClick={handleClick}>
              New Question
          </Button>

        </Paper>

        <Paper style={{ margin:"10px", height: "30%"}}>
          <VideoCall/>
        </Paper>
          
      </Grid>

      {/* Divider */}
      <div
        style={{
          width: '2px',
          background: '#ccc',
          cursor: 'col-resize',
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `calc(${dividerPosition}% - 1px)`,
          display: 'flex',
          alignItems: 'center',
          zIndex: 1,
        }}
        onMouseDown={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
      >
        <DividerIcon style={{ fontSize: '16px', color: '#666' }} />
      </div>

      {/* Playground and Submit Section */}
      <Grid item style={{ flex: `0 0 ${100 - dividerPosition}%` , maxWidth: `${100 - dividerPosition}%`}}>
        <Paper elevation={3} style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>

          {/* Playground */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', overflowX: 'auto', whiteSpace: 'pre-wrap', wordWrap: 'break-word', maxHeight: 'calc(100vh - 64px - 68px)' }}>
            <Typography variant="h6">Playground</Typography>
            <TextEditor setUserCode={setUserCode}/>
          </div>

          {/* Submit Section */}
          <Paper elevation={3} style={{ padding: '16px' }}>
            <CodeExecutionComponent userCode={userCode}/>

            

          </Paper>
          <Paper style={{ display: 'flex', justifyContent: 'space-between' }}>
            <ExitButton/>
            <SaveSolutionButton userCode={userCode} question={question}/>
          </Paper>
        </Paper>
      </Grid>

    </Grid>
  )
}

export default Room
