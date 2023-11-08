const mongoose = require("mongoose")
const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")

const historyRouter = require('./routes/historyRouter')
dotenv.config({
    path: ".env.local"
})

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json());
const uri = process.env.MONGODB_URI;
mongoose.connect(uri);

app.use("/api/history", historyRouter)
app.use("/", (req, res) => res.status(200).json({status: "OK"}))

app.listen(PORT, () => {
  console.log(`Question history service connected on port ${PORT}`);
});