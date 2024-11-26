document.addEventListener('DOMContentLoaded', function() {
    // Elements
    let start = document.getElementById('start');
    let question = document.getElementById('question');
    let answer1 = document.getElementById('answer1');
    let answer2 = document.getElementById('answer2');
    let answer3 = document.getElementById('answer3');
    let answer4 = document.getElementById('answer4');
    let category = document.getElementById('category');
    let difficulty = document.getElementById('difficulty');
    let correct = document.getElementById('correct');
    let incorrect = document.getElementById('incorrect');
    let incorrectAnswers = [];
    let correctAnswer = '';
    let lastRequestTime = 0;
    let questionCategory = document.getElementById('category-selector');
    let difficultySelector = document.getElementById('difficulty-selector');

    // Event listeners
    start.addEventListener('click', generateQuestion);
    answer1.addEventListener('click', checkAnswer);
    answer2.addEventListener('click', checkAnswer);
    answer3.addEventListener('click', checkAnswer);
    answer4.addEventListener('click', checkAnswer);

    async function generateQuestion() {
        const currentTime = Date.now();
        if (currentTime - lastRequestTime < 6000) {
            console.log('Waiting for 5 seconds before making another request');
            setTimeout(generateQuestion, 5000);
            return;
        }
        lastRequestTime = currentTime;

        disableAnswers();
        try {
            const response = await fetch(`https://opentdb.com/api.php?amount=1&type=multiple&category=${questionCategory.value}&difficulty=${difficultySelector.value}`);
            const data = await response.json();
            if (!data.results || data.results.length === 0) {
                console.error('No results found');
                console.log('Response Code:', data.response_code);
                return;
            }
            let questionData = data.results[0];
            question.innerHTML = questionData.question;
            incorrectAnswers = [
                questionData.incorrect_answers[0],
                questionData.incorrect_answers[1],
                questionData.incorrect_answers[2]
            ];
            correctAnswer = questionData.correct_answer;
            // Shuffle the incorrect answers array
            incorrectAnswers = incorrectAnswers.sort(() => Math.random() - 0.5);
            // Insert the correct answer at a random position
            let answers = [...incorrectAnswers];
            answers.splice(Math.floor(Math.random() * 4), 0, correctAnswer);
            answer1.innerHTML = answers[0];
            answer2.innerHTML = answers[1];
            answer3.innerHTML = answers[2];
            answer4.innerHTML = answers[3];
            category.innerHTML = questionData.category;
            difficulty.innerHTML = questionData.difficulty;
            enableAnswers();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function checkAnswer(e) {
        if (e.target.innerHTML === correctAnswer) {
            e.target.style.backgroundColor = 'green';
            correct.innerHTML = parseInt(correct.innerHTML) + 1;
        } else {
            e.target.style.backgroundColor = 'red';
            incorrect.innerHTML = parseInt(incorrect.innerHTML) + 1;
            // Highlight the correct answer in light green
            if (answer1.innerHTML === correctAnswer) {
                answer1.style.backgroundColor = '#d4edda';
                answer1.style.color = 'black';
            }
            if (answer2.innerHTML === correctAnswer) {
                answer2.style.backgroundColor = '#d4edda';
                answer2.style.color = 'black';
            }
            if (answer3.innerHTML === correctAnswer) {
                answer3.style.backgroundColor = '#d4edda';
                answer3.style.color = 'black';
            }
            if (answer4.innerHTML === correctAnswer) {
                answer4.style.backgroundColor = '#d4edda';
                answer4.style.color = 'black';
            }
        }
        setTimeout(() => {
            resetAnswerStyles();
            generateQuestion();
        }, 5000);
    }

    function resetAnswerStyles() {
        answer1.style.backgroundColor = '';
        answer1.style.color = '';
        answer2.style.backgroundColor = '';
        answer2.style.color = '';
        answer3.style.backgroundColor = '';
        answer3.style.color = '';
        answer4.style.backgroundColor = '';
        answer4.style.color = '';
    }

    function disableAnswers() {
        answer1.disabled = true;
        answer2.disabled = true;
        answer3.disabled = true;
        answer4.disabled = true;
    }

    function enableAnswers() {
        answer1.disabled = false;
        answer2.disabled = false;
        answer3.disabled = false;
        answer4.disabled = false;
    }
});