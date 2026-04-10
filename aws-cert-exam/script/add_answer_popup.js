const fs = require('fs');

for (let i = 1; i <= 23; i++) {
    const filename = `../practice-exam-${i}.html`;
    let content = fs.readFileSync(filename, 'utf-8');
    
    // Add CSS for modal popup
    const cssEnd = `        .hidden { display: none; }`;
    const newCSS = `        .hidden { display: none; }
        .modal { display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); }
        .modal-content { background: white; margin: 10% auto; padding: 30px; border-radius: 8px; max-width: 500px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
        .modal-header { font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center; }
        .modal-correct { color: #28a745; }
        .modal-incorrect { color: #dc3545; }
        .modal-body { margin: 20px 0; font-size: 16px; line-height: 1.6; }
        .modal-footer { text-align: center; margin-top: 20px; }
        .modal-btn { padding: 12px 30px; background: #ff9900; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; font-weight: 600; }
        .modal-btn:hover { background: #ec7211; }`;
    
    content = content.replace(cssEnd, newCSS);
    
    // Add modal HTML before closing body tag
    const bodyEnd = `    </div>
    <script>`;
    const newHTML = `    </div>
    <div id="answerModal" class="modal">
        <div class="modal-content">
            <div class="modal-header" id="modal-header"></div>
            <div class="modal-body" id="modal-body"></div>
            <div class="modal-footer">
                <button class="modal-btn" onclick="closeModal()">Continue</button>
            </div>
        </div>
    </div>
    <script>`;
    
    content = content.replace(bodyEnd, newHTML);
    
    // Add modal functions before nextQuestion
    const beforeNext = `        function goToQuestion(index) {`;
    const modalFunctions = `        function showAnswerModal(isCorrect, userAns, correctAns) {
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
        }
        function goToQuestion(index) {`;
    
    content = content.replace(beforeNext, modalFunctions);
    
    // Update nextQuestion to show modal
    const oldNext = `        function nextQuestion() { 
            if (currentQuestion < questions.length - 1) { 
                if (userAnswers[currentQuestion] && userAnswers[currentQuestion].length > 0) {
                    questionRevealed[currentQuestion] = true;
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
                    showAnswerModal(isCorrect, userAns, correctAns);
                }
                currentQuestion++; 
                showQuestion(currentQuestion); 
            } 
        }`;
    
    content = content.replace(oldNext, newNext);
    
    fs.writeFileSync(filename, content, 'utf-8');
    console.log(`Updated ${filename}`);
}

console.log('\nSuccessfully updated all 23 exam files!');
