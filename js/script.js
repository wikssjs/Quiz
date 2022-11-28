//* All html elements
const checkboxes= document.querySelectorAll('.checkbox');
const score = document.getElementById('score_number');
const question = document.getElementById('question');
const nextQuestionButton = document.querySelector('.next_question');
const newGameButton = document.getElementById('new-game');
const questionCOunt = document.getElementById('question-count');
const buttons = document.getElementsByClassName('btn');
const countdownEl = document.getElementById('seconds');


//* Variables
let answers ;
let questions;
let time = 30;
let index = 0;
let scoreNumber = 0 
let interval;






//* options
const options = {
    method: 'GET',
	headers: {
        'X-RapidAPI-Key': '1a1dd8d20amsh9f57cb9363b78d2p1d9416jsnef806e1b3281',
		'X-RapidAPI-Host': 'ases-quiz-api1.p.rapidapi.com'
	}
};


/**
 * * Api Fetch
 */
async function fetchApi(){
    fetch('https://ases-quiz-api1.p.rapidapi.com/questions/random/20', options)
    .then(response => response.json())
    .then(response => {
        console.log(response);
        questions = response.questions;
        getData();
    })
    .catch(err => console.error(err));
    
}
fetchApi();



/**
 * * get the data from the response of the API
 */
 function getData(){
    time = 30;
   question.innerText= questions[index].text;
   interval = setInterval(updateCountdown,1000);
    let isCorrect;
    
    for(let i = 0 ;i<4;i++){
        let option = questions[index].options[i].option;
        isCorrect = questions[index].options[i].isCorrect;
        buttons[i].textContent = option;
    }

    questionCOunt.innerText = ` ${index+1} of 20`

    addEventsListeners();
   
}



/**
 * * Add a listener on the four responses buttons
 */
function addEventsListeners(){
    for(let j=0;j<4;j++){
        buttons[j].addEventListener('click',(event)=>{
            let clickedButton = event.target;
            
            clickedButton.dataset.iscorrect =questions[index].options[j].isCorrect;
            
            if(clickedButton.dataset.iscorrect==='true'){
                checkboxes[index].style.backgroundColor = "Green";
                clickedButton.classList.add('correct');   
                clickedButton.classList.add('green');
                scoreNumber+=30;
                score.innerText = scoreNumber;
                clearInterval(interval)
                console.log()
                console.log("james");  
                disableButtons(buttons);
    
                if(index>=19){
                    nextQuestionButton.style.display = 'none';
                    newGameButton.style.display = 'block'
                }
                else{
                    nextQuestionButton.style.display = "block"
                    newGameButton.style.display = 'none'
                }
            }
            else{
                clickedButton.classList.add('incorrect');
                disableButtons(buttons);
                incorrectEvent(buttons);
                clickedButton.classList.add('red');
                clearInterval(interval)
                checkboxes[index].style.backgroundColor = "red";
                console.log(clickedButton)
            }
        })
        
    }   
    
}

//* next question click
nextQuestionButton.addEventListener('click',nextQuestion)



/**
 * * Disables all buttons when user click on one
 * @param {the buttons} buttons 
 */
function disableButtons (buttons){
    for(let i = 0;i<4;i++){
        buttons[i].disabled=true;
        buttons[i].classList.remove('hover');
    }
}


/**
 * * Enable all button for the next quetion
 */
function enableButton(){
    for(let i = 0;i<4;i++){
        buttons[i].disabled=false;
        buttons[i].classList.add('hover');
        buttons[i].classList.remove('correct')
        buttons[i].classList.remove('incorrect')
        buttons[i].classList.remove('border');
        buttons[i].classList.remove('red');
        buttons[i].classList.remove('green');
        
    }
}


/**
 * * event for incorrect answer
 * @param {the buttons} buttons 
 */
function incorrectEvent(buttons){
    
    for(let i = 0;i<4;i++){
        let isCorrect = questions[index].options[i].isCorrect;
        buttons[i].dataset.iscorrect = isCorrect;
        
        if(buttons[i].dataset.iscorrect==='true'){
         buttons[i].classList.add('border');
        }
    }
    
    if(index>=19){
        nextQuestionButton.style.display = 'none';
        newGameButton.style.display = 'block'
    }
    else{
        newGameButton.style.display = 'none'
        nextQuestionButton.style.display = "block"
    }
}



/**
 * * Call on next question click
 */
function nextQuestion(){
    index++;
    enableButton();
    getData();
    nextQuestionButton.style.display = 'none'
}


/**
 * * Update for countdown
 */
function updateCountdown(){
    
    time--;
    countdownEl.innerText = time
    
    if(time<=0){ 
        clearInterval(interval);
        disableButtons(buttons);
        incorrectEvent(buttons);
    }
    
}


//* New game button click
newGameButton.addEventListener('click',()=>{
    index=0;
    fetchApi();


    for(let check of checkboxes){
        check.style.backgroundColor = "White"
        clearInterval(interval);
        interval = setInterval(updateCountdown,1000);
    }
    
    scoreNumber = 0;
    newGameButton.style.display = 'none';
    enableButton();

});