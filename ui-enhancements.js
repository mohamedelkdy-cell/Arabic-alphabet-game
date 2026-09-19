// في هذه النسخة الرسم اختياري ويفتح كشاشة مستقلة، حتى لا يضطر طفل الجوال للتمرير.
(() => {
    const prompt = document.getElementById('drawingPrompt');
    const drawingArea = document.getElementById('drawingArea');
    const originalShowDrawingArea = window.showDrawingArea;
    const originalNextRound = window.nextRound;
    const originalBackToMenu = window.backToMenu;

    window.showDrawingArea = function () {
        if (prompt) prompt.classList.remove('hidden');
        if (drawingArea) drawingArea.classList.add('hidden');
    };
    window.openDrawingMode = function () {
        if (prompt) prompt.classList.add('hidden');
        if (originalShowDrawingArea) originalShowDrawingArea();
        if (drawingArea) drawingArea.classList.remove('hidden');
        document.body.classList.add('drawing-open');
    };
    window.closeDrawingMode = function () {
        if (drawingArea) drawingArea.classList.add('hidden');
        document.body.classList.remove('drawing-open');
    };
    window.nextRound = function () {
        window.closeDrawingMode();
        if (prompt) prompt.classList.add('hidden');
        if (originalNextRound) originalNextRound();
    };
    window.backToMenu = function () {
        window.closeDrawingMode();
        if (prompt) prompt.classList.add('hidden');
        if (originalBackToMenu) originalBackToMenu();
    };
})();
