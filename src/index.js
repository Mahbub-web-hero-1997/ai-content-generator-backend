import dotenv from "dotenv";
import connectDB from "./db/connectionDb.js";
import app from "./app.js";

dotenv.config();

const port = process.env.PORT;
connectDB()
  .then(() => {
    const port = process.env.PORT || 5000;

    app.listen(port, () => `Server running on port ${port}`);
  })
  .catch((err) => {
    console.error("Error connecting to the database", err);
  });
