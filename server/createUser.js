const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./models/users'); // Assuming you have a User model defined

async function createUser() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('password', 10);

    // Create a new user document
    const user = new User({
      username: 'test',
      password: hashedPassword
    });

    // Save the user document to the database
    await user.save();

    console.log('Test user created successfully!');
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.disconnect();
  }
}

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/crm', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  // Call the function to create the test user
  createUser();
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});
