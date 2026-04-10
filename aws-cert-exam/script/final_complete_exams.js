const fs = require('fs');

const content = fs.readFileSync('../merged (1).html', 'utf-8');
const match = content.match(/<textarea id="markdown-source"[^>]*>([\s\S]*?)<\/textarea>/);
if (!match) {
    console.log("Could not find markdown content");
    process.exit(1);
}

const markdown = match[1];
const parts = markdown.split(/# Practice Exam \d+/);
const examNumbers = [...markdown.matchAll(/# Practice Exam (\d+)/g)].map(m => m[1]);

parts.slice(1).forEach((examContent, idx) => {
    const examNum = examNumbers[idx];
    const lines = examContent.split('\n');
    const questions = [];
    
    let currentQ = null;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const qMatch = line.match(/^(\d+)\.\s+(.+)/);
        if (qMatch) {
            if (currentQ) questions.push(currentQ);
            currentQ = { num: qMatch[1], text: qMatch[2], options: [], correct: [] };
        } else if (currentQ && line.match(/^\s+- ([A-E])\.\s+(.+)/)) {
            const opt = line.match(/^\s+- ([A-E])\.\s+(.+)/);
            currentQ.options.push({ letter: opt[1], text: opt[2] });
        } else if (currentQ && line.includes('Correct answer:')) {
            const ans = line.match(/Correct answer:\s*([A-E, ]+)/);
            if (ans) currentQ.correct = ans[1].split(',').map(a => a.trim());
        }
    }
    if (currentQ) questions.push(currentQ);
    
    const filename = `../practice-exam-${examNum}.html`;
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PRACTICE EXAM ${examNum}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
        .top-bar { max-width: 1200px; margin: 0 auto 20px; }
        .back-btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; background: #232f3e; color: white; text-decoration: none; border-radius: 4px; font-weight: 600; transition: background 0.2s; }
        .back-btn:hover { background: #131921; }
        .container { max-width: 1200px; margin: 0 auto; display: flex; gap: 20px; }
        .main-content { flex: 1; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .sidebar { width: 250px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); position: sticky; top: 20px; height: fit-content; }
        h1 { color: #232f3e; margin-bottom: 20px; font-size: 24px; }
        .timer { background: #232f3e; color: white; padding: 15px; border-radius: 4px; text-align: center; margin-bottom: 20px; font-size: 20px; font-weight: bold; }
        .progress { margin-bottom: 20px; }
        .progress-bar { width: 100%; height: 8px; background: #e0e0e0; border-radius: 4px; overflow: hidden; }
        .progress-fill { height: 100%; background: #ff9900; transition: width 0.3s; }
        .progress-text { margin-top: 5px; font-size: 14px; color: #666; }
        .question-nav { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-bottom: 20px; }
        .nav-btn { padding: 8px; border: 2px solid #ddd; background: white; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 600; transition: all 0.2s; }
        .nav-btn:hover { background: #f0f0f0; }
        .nav-btn.current { background: #0073bb; color: white; border-color: #0073bb; }
        .nav-btn.answered { background: #d4edda; border-color: #28a745; }
        .nav-btn.flagged { background: #fff3cd; border-color: #ffc107; }
        .question { margin-bottom: 30px; }
        .question-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .question-text { font-size: 18px; font-weight: 600; color: #333; }
        .flag-btn { padding: 8px 16px; border: 2px solid #ffc107; background: white; border-radius: 4px; cursor: pointer; font-size: 14px; }
        .flag-btn.flagged { background: #ffc107; color: white; }
        .option { padding: 12px; margin: 8px 0; border: 2px solid #ddd; border-radius: 4px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; }
        .option:hover { background: #f0f8ff; border-color: #0073bb; }
        .option.selected { background: #e3f2fd; border-color: #0073bb; }
        .option.correct { background: #d4edda; border-color: #28a745; }
        .option.incorrect { background: #f8d7da; border-color: #dc3545; }
        .option input[type="checkbox"], .option input[type="radio"] { margin-right: 10px; width: 18px; height: 18px; cursor: pointer; }
        .buttons { margin: 20px 0; display: flex; gap: 10px; flex-wrap: wrap; }
        button { padding: 12px 24px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; font-weight: 600; }
        .btn-primary { background: #ff9900; color: white; }
        .btn-primary:hover { background: #ec7211; }
        .btn-secondary { background: #232f3e; color: white; }
        .btn-secondary:hover { background: #131921; }
        .btn-danger { background: #dc3545; color: white; }
        .btn-danger:hover { background: #c82333; }
        button:disabled { opacity: 0.5; cursor: not-allowed; }
        .results { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .score { font-size: 24px; font-weight: bold; margin: 10px 0; }
        .pass { color: #28a745; }
        .fail { color: #dc3545; }
        .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0; }
        .stat-card { background: white; padding: 15px; border-radius: 4px; text-align: center; border: 2px solid #e0e0e0; }
        .stat-value { font-size: 28px; font-weight: bold; color: #232f3e; }
        .stat-label { font-size: 14px; color: #666; margin-top: 5px; }
        .hidden { display: none; }
        @media (max-width: 768px) {
            .container { flex-direction: column; }
            .sidebar { width: 100%; position: static; }
            .stats { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="top-bar">
        <a href="index.html" class="back-btn"><span>←</span><span>Back to Exam List</span></a>
    </div>
    <div class="container">
        <div class="main-content">
            <h1>PRACTICE EXAM ${examNum}</h1>
            <div id="exam-view">
                <div id="question-container"></div>
                <div class="buttons">
                    <button class="btn-secondary" id="prev-btn" onclick="prevQuestion()">← Previous</button>
                    <button class="btn-primary" id="next-btn" onclick="nextQuestion()">Next →</button>
                    <button class="btn-danger hidden" id="submit-btn" onclick="confirmSubmit()">Submit Exam</button>
                    <button class="btn-secondary" onclick="clearAnswer()">Clear Answer</button>
                </div>
            </div>
            <div id="results-view" class="hidden">
                <div class="results">
                    <h2>Exam Results</h2>
                    <div class="score" id="score-display"></div>
                    <div id="pass-status"></div>
                    <div class="stats">
                        <div class="stat-card"><div class="stat-value" id="correct-count">0</div><div class="stat-label">Correct</div></div>
                        <div class="stat-card"><div class="stat-value" id="incorrect-count">0</div><div class="stat-label">Incorrect</div></div>
                        <div class="stat-card"><div class="stat-value" id="unanswered-count">0</div><div class="stat-label">Unanswered</div></div>
                    </div>
                    <div id="time-taken"></div>
                </div>
                <div class="buttons">
                    <button class="btn-primary" onclick="reviewAnswers()">Review Answers</button>
                    <button class="btn-secondary" onclick="restartExam()">Retake Exam</button>
                    <a href="index.html" class="btn-secondary" style="display: inline-block; text-decoration: none; text-align: center; padding: 12px 24px;">Back to Exam List</a>
                </div>
            </div>
            <div id="review-view" class="hidden">
                <h2>Answer Review</h2>
                <div id="all-questions"></div>
                <div class="buttons">
                    <button class="btn-secondary" onclick="backToResults()">Back to Results</button>
                    <button class="btn-primary" onclick="restartExam()">Retake Exam</button>
                    <a href="index.html" class="btn-secondary" style="display: inline-block; text-decoration: none; text-align: center; padding: 12px 24px;">Back to Exam List</a>
                </div>
            </div>
        </div>
        <div class="sidebar">
            <div class="timer" id="timer">00:00</div>
            <div class="progress">
                <div class="progress-bar"><div class="progress-fill" id="progress-fill"></div></div>
                <div class="progress-text" id="progress-text">0 of ${questions.length} answered</div>
            </div>
            <h3 style="margin-bottom: 10px; font-size: 16px;">Question Navigator</h3>
            <div class="question-nav" id="question-nav"></div>
            <div style="margin-top: 15px; font-size: 12px; color: #666;">
                <div>🟦 Current</div><div>🟩 Answered</div><div>🟨 Flagged</div>
            </div>
        </div>
    </div>
    <script>
        const questions = ${JSON.stringify(questions)};
        let currentQuestion = 0, userAnswers = {}, flaggedQuestions = new Set(), examSubmitted = false, startTime = Date.now(), timerInterval;

        function initExam() { startTimer(); renderQuestionNav(); showQuestion(0); }
        function startTimer() {
            timerInterval = setInterval(() => {
                if (!examSubmitted) {
                    const elapsed = Math.floor((Date.now() - startTime) / 1000), mins = Math.floor(elapsed / 60), secs = elapsed % 60;
                    document.getElementById('timer').textContent = \`\${String(mins).padStart(2, '0')}:\${String(secs).padStart(2, '0')}\`;
                }
            }, 1000);
        }
        function renderQuestionNav() {
            document.getElementById('question-nav').innerHTML = questions.map((q, i) => \`<button class="nav-btn" onclick="goToQuestion(\${i})" id="nav-\${i}">\${i + 1}</button>\`).join('');
            updateNavigation();
        }
        function updateNavigation() {
            questions.forEach((q, i) => {
                const btn = document.getElementById('nav-' + i);
                btn.className = 'nav-btn';
                if (i === currentQuestion) btn.classList.add('current');
                if (userAnswers[i] && userAnswers[i].length > 0) btn.classList.add('answered');
                if (flaggedQuestions.has(i)) btn.classList.add('flagged');
            });
            updateProgress();
        }
        function updateProgress() {
            const answered = Object.keys(userAnswers).filter(k => userAnswers[k].length > 0).length;
            const percentage = (answered / questions.length) * 100;
            document.getElementById('progress-fill').style.width = percentage + '%';
            document.getElementById('progress-text').textContent = \`\${answered} of \${questions.length} answered\`;
        }
        function showQuestion(index, showAnswer = false) {
            currentQuestion = index;
            const q = questions[index], isMultiple = q.correct.length > 1, inputType = isMultiple ? 'checkbox' : 'radio';
            const userAns = userAnswers[index] || [];
            
            document.getElementById('question-container').innerHTML = \`
                <div class="question">
                    <div class="question-header">
                        <div class="question-text">Question \${index + 1} of \${questions.length}\${isMultiple ? ' (Choose ' + q.correct.length + ')' : ''}</div>
                        <button class="flag-btn \${flaggedQuestions.has(index) ? 'flagged' : ''}" onclick="toggleFlag()">\${flaggedQuestions.has(index) ? '🚩 Flagged' : '🏳️ Flag'}</button>
                    </div>
                    <div class="question-text" style="margin-bottom: 20px;">\${q.text}</div>
                    \${q.options.map(opt => {
                        const isUserAnswer = userAns.includes(opt.letter);
                        const isCorrectAnswer = q.correct.includes(opt.letter);
                        let optClass = 'option';
                        if (showAnswer) {
                            if (isCorrectAnswer) optClass += ' correct';
                            else if (isUserAnswer) optClass += ' incorrect';
                        }
                        return \`<label class="\${optClass}" id="opt-\${opt.letter}">
                            <input type="\${inputType}" name="answer" value="\${opt.letter}" 
                                \${isUserAnswer ? 'checked' : ''} 
                                \${showAnswer ? 'disabled' : ''}
                                onchange="selectOption('\${opt.letter}', this.checked)">
                            <span><strong>\${opt.letter}.</strong> \${opt.text}\${showAnswer && isCorrectAnswer ? ' ✓' : ''}</span>
                        </label>\`;
                    }).join('')}
                    \${showAnswer ? \`<div style="margin-top: 15px; padding: 12px; background: #f8f9fa; border-radius: 4px; border-left: 4px solid #0073bb;">
                        <strong>Your answer:</strong> \${userAns.length > 0 ? userAns.join(', ') : 'Not answered'}<br>
                        <strong>Correct answer:</strong> \${q.correct.join(', ')}
                    </div>\` : ''}
                </div>\`;
            document.getElementById('prev-btn').disabled = index === 0;
            document.getElementById('next-btn').classList.toggle('hidden', index === questions.length - 1);
            document.getElementById('submit-btn').classList.toggle('hidden', index !== questions.length - 1);
            updateNavigation();
        }
        function selectOption(letter, checked) {
            const q = questions[currentQuestion], isMultiple = q.correct.length > 1;
            if (!userAnswers[currentQuestion]) userAnswers[currentQuestion] = [];
            if (isMultiple) {
                if (checked) {
                    if (userAnswers[currentQuestion].length >= q.correct.length && !userAnswers[currentQuestion].includes(letter)) {
                        event.target.checked = false;
                        alert(\`You can only select \${q.correct.length} options for this question.\`);
                        return;
                    }
                    if (!userAnswers[currentQuestion].includes(letter)) userAnswers[currentQuestion].push(letter);
                } else {
                    userAnswers[currentQuestion] = userAnswers[currentQuestion].filter(a => a !== letter);
                }
            } else {
                userAnswers[currentQuestion] = checked ? [letter] : [];
            }
            updateNavigation();
        }
        function toggleFlag() { flaggedQuestions.has(currentQuestion) ? flaggedQuestions.delete(currentQuestion) : flaggedQuestions.add(currentQuestion); showQuestion(currentQuestion); }
        function clearAnswer() { userAnswers[currentQuestion] = []; showQuestion(currentQuestion); }
        function goToQuestion(index) { 
            const hasAnswered = userAnswers[currentQuestion] && userAnswers[currentQuestion].length > 0;
            showQuestion(index, hasAnswered); 
        }
        function nextQuestion() { 
            if (currentQuestion < questions.length - 1) { 
                const hasAnswered = userAnswers[currentQuestion] && userAnswers[currentQuestion].length > 0;
                currentQuestion++; 
                showQuestion(currentQuestion, hasAnswered); 
            } 
        }
        function prevQuestion() { 
            if (currentQuestion > 0) { 
                const hasAnswered = userAnswers[currentQuestion] && userAnswers[currentQuestion].length > 0;
                currentQuestion--; 
                showQuestion(currentQuestion, hasAnswered); 
            } 
        }
        function confirmSubmit() {
            const answered = Object.keys(userAnswers).filter(k => userAnswers[k].length > 0).length, unanswered = questions.length - answered;
            if (unanswered > 0 && !confirm(\`You have \${unanswered} unanswered question(s). Do you want to submit anyway?\`)) return;
            submitExam();
        }
        function submitExam() {
            examSubmitted = true; clearInterval(timerInterval);
            let correct = 0, incorrect = 0, unanswered = 0;
            questions.forEach((q, i) => {
                const userAns = userAnswers[i] || [], correctAns = q.correct;
                if (userAns.length === 0) unanswered++;
                else if (userAns.length === correctAns.length && userAns.every(a => correctAns.includes(a))) correct++;
                else incorrect++;
            });
            const percentage = (correct / questions.length * 100).toFixed(1), passed = percentage >= 70;
            const elapsed = Math.floor((Date.now() - startTime) / 1000), mins = Math.floor(elapsed / 60), secs = elapsed % 60;
            document.getElementById('exam-view').classList.add('hidden');
            document.getElementById('results-view').classList.remove('hidden');
            document.getElementById('score-display').innerHTML = \`Score: \${correct}/\${questions.length} (\${percentage}%)\`;
            document.getElementById('pass-status').innerHTML = \`<div class="score \${passed ? 'pass' : 'fail'}">\${passed ? '✓ PASSED' : '✗ FAILED'}</div>\`;
            document.getElementById('correct-count').textContent = correct;
            document.getElementById('incorrect-count').textContent = incorrect;
            document.getElementById('unanswered-count').textContent = unanswered;
            document.getElementById('time-taken').innerHTML = \`<strong>Time taken:</strong> \${mins}m \${secs}s\`;
        }
        function reviewAnswers() {
            document.getElementById('all-questions').innerHTML = questions.map((q, i) => {
                const userAns = userAnswers[i] || [], correctAns = q.correct;
                const isCorrect = userAns.length === correctAns.length && userAns.every(a => correctAns.includes(a)), isUnanswered = userAns.length === 0;
                return \`<div class="question" style="border-left: 4px solid \${isUnanswered ? '#ffc107' : isCorrect ? '#28a745' : '#dc3545'}; padding-left: 15px; margin-bottom: 30px;">
                    <div class="question-text">Question \${i + 1}: \${q.text}</div>
                    \${q.options.map(opt => {
                        const isUserAnswer = userAns.includes(opt.letter), isCorrectAnswer = correctAns.includes(opt.letter);
                        let className = 'option';
                        if (isCorrectAnswer) className += ' correct';
                        else if (isUserAnswer) className += ' incorrect';
                        return \`<div class="\${className}"><strong>\${opt.letter}.</strong> \${opt.text} \${isCorrectAnswer ? '✓' : ''}</div>\`;
                    }).join('')}
                    <div style="margin-top: 10px; padding: 10px; background: #f8f9fa; border-radius: 4px;">
                        <strong>Your answer:</strong> \${userAns.length > 0 ? userAns.join(', ') : 'Not answered'}<br>
                        <strong>Correct answer:</strong> \${correctAns.join(', ')}
                    </div></div>\`;
            }).join('');
            document.getElementById('results-view').classList.add('hidden');
            document.getElementById('review-view').classList.remove('hidden');
        }
        function backToResults() { document.getElementById('review-view').classList.add('hidden'); document.getElementById('results-view').classList.remove('hidden'); }
        function restartExam() {
            currentQuestion = 0; userAnswers = {}; flaggedQuestions.clear(); examSubmitted = false; startTime = Date.now(); clearInterval(timerInterval);
            document.getElementById('results-view').classList.add('hidden'); document.getElementById('review-view').classList.add('hidden'); document.getElementById('exam-view').classList.remove('hidden');
            initExam();
        }
        initExam();
    </script>
</body>
</html>`;
    
    fs.writeFileSync(filename, html, 'utf-8');
    console.log(`Created ${filename}`);
});

console.log(`\nSuccessfully created ${examNumbers.length} complete interactive exam files!`);
