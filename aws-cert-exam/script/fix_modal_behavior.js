const fs = require('fs');

for (let i = 1; i <= 23; i++) {
    const filename = `../practice-exam-${i}.html`;
    let content = fs.readFileSync(filename, 'utf-8');
    
    // Replace modal functions to show full answer text
    const oldModalFunctions = `        function showAnswerModal(isCorrect, userAns, correctAns) {
            const modal = document.getElementById('answerModal');
            const header = document.getElementById('modal-header');
            const body = document.getElementById('modal-body');
            
            if (isCorrect) {
                header.className = 'modal-header modal-correct';
                header.innerHTML = '✓ Correct!';
                body.innerHTML = \`<p>Your answer <strong>\${userAns.join(', ')}</strong> is correct!</p>\`;
            } else {
                header.className = 'modal-header modal-incorrect';
                header.innerHTML = '✗ Incorrect';
                body.innerHTML = \`
                    <p><strong>Your answer:</strong> \${userAns.length > 0 ? userAns.join(', ') : 'Not answered'}</p>
                    <p><strong>Correct answer:</strong> \${correctAns.join(', ')}</p>
                \`;
            }
            
            modal.style.display = 'block';
        }
        function closeModal() {
            document.getElementById('answerModal').style.display = 'none';
        }`;
    
    const newModalFunctions = `        function showAnswerModal(isCorrect, userAns, correctAns, questionIndex) {
            const modal = document.getElementById('answerModal');
            const header = document.getElementById('modal-header');
            const body = document.getElementById('modal-body');
            const q = questions[questionIndex];
            
            // Get full text for answers
            const userAnswerText = userAns.map(letter => {
                const opt = q.options.find(o => o.letter === letter);
                return opt ? \`<strong>\${letter}.</strong> \${opt.text}\` : letter;
            }).join('<br>');
            
            const correctAnswerText = correctAns.map(letter => {
                const opt = q.options.find(o => o.letter === letter);
                return opt ? \`<strong>\${letter}.</strong> \${opt.text}\` : letter;
            }).join('<br>');
            
            if (isCorrect) {
                header.className = 'modal-header modal-correct';
                header.innerHTML = '✓ Correct!';
                body.innerHTML = \`<p style="margin-bottom: 10px;">Your answer is correct:</p><div style="padding: 10px; background: #d4edda; border-radius: 4px; border-left: 4px solid #28a745;">\${userAnswerText}</div>\`;
            } else {
                header.className = 'modal-header modal-incorrect';
                header.innerHTML = '✗ Incorrect';
                body.innerHTML = \`
                    <p style="margin-bottom: 10px;"><strong>Your answer:</strong></p>
                    <div style="padding: 10px; background: #f8d7da; border-radius: 4px; border-left: 4px solid #dc3545; margin-bottom: 15px;">\${userAns.length > 0 ? userAnswerText : 'Not answered'}</div>
                    <p style="margin-bottom: 10px;"><strong>Correct answer:</strong></p>
                    <div style="padding: 10px; background: #d4edda; border-radius: 4px; border-left: 4px solid #28a745;">\${correctAnswerText}</div>
                \`;
            }
            
            modal.style.display = 'block';
        }
        function closeModal() {
            document.getElementById('answerModal').style.display = 'none';
            if (pendingNavigation !== null) {
                currentQuestion = pendingNavigation;
                pendingNavigation = null;
                showQuestion(currentQuestion);
            }
        }`;
    
    content = content.replace(oldModalFunctions, newModalFunctions);
    
    // Add pendingNavigation variable
    const oldVars = `        let currentQuestion = 0, userAnswers = {}, flaggedQuestions = new Set(), questionRevealed = {}, examSubmitted = false, startTime = Date.now(), timerInterval;`;
    const newVars = `        let currentQuestion = 0, userAnswers = {}, flaggedQuestions = new Set(), questionRevealed = {}, examSubmitted = false, startTime = Date.now(), timerInterval, pendingNavigation = null;`;
    
    content = content.replace(oldVars, newVars);
    
    // Update nextQuestion to not navigate immediately
    const oldNext = `        function nextQuestion() { 
            if (currentQuestion < questions.length - 1) { 
                const userAns = userAnswers[currentQuestion] || [];
                if (userAns.length > 0) {
                    const q = questions[currentQuestion];
                    const correctAns = q.correct;
                    const isCorrect = userAns.length === correctAns.length && userAns.every(a => correctAns.includes(a));
                    questionRevealed[currentQuestion] = true;
                    showAnswerModal(isCorrect, userAns, correctAns);
                }
                currentQuestion++; 
                showQuestion(currentQuestion); 
            } 
        }`;
    
    const newNext = `        function nextQuestion() { 
            if (currentQuestion < questions.length - 1) { 
                const userAns = userAnswers[currentQuestion] || [];
                if (userAns.length > 0) {
                    const q = questions[currentQuestion];
                    const correctAns = q.correct;
                    const isCorrect = userAns.length === correctAns.length && userAns.every(a => correctAns.includes(a));
                    questionRevealed[currentQuestion] = true;
                    pendingNavigation = currentQuestion + 1;
                    showAnswerModal(isCorrect, userAns, correctAns, currentQuestion);
                } else {
                    currentQuestion++; 
                    showQuestion(currentQuestion);
                }
            } 
        }`;
    
    content = content.replace(oldNext, newNext);
    
    // Update prevQuestion similarly
    const oldPrev = `        function prevQuestion() { 
            if (currentQuestion > 0) { 
                if (userAnswers[currentQuestion] && userAnswers[currentQuestion].length > 0) {
                    questionRevealed[currentQuestion] = true;
                }
                currentQuestion--; 
                showQuestion(currentQuestion); 
            } 
        }`;
    
    const newPrev = `        function prevQuestion() { 
            if (currentQuestion > 0) { 
                const userAns = userAnswers[currentQuestion] || [];
                if (userAns.length > 0) {
                    const q = questions[currentQuestion];
                    const correctAns = q.correct;
                    const isCorrect = userAns.length === correctAns.length && userAns.every(a => correctAns.includes(a));
                    questionRevealed[currentQuestion] = true;
                    pendingNavigation = currentQuestion - 1;
                    showAnswerModal(isCorrect, userAns, correctAns, currentQuestion);
                } else {
                    currentQuestion--; 
                    showQuestion(currentQuestion);
                }
            } 
        }`;
    
    content = content.replace(oldPrev, newPrev);
    
    // Update goToQuestion similarly
    const oldGoto = `        function goToQuestion(index) { 
            if (userAnswers[currentQuestion] && userAnswers[currentQuestion].length > 0) {
                questionRevealed[currentQuestion] = true;
            }
            showQuestion(index); 
        }`;
    
    const newGoto = `        function goToQuestion(index) { 
            const userAns = userAnswers[currentQuestion] || [];
            if (userAns.length > 0 && index !== currentQuestion) {
                const q = questions[currentQuestion];
                const correctAns = q.correct;
                const isCorrect = userAns.length === correctAns.length && userAns.every(a => correctAns.includes(a));
                questionRevealed[currentQuestion] = true;
                pendingNavigation = index;
                showAnswerModal(isCorrect, userAns, correctAns, currentQuestion);
            } else {
                showQuestion(index);
            }
        }`;
    
    content = content.replace(oldGoto, newGoto);
    
    fs.writeFileSync(filename, content, 'utf-8');
    console.log(`Updated ${filename}`);
}

console.log('\nSuccessfully updated all 23 exam files!');
