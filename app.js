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

    // マイクのアクセス権を確認する関数
    function checkMicrophonePermission() {
        navigator.permissions.query({ name: 'microphone' }).then((permissionStatus) => {
            if (permissionStatus.state === 'granted') {
                console.log('マイクのアクセスは許可されています');
                startVoiceRecognition(); // マイクが許可されていれば音声認識を開始
            } else if (permissionStatus.state === 'prompt') {
                console.log('マイクのアクセスは確認が必要です');
                startVoiceRecognition(); // 許可ダイアログが表示される
            } else if (permissionStatus.state === 'denied') {
                console.log('マイクのアクセスは拒否されています');
                alert('マイクのアクセスが拒否されています。ブラウザの設定を確認してください。');
            }
        }).catch((error) => {
            console.error('マイクの権限を確認中にエラーが発生しました:', error);
        });
    }

    // 音声認識を開始する関数
    function startVoiceRecognition() {
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
                console.log('音声で認識された答え:', userAnswer);
                answerInput.value = userAnswer; // 音声認識結果をテキストボックスに入力
            } else {
                resultElement.textContent = "音声認識がうまくいきませんでした。";
            }
        };

        recognition.onerror = (event) => {
            console.error('音声認識中にエラーが発生しました:', event.error);
            resultElement.textContent = `エラーが発生しました: ${event.error}`;
        };
    }

    // 音声で問題を読み上げる関数
    function speakText(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP'; // 日本語設定
        speechSynthesis.speak(utterance);
    }

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
        speakText(`${problem.num1} たす ${problem.num2} は？`); // 問題を読み上げ
    }

    // ユーザーの入力を確認し、正解なら読み上げてから次の問題を表示する関数
    function checkAnswer(problem, userAnswer) {
        if (userAnswer === problem.answer) {
            resultElement.textContent = "正解！";
            speakText("正解！"); // 正解を読み上げ
            const utterance = new SpeechSynthesisUtterance("正解！");
            utterance.lang = 'ja-JP';
            utterance.onend = () => {
                currentProblem = generateProblem();
                displayProblem(currentProblem);
            };
            speechSynthesis.speak(utterance);
        } else {
            resultElement.textContent = "間違い。もう一度やってみてください。";
            speakText("間違い。もう一度やってみてください。"); // 間違いも読み上げ
        }
    }

    // 音声ボタンが押された時に音声認識を開始
    voiceButton.addEventListener('click', () => {
        checkMicrophonePermission();
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
});
