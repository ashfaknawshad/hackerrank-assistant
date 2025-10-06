/**
 * background.js (v3 - Secure & Public Version)
 *
 * This version removes the hard-coded API key.
 * It now retrieves the key from chrome.storage.sync, which is set by the user
 * on the settings page. It also includes robust error handling for a missing key.
 */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "solveWithGemini") {
    callGeminiAPI(request.prompt)
      .then(response => sendResponse({ success: true, data: response }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

async function callGeminiAPI(prompt) {
  // Step 1: Retrieve the API key from storage.
  const { geminiApiKey } = await chrome.storage.sync.get(['geminiApiKey']);

  // Step 2: Check if the key exists. If not, send a helpful error.
  if (!geminiApiKey) {
    throw new Error("Gemini API key not found. Please set it in the extension's settings page.");
  }

  const API_KEY = geminiApiKey; // Use the retrieved key
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${API_KEY}`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "contents": [{ "parts": [{ "text": prompt }] }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${response.status} - ${errorData.error.message}`);
    }

    const data = await response.json();
    const solution = data.candidates[0].content.parts[0].text;
    return solution;

  } catch (error) {
    console.error("Failed to call Gemini API:", error);
    throw error;
  }
}