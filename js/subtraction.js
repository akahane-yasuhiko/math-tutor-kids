import { checkMicrophonePermission, startVoiceRecognition, speakText } from './utils/speechUtils.js';
import { generateSubtractionProblem, checkAnswer } from './utils/problemUtils.js';
import { handleCorrectAnswer, handleIncorrectAnswer } from './utils/feedbackUtils.js';

document.addEventListener('DOMContentLoaded', () => {
    const problemElement = document.getElementById('problem');
    const answerInput = document.getElementById('answer');
    const submitButton = document.getElementById('submit');
    const resultElement = document.getElementById('result');
    const markContainer = document.getElementById('mark-container');
    const fanfareSound = document.getElementById('fanfare-sound');
    const voiceButton = document.getElementById('voice-answer');

    let currentProblem = generateProblem();
    displayProblem(currentProblem);

    function generateProblem() {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const [larger, smaller] = num1 > num2 ? [num1, num2] : [num2, num1]; // 結果が負にならないように調整
        return { num1: larger, num2: smaller, answer: larger - smaller };
    }

    function displayProblem(problem) {
        problemElement.textContent = `${problem.num1} - ${problem.num2} = ?`;
        answerInput.value = '';
        resultElement.textContent = '';
        speakText(`${problem.num1} ひく ${problem.num2} は？`, 1.2, 1.2);
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
            if (checkAnswer(currentProblem, userAnswer)) {
                handleCorrectAnswer(resultElement, markContainer, fanfareSound, () => {
                    currentProblem = generateSubtractionProblem();
                    displayProblem(currentProblem);
                });
            } else {
                handleIncorrectAnswer(resultElement, markContainer);
            }
        }
    });

    answerInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            submitButton.click();
        }
    });
});
