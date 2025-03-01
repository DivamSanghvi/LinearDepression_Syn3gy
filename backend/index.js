require('dotenv').config();
require('express-async-errors');
const authRouter = require('./routes/auth');
// extra security packages
const cors = require('cors');

const authenticator = require("./middleware/authentication");
const express = require('express');
const app = express();
// connectDB
const connectDB = require('./db/connect');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// middleware
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('FSD 5');
});

app.use('/api/auth', authRouter);

// error handling middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 8000;

const start = async () => {
  try {
    // Connect to the database
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.error(error);
  }
};

start();
