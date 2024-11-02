import { checkMicrophonePermission, startVoiceRecognition, speakText } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    const problemElement = document.getElementById('problem');
    const answerInput = document.getElementById('answer');
    const submitButton = document.getElementById('submit');
    const resultElement = document.getElementById('result');
    const voiceButton = document.createElement('button');
    voiceButton.textContent = '🎤 音声で答える';
    voiceButton.className = 'submit-btn';
    document.body.appendChild(voiceButton);

    const markContainer = document.createElement('div');
    markContainer.className = 'mark-container';
    document.body.appendChild(markContainer);

    const fanfareSound = document.getElementById('fanfare-sound');
    let correctStreak = 0; // 連続正解のカウント
    const compliments = [
        "正解！素晴らしい！",
        "よくできました！",
        "その調子！",
        "素晴らしい！",
        "すごい！その通り！",
        "いい感じだね！",
        "よく頑張ったね！",
        "完璧です！"
    ];

    let currentProblem = generateProblem();
    displayProblem(currentProblem);


    // 問題を生成する関数
    function generateProblem() {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        return { num1, num2, answer: num1 + num2 };
    }

    // 問題を画面に表示し、読み上げる関数
    function displayProblem(problem) {
        problemElement.textContent = `${problem.num1} + ${problem.num2} = ?`;
        answerInput.value = '';
        resultElement.textContent = '';
        speakText(`${problem.num1} たす ${problem.num2} は？`, 1.1, 1.2); // 問題をテンション高く読み上げ
    }

    // ランダムに褒め言葉を選ぶ関数
    function getRandomCompliment() {
        const randomIndex = Math.floor(Math.random() * compliments.length);
        return compliments[randomIndex];
    }

    function addCorrectMark() {
        const mark = document.createElement('span');
        mark.textContent = '✔️';
        mark.className = 'mark';
        markContainer.appendChild(mark);

        if (correctStreak % 3 === 0 && correctStreak !== 0) {
            const separator = document.createElement('span');
            separator.textContent = ' | ';
            separator.className = 'separator';
            markContainer.appendChild(separator);
        }
    }

    function clearMarks() {
        markContainer.innerHTML = '';
    }

    function checkAnswer(problem, userAnswer) {
        if (userAnswer === problem.answer) {
            const compliment = getRandomCompliment(); // 褒め言葉をランダムに選ぶ
            resultElement.textContent = compliment;
            // 褒め言葉をテンション高く読み上げてから次の問題を表示
            const utterance = new SpeechSynthesisUtterance(compliment);
            utterance.lang = 'ja-JP';
            utterance.rate = 1.2; // 褒めるときの速度を速くしてテンションを上げる
            utterance.pitch = 1.3; // 褒めるときのピッチを高くする
            utterance.onend = () => {
                correctStreak++;
                addCorrectMark();

                if (correctStreak === 10) {
                    fanfareSound.play();
                    resultElement.textContent = "10問連続正解！すごい！";
                    correctStreak = 0;
                    clearMarks();
                } else {
                    currentProblem = generateProblem();
                    displayProblem(currentProblem);
                }
            };
            speechSynthesis.speak(utterance);
        } else {
            resultElement.textContent = "間違い。もう一度やってみてください。";
            speakText("間違い。もう一度やってみてください。", 1, 1); // 誤答時は通常の速度とピッチで
            correctStreak = 0;
            clearMarks();
        }
    }

    // 音声ボタンが押された時に音声認識を開始
    voiceButton.addEventListener('click', async () => {
        try {
            await checkMicrophonePermission();
            const transcript = await startVoiceRecognition();
            const userAnswer = parseInt(transcript);
            if (!isNaN(userAnswer)) {
                answerInput.value = userAnswer;
            } else {
                resultElement.textContent = "音声認識がうまくいきませんでした。";
            }
        } catch (error) {
            resultElement.textContent = `エラーが発生しました: ${error}`;
        }
    });

    // 答えボタンが押されたときに答えを確認
    submitButton.addEventListener('click', () => {
        const userAnswer = parseInt(answerInput.value);
        if (isNaN(userAnswer)) {
            resultElement.textContent = "数字を入力してください。";
            speakText("数字を入力してください。");
        } else {
            checkAnswer(currentProblem, userAnswer);
        }
    });

    // Enterキーで「答える」ボタンを押す処理
    answerInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            submitButton.click();
        }
    });
});
