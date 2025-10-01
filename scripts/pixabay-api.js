async function getImageUrl(query) {
  const URL = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=3`;

  try {
    const response = await fetch(URL);
    if (!response.ok) {
      if (response.status === 400 && PIXABAY_API_KEY === 'YOUR_PIXABAY_PIXABAY_API_KEY') {
        console.error("Pixabay API key is a placeholder. Please replace it with your actual key.");
        alert("The image feature is not configured. Please add a Pixabay API key.");
        return null;
      }
      throw new Error(`Pixabay API request failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.hits && data.hits.length > 0) {
      return data.hits[0].webformatURL;
    } else {
      console.warn(`No images found for query: "${query}"`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching image from Pixabay:', error);
    return null;
  }
}