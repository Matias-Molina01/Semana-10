import express from 'express';
import scraperRoutes from './routes/scraper.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares para procesar JSON y peticiones
app.use(express.json());

// Montar las rutas globales
app.use('/api', scraperRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` Servidor backend corriendo exitosamente en:`);
  console.log(` http://localhost:${PORT}`);
  console.log(`===============================================`);
});