import { speakText } from './speechUtils.js';

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

export let correctStreak = 0; // 連続正解のカウント

// ランダムに褒め言葉を選ぶ関数
export function getRandomCompliment() {
    const randomIndex = Math.floor(Math.random() * compliments.length);
    return compliments[randomIndex];
}

// 正解マークを追加し、3つごとに区切りを入れる関数
export function addCorrectMark(markContainer) {
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

// 正解マークをクリアする関数
export function clearMarks(markContainer) {
    markContainer.innerHTML = '';
}

// 正解時のフィードバックを行う関数
export function handleCorrectAnswer(resultElement, markContainer, correctSound, fanfareSound, displayNextProblem) {
    const compliment = getRandomCompliment();
    resultElement.textContent = compliment;

    // 正解時の音声を再生し、その後褒め言葉を読み上げ
    correctSound.play();
    correctSound.onended = () => {
        const utterance = new SpeechSynthesisUtterance(compliment);
        utterance.lang = 'ja-JP';
        utterance.rate = 1.2;
        utterance.pitch = 1.3;
        utterance.onend = () => {
            correctStreak++;
            addCorrectMark(markContainer);

            // 10問連続正解時の処理
            if (correctStreak === 10) {
                fanfareSound.play();
                fanfareSound.onended = () => {
                    resultElement.textContent = "10問連続正解！すごい！";
                    correctStreak = 0;
                    clearMarks(markContainer);
                    displayNextProblem();
                };
            } else {
                displayNextProblem();
            }
        };
        speechSynthesis.speak(utterance);
    };
}

// 不正解時のフィードバックを行う関数
export function handleIncorrectAnswer(resultElement, markContainer, incorrectSound) {
    resultElement.textContent = "間違い。もう一度やってみてください。";
    incorrectSound.play();
    incorrectSound.onended = () => {
        speakText("間違い。もう一度やってみてください。", 1, 1);
        correctStreak = 0;
        clearMarks(markContainer);
    };
}
