const selectTag = document.querySelectorAll("select");
const translateBtn = document.querySelector("#translateBtn");
const fromText = document.querySelector("#inputText");
const toText = document.querySelector("#outputText");
const icons = document.querySelectorAll("i");

 selectTag.forEach((tag, id) => {    
    for(const country_code in languages){
    let selected ;
    if(id == 0 && country_code == "en"){
        selected = "selected";
    }else if(id == 1 && country_code == "hi"){
        selected = "selected";
    }
    let option = `<option value="${country_code}" ${selected}>${languages[country_code]}</option>`;
    tag.insertAdjacentHTML("beforeend", option);
  }});

  translateBtn.addEventListener("click", () => {
    let text = fromText.value.trim();
    let translateFrom = selectTag[0].value;
    let translateTo = selectTag[1].value;
    const apiUrl=`https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    fetch(apiUrl).then(res => res.json()).then(data => {
    toText.value = data.responseData.translatedText;
  });
  });

    icons.forEach(icon => { 
    icon.addEventListener("click", ({target}) => {
        if(target.classList.contains("fa-copy")){
            if(target.dataset.copy == "from"){
                navigator.clipboard.writeText(fromText.value);
            }else{
                navigator.clipboard.writeText(toText.value);
            }
        }else{
            let utterance;
            if(target.dataset.speech == "from"){
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value;
            }else{
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value;
            }
            speechSynthesis.speak(utterance);
        }});
    });
    
  
