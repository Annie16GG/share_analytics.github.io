// server/app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');  // Importa CORS
const authRoutes = require('./routes/authRoutes');
const formRoutes = require('./routes/formRoutes');
const permissionRoutes = require('./routes/permissionRoutes');
const boldbiRoutes = require('./routes/boldbiRoutes');
const dashboardsRoutes = require('./routes/dashboardsRoutes');
const groupesRoutes = require('./routes/groupsRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const path = require('path');
const morgan = require('morgan');
const app = express();
const PORT = process.env.PORT || 3000;

// Configura CORS
const corsOptions = {
  origin: 'https://share-analytics.vercel.app',  // Tu dominio en Vercel
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use(morgan('dev'));
app.use('/api', formRoutes);
app.use('/api/perm', permissionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupesRoutes);
app.use('/api/dash', dashboardsRoutes);
app.use('/api/category', categoryRoutes);

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, '..', '..', 'public')));

// Handle requests to the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
