require('dotenv').config();
require('express-async-errors');
const express = require('express');
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const connectDB = require('./db/connect');
const auth = require('./middleware/authentication');
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')


const app = express();


//no. of requests a user can make within a specific time window
app.use(rateLimiter({
  windowMs : 15 * 60 * 1000, // in milliseconds
  max : 100
}))
app.use(express.json());
app.use(helmet())
app.use(cors())
app.use(xss())
// extra packages

// routes
app.get('/', (req, res) => {
  res.send('Jobs Api')
})
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', auth, jobsRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
