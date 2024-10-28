document.addEventListener('DOMContentLoaded', () => {
    const problemElement = document.getElementById('problem');
    const answerInput = document.getElementById('answer');
    const submitButton = document.getElementById('submit');
    const resultElement = document.getElementById('result');
    const markContainer = document.getElementById('mark-container');
    const fanfareSound = document.getElementById('fanfare-sound');

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

    let currentProblem = generateProblem();
    displayProblem(currentProblem);

    function speakText(text, rate = 1, pitch = 1) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        utterance.rate = rate;
        utterance.pitch = pitch;
        speechSynthesis.speak(utterance);
    }

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
                    currentProblem = generateProblem();
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
