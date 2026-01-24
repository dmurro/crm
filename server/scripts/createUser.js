require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const config = require("../config");
const User = require("../models/users");

async function createUser() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash("password", 10);

    // Create a new user document
    const user = new User({
      username: "test",
      password: hashedPassword,
    });

    // Save the user document to the database
    await user.save();

    console.log("Test user created successfully!");
    console.log("Username: test");
    console.log("Password: password");
  } catch (error) {
    if (error.code === 11000) {
      console.log("User 'test' already exists");
    } else {
      console.error("Error creating test user:", error);
    }
  } finally {
    // Close the MongoDB connection
    mongoose.disconnect();
  }
}

// Connect to MongoDB using config
mongoose
  .connect(config.mongodbUri)
  .then(() => {
    console.log(`Connected to MongoDB (${config.env} environment)`);
    // Call the function to create the test user
    createUser();
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });
