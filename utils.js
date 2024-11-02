// マイクのアクセス権を確認する関数（Promiseベース）
export function checkMicrophonePermission() {
    return new Promise((resolve, reject) => {
        if (!('permissions' in navigator)) {
            alert('ブラウザがマイクのアクセス権確認をサポートしていません。');
            reject(new Error('Permissions API not supported'));
            return;
        }

        navigator.permissions.query({ name: 'microphone' }).then((permissionStatus) => {
            if (permissionStatus.state === 'granted' || permissionStatus.state === 'prompt') {
                resolve();
            } else {
                alert('マイクのアクセスが拒否されています。ブラウザの設定を確認してください。');
                reject(new Error('Microphone access denied'));
            }
        }).catch((error) => {
            console.error('マイクの権限を確認中にエラーが発生しました:', error);
            reject(error);
        });
    });
}

// 音声認識を開始する関数（Promiseベース）
export function startVoiceRecognition() {
    return new Promise((resolve, reject) => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("このブラウザは音声認識に対応していません。");
            reject(new Error("Speech recognition not supported"));
            return;
        }

        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'ja-JP'; // 日本語設定
        recognition.interimResults = false; // 最終結果のみ取得
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            resolve(transcript);
        };

        recognition.onerror = (event) => {
            reject(event.error);
        };

        recognition.start();
    });
}

// テキストを読み上げる関数
export function speakText(text, rate = 1, pitch = 1) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP'; // 日本語設定
    utterance.rate = rate; // 読み上げ速度
    utterance.pitch = pitch; // ピッチ（高さ）
    speechSynthesis.speak(utterance);
}
