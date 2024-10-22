document.addEventListener('DOMContentLoaded', () => {
    const problemElement = document.getElementById('problem');
    const answerInput = document.getElementById('answer');
    const submitButton = document.getElementById('submit');
    const resultElement = document.getElementById('result');
    const voiceButton = document.createElement('button');
    voiceButton.textContent = '🎤 音声で答える';
    voiceButton.className = 'submit-btn';
    document.body.appendChild(voiceButton);

    let currentProblem = generateProblem();
    displayProblem(currentProblem);

    // 問題を音声で読み上げる
    function speakProblem(problem) {
        const utterance = new SpeechSynthesisUtterance(`${problem.num1} たす ${problem.num2} は？`);
        utterance.lang = 'ja-JP'; // 日本語設定
        speechSynthesis.speak(utterance);
    }

    // 問題を生成する
    function generateProblem() {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        return { num1, num2, answer: num1 + num2 };
    }

    // 問題を画面に表示する
    function displayProblem(problem) {
        problemElement.textContent = `${problem.num1} + ${problem.num2} = ?`;
        answerInput.value = '';
        resultElement.textContent = '';
        speakProblem(problem); // 問題を読み上げ
    }

    // ユーザーの入力を確認
    function checkAnswer(problem, userAnswer) {
        if (userAnswer === problem.answer) {
            resultElement.textContent = "正解！";
            currentProblem = generateProblem();
            displayProblem(currentProblem);
        } else {
            resultElement.textContent = "間違い。もう一度やってみてください。";
        }
    }

    // 音声認識で答えを入力
    voiceButton.addEventListener('click', () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("このブラウザは音声認識に対応していません。");
            return;
        }

        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'ja-JP'; // 日本語設定
        recognition.interimResults = false; // 最終結果のみ取得
        recognition.maxAlternatives = 1;

        recognition.start();

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            const userAnswer = parseInt(transcript);

            if (!isNaN(userAnswer)) {
                checkAnswer(currentProblem, userAnswer);
            } else {
                resultElement.textContent = "音声認識がうまくいきませんでした。";
            }
        };

        recognition.onerror = (event) => {
            resultElement.textContent = `エラーが発生しました: ${event.error}`;
        };
    });

    submitButton.addEventListener('click', () => {
        const userAnswer = parseInt(answerInput.value);
        if (isNaN(userAnswer)) {
            resultElement.textContent = "数字を入力してください。";
        } else {
            checkAnswer(currentProblem, userAnswer);
        }
    });
});
