// Initialize Mermaid diagram library
mermaid.initialize({ startOnLoad: false, theme: 'dark' });

// Paste your actual Google Gemini API Key here (starts with "AIzaSy...")
const API_KEY = dummyapikey;

async function generateDiagram() {
    const codeInput = document.getElementById('codeInput');
    const outputDiv = document.getElementById('diagramOutput');
    const loadingDiv = document.getElementById('loading');

    if (!codeInput) {
        console.error("Cannot find #codeInput element in DOM.");
        return;
    }

    const code = codeInput.value.trim();

    if (!code) {
        alert("Please paste some code first!");
        return;
    }

    // Key Validation Check
    if (!API_KEY || API_KEY.trim() === "" || API_KEY.includes("")) {
    alert("Please paste a valid Gemini API key inside script.js!");
    return;
}
    }

    // Show loading UI state
    if (loadingDiv) loadingDiv.classList.remove('hidden');
    if (outputDiv) outputDiv.innerHTML = '';

    const systemInstruction = "You are a code visualizer. Convert the user's code into valid Mermaid.js flowchart syntax (graph TD). Output ONLY the raw Mermaid syntax inside a ```mermaid markdown block. Do NOT include any intro, explanations, or extra commentary.";

    try {
        const url = `[https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=$](https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=$){API_KEY.trim()}`;

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { text: systemInstruction },
                            { text: `Convert this code to a Mermaid flowchart:\n\n${code}` }
                        ]
                    }
                ]
            })
        });

        const rawText = await response.text();

        if (!rawText) {
            throw new Error("Received empty response from Gemini API.");
        }

        const data = JSON.parse(rawText);

        if (!response.ok) {
            console.error("Gemini API Error Response:", data);
            throw new Error(data.error?.message || "Failed to call Gemini API");
        }

        if (!data.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
            console.warn("Full API Response:", data);
            throw new Error("Gemini returned an empty result. Check browser console for safety blocks.");
        }

        // Clean markdown backticks from response
        let mermaidCode = data.candidates[0].content.parts[0].text
            .replace(/```mermaid/g, '')
            .replace(/```/g, '')
            .trim();

        loadingDiv.classList.add('hidden');

        // Clear previous diagram
        outputDiv.innerHTML = '';

        // Render diagram safely using mermaid.render
        const { svg } = await mermaid.render('renderedSvg', mermaidCode);
        outputDiv.innerHTML = svg;

    } catch (error) {
        if (loadingDiv) loadingDiv.classList.add('hidden');
        alert(`Error: ${error.message}`);
        console.error("Full Error Details:", error);
    }

// Safely attach event listener after DOM loads
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("generateBtn");
    if (btn) {
        btn.addEventListener("click", generateDiagram);
    } else {
        console.error("Button #generateBtn not found in DOM.");
    }
});