// متغيرات اللعبة

let currentLetter = null;

let choices = [];

let learningIndex = 0;

let showImages = true; // متغير للتحكم في إظهار الصور

// متغيرات لتتبع الحروف المستخدمة في الجولة الحالية

let availableLetters = []; // الحروف المتبقية للاختيار منها

let usedLetters = []; // الحروف المستخدمة بالفعل

// تهيئة قائمة الحروف المتاحة

function initializeLetterPool() {

    availableLetters = [...lettersData]; // نسخ جميع الحروف

    usedLetters = [];

    shuffleArray(availableLetters); // خلط الحروف عشوائياً

}

// الموسيقى الخلفية

// عناصر DOM

const menuScreen = document.getElementById("menuScreen");

const gameScreen = document.getElementById("gameScreen");

const learningScreen = document.getElementById("learningScreen");

const choicesDiv = document.getElementById("choices");

const drawingArea = document.getElementById("drawingArea");

const canvas = document.getElementById("letterCanvas");

const ctx = canvas ? canvas.getContext("2d") : null;

const fireworksDiv = document.getElementById("fireworks");

// Canvas للرسم

let isDrawing = false;

let drawingPath = [];

let allDrawingPaths = [];

let letterOutlinePath = null; // مسار الحرف لتحديد منطقة الملء

// بدء لعبة الاختيار

function startGame(withImages) {

    showImages = withImages;

    stopAudio();

    // لا تشغل الموسيقى تلقائياً - احترام حالة الموسيقى الحالية

    if (typeof initializeMusic === 'function') {

        initializeMusic();

    }

    hideAllScreens();

    gameScreen.classList.add("active");

    // تهيئة قائمة الحروف المتاحة

    initializeLetterPool();

    createNewRound();

}

// بدء وضع التعلم

function startLearning() {

    stopAudio();

    // لا تشغل الموسيقى تلقائياً - احترام حالة الموسيقى الحالية

    if (typeof initializeMusic === 'function') {

        initializeMusic();

    }

    hideAllScreens();

    learningScreen.classList.add("active");

    learningIndex = 0;

    showLearningLetter();

}

// إخفاء جميع الشاشات

function hideAllScreens() {

    menuScreen.classList.remove("active");

    gameScreen.classList.remove("active");

    learningScreen.classList.remove("active");

}

// العودة للقائمة الرئيسية

function backToMenu() {

    stopAudio();

    // لا تشغل الموسيقى تلقائياً - احترام حالة الموسيقى الحالية

    if (typeof initializeMusic === 'function') {

        initializeMusic();

    }

    hideAllScreens();

    menuScreen.classList.add("active");

    drawingArea.classList.add("hidden");

}

// إنشاء جولة جديدة

function createNewRound() {

    stopAudio();

    // لا تشغل الموسيقى تلقائياً - احترام حالة الموسيقى الحالية

    if (typeof initializeMusic === 'function') {

        initializeMusic();

    }

    // إخفاء منطقة الرسم

    drawingArea.classList.add("hidden");

    

    // إذا انتهت جميع الحروف المتاحة، أعد تهيئة القائمة

    if (availableLetters.length === 0) {

        initializeLetterPool();

    }

    

    // اختيار حرف عشوائي من الحروف المتاحة

    const randomIndex = Math.floor(Math.random() * availableLetters.length);

    currentLetter = availableLetters[randomIndex];

    

    // نقل الحرف المختار إلى قائمة الحروف المستخدمة

    availableLetters.splice(randomIndex, 1);

    usedLetters.push(currentLetter);

    

    // إنشاء 4 خيارات (الحرف الصحيح + 3 حروف عشوائية من جميع الحروف)

    choices = [currentLetter];

    

    while (choices.length < 4) {

        const randomLetter = lettersData[Math.floor(Math.random() * lettersData.length)];

        if (!choices.some(c => c.letter === randomLetter.letter)) { // التأكد من عدم تكرار الحروف في الخيارات

            choices.push(randomLetter);

        }

    }

    

    // خلط الخيارات

    choices = shuffleArray(choices);

    

    // عرض الخيارات

    displayChoices();

}

// عرض الاختيارات

