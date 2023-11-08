import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import axios from "axios";
import useCookie from "../components/useCookie";
import { CopyToClipboard } from 'react-copy-to-clipboard';

const HISTORY_HOST =
  process.env.REACT_APP_HISTORY_HOST || "http://localhost:5000/api/history";

function QuestionHistoryPage() {
  const [history, setHistory] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getAuthCookie } = useCookie();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = getAuthCookie();
        const tokenBody = token.split(".")[1];
        const buffer = JSON.parse(atob(tokenBody));
        const user_id = buffer.user_data.user_id;

        const response = await axios.get(
          `${HISTORY_HOST}/questions/${user_id}`
        );
        setHistory(response.data.reverse());
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    fetchHistory();
  }, [getAuthCookie]);

  const handleOpenModal = (question) => {
    setSelectedQuestion(question);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  fontSize: "1.25rem",
                }}
              >
                Title
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontWeight: "bold",
                  fontSize: "1.25rem",
                }}
              >
                Complexity
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontWeight: "bold",
                  fontSize: "1.25rem",
                }}
              >
                Categories
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontWeight: "bold",
                  fontSize: "1.25rem",
                }}
              >
                Last Attempt
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontWeight: "bold",
                  fontSize: "1.25rem",
                }}
              >
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((question) => (
              <TableRow
                key={question._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {question.question_title}
                </TableCell>
                <TableCell align="right">{question.complexity}</TableCell>
                <TableCell align="right">
                  {question.categories.join(", ")}
                </TableCell>
                <TableCell align="right">
                  {new Date(question.last_attempt).toLocaleString()}
                </TableCell>
                <TableCell align="right">
                  <Button onClick={() => handleOpenModal(question)}>
                    View Attempt
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "auto",
            maxWidth: "80vw",
            maxHeight: "80vh", // Prevent the modal from being too tall
            overflow: "auto", // Allow scrolling within the modal
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "row",
          }}
        >
          {/* Description Column */}
          <Box
            sx={{
              flex: 1,
              pr: 2,
              maxHeight: "70vh", // Set a max height for scrolling
              overflowY: "auto", // Allow vertical scrolling
            }}
          >
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {selectedQuestion?.question_description}
            </Typography>
          </Box>

          {/* Vertical Separator */}
          <Box
            sx={{
              width: "1px",
              bgcolor: "grey.500",
              opacity: 0.5,
              mx: 2,
              alignSelf: "stretch",
            }}
          />

          {/* Code Column */}
          <Box
            sx={{
              flex: 1,
              pl: 2,
              maxHeight: "70vh", // Set a max height for scrolling
              overflow: "auto", // Allow scrolling
            }}
          >
            <Typography
              component="pre"
              sx={{
                fontFamily: "monospace",
                whiteSpace: "pre-wrap", // Wrap long lines of code
                wordBreak: "break-word", // Break long words
              }}
            >
              {selectedQuestion?.attempt}
            </Typography>
            {/* Copy to Clipboard Button */}
            <CopyToClipboard text={selectedQuestion?.attempt}>
              <Button variant="contained" sx={{ mt: 2 }}>
                Copy Code
              </Button>
            </CopyToClipboard>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default QuestionHistoryPage;
