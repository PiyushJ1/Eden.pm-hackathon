import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
const app = express();
const PORT = 4000;

app.use(express.json());
dotenv.config();

mongoose
  .connect(`${process.env.MONGODB_CONNECTION_URL}`)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const schema = new mongoose.Schema({
  sessionId: String,
  userId: String,
  startTime: Number,
  endTime: Number,
  filePath: String,
  processed: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const sessionModel = mongoose.model("Session", schema);

// session interface
interface Session {
  sessionId: string;
  userId: string;
  startTime: number;
  endTime: number;
  filePath: string;
}

function simulateFfmpegProcessing(filePath: String): void {
  // process media here
}

app.post("/logsession", async (req: Request, res: Response) => {
  try {
    const session = req.body as Session;

    if (!session?.sessionId || !session?.userId || !session?.filePath) {
      return res.status(400).json({ message: "Could not get session info" });
    }

    simulateFfmpegProcessing(session.filePath);

    const newSession = new sessionModel({
      sessionId: session.sessionId,
      userId: session.userId,
      startTime: session.startTime,
      endTime: session.endTime,
      filePath: session.filePath,
      processed: true,
    });

    // save to focus session info to mongodb
    await newSession.save();

    res.status(201).json({ message: "Saved focus session successfully" });
  } catch (err) {
    console.log("Error saving focus session:", err);
    res
      .status(500)
      .json({ message: "Internal server error trying to save focus session" });
  }
});

//
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