function displayChoices() {

    choicesDiv.innerHTML = "";

    

    choices.forEach((choice) => {

        const card = document.createElement("div");

        card.className = "choice-card";

        

        if (showImages) {

            const imageOrEmoji = choice.image 

                ? `<img src="images/${choice.image}" alt="${choice.word}" style="width: 80px; height: 80px; object-fit: contain;">` 

                : `<div class="choice-emoji">${choice.emoji}</div>`;

            card.innerHTML = `

                <div class="choice-letter">${choice.letter}</div>

                ${imageOrEmoji}

                <div class="choice-word">${choice.word}</div>

            `;

        } else {

            card.innerHTML = `

                <div class="choice-letter" style="font-size: 6rem; margin: 40px 0;">${choice.letter}</div>

            `;

        }

        

        card.onclick = () => handleChoice(choice, card);

        choicesDiv.appendChild(card);

    });

}

// معالجة اختيار الحرف

async function handleChoice(choice, cardElement) {

    if (choice.letter === currentLetter.letter) {

        // إجابة صحيحة

        cardElement.classList.add("correct");

        

        // تشغيل الألعاب النارية

        showFireworks();

        

        // تشغيل صوت تشجيعي

        await playCorrectAnswer();

        

        // إظهار منطقة الرسم

        setTimeout(() => {

            showDrawingArea();

        }, 500);

        

    } else {

        // إجابة خاطئة

        cardElement.classList.add("wrong");

        

        // تشغيل صوت خطأ

        await playWrongAnswer();

        

        // إزالة التأثير بعد ثانية

        setTimeout(() => {

            cardElement.classList.remove("wrong");

        }, 1000);

    }

}

// عرض الألعاب النارية

function showFireworks() {

    const emojis = ["🎆", "🎇", "✨", "⭐", "🌟", "💫", "🎉", "🎊"];

    

    for (let i = 0; i < 15; i++) {

        setTimeout(() => {

            const firework = document.createElement("div");

            firework.className = "firework";

            firework.textContent = emojis[Math.floor(Math.random() * emojis.length)];

            firework.style.left = Math.random() * 100 + "%";

            firework.style.top = Math.random() * 100 + "%";

            

            fireworksDiv.appendChild(firework);

            

            setTimeout(() => {

                firework.remove();

            }, 1000);

        }, i * 100);

    }

}

// إظهار منطقة الرسم

function showDrawingArea() {

    drawingArea.classList.remove("hidden");

    document.getElementById("currentLetterDisplay").textContent = currentLetter.letter;

    

    // تهيئة Canvas

    setupCanvas();

}

// تهيئة Canvas للرسم

function setupCanvas() {

    if (!canvas || !ctx) return;

    

    // تعيين حجم Canvas

    canvas.width = canvas.offsetWidth;

    canvas.height = 300;

    

    // مسح Canvas

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    

    // رسم الحرف بلون باهت وحفظ مساره

    ctx.font = "bold 200px Tajawal, Arial";

    ctx.textAlign = "center";

    ctx.textBaseline = "middle";

    ctx.fillStyle = "#E5E7EB"; // لون باهت للحرف

    ctx.fillText(currentLetter.letter, canvas.width / 2, canvas.height / 2);

    // حفظ مسار الحرف كمسك

    const tempCanvas = document.createElement("canvas");

    const tempCtx = tempCanvas.getContext("2d");

    tempCanvas.width = canvas.width;

    tempCanvas.height = canvas.height;

    tempCtx.font = "bold 200px Tajawal, Arial";

    tempCtx.textAlign = "center";

    tempCtx.textBaseline = "middle";

    tempCtx.fillText(currentLetter.letter, tempCanvas.width / 2, tempCanvas.height / 2);

    letterMask = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);

    drawingPath = []; // مسح مسار الرسم السابق

    allDrawingPaths = []; // مسح جميع المسارات السابقة

}

// معالجة الرسم على Canvas

if (canvas) {

    canvas.addEventListener("mousedown", startDrawing);

    canvas.addEventListener("mousemove", draw);

    canvas.addEventListener("mouseup", stopDrawing);

    canvas.addEventListener("mouseleave", stopDrawing);

    

    canvas.addEventListener("touchstart", handleTouch);

    canvas.addEventListener("touchmove", handleTouch);

    canvas.addEventListener("touchend", stopDrawing);

}

function startDrawing(e) {

    isDrawing = true;

    draw(e);

}

function stopDrawing() {

    if (isDrawing) {

        isDrawing = false;

        if (drawingPath.length > 0) {

            allDrawingPaths.push(drawingPath);

            drawingPath = []; // Reset current path for next stroke

        }

    }

}

