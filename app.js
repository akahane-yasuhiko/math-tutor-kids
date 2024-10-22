document.addEventListener('DOMContentLoaded', () => {
    const problemElement = document.getElementById('problem');
    const answerInput = document.getElementById('answer');
    const submitButton = document.getElementById('submit');
    const resultElement = document.getElementById('result');

    let currentProblem = generateProblem();
    displayProblem(currentProblem);

    submitButton.addEventListener('click', () => {
        const userAnswer = parseInt(answerInput.value);
        if (isNaN(userAnswer)) {
            resultElement.textContent = "数字を入力してください。";
        } else {
            checkAnswer(currentProblem, userAnswer);
        }
    });

    function generateProblem() {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        return { num1, num2, answer: num1 + num2 };
    }

    function displayProblem(problem) {
        problemElement.textContent = `${problem.num1} + ${problem.num2} = ?`;
        answerInput.value = '';
        resultElement.textContent = '';
        speakProblem(problem); // 問題を表示すると同時に読み上げ
    }

    function checkAnswer(problem, userAnswer) {
        if (userAnswer === problem.answer) {
            resultElement.textContent = "正解！";
            currentProblem = generateProblem();
            displayProblem(currentProblem);
        } else {
            resultElement.textContent = "間違い。もう一度やってみてください。";
        }
    }

    // 問題を読み上げる
    function speakProblem(problem) {
        const utterance = new SpeechSynthesisUtterance(`${problem.num1} たす ${problem.num2} は？`);
        utterance.lang = 'ja-JP'; // 日本語を設定
        speechSynthesis.speak(utterance);
    }
});
