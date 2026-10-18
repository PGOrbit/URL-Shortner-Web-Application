import express from "express";
import { nanoid } from "nanoid";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/", express.static("public"));

app.use(cors());

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
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
  try {
    const longUrl = req.body?.longUrl;

    if (!longUrl) {
      return res.status(400).json({
        error: "Please enter a URL",
      });
    }

    const shortCode = nanoid(6);

    const url = new Url({
      shortCode: shortCode,
      longUrl: longUrl,
    });

    await url.save();

    const shortUrl = `${req.protocol}://${req.get("host")}/url/${shortCode}`;

    return res.status(201).json({
      shortUrl: shortUrl,
    });
  } catch (error) {
    console.error("SHORTEN ROUTE ERROR:", error);

    return res.status(500).json({
      error: "URL shortening failed",
      details: error.message,
    });
  }
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

export default app;
