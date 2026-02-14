import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import calendarRoutes from "./routes/calendarRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api/calendar", calendarRoutes);
app.use("/api/activity", activityRoutes);

app.get("/", (req, res) => {
  res.send("Academic Smart Calendar API Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
