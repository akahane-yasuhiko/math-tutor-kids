// 足し算の問題を生成する関数
export function generateAdditionProblem() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    return { num1, num2, answer: num1 + num2 };
}

// 引き算の問題を生成する関数
export function generateSubtractionProblem() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const [larger, smaller] = num1 > num2 ? [num1, num2] : [num2, num1];
    return { num1: larger, num2: smaller, answer: larger - smaller };
}

// 掛け算の問題を生成する関数
export function generateMultiplicationProblem() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    return { num1, num2, answer: num1 * num2 };
}

// 回答をチェックする関数
export function checkAnswer(problem, userAnswer) {
    return problem.answer === userAnswer;
}