function draw(e) {

    if (!isDrawing) return;

    

    const rect = canvas.getBoundingClientRect();

    let clientX, clientY;

    if (e.touches) {

        clientX = e.touches[0].clientX;

        clientY = e.touches[0].clientY;

    } else {

        clientX = e.clientX;

        clientY = e.clientY;

    }

    const x = clientX - rect.left;

    const y = clientY - rect.top;

    

    // التحقق مما إذا كانت النقطة داخل الحرف الباهت

    if (isPointInLetter(x, y)) {

        drawingPath.push({x, y});

        redrawCanvas();

    }

}

function handleTouch(e) {

    e.preventDefault();

    const touch = e.touches[0];

    const mouseEvent = new MouseEvent(e.type === "touchstart" ? "mousedown" : "mousemove", {

        clientX: touch.clientX,

        clientY: touch.clientY

    });

    canvas.dispatchEvent(mouseEvent);

}

function isPointInLetter(x, y) {

    if (!letterMask) return false;

    const pixelData = letterMask.data;

    const index = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;

    // إذا كان لون البكسل ليس شفافاً تماماً (جزء من الحرف الباهت)

    return pixelData[index + 3] > 0; 

}

function redrawCanvas() {

    if (!ctx) return;

    // مسح منطقة الرسم فقط (الحفاظ على الحرف الباهت)

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    

    // إعادة رسم الحرف الباهت

    ctx.font = "bold 200px Tajawal, Arial";

    ctx.textAlign = "center";

    ctx.textBaseline = "middle";

    ctx.fillStyle = "#E5E7EB";

    ctx.fillText(currentLetter.letter, canvas.width / 2, canvas.height / 2);

    ctx.strokeStyle = "#3B82F6"; // لون الملء

    ctx.lineWidth = 20; // سمك خط الملء

    ctx.lineCap = "round";

    ctx.lineJoin = "round";

    // رسم جميع المسارات المكتملة

    allDrawingPaths.forEach(path => {

        if (path.length > 0) {

            ctx.beginPath();

            ctx.moveTo(path[0].x, path[0].y);

            for (let i = 1; i < path.length; i++) {

                ctx.lineTo(path[i].x, path[i].y);

            }

            ctx.stroke();

        }

    });

    // رسم المسار الحالي غير المكتمل

    if (drawingPath.length > 0) {

        ctx.beginPath();

        ctx.moveTo(drawingPath[0].x, drawingPath[0].y);

        for (let i = 1; i < drawingPath.length; i++) {

            ctx.lineTo(drawingPath[i].x, drawingPath[i].y);

        }

        ctx.stroke();

    }

}

// مسح Canvas

function clearCanvas() {

    if (ctx) {

        setupCanvas(); // يعيد رسم الحرف الباهت ويمسح الرسم

        allDrawingPaths = []; // مسح جميع المسارات عند مسح اللوحة

    }

}

// الانتقال للجولة التالية

function nextRound() {

    createNewRound();

}

// تشغيل صوت الحرف الحالي

function playCurrentLetter() {

    if (currentLetter) {

        playLetterSound(currentLetter.letter);

    }

}

// تشغيل صوت الكلمة الحالية

function playCurrentWord() {

    if (currentLetter) {

        playWordSound(currentLetter.wordKey);

    }

}

// عرض حرف في وضع التعلم

function showLearningLetter() {

    const letter = lettersData[learningIndex];

    document.getElementById("learningLetter").textContent = letter.letter;

    document.getElementById("learningWord").textContent = letter.word;

    

    const imageDisplay = document.getElementById("learningImage");

    const emojiDisplay = document.getElementById("learningEmoji");

    

    if (letter.image) {

        imageDisplay.innerHTML = `<img src="images/${letter.image}" alt="${letter.word}" style="width: 150px; height: 150px; object-fit: contain;">`;

        emojiDisplay.style.display = 'none';

    } else {

        imageDisplay.innerHTML = '';

        emojiDisplay.textContent = letter.emoji;

        emojiDisplay.style.display = 'block';

    }

}

// الحرف التالي في وضع التعلم

function nextLetter() {

    learningIndex = (learningIndex + 1) % lettersData.length;

    showLearningLetter();

    stopAudio();

}

// الحرف السابق في وضع التعلم

function previousLetter() {

    learningIndex = (learningIndex - 1 + lettersData.length) % lettersData.length;

    showLearningLetter();

    stopAudio();

}

// تشغيل صوت في وضع التعلم

function playLearningSound() {

    const letter = lettersData[learningIndex];

    playLetterSound(letter.letter);

    setTimeout(() => {

        playWordSound(letter.wordKey);

    }, 800);

}

