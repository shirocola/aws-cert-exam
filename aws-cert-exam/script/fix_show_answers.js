const fs = require('fs');

for (let i = 1; i <= 23; i++) {
    const filename = `../practice-exam-${i}.html`;
    let content = fs.readFileSync(filename, 'utf-8');
    
    // Replace showQuestion function
    const oldShowQuestion = `        function showQuestion(index, showAnswer = false) {
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
        }`;
    
    const newShowQuestion = `        function showQuestion(index) {
            currentQuestion = index;
            const q = questions[index], isMultiple = q.correct.length > 1, inputType = isMultiple ? 'checkbox' : 'radio';
            const userAns = userAnswers[index] || [];
            const showAnswer = questionRevealed[index] || false;
            
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
        }`;
    
    // Replace navigation functions
    const oldNav = `        function goToQuestion(index) { 
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
        }`;
    
    const newNav = `        function goToQuestion(index) { 
            if (userAnswers[currentQuestion] && userAnswers[currentQuestion].length > 0) {
                questionRevealed[currentQuestion] = true;
            }
            showQuestion(index); 
        }
        function nextQuestion() { 
            if (currentQuestion < questions.length - 1) { 
                if (userAnswers[currentQuestion] && userAnswers[currentQuestion].length > 0) {
                    questionRevealed[currentQuestion] = true;
                }
                currentQuestion++; 
                showQuestion(currentQuestion); 
            } 
        }
        function prevQuestion() { 
            if (currentQuestion > 0) { 
                if (userAnswers[currentQuestion] && userAnswers[currentQuestion].length > 0) {
                    questionRevealed[currentQuestion] = true;
                }
                currentQuestion--; 
                showQuestion(currentQuestion); 
            } 
        }`;
    
    // Add questionRevealed to the variables
    const oldVars = `        let currentQuestion = 0, userAnswers = {}, flaggedQuestions = new Set(), examSubmitted = false, startTime = Date.now(), timerInterval;`;
    const newVars = `        let currentQuestion = 0, userAnswers = {}, flaggedQuestions = new Set(), questionRevealed = {}, examSubmitted = false, startTime = Date.now(), timerInterval;`;
    
    // Update restartExam to reset questionRevealed
    const oldRestart = `            currentQuestion = 0; userAnswers = {}; flaggedQuestions.clear(); examSubmitted = false; startTime = Date.now(); clearInterval(timerInterval);`;
    const newRestart = `            currentQuestion = 0; userAnswers = {}; flaggedQuestions.clear(); questionRevealed = {}; examSubmitted = false; startTime = Date.now(); clearInterval(timerInterval);`;
    
    content = content.replace(oldShowQuestion, newShowQuestion);
    content = content.replace(oldNav, newNav);
    content = content.replace(oldVars, newVars);
    content = content.replace(oldRestart, newRestart);
    
    fs.writeFileSync(filename, content, 'utf-8');
    console.log(`Updated ${filename}`);
}

console.log('\nSuccessfully updated all 23 exam files!');
