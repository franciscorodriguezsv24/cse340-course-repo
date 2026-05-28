import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

import { testConnection } from './src/models/db.js';
import homeRoutes from './src/routes/home.js';
import organizationRoutes from './src/routes/organizations.js';
import projectRoutes from './src/routes/projects.js';
import categoryRoutes from './src/routes/categories.js';

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});

app.use('/', homeRoutes);
app.use('/', organizationRoutes);
app.use('/', projectRoutes);
app.use('/', categoryRoutes);

app.use((req, res) => {
    res.status(404).render('errors/404', { title: 'Page Not Found' });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).render('errors/500', { title: 'Server Error' });
});

app.listen(PORT, async () => {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
});
