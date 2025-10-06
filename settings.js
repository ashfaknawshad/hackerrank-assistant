/**
 * settings.js
 *
 * This script handles the logic for the settings page.
 * It saves the user's Gemini API key to chrome.storage.sync and
 * retrieves it on page load.
 */
document.addEventListener('DOMContentLoaded', () => {
  const saveButton = document.getElementById('saveButton');
  const apiKeyInput = document.getElementById('apiKey');
  const statusEl = document.getElementById('status');

  // Load the currently saved key when the page opens
  chrome.storage.sync.get(['geminiApiKey'], (result) => {
    if (result.geminiApiKey) {
      apiKeyInput.value = result.geminiApiKey;
    }
  });

  // Save the new key when the "Save" button is clicked
  saveButton.addEventListener('click', () => {
    const apiKey = apiKeyInput.value;
    if (apiKey) {
      chrome.storage.sync.set({ geminiApiKey: apiKey }, () => {
        statusEl.textContent = 'API Key Saved!';
        statusEl.classList.remove('hidden');
        setTimeout(() => {
          statusEl.classList.add('hidden');
        }, 2000);
      });
    }
  });
});