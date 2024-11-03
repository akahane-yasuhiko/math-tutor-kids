import { checkMicrophonePermission, startVoiceRecognition, speakText } from './utils/speechUtils.js';
import { generateMultiplicationProblem, checkAnswer } from './utils/problemUtils.js';
import { handleCorrectAnswer, handleIncorrectAnswer } from './utils/feedbackUtils.js';

document.addEventListener('DOMContentLoaded', () => {
    const problemElement = document.getElementById('problem');
    const answerInput = document.getElementById('answer');
    const submitButton = document.getElementById('submit');
    const resultElement = document.getElementById('result');
    const markContainer = document.getElementById('mark-container');
    const voiceButton = document.getElementById('voice-answer');
    const correctSound = new Audio('./audio/correct-sound.mp3');
    const fanfareSound = new Audio('./audio/fanfare.mp3');
    let currentProblem = generateMultiplicationProblem();
    displayProblem(currentProblem);

    function displayProblem(problem) {
        problemElement.textContent = `${problem.num1} × ${problem.num2} = ?`;
        answerInput.value = '';
        resultElement.textContent = '';
        speakText(`${problem.num1} かける ${problem.num2} は？`, 1.2, 1.2);
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
                handleCorrectAnswer(resultElement, markContainer, correctSound, fanfareSound, () => {
                    currentProblem = generateMultiplicationProblem();
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
