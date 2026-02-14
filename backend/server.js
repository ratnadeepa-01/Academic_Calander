import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import calendarRoutes from "./routes/calendarRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dbConnect from "./config/db.js";

dotenv.config();
dbConnect();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/calendar", calendarRoutes);
app.use("/api/activity", activityRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get("/", (req, res) => {
  res.send("Academic Smart Calendar API Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
