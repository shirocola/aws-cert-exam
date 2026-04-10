const fs = require('fs');

for (let i = 1; i <= 23; i++) {
    const filename = `../practice-exam-${i}.html`;
    let content = fs.readFileSync(filename, 'utf-8');
    
    // Replace entire style section with mobile-first design
    const styleStart = `    <style>`;
    const styleEnd = `    </style>`;
    
    const newStyles = `    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 10px; }
        .top-bar { margin-bottom: 10px; }
        .back-btn { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: #232f3e; color: white; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 14px; }
        .back-btn:hover { background: #131921; }
        .container { max-width: 100%; }
        .main-content { background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #232f3e; margin-bottom: 15px; font-size: 20px; }
        .timer { background: #232f3e; color: white; padding: 10px; border-radius: 4px; text-align: center; font-size: 16px; font-weight: bold; }
        .progress { margin: 0; }
        .progress-bar { width: 100%; height: 6px; background: #e0e0e0; border-radius: 4px; overflow: hidden; }
        .progress-fill { height: 100%; background: #ff9900; transition: width 0.3s; }
        .progress-text { margin-top: 5px; font-size: 12px; color: #666; text-align: center; }
        .question { margin-bottom: 15px; }
        .question-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; gap: 10px; flex-wrap: wrap; }
        .question-text { font-size: 16px; font-weight: 600; color: #333; }
        .flag-btn { padding: 6px 12px; border: 2px solid #ffc107; background: white; border-radius: 4px; cursor: pointer; font-size: 12px; white-space: nowrap; }
        .flag-btn.flagged { background: #ffc107; color: white; }
        .option { padding: 10px; margin: 8px 0; border: 2px solid #ddd; border-radius: 4px; cursor: pointer; transition: all 0.2s; display: flex; align-items: flex-start; font-size: 14px; }
        .option:hover { background: #f0f8ff; border-color: #0073bb; }
        .option.selected { background: #e3f2fd; border-color: #0073bb; }
        .option.correct { background: #d4edda; border-color: #28a745; }
        .option.incorrect { background: #f8d7da; border-color: #dc3545; }
        .option input[type="checkbox"], .option input[type="radio"] { margin-right: 8px; margin-top: 2px; width: 18px; height: 18px; cursor: pointer; flex-shrink: 0; }
        .buttons { margin: 15px 0; display: flex; gap: 8px; flex-wrap: wrap; }
        button { padding: 10px 16px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 600; }
        .btn-primary { background: #ff9900; color: white; }
        .btn-primary:hover { background: #ec7211; }
        .btn-secondary { background: #232f3e; color: white; }
        .btn-secondary:hover { background: #131921; }
        .btn-danger { background: #dc3545; color: white; }
        .btn-danger:hover { background: #c82333; }
        button:disabled { opacity: 0.5; cursor: not-allowed; }
        .results { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .score { font-size: 20px; font-weight: bold; margin: 10px 0; }
        .pass { color: #28a745; }
        .fail { color: #dc3545; }
        .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 15px 0; }
        .stat-card { background: white; padding: 12px; border-radius: 4px; text-align: center; border: 2px solid #e0e0e0; }
        .stat-value { font-size: 24px; font-weight: bold; color: #232f3e; }
        .stat-label { font-size: 12px; color: #666; margin-top: 5px; }
        .hidden { display: none; }
        .modal { display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); padding: 20px; }
        .modal-content { background: white; margin: 10% auto; padding: 20px; border-radius: 8px; max-width: 500px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
        .modal-header { font-size: 20px; font-weight: bold; margin-bottom: 15px; text-align: center; }
        .modal-correct { color: #28a745; }
        .modal-incorrect { color: #dc3545; }
        .modal-body { margin: 15px 0; font-size: 14px; line-height: 1.6; }
        .modal-footer { text-align: center; margin-top: 15px; }
        .modal-btn { padding: 10px 24px; background: #ff9900; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 600; }
        .modal-btn:hover { background: #ec7211; }
        @media (min-width: 768px) {
            body { padding: 20px; }
            .container { max-width: 900px; margin: 0 auto; }
            .main-content { padding: 30px; }
            h1 { font-size: 24px; margin-bottom: 20px; }
            .timer { padding: 15px; font-size: 20px; }
            .progress-text { font-size: 14px; }
            .question-text { font-size: 18px; }
            .option { padding: 12px; font-size: 16px; }
            button { padding: 12px 24px; font-size: 16px; }
            .flag-btn { padding: 8px 16px; font-size: 14px; }
            .modal-content { padding: 30px; }
            .modal-header { font-size: 24px; margin-bottom: 20px; }
            .modal-body { font-size: 16px; margin: 20px 0; }
            .modal-footer { margin-top: 20px; }
            .modal-btn { padding: 12px 30px; font-size: 16px; }
        }
    </style>`;
    
    const styleRegex = new RegExp(`${styleStart}[\\s\\S]*?${styleEnd}`);
    content = content.replace(styleRegex, newStyles);
    
    fs.writeFileSync(filename, content, 'utf-8');
    console.log(`Updated ${filename}`);
}

console.log('\nSuccessfully updated all 23 exam files to mobile-first!');
