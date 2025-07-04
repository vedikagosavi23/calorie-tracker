const axios = require('axios');

export default  async function handler(req, res) {
  console.log('[analyze-image] Handler called');
  if (req.method !== 'POST') {
    console.warn('[analyze-image] Method Not Allowed:', req.method);
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { image } = req.body;
  if (!image) {
    console.warn('[analyze-image] No image provided');
    res.status(400).json({ error: 'No image provided' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('[analyze-image] GEMINI_API_KEY not set in environment');
    res.status(500).json({ error: 'GEMINI_API_KEY not set in environment' });
    return;
  }

  let base64Data = image;
  let mimeType = 'image/jpeg';
  if (image.includes(',')) {
    const [prefix, data] = image.split(',');
    base64Data = data;
    if (prefix.includes('png')) mimeType = 'image/png';
    if (prefix.includes('bmp')) mimeType = 'image/bmp';
    if (prefix.includes('gif')) mimeType = 'image/gif';
    if (prefix.includes('tiff')) mimeType = 'image/tiff';
    if (prefix.includes('heic')) mimeType = 'image/heic';
  }
  console.log('[analyze-image] Image received, mimeType:', mimeType);

  const prompt = `You are a food recognition and nutrition expert. Analyze the food items in this image. For each distinct food item you see, provide a JSON array element with these fields: food (string), estimated_calories (number, kcal), and confidence (0-1, number). Respond ONLY with a valid JSON array, no extra text or explanation. also provide calories based on the size of the food not anly item like if it is half part of some food then show half calories, be logical, practical`;

  const body = {
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Data
            }
          }
        ]
      }
    ]
  };

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    console.log('[analyze-image] Sending request to Gemini API...');
    const response = await axios.post(endpoint, body, {
      headers: { "Content-Type": "application/json" }
    });
    console.log('[analyze-image] Gemini API response received');
    res.status(200).json({ gemini: response.data });
  } catch (err) {
    console.error('[analyze-image] Error from Gemini API:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to analyze image', details: err.response?.data || err.message });
  }
}
