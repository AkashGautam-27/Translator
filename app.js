// Language select elements and UI controls
const sourceLangSelect = document.getElementById("sourceLanguage");
const targetLangSelect = document.getElementById("targetLanguage");
const translateBtn = document.getElementById("translateBtn");
const fromText = document.getElementById("inputText");
const toText = document.getElementById("outputText");
const charCount = document.getElementById("charCount");
const loadingOverlay = document.getElementById("loadingOverlay");

// Mic, Sound, Copy Controls
const micBtn = document.getElementById("micBtn");
const speakFromBtn = document.getElementById("speakFromBtn");
const speakToBtn = document.getElementById("speakToBtn");
const copyFromBtn = document.getElementById("copyFromBtn");
const copyToBtn = document.getElementById("copyToBtn");

// Swap and History controls
const swapBtn = document.getElementById("swapBtn");
const swapIcon = document.getElementById("swapIcon");
const historyToggleBtn = document.getElementById("historyToggleBtn");
const historyPanel = document.getElementById("historyPanel");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

// Toast elements
const toast = document.getElementById("toastNotification");
const toastMsg = document.getElementById("toastMsg");
const toastIcon = document.getElementById("toastIcon");

const HISTORY_KEY = "lingotrans_history";

// 1. Populate Language Select Dropdowns
function populateLanguages() {
    if (typeof languages === "undefined") {
        console.error("Languages object is not defined. Ensure language.js is loaded.");
        return;
    }
    
    sourceLangSelect.innerHTML = "";
    targetLangSelect.innerHTML = "";
    
    for (const code in languages) {
        const sourceSelected = code === "en" ? "selected" : "";
        const targetSelected = code === "hi" ? "selected" : "";
        
        const sourceOption = `<option value="${code}" ${sourceSelected}>${languages[code]}</option>`;
        const targetOption = `<option value="${code}" ${targetSelected}>${languages[code]}</option>`;
        
        sourceLangSelect.insertAdjacentHTML("beforeend", sourceOption);
        targetLangSelect.insertAdjacentHTML("beforeend", targetOption);
    }
}

// 2. Character Count Tracker
fromText.addEventListener("input", () => {
    const len = fromText.value.length;
    charCount.textContent = `${len} / 5000`;
});

// 3. Toast Notifications helper
function showToast(message, iconClass = "fa-circle-check", colorClass = "text-indigo-400") {
    toastMsg.textContent = message;
    toastIcon.className = `fa-solid ${iconClass} ${colorClass} text-lg`;
    
    toast.classList.add("show");
    
    if (toast.timeoutId) {
        clearTimeout(toast.timeoutId);
    }
    
    toast.timeoutId = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

// 4. Copy to Clipboard logic with micro-interaction feedback
function copyToClipboard(text, buttonElement, successMsg) {
    if (!text.trim()) {
        showToast("Nothing to copy.", "fa-circle-exclamation", "text-amber-400");
        return;
    }
    navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg, "fa-circle-check", "text-emerald-400");
        const icon = buttonElement.querySelector("i");
        const originalClass = icon.className;
        icon.className = "fa-solid fa-check success-bounce text-emerald-400";
        setTimeout(() => {
            icon.className = originalClass;
        }, 2000);
    }).catch(err => {
        console.error("Copy error: ", err);
        showToast("Failed to copy text.", "fa-circle-xmark", "text-red-400");
    });
}

copyFromBtn.addEventListener("click", () => {
    copyToClipboard(fromText.value, copyFromBtn, "Input copied to clipboard!");
});

copyToBtn.addEventListener("click", () => {
    copyToClipboard(toText.value, copyToBtn, "Translation copied to clipboard!");
});

// 5. Speech Synthesis (TTS) - Text-to-Speech
function speak(text, lang) {
    if (!text.trim()) {
        showToast("No text to speak.", "fa-circle-exclamation", "text-amber-400");
        return;
    }
    
    // Stop any existing TTS voice immediately
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    
    utterance.onstart = () => {
        showToast("Reading aloud...", "fa-volume-high", "text-indigo-400");
    };
    utterance.onerror = (e) => {
        console.error("TTS playback error: ", e);
        showToast("Playback failed.", "fa-circle-exclamation", "text-red-400");
    };
    
    window.speechSynthesis.speak(utterance);
}

speakFromBtn.addEventListener("click", () => {
    speak(fromText.value, sourceLangSelect.value);
});

speakToBtn.addEventListener("click", () => {
    speak(toText.value, targetLangSelect.value);
});

// 6. Speech Recognition (STT) - Voice Input/Dictation
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => {
        micBtn.classList.add("recording-pulse");
        showToast("Listening. Speak now...", "fa-microphone", "text-red-400");
    };
    
    recognition.onend = () => {
        micBtn.classList.remove("recording-pulse");
    };
    
    recognition.onerror = (e) => {
        console.error("Speech recognition error: ", e.error);
        if (e.error === "not-allowed") {
            showToast("Microphone permission denied.", "fa-circle-exclamation", "text-red-400");
        } else {
            showToast(`Voice input error: ${e.error}`, "fa-circle-exclamation", "text-red-400");
        }
        micBtn.classList.remove("recording-pulse");
    };
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const currentText = fromText.value.trim();
        fromText.value = currentText ? currentText + " " + transcript : transcript;
        
        // Dispatch input event to update character count
        fromText.dispatchEvent(new Event("input"));
        showToast("Speech recognized!", "fa-circle-check", "text-emerald-400");
    };
}

micBtn.addEventListener("click", () => {
    if (!recognition) {
        showToast("Voice typing is not supported in this browser.", "fa-circle-exclamation", "text-red-400");
        return;
    }
    
    if (micBtn.classList.contains("recording-pulse")) {
        recognition.stop();
    } else {
        recognition.lang = sourceLangSelect.value;
        recognition.start();
    }
});

// 7. Swap Languages and Texts
swapBtn.addEventListener("click", () => {
    // Icon rotate spin animation
    swapIcon.classList.add("swap-active");
    setTimeout(() => {
        swapIcon.classList.remove("swap-active");
    }, 400);
    
    // Swap selected languages
    const tempLang = sourceLangSelect.value;
    sourceLangSelect.value = targetLangSelect.value;
    targetLangSelect.value = tempLang;
    
    // Swap textarea values
    const tempText = fromText.value;
    fromText.value = toText.value;
    toText.value = tempText;
    
    // Dispatch input to refresh char limit display
    fromText.dispatchEvent(new Event("input"));
    
    showToast("Languages and text swapped!", "fa-right-left", "text-indigo-400");
    
    // Auto translate swapped content
    if (fromText.value.trim()) {
        translate();
    }
});

