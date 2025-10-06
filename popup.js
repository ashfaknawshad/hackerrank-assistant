document.addEventListener('DOMContentLoaded', function() {
  const mainView = document.getElementById('mainView');
  const loadingView = document.getElementById('loadingView');
  const resultView = document.getElementById('resultView');

  const copyForAIButton = document.getElementById('copyForAI');
  const sendToAIButton = document.getElementById('sendToAI');
  const resultTextElement = document.getElementById('resultText'); // This is now a <code> element
  const copyResultButton = document.getElementById('copyResult');
  const settingsButton = document.getElementById('settingsButton');

  function showView(view) {
    mainView.classList.add('hidden');
    loadingView.classList.add('hidden');
    resultView.classList.add('hidden');
    view.classList.remove('hidden');
  }

  copyForAIButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "copyForAI" }, (response) => {
        if (chrome.runtime.lastError) console.error(chrome.runtime.lastError.message);
        copyForAIButton.textContent = "Copied!";
        setTimeout(() => { copyForAIButton.textContent = "1. Copy Problem for AI"; }, 1500);
      });
    });
  });

  sendToAIButton.addEventListener('click', async () => {
    try {
      const promptFromClipboard = await navigator.clipboard.readText();
      if (!promptFromClipboard || !promptFromClipboard.includes("Problem Statement:")) {
        alert("Clipboard does not seem to contain a prepared problem. Please click 'Copy Problem for AI' first.");
        return;
      }
      showView(loadingView);

      chrome.runtime.sendMessage({ action: "solveWithGemini", prompt: promptFromClipboard }, (response) => {
        if (chrome.runtime.lastError) {
          resultTextElement.textContent = `Error: ${chrome.runtime.lastError.message}`;
          showView(resultView);
          return;
        }

        if (response.success) {
          // Put the raw text into our <code> block
          resultTextElement.textContent = response.data.replace(/```python\n|```/g, '').trim(); // Clean up markdown
        } else {
          resultTextElement.textContent = `An error occurred:\n${response.error}`;
        }
        
        // --- THIS IS THE CRUCIAL NEW STEP ---
        // Tell highlight.js to apply syntax highlighting to our element
        hljs.highlightElement(resultTextElement);
        // ------------------------------------
        
        showView(resultView);
      });

    } catch (err) {
      alert("Could not read from clipboard. Make sure you have granted permission and copied the problem first.");
      console.error("Clipboard read error:", err);
    }
  });

  copyResultButton.addEventListener('click', () => {
    // We now copy the textContent of the <code> block
    navigator.clipboard.writeText(resultTextElement.textContent).then(() => {
      copyResultButton.textContent = "Copied!";
      setTimeout(() => { copyResultButton.textContent = "Copy Solution"; }, 1500);
    });
  });
  
  settingsButton.addEventListener('click', () => {
    // This is the official Chrome API to open the extension's options page
    chrome.runtime.openOptionsPage();
  });
});