// server/app.js
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const formRoutes = require('./routes/formRoutes');
const permissionRoutes = require('./routes/permissionRoutes');
const boldbiRoutes = require('./routes/boldbiRoutes');
const dashboardsRoutes = require('./routes/dashboardsRoutes');
const groupesRoutes = require('./routes/groupsRoutes');
const viajesRoutes = require('./routes/viajesRoutes');
const tareas_ACPRoutes = require('./routes/tareas_ACPRoutes');
const estudiantesRoutes = require('./routes/estudiantesRoutes');
const agileRoutes = require('./routes/agileRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const latbcRoutes = require('./routes/clientesLatRoutes');



const path = require('path');
const morgan = require('morgan');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use(morgan('dev'));
app.use('/api', formRoutes);
app.use('/api/perm', permissionRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/groups', groupesRoutes)
// app.use('/api/dashboards', boldbiRoutes)
app.use('/api/dash', dashboardsRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/viaje', viajesRoutes)
app.use('/api/tareas', tareas_ACPRoutes)
app.use('/api/estudiantes', estudiantesRoutes)
app.use('/api/agile', agileRoutes)
app.use('/api/latbc', latbcRoutes)

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

