document.addEventListener('DOMContentLoaded', function() {
    const sourceLang = document.getElementById('sourceLang');
    const targetLang = document.getElementById('targetLang');
    const translateBtn = document.getElementById('translateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const errorMessage = document.getElementById('errorMessage');
    const translationDetails = document.getElementById('translationDetails');
    
    // Supported languages with full names
    const languageNames = {
        'auto': 'Detect Language',
        'en': 'English',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'it': 'Italian',
        'pt': 'Portuguese',
        'ru': 'Russian',
        'zh': 'Chinese',
        'ja': 'Japanese',
        'ko': 'Korean',
        'ar': 'Arabic',
        'hi': 'Hindi',
        'bn': 'Bengali',
        'pa': 'Punjabi',
        'ta': 'Tamil',
        'te': 'Telugu',
        'mr': 'Marathi',
        'gu': 'Gujarati',
        'kn': 'Kannada',
        'ml': 'Malayalam',
        'or': 'Odia',
        'as': 'Assamese',
        'ur': 'Urdu'
    };
    
    // Translate function
    async function translateText() {
        const text = inputText.value.trim();
        const source = sourceLang.value;
        const target = targetLang.value;
        
        if (text === "") {
            showError("Please enter text to translate.");
            return;
        }
        
        if (source === target) {
            showError("Source and target languages cannot be the same.");
            return;
        }
        
        // Clear previous errors
        errorMessage.textContent = "";
        
        // Show loading indicator
        loadingIndicator.style.display = 'block';
        outputText.textContent = '';
        translationDetails.textContent = '';
        
        try {
            // Use MyMemory API for translation
            let url;
            if (source === 'auto') {
                url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${target}`;
            } else {
                url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`;
            }
            
            const response = await fetch(url);
            const data = await response.json();
            
            loadingIndicator.style.display = 'none';
            
            if (data.responseData) {
                // Display translation
                outputText.textContent = data.responseData.translatedText;
                
                // Display translation details
                const detectedLang = source === 'auto' ? 
                    (data.responseData.langDetected || 'unknown') : 
                    source;
                    
                translationDetails.innerHTML = `
                    <strong>Detected Language:</strong> ${languageNames[detectedLang] || detectedLang}<br>
                    <strong>Translated to:</strong> ${languageNames[target] || target}<br>
                    <strong>Match:</strong> ${data.responseData.match || 'N/A'}
                `;
            } else {
                showError("Translation not available. Please try different text.");
            }
        } catch (error) {
            console.error('Translation error:', error);
            loadingIndicator.style.display = 'none';
            showError("Translation error. Please try again.");
        }
    }
    
    function showError(message) {
        errorMessage.textContent = message;
        outputText.textContent = "";
        translationDetails.textContent = "";
    }
    
    function clearText() {
        inputText.value = "";
        outputText.textContent = "Your translation will appear here...";
        errorMessage.textContent = "";
        translationDetails.textContent = "";
    }
    
    // Event listeners
    translateBtn.addEventListener('click', translateText);
    clearBtn.addEventListener('click', clearText);
    
    // Auto-translate when source language changes (if text exists)
    sourceLang.addEventListener('change', function() {
        if (inputText.value.trim() !== "") {
            translateText();
        }
    });
    
    // Auto-translate when target language changes (if text exists)
    targetLang.addEventListener('change', function() {
        if (inputText.value.trim() !== "") {
            translateText();
        }
    });
});