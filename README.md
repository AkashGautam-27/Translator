# 🌍 Language Translator App

A simple and responsive Language Translator web application that allows users to translate text between multiple languages, copy translated text, and listen to text using speech synthesis.

## 🚀 Live Demo

🔗 https://lively-bunny-e50251.netlify.app/

---

## ✨ Features

* Translate text between multiple languages
* Supports a large list of languages
* Copy input or translated text to clipboard
* Text-to-Speech support
* Responsive design for mobile and desktop
* Clean and modern UI
* Built using Vanilla JavaScript and Tailwind CSS

---

## 🛠️ Technologies Used

* HTML5
* Tailwind CSS
* JavaScript (ES6)
* MyMemory Translation API
* Web Speech API
* Font Awesome

---

## 📸 Screenshots

### Desktop View

![Desktop Screenshot](./screenshots/desktop.png)

### Mobile View

![Mobile Screenshot](./screenshots/mobile.png)

---

## 📂 Project Structure


Language-Translator/
│
├── index.html
├── style.css
├── app.js
├── language.js
└── README.md


---

## ⚙️ Installation

1. Clone the repository

git clone https://github.com/your-username/language-translator.git


2. Navigate to the project folder

cd language-translator

3. Open `index.html` in your browser

---

## 🔧 How It Works

1. Enter text in the input textarea.
2. Select source language.
3. Select target language.
4. Click the **Translate** button.
5. The translated text appears in the output area.
6. Use the copy icon to copy text.
7. Use the speaker icon to hear the text.

---

## 🌐 API Used

### MyMemory Translation API

https://api.mymemory.translated.net/get


Example:


const apiUrl =
`https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;


---

## 📱 Responsive Design

The application is fully responsive and works on:

* Mobile Devices
* Tablets
* Laptops
* Desktop Screens

---

## 🎯 Future Improvements

* Language swap button
* Translation history
* Dark mode
* Better Text-to-Speech voice support
* Voice input using Speech Recognition
* Multiple translation API support

---

## 👨‍💻 Author

Akash Gautam

If you like this project, consider giving it a ⭐ on GitHub.
