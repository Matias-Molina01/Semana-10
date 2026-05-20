import axios from 'axios';
import * as cheerio from 'cheerio';

export const scrapeBooksService = async (url) => {
  try {
    const { data: html } = await axios.get(url, { timeout: 5000 });

    if (!html || html.trim() === '') {
      throw { status: 400, message: 'El HTML de la URL objetivo está vacío.' };
    }

    const $ = cheerio.load(html);
    const books = [];

    const bookElements = $('article.product_pod');

    if (bookElements.length === 0) {
      throw { status: 404, message: 'No se encontraron elementos con el selector provisto.' };
    }

    // Iterar sobre los elementos y extraer los datos estructurados (Mínimo 3 requeridos)
    bookElements.each((index, element) => {
      const title = $(element).find('h3 a').attr('title');
      const price = $(element).find('.price_color').text().trim();
      const availability = $(element).find('.availability').text().trim();
      const image = $(element).find('.image_container img').attr('src');

      // Normalizar y estructurar los datos extraídos
      books.push({
        id: index + 1,
        title: title || 'Sin título',
        price: price || 'No disponible',
        availability: availability || 'Desconocida',
        imageUrl: image ? `https://books.toscrape.com/${image}` : 'Sin imagen'
      });
    });

    return books;
  } catch (error) {
    // Si el error ya fue personalizado por nosotros, lo relanzamos
    if (error.status) throw error;

    // Manejo de errores de red (Axios) u otros problemas imprevistos
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      throw { status: 404, message: 'No se pudo conectar con la URL remota de origen.' };
    }
    
    throw { status: 500, message: `Error interno en el proceso de scraping: ${error.message}` };
  }
};