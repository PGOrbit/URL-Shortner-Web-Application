import express from "express";
import { nanoid } from "nanoid";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 1234;

app.use(express.json());

app.use("/", express.static("public"));

app.use(cors());

function connectDB() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected Successfully"));
}
connectDB();

// const urls = new Map();

// app.get("/", (req, res) => {
//   res.send("Hello From the Server");
// });

const schema = mongoose.Schema({
  shortCode: String,
  longUrl: String,
});

const Url = mongoose.model("urlims", schema);

app.post("/shorten", async (req, res) => {
  const body = req.body;
  const longUrl = body.longUrl;
  const shortCode = nanoid(6);
  const url = new Url({
    shortCode: shortCode,
    longUrl: longUrl,
  });
  await url.save();
  // urls.set(shortCode, longUrl);
  const shortUrl = `http://localhost:1234/url/${shortCode}`;
  res.status(201).json({
    shortUrl: shortUrl,
  });
});

app.get("/url/:code", async (req, res) => {
  const shortCode = req.params.code;
  // const longUrl = urls.get(shortCode);
  const doc = await Url.findOne({ shortCode: shortCode });
  const longUrl = doc.longUrl;
  if (!longUrl) {
    return res.status(404).json({
      msg: "Not Found",
    });
  }

  return res.status(302).redirect(longUrl);
});

app.listen(port, () => {
  console.log(`App is Running om Port ${port}`);
});
