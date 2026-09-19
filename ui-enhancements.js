// في هذه النسخة الرسم اختياري ويفتح كشاشة مستقلة، كما يتم إخفاء عنوان الصفحة
// ورمز الكتب عند الانتقال إلى أي شاشة داخلية.
(() => {
    const prompt = document.getElementById('drawingPrompt');
    const drawingArea = document.getElementById('drawingArea');
    const appHeader = document.getElementById('mainAppHeader');
    const originalShowDrawingArea = window.showDrawingArea;
    const originalNextRound = window.nextRound;
    const originalBackToMenu = window.backToMenu;
    const originalStartGame = window.startGame;
    const originalStartLearning = window.startLearning;
    const originalStartHarakat = window.startHarakat;

    const showMainHeader = (visible) => {
        if (appHeader) appHeader.classList.toggle('hidden', !visible);
    };

    window.startGame = function (...args) {
        showMainHeader(false);
        return originalStartGame(...args);
    };
    window.startLearning = function (...args) {
        showMainHeader(false);
        return originalStartLearning(...args);
    };
    window.startHarakat = function (...args) {
        showMainHeader(false);
        return originalStartHarakat(...args);
    };

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
    window.backToMenu = function (...args) {
        window.closeDrawingMode();
        if (prompt) prompt.classList.add('hidden');
        showMainHeader(true);
        if (originalBackToMenu) return originalBackToMenu(...args);
    };
})();
