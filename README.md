# HackerRank Assistant

An AI-powered browser extension to help you solve HackerRank challenges by seamlessly preparing prompts for and communicating with Google's Gemini AI.

![Demo GIF](demo.gif) <!-- You will create and add this GIF -->

---

## Features

-   **One-Click Prompt Engineering:** Automatically copies the entire problem statement, including math formulas, and formats it with an expert-level prompt for the AI.
-   **Direct AI Communication:** Sends the prepared prompt to the Gemini API with a single click.
-   **In-Extension Code Display:** Displays the AI-generated solution in a beautiful, syntax-highlighted code block directly in the extension popup.
-   **Secure API Key Storage:** Your personal Gemini API key is stored securely in your browser's sync storage, not in the code.

## Installation

Since this is an unpacked extension, you need to load it manually in your browser.

1.  **Download:** Download this repository as a ZIP file and unzip it, or clone it using Git.
2.  **Open Browser Extensions:**
    -   In Chrome/Edge, navigate to `chrome://extensions` or `edge://extensions`.
3.  **Enable Developer Mode:** Turn on the "Developer mode" toggle, usually in the top-right corner.
4.  **Load the Extension:** Click on the "Load unpacked" button and select the folder where you unzipped/cloned this repository.
5.  The **HackerRank Assistant** icon should now appear in your browser's toolbar!

## Configuration

Before you can use the assistant, you must provide your own Google Gemini API key.

1.  **Get an API Key:** Go to [Google AI Studio](https://aistudio.google.com/app/apikey) and create a new API key.
2.  **Open Extension Settings:** Right-click the HackerRank Assistant icon in your toolbar and select "Options," or click the small gear icon inside the popup.
3.  **Save Your Key:** Paste your newly created API key into the input field and click "Save Key."

The extension is now ready to use!

## Usage Workflow

1.  Navigate to any HackerRank challenge page.
2.  Click the **HackerRank Assistant** icon in your toolbar.
3.  Click the **"1. Copy Problem for AI"** button. This prepares the prompt and copies it to your clipboard.
4.  Click the **"2. Send to AI"** button. This sends the clipboard content to Gemini.
5.  Wait for the loading animation to complete.
6.  The AI-generated solution will appear. Click **"Copy Solution"** to copy it.