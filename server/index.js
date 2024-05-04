const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors({ origin: [""], methods: ["POST", "GET"], credentials: true }));

// Connect to MongoDB
/* mongoose
  .connect("mongodb://localhost:27017/crm")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));
 */
// Routes
app.use("/api", require("./routes/api"));

app.get("/", (req, res) => {
  res.json("Hello");
});
// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
