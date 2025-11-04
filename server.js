import express from "express";
import cors from "cors";
import patternRouter from "./pattern.js";
import generateRouter from "./generate.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from my-shorts-backend!");
});

app.use("/pattern", patternRouter);
app.use("/generate", generateRouter);

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
