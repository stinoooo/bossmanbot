const mongoose = require('mongoose');

// Define schema for fun facts
const factSchema = new mongoose.Schema({
  factId: { type: Number, required: true },
  fact: { type: String, required: true },
  sentAt: { type: Date, default: null },  // Timestamp when the fact is sent
  addedAt: { type: Date, default: Date.now },  // Timestamp when the fact is added
  sent: { type: Boolean, default: false }  // Indicates if the fact has been sent
});

// Counter schema for auto-incrementing factId
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

// Models
const Fact = mongoose.model('Fact', factSchema);
const Counter = mongoose.model('Counter', counterSchema);

// Function to get the next factId
async function getNextFactId() {
  const counter = await Counter.findByIdAndUpdate(
    { _id: 'factId' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }  // Create counter if it doesn't exist
  );
  return counter.seq;
}

// Function to connect to MongoDB
async function connectDB(mongoURI) {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);  // Exit the process with an error code
  }
}

// Export everything
module.exports = { Fact, getNextFactId, connectDB };