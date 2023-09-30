document.addEventListener("DOMContentLoaded", function () {
  const quizOptions = document.querySelector(".quiz-options");
  const quizQuestions = document.querySelector(".quiz-questions");
  const quizResults = document.querySelector(".quiz-results");

  const startQuizButton = document.querySelector(".start-quiz");
  const nextQuestionButton = document.querySelector(".next-question");
  const quitQuizButton = document.querySelector(".quit-quiz");
  const playAgainButton = document.querySelector(".play-again");

  const currentQuestionElement = document.querySelector(".current-question");
  const questionTextElement = document.querySelector(".question-text");
  const optionsElement = document.querySelector(".options");
  const finalScoreElement = document.querySelector(".final-score");

  let currentQuestionIndex = 0;
  let score = 0;
  let questions = [];

  startQuizButton.addEventListener("click", startQuiz);
  nextQuestionButton.addEventListener("click", nextQuestion);
  quitQuizButton.addEventListener("click", showResults);
  playAgainButton.addEventListener("click", () => (window.location = "/"));

  async function fetchQuestions() {
    const numQuestions = document.querySelector(".num-questions").value;
    const quizCategory = document.querySelector(".quiz-category").value;
    const quizType = document.querySelector(".quiz-type").value;
    const quizDifficulty = document.querySelector(".quiz-difficulty").value;

    const apiUrl = `https://opentdb.com/api.php?amount=${numQuestions}&category=${quizCategory}&difficulty=${quizDifficulty}&type=${quizType}`;

    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log(data.results);
    questions = data.results;
  }

  async function startQuiz() {
    const numQuestionsInput = document.querySelector(".num-questions");
    const numQuestions = parseInt(numQuestionsInput.value);

    if (numQuestions < 1 || numQuestions > 50) {
      alert("Please enter a number of questions between 1 and 50.");
    } else {
      await fetchQuestions();
      score = 0;
      currentQuestionIndex = 0;
      updateQuestion();
      quizOptions.style.display = "none";
      quizResults.style.display = "none";
      quizQuestions.style.display = "block";
    }
  }

  function updateQuestion() {
    const currentQuestion = questions[currentQuestionIndex];

    disableButton();

    if (currentQuestion && currentQuestion.question) {
      currentQuestionElement.textContent = `Question ${
        currentQuestionIndex + 1
      } of ${questions.length}`;
      questionTextElement.textContent = currentQuestion.question;

      // Combine incorrect and correct answers and shuffle them
      const allOptions = [
        ...currentQuestion.incorrect_answers,
        currentQuestion.correct_answer,
      ];
      shuffleArray(allOptions);

      optionsElement.innerHTML = "";
      allOptions.forEach((option) => {
        optionsElement.innerHTML += `<button class="option">${option}</button>`;
      });

      const optionButtons = document.querySelectorAll(".option");
      optionButtons.forEach((button) => {
        button.addEventListener("click", checkAnswer);
      });
    } else {
      // Handle the case where the current question is undefined
      questionTextElement.textContent = "Error: Unable to fetch question.";
      optionsElement.innerHTML = "";
      nextQuestion();
    }
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function checkAnswer(event) {
    const selectedOption = event.target.textContent;
    const correctOption = questions[currentQuestionIndex].correct_answer;

    if (selectedOption === correctOption) {
      score++;
      event.target.style.backgroundColor = "#00ff3c";
    } else {
      event.target.style.backgroundColor = "red";
      const optionButtons = document.querySelectorAll(".option");

      optionButtons.forEach((button) => {
        if (button.textContent === correctOption) {
          button.style.backgroundColor = "#00ff3c";
        }
      });
    }
    enableButton();
  }

  function nextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
      updateQuestion();
    } else {
      showResults();
    }
  }

  function enableButton() {
    nextQuestionButton.disabled = false;
    nextQuestionButton.style.background = "";
    nextQuestionButton.style.cursor = "pointer";
  }

  function disableButton() {
    nextQuestionButton.disabled = true;
    nextQuestionButton.style.background = "#0057b379";
    nextQuestionButton.style.cursor = "default";
  }

  function showResults() {
    quizQuestions.style.display = "none";
    quizResults.style.display = "block";
    finalScoreElement.textContent = `Your Score: ${score}`;
  }
});
