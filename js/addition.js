import { checkMicrophonePermission, startVoiceRecognition, speakText } from './utils/speechUtils.js';
import { generateAdditionProblem, checkAnswer } from './utils/problemUtils.js';
import { handleCorrectAnswer, handleIncorrectAnswer } from './utils/feedbackUtils.js';

document.addEventListener('DOMContentLoaded', () => {
    const problemElement = document.getElementById('problem');
    const answerInput = document.getElementById('answer');
    const submitButton = document.getElementById('submit');
    const resultElement = document.getElementById('result');
    const markContainer = document.getElementById('mark-container');
    const fanfareSound = document.getElementById('fanfare-sound');
    const voiceButton = document.getElementById('voice-answer');

    let correctStreak = 0;

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

    let currentProblem = generateAdditionProblem();
    displayProblem(currentProblem);

    function displayProblem(problem) {
        problemElement.textContent = `${problem.num1} + ${problem.num2} = ?`;
        answerInput.value = '';
        resultElement.textContent = '';
        speakText(`${problem.num1} たす ${problem.num2} は？`, 1.2, 1.2);
    }

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
            const compliment = getRandomCompliment();
            resultElement.textContent = compliment;
            const utterance = new SpeechSynthesisUtterance(compliment);
            utterance.lang = 'ja-JP';
            utterance.rate = 1.4;
            utterance.pitch = 1.5;
            utterance.onend = () => {
                correctStreak++;
                addCorrectMark();

                if (correctStreak === 10) {
                    fanfareSound.play();
                    resultElement.textContent = "10問連続正解！すごい！";
                    correctStreak = 0;
                    clearMarks();
                } else {
                    currentProblem = generateAdditionProblem();
                    displayProblem(currentProblem);
                }
            };
            speechSynthesis.speak(utterance);
        } else {
            resultElement.textContent = "間違い。もう一度やってみてください。";
            speakText("間違い。もう一度やってみてください。");
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
    submitButton.addEventListener('click', () => {
        const userAnswer = parseInt(answerInput.value);
        if (isNaN(userAnswer)) {
            resultElement.textContent = "数字を入力してください。";
            speakText("数字を入力してください。");
        } else {
            checkAnswer(currentProblem, userAnswer);
        }
    });

    answerInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            submitButton.click();
        }
    });
});