// تشغيل صوت الحرف في وضع التعلم

function playLearningLetter() {

    const letter = lettersData[learningIndex];

    playLetterSound(letter.letter);

}

// تشغيل صوت الكلمة في وضع التعلم

function playLearningWord() {

    const letter = lettersData[learningIndex];

    playWordSound(letter.wordKey);

}

// دالة مساعدة لخلط المصفوفة

function shuffleArray(array) {

    const newArray = [...array];

    for (let i = newArray.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];

    }

    return newArray;

}

// وظائف الموسيقى الخلفية

// تبديل إظهار/إخفاء الصور

function toggleImages() {

    showImages = !showImages;

    displayChoices(); // إعادة عرض الاختيارات

}

// ========== وظائف حركات الحروف ==========

// بدء شاشة حركات الحروف

function startHarakat() {

    stopAudio();

    // لا تشغل الموسيقى تلقائياً - احترام حالة الموسيقى الحالية

    if (typeof initializeMusic === 'function') {

        initializeMusic();

    }

    hideAllScreens();

    document.getElementById("harakatScreen").classList.add("active");

    createLettersGrid();

}

// إنشاء شبكة الحروف

function createLettersGrid() {

    const grid = document.getElementById("lettersGrid");

    grid.innerHTML = '';

    

    // قائمة الحروف بالترتيب

    const letters = ['أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 

                     'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 

                     'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'];

    

    letters.forEach(letter => {

        const btn = document.createElement('button');

        btn.className = 'letter-btn';

        btn.textContent = letter;

        btn.onclick = () => showHarakat(letter);

        grid.appendChild(btn);

    });

}

// عرض الحركات للحرف المختار

function showHarakat(letter) {

    const display = document.getElementById("harakatDisplay");

    const harakatLetters = document.getElementById("harakatLetters");

    

    // عرض الحرف بالحركات الثلاثة

    harakatLetters.textContent = `${letter}َ ${letter}ِ ${letter}ُ`;

    display.classList.remove('hidden');

    

    // تشغيل أصوات الحركات

    playHarakatSounds(letter);

}

// تشغيل أصوات الحركات

function playHarakatSounds(letter) {

    // خريطة الحروف إلى أسماء الملفات

    const harakatSoundsMap = {

        'أ': 'harakat/word_أ.mp3',

        'ب': 'harakat/word_ب.mp3',

        'ت': 'harakat/word_ت.mp3',

        'ث': 'harakat/word_ث.mp3',

        'ج': 'harakat/word_ج.mp3',

        'ح': 'harakat/word_ح.mp3',

        'خ': 'harakat/word_خ.mp3',

        'د': 'harakat/word_د.mp3',

        'ذ': 'harakat/word_ذ.mp3',

        'ر': 'harakat/word_ر.mp3',

        'ز': 'harakat/word_ز.mp3',

        'س': 'harakat/word_س.mp3',

        'ش': 'harakat/word_ش.mp3',

        'ص': 'harakat/word_ص.mp3',

        'ض': 'harakat/word_ض.mp3',

        'ط': 'harakat/word_ط.mp3',

        'ظ': 'harakat/word_ظ.mp3',

        'ع': 'harakat/word_ع.mp3',

        'غ': 'harakat/word_غ.mp3',

        'ف': 'harakat/word_ف.mp3',

        'ق': 'harakat/word_ق.mp3',

        'ك': 'harakat/word_ك.mp3',

        'ل': 'harakat/word_ل.mp3',

        'م': 'harakat/word_م.mp3',

        'ن': 'harakat/word_ن.mp3',

        'ه': 'harakat/word_ه.mp3',

        'و': 'harakat/word_و.mp3',

        'ي': 'harakat/word_ي.mp3'

    };

    

    const soundPath = harakatSoundsMap[letter];

    

    if (soundPath) {

        const audio = new Audio(soundPath);

        audio.playbackRate = 1.0;

        audio.volume = 1.0;

        audio.play().catch(e => console.error("Harakat sound play failed:", e));

    } else {

        console.warn("No harakat sound found for letter:", letter);

    }

}

// تحديث hideAllScreens لتشمل شاشة الحركات

const originalHideAllScreens = hideAllScreens;

hideAllScreens = function() {

    originalHideAllScreens();

    const harakatScreen = document.getElementById("harakatScreen");

    if (harakatScreen) {

        harakatScreen.classList.remove("active");

    }

};