// 8. Translation Core logic
function translate() {
    const text = fromText.value.trim();
    if (!text) {
        showToast("Please enter some text.", "fa-circle-exclamation", "text-amber-400");
        return;
    }
    
    // Display loading state
    loadingOverlay.classList.remove("opacity-0", "pointer-events-none");
    loadingOverlay.classList.add("opacity-100");
    translateBtn.disabled = true;
    translateBtn.style.opacity = "0.7";
    
    const translateFrom = sourceLangSelect.value;
    const translateTo = targetLangSelect.value;
    
    const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${translateFrom}|${translateTo}`;
    
    fetch(apiUrl)
        .then(res => {
            if (!res.ok) throw new Error("HTTP connection failed");
            return res.json();
        })
        .then(data => {
            // Restore normal state
            loadingOverlay.classList.remove("opacity-100");
            loadingOverlay.classList.add("opacity-0", "pointer-events-none");
            translateBtn.disabled = false;
            translateBtn.style.opacity = "1";
            
            if (data.responseData && data.responseData.translatedText) {
                const resultText = data.responseData.translatedText;
                toText.value = resultText;
                
                // Save to history drawer
                saveHistory(translateFrom, translateTo, text, resultText);
            } else {
                showToast("Server returned invalid response.", "fa-circle-exclamation", "text-red-400");
            }
        })
        .catch(err => {
            console.error("Translation API failure: ", err);
            loadingOverlay.classList.remove("opacity-100");
            loadingOverlay.classList.add("opacity-0", "pointer-events-none");
            translateBtn.disabled = false;
            translateBtn.style.opacity = "1";
            showToast("Failed to connect to translator service.", "fa-circle-exclamation", "text-red-400");
        });
}

translateBtn.addEventListener("click", translate);

// 9. History Manager
function getHistory() {
    try {
        return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function saveHistory(fromLang, toLang, fromText, toText) {
    let history = getHistory();
    
    // Filter duplicates of identical content to avoid cluttering history
    history = history.filter(item => !(item.fromText.trim() === fromText.trim() && item.toText.trim() === toText.trim()));
    
    const newItem = {
        id: Date.now(),
        fromLang,
        toLang,
        fromText,
        toText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    history.unshift(newItem);
    
    // Cap at 10 items
    if (history.length > 10) {
        history.pop();
    }
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    renderHistory();
}

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function renderHistory() {
    const history = getHistory();
    
    if (history.length === 0) {
        historyList.innerHTML = `<p class="text-sm text-gray-500 italic select-none">No translation history yet.</p>`;
        return;
    }
    
    historyList.innerHTML = history.map(item => {
        const fromName = languages[item.fromLang] || item.fromLang;
        const toName = languages[item.toLang] || item.toLang;
        return `
            <div class="flex items-start justify-between p-3 rounded-xl bg-gray-900/50 hover:bg-gray-800/40 border border-gray-800/50 hover:border-gray-700/50 cursor-pointer transition-all gap-3" data-history-id="${item.id}">
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1 select-none">
                        <span class="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">${fromName}</span>
                        <i class="fa-solid fa-arrow-right text-[9px] text-gray-600"></i>
                        <span class="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">${toName}</span>
                        <span class="text-[9px] text-gray-500 ml-auto">${item.timestamp}</span>
                    </div>
                    <p class="text-sm text-gray-200 truncate font-semibold">${escapeHtml(item.fromText)}</p>
                    <p class="text-xs text-gray-400 truncate mt-0.5">${escapeHtml(item.toText)}</p>
                </div>
                <button class="delete-history-btn text-gray-600 hover:text-red-400 transition-colors self-center p-1.5 cursor-pointer shrink-0" data-id="${item.id}" title="Remove entry">
                    <i class="fa-solid fa-trash-can text-xs"></i>
                </button>
            </div>
        `;
    }).join("");
    
    // Bind click to restore state
    historyList.querySelectorAll("[data-history-id]").forEach(card => {
        card.addEventListener("click", (e) => {
            if (e.target.closest(".delete-history-btn")) return;
            
            const id = parseInt(card.dataset.historyId);
            const item = history.find(i => i.id === id);
            if (item) {
                sourceLangSelect.value = item.fromLang;
                targetLangSelect.value = item.toLang;
                fromText.value = item.fromText;
                toText.value = item.toText;
                fromText.dispatchEvent(new Event("input"));
                showToast("Translation restored!", "fa-clock-rotate-left", "text-indigo-400");
            }
        });
    });

    // Bind individual delete
    historyList.querySelectorAll(".delete-history-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            let history = getHistory();
            history = history.filter(item => item.id !== id);
            localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
            renderHistory();
            showToast("Item deleted", "fa-trash-can", "text-red-400");
        });
    });
}

// 10. Drawer Toggles & Clearing Actions
historyToggleBtn.addEventListener("click", () => {
    const isOpen = historyPanel.classList.contains("open");
    if (isOpen) {
        historyPanel.classList.remove("open");
        historyToggleBtn.querySelector("span").textContent = "View Translation History";
    } else {
        historyPanel.classList.add("open");
        historyToggleBtn.querySelector("span").textContent = "Hide Translation History";
    }
});

clearHistoryBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear all translation history?")) {
        localStorage.removeItem(HISTORY_KEY);
        renderHistory();
        showToast("History cleared.", "fa-trash-can", "text-red-400");
    }
});

// Initialize on page load
populateLanguages();
renderHistory();
charCount.textContent = `${fromText.value.length} / 5000`;
