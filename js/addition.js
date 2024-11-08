import { checkMicrophonePermission, startVoiceRecognition, speakText } from './utils/speechUtils.js';
import { generateAdditionProblem, checkAnswer } from './utils/problemUtils.js';
import { handleCorrectAnswerWithName, handleIncorrectAnswer } from './utils/feedbackUtils.js';

document.addEventListener('DOMContentLoaded', () => {
    const problemElement = document.getElementById('problem');
    const answerInput = document.getElementById('answer');
    const submitButton = document.getElementById('submit');
    const resultElement = document.getElementById('result');
    const markContainer = document.getElementById('mark-container');
    const voiceButton = document.getElementById('voice-answer');
    const correctSound = new Audio('./audio/correct-sound.mp3');
    const incorrectSound = new Audio('./audio/incorrect-sound.mp3');
    const fanfareSound = new Audio('./audio/fanfare.mp3');
    let currentProblem = generateAdditionProblem();
    displayProblem(currentProblem);

    function displayProblem(problem) {
        problemElement.textContent = `${problem.num1} + ${problem.num2} =`;
        answerInput.value = '';
        resultElement.textContent = '';
        speakText(`${problem.num1} たす ${problem.num2} は？`, 1.2, 1.2);
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
                handleCorrectAnswerWithName(resultElement, markContainer, correctSound, fanfareSound, () => {
                    currentProblem = generateAdditionProblem();
                    displayProblem(currentProblem);
                }, userName);
            } else {
                handleIncorrectAnswer(resultElement, markContainer, incorrectSound);
            }
        }
    });

    answerInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            submitButton.click();
        }
    });

    // ソフトキーボード
    let userName = "";
    const nameInput = document.getElementById('name-input');
    const keyboardButtons = document.querySelectorAll('.keyboard button');

    keyboardButtons.forEach(button => {
        const key = button.textContent;
    
        button.addEventListener('click', () => {
            if (key === "␣") {
                nameInput.value += " ";
            } else if (key === "←") {
                nameInput.value = nameInput.value.slice(0, -1);
            } else if (key === "OK") {
                userName = nameInput.value;
                alert(`こんにちは、${userName}さん！`); // 動作確認用
            } else if (key) {
                nameInput.value += key;
            }
        });
    });
    
    // スペース、削除、完了ボタンを追加
    const spaceButton = document.createElement('button');
    spaceButton.textContent = "␣";
    spaceButton.addEventListener('click', () => {
        nameInput.value += " ";
    });
    keyboardContainer.appendChild(spaceButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = "←";
    deleteButton.addEventListener('click', () => {
        nameInput.value = nameInput.value.slice(0, -1);
    });
    keyboardContainer.appendChild(deleteButton);

    const doneButton = document.createElement('button');
    doneButton.textContent = "完了";
    doneButton.addEventListener('click', () => {
        userName = nameInput.value;
        alert(`こんにちは、${userName}さん！`); // 動作確認用
    });
    keyboardContainer.appendChild(doneButton);
});
