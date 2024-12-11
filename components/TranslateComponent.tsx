import React, { useState, useEffect } from "react";

function TranslateComponent() {
  const [selectedText, setSelectedText] = useState<string>("");
  const [translatedText, setTranslatedText] = useState<string>("");

  // Function to handle text selection
  const handleSelection = () => {
    const selection = window.getSelection()?.toString(); // Ensure selection is not null or undefined
    if (selection && selection.trim() !== "") {
      setSelectedText(selection);
      translateText(selection); // Call translation function
    }
  };

  // Function to translate selected text
  const translateText = (text: string): void => { // Explicitly type 'text' as a string
    const url = "/api/translate"; // The backend translation API endpoint

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        target: "zh", // Translate to Chinese
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data?.translatedText) {
          setTranslatedText(data.translatedText);
        }
      })
      .catch((error) => {
        console.error("Error translating text:", error);
      });
  };

  useEffect(() => {
    // Adding event listener for text selection
    document.addEventListener("mouseup", handleSelection);

    return () => {
      // Cleanup event listener when component is unmounted
      document.removeEventListener("mouseup", handleSelection);
    };
  }, []);

  return (
    <div style={{ padding: "20px", cursor: "text" }}>
      <h1>Select Text to Translate</h1>
      <p>
        Try selecting this text to see how the translation feature works.
        Select any word or phrase and the translation will appear below.
      </p>
      {selectedText && (
        <div style={{ marginTop: "20px" }}>
          <h3>Selected Text:</h3>
          <p>{selectedText}</p>
          <h3>Translated Text:</h3>
          <p>{translatedText || "Translating..."}</p>
        </div>
      )}
    </div>
  );
}

export default TranslateComponent;
