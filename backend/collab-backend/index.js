
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Document = require("./Document");
const roomSchema = require("./roomSchema");
const { Mutex } = require("async-mutex");
const axios = require("axios");

const collabRouter = require('./routes/collabRouter')
dotenv.config({
    path: ".env.local"
})
const DEFAULT_DOCUMENT_DATA = ""
const PORT = process.env.PORT ? process.env.PORT : 9000
const FRONTEND_HOST = process.env.FRONTEND_HOST ? process.env.FRONTEND_HOST : "http://localhost:3000"
const QUESTION_HOST = process.env.QUESTION_HOST ? process.env.QUESTION_HOST : "http://localhost:8000/api/questions"
const MONGODB_URI = process.env.MONGODB_URI ? process.env.MONGODB_URI : "mongodb://localhost/document_db"


mongoose.connect(MONGODB_URI)

const app = express()
const server = require("http").createServer(app)
app.use(cors())
app.use(express.json())
const io = require("socket.io")(server, {
    cors: {
      origin: FRONTEND_HOST,
      methods: ["GET", "POST"]
    }
})
server.listen(PORT, () => {
    console.log(`Collab service connected on port ${PORT}`);
});


app.use("/api/collab", collabRouter)
app.use("/", (req, res) => res.status(200).json({status: "OK"}))

io.on("connection", socket => {
    console.log("member joined")
    socket.on('get-document', async documentID => {
        // Upon connecting, grab latest copy of document w/ ID, and join channel w/ ID
        const document = await findOrCreateDocument(documentID)
        socket.join(documentID)
        socket.emit("load-document", document.data)

    // Proprogate changes from users to other users in the same channel
    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentID).emit("recieve-changes", delta);
    });

    // Save document into MongoDB
    socket.on("save-document", async (data) => {
      await Document.findByIdAndUpdate(documentID, { data });
      findOrCreateDocument(documentID);
    });
  });

  // Join the question room
  socket.on("join-question-room", (roomId) => {
    console.log("join-question-room")
    const questionRoomId = `question_${roomId}`;
    socket.join(questionRoomId);
  });

  // Request questions for the room
  
  socket.on("request-questions", async (data) => {
    const {roomId, complexity} =  data
    const questionRoomId = `question_${roomId}`;
    const newQuestion = await findOrFetchNewQuestion(questionRoomId, complexity);
    io.to(questionRoomId).emit("receive-questions", newQuestion);
  });

  socket.on("request-new-questions", async (data) => {
    const {roomId, complexity} =  data
    const questionRoomId = `question_${roomId}`;
    
    const newQuestion = await fetchQuestionByComplexity(complexity)
    console.log("getnewqsn time")
    console.log(newQuestion)
    const foo = await roomSchema.findByIdAndUpdate(questionRoomId, {question : newQuestion});
    console.log(foo)
    io.to(questionRoomId).emit("receive-questions", newQuestion);
  });
});

async function fetchQuestionByComplexity(complexity) {
  try {
    const response = await axios.get(`${QUESTION_HOST}/${complexity}`, {});
    return response.data;
  } catch (error) {
    console.error("Error fetching question:", error);
    return null;
  }
}
const question_mutex = new Mutex();

async function findOrFetchNewQuestion(id, complexity) {
  if (id == null) return;

  const release = await question_mutex.acquire();
  let question = null;
  try {
    question = await roomSchema.findById(id);

    // if document is null, aka isn't in the DB
    if (!question) {
      question = await fetchQuestionByComplexity(complexity)
      question = await roomSchema.create({
        _id: id,
        question: await fetchQuestionByComplexity(complexity),
      });
    }
  } finally {
    release();
  }
  return question;
}

const add_to_db_mutex = new Mutex()

async function findOrCreateDocument(id) {
    if (id == null) return

    const release = await add_to_db_mutex.acquire();
    var document = null
    try {
        document = await Document.findById(id)

    // Handle document is not in the DB
    if (!document) {
      document = await Document.create({
        _id: id,
        data: DEFAULT_DOCUMENT_DATA,
      });
    }
  } finally {
    release();
  }
  return document;
}
