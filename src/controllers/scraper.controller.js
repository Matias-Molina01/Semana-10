import { scrapeBooksService } from '../services/scraper.service.js';

export const getScrapedData = async (req, res) => {
  // Obtener la URL desde los parámetros de consulta (query string) ej: ?url=...
  const { url } = req.query;

  // Validación básica: Verificar que la URL exista en la petición
  if (!url) {
    return res.status(400).json({
      status: 'error',
      message: 'Falta el parámetro requerido "url" en la query string.'
    });
  }

  // Validación básica: Verificar formato de URL válido
  try {
    new URL(url);
  } catch (e) {
    return res.status(400).json({
      status: 'error',
      message: 'El formato de la URL proporcionada no es válido.'
    });
  }

  try {
    // Llamar al servicio por capas
    const data = await scrapeBooksService(url);
    
    // Responder exitosamente con código 200 y JSON ordenado
    return res.status(200).json({
      status: 'success',
      count: data.length,
      data: data
    });
  } catch (error) {
    // Captura centralizada de errores controlados (400, 404, 500)
    return res.status(error.status || 500).json({
      status: 'error',
      message: error.message || 'Ocurrió un error inesperado.'
    });
  }
};