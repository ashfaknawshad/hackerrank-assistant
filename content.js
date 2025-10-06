/**
 * content.js (v22 - The AI Prompt Engineer)
 *
 * This definitive version prepends a carefully refined, expert-level prompt
 * to the copied problem statement. This optimizes the content for direct
 * pasting into an LLM like Gemini for a high-quality, competition-ready answer.
 */

// ===================================================================
// CORE UTILITY: The Deep Scan function to search inside Shadow DOMs
// ===================================================================
function deepQuerySelectorAll(selector, root = document) {
  let results = Array.from(root.querySelectorAll(selector));
  root.querySelectorAll('*').forEach(el => {
    if (el.shadowRoot) {
      results = results.concat(deepQuerySelectorAll(selector, el.shadowRoot));
    }
  });
  return results;
}

// Main listener to route requests from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "copyForAI") {
    recomposeForAI();
  } else if (request.action === "copyRawHTML") {
    copyChallengeHTML();
  }
  sendResponse({ message: "Action received." });
  return true;
});

// ===================================================================
// THE PRIMARY "COPY FOR AI" FUNCTION
// ===================================================================
function recomposeForAI() {
  // --- REFINED PROMPT FOR AI ---
  const promptForAI = `You are an expert competitive programmer.
Provide a complete and efficient solution in Python 3 for the following problem.

Requirements:
1. Read all input from standard input (stdin).
2. Write all output to standard output (stdout).
3. The solution must be robust, handle all edge cases, and respect the given constraints.
4. Use concise variable names, typical for competitive programming.
5. Do not include any comments in the code.

Output Format:
Your response must be ONLY the raw Python 3 code. Do not include any explanations, introductory text, or markdown formatting like \`\`\`python.

---

Problem Statement:`;
  // --------------------------------

  const mainContent = document.querySelector('.problem-statement');
  if (!mainContent) {
    alert("Could not find the '.problem-statement' element.");
    return;
  }
  const contentClone = mainContent.cloneNode(true);

  const latexMap = new Map();
  const mathScripts = deepQuerySelectorAll('script[type^="math/tex"]');
  mathScripts.forEach(script => {
    const scriptId = script.id ? script.id.replace(/-Frame$/, '') : null;
    if (scriptId && script.textContent) {
      latexMap.set(scriptId, script.textContent.trim());
    }
  });

  contentClone.querySelectorAll('.MathJax_SVG').forEach(svgElement => {
    const scriptId = svgElement.id ? svgElement.id.replace(/-Frame$/, '') : null;
    if (scriptId && latexMap.has(scriptId)) {
      const source = latexMap.get(scriptId);
      const delimiter = svgElement.style.display !== 'inline-block' ? '$$' : '$';
      const latexText = document.createTextNode(` ${delimiter}${source}${delimiter} `);
      svgElement.parentNode.replaceChild(latexText, svgElement);
    }
  });
  
  contentClone.querySelectorAll('.katex').forEach(katexEl => {
    const annotation = katexEl.querySelector('.katex-mathml annotation');
    if (annotation && annotation.textContent) {
        const isDisplay = katexEl.matches('.katex-display');
        const delimiter = isDisplay ? '$$' : '$';
        const latexText = document.createTextNode(` ${delimiter}${annotation.textContent.trim()}${delimiter} `);
        katexEl.parentNode.replaceChild(latexText, katexEl);
    }
  });

  const problemText = (contentClone.innerText || contentClone.textContent).replace(/(\n\s*){3,}/g, '\n\n').trim();

  // --- COMBINE PROMPT AND PROBLEM ---
  const finalOutput = `${promptForAI}\n\n${problemText}`;
  // ---------------------------------

  // --- UPDATE THE ALERT MESSAGE ---
  copyToClipboard_Fallback(finalOutput, "AI prompt and problem statement copied to clipboard!");
}

// ===================================================================
// DEBUG and CLIPBOARD HELPER
// ===================================================================
function copyChallengeHTML() {
  const mainContent = document.querySelector('.problem-statement');
  if (mainContent) {
    copyToClipboard_Fallback(mainContent.innerHTML, "Copied the raw inner HTML of '.problem-statement'!");
  } else {
    alert("Could not find '.problem-statement'.");
  }
}

function copyToClipboard_Fallback(text, alertMessage) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;
  textArea.style.opacity = 0;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    const successful = document.execCommand('copy');
    if (successful) { alert(alertMessage); }
    else { throw new Error('Copy command was unsuccessful'); }
  } catch (err) {
    console.error('Fallback copy command failed', err);
    alert("Error: Could not copy the content. See the console for details.");
  }
  document.body.removeChild(textArea);
}