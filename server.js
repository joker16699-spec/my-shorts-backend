import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from my-shorts-backend!");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
