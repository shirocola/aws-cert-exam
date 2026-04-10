const fs = require('fs');

for (let i = 1; i <= 23; i++) {
    const filename = `../practice-exam-${i}.html`;
    let content = fs.readFileSync(filename, 'utf-8');
    
    // Remove sidebar CSS
    content = content.replace(/        \.sidebar \{[^}]+\}\n/g, '');
    
    // Update container to remove flex layout
    const oldContainer = `        .container { max-width: 1200px; margin: 0 auto; display: flex; gap: 20px; }`;
    const newContainer = `        .container { max-width: 900px; margin: 0 auto; }`;
    content = content.replace(oldContainer, newContainer);
    
    // Update main-content to remove flex
    const oldMainContent = `        .main-content { flex: 1; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }`;
    const newMainContent = `        .main-content { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }`;
    content = content.replace(oldMainContent, newMainContent);
    
    // Remove question-nav CSS
    content = content.replace(/        \.question-nav \{[^}]+\}\n/g, '');
    content = content.replace(/        \.nav-btn \{[^}]+\}\n/g, '');
    content = content.replace(/        \.nav-btn:hover \{[^}]+\}\n/g, '');
    content = content.replace(/        \.nav-btn\.current \{[^}]+\}\n/g, '');
    content = content.replace(/        \.nav-btn\.answered \{[^}]+\}\n/g, '');
    content = content.replace(/        \.nav-btn\.flagged \{[^}]+\}\n/g, '');
    
    // Update media query
    const oldMedia = `        @media (max-width: 768px) {
            .container { flex-direction: column; }
            .sidebar { width: 100%; position: static; }
            .stats { grid-template-columns: 1fr; }
        }`;
    const newMedia = `        @media (max-width: 768px) {
            .stats { grid-template-columns: 1fr; }
            .main-content { padding: 20px; }
        }`;
    content = content.replace(oldMedia, newMedia);
    
    // Add timer and progress to top of main content
    const oldH1 = `            <h1>PRACTICE EXAM ${i}</h1>`;
    const newH1 = `            <h1>PRACTICE EXAM ${i}</h1>
            <div style="display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap;">
                <div class="timer" id="timer" style="flex: 1; min-width: 150px; margin: 0;">00:00</div>
                <div class="progress" style="flex: 2; min-width: 200px; margin: 0;">
                    <div class="progress-bar"><div class="progress-fill" id="progress-fill"></div></div>
                    <div class="progress-text" id="progress-text">0 of 50 answered</div>
                </div>
            </div>`;
    content = content.replace(oldH1, newH1);
    
    // Remove sidebar HTML
    const sidebarRegex = /        <div class="sidebar">[\s\S]*?<\/div>\n    <\/div>/;
    content = content.replace(sidebarRegex, '    </div>');
    
    // Remove renderQuestionNav function call
    content = content.replace(/renderQuestionNav\(\); /g, '');
    
    // Remove renderQuestionNav function
    const renderNavRegex = /        function renderQuestionNav\(\) \{[\s\S]*?\}\n/;
    content = content.replace(renderNavRegex, '');
    
    // Remove updateNavigation calls but keep updateProgress
    content = content.replace(/            updateNavigation\(\);/g, '            updateProgress();');
    
    // Simplify updateNavigation to only update progress
    const oldUpdateNav = /        function updateNavigation\(\) \{[\s\S]*?        \}\n        function updateProgress\(\)/;
    const newUpdateNav = `        function updateProgress()`;
    content = content.replace(oldUpdateNav, newUpdateNav);
    
    fs.writeFileSync(filename, content, 'utf-8');
    console.log(`Updated ${filename}`);
}

console.log('\nSuccessfully removed sidebar from all 23 exam files!');
