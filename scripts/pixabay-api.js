// NOTE: Replace 'YOUR_PIXABAY_API_KEY' with your actual Pixabay API key.
const API_KEY = 'YOUR_PIXABAY_API_KEY';

/**
 * Fetches an image URL from the Pixabay API based on a search query.
 * @param {string} query The search term for the image (e.g., "Paris").
 * @returns {Promise<string|null>} A promise that resolves to the URL of the first image found, or null if no image is found or an error occurs.
 */
export async function getImageUrl(query) {
  const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=3`;

  try {
    const response = await fetch(URL);
    if (!response.ok) {
      // If the response is not OK, we can check for specific status codes
      if (response.status === 400 && API_KEY === 'YOUR_PIXABAY_API_KEY') {
          console.error("Pixabay API key is a placeholder. Please replace 'YOUR_PIXABAY_API_KEY' in scripts/pixabay-api.js with your actual key.");
          alert("The image generation feature is not configured. Please add a Pixabay API key.");
          return null;
      }
      throw new Error(`Pixabay API request failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.hits && data.hits.length > 0) {
      return data.hits[0].webformatURL;
    } else {
      console.warn(`No images found on Pixabay for query: "${query}"`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching image from Pixabay:', error);
    return null;
  }
}