const fs = require('fs');

for (let i = 1; i <= 23; i++) {
    const filename = `../practice-exam-${i}.html`;
    let content = fs.readFileSync(filename, 'utf-8');
    
    // Remove Clear Answer button from HTML
    content = content.replace(/<button class="btn-secondary" onclick="clearAnswer\(\)">Clear Answer<\/button>\s*/g, '');
    
    // Update selectOption function to allow deselecting
    const oldSelectOption = `        function selectOption(letter, checked) {
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
            updateProgress();
        }`;
    
    const newSelectOption = `        function selectOption(letter, checked) {
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
                // For single choice, allow deselecting by clicking the same option
                if (userAnswers[currentQuestion].includes(letter)) {
                    userAnswers[currentQuestion] = [];
                    event.target.checked = false;
                } else {
                    userAnswers[currentQuestion] = [letter];
                }
            }
            updateProgress();
        }`;
    
    content = content.replace(oldSelectOption, newSelectOption);
    
    // Remove clearAnswer function
    const clearAnswerRegex = /        function clearAnswer\(\) \{[^}]+\}\n/;
    content = content.replace(clearAnswerRegex, '');
    
    fs.writeFileSync(filename, content, 'utf-8');
    console.log(`Updated ${filename}`);
}

console.log('\nSuccessfully removed Clear Answer button from all 23 exam files!');
