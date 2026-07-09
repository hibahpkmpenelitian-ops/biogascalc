const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { syncDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    message: 'BiogasCalc API is running',
    version: '1.0.0',
  });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/domes', require('./routes/domeRoutes'));
app.use('/api/example', require('./routes/exampleRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

syncDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\nServer running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`   http://localhost:${PORT}\n`);
  });
});
