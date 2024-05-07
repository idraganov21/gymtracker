const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();
const port = 3000;

// Replace with your actual MongoDB Atlas URI
const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB using Mongoose
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Connection error', err));

// Middleware to parse incoming JSON data
app.use(express.json());


app.use(cors());


const workoutSchema = new mongoose.Schema({
  day: { type: String, required: true },
  exercises: [
    {
      name: String,
      weight: Number, // kg used
      reps: Number // repetitions
    }
  ]
});

const Workout = mongoose.model('Workout', workoutSchema);

// Basic route to test the server
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Authentication routes (login)
app.use('/api', authRoutes);

// Create a new workout
app.post('/api/workouts', async (req, res) => {
  console.log('Received request data:', req.body);

  try {
    const newWorkout = new Workout(req.body);
    const savedWorkout = await newWorkout.save();
    res.status(201).json(savedWorkout);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Retrieve all workouts, or filter by day if provided
app.get('/api/workouts', async (req, res) => {
  const dayFilter = req.query.day;

  try {
    const query = dayFilter ? { day: dayFilter } : {};
    const workouts = await Workout.find(query);
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.delete('/api/workouts/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const deletedWorkout = await Workout.findByIdAndDelete(id);
      if (!deletedWorkout) {
        return res.status(404).json({ error: 'Workout not found' });
      }
      res.json({ message: 'Workout deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});




