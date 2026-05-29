let speechUtterance = null;
let voices = [];

// خريطة الأصوات للكلمات - استخدام الملفات المعاد تسميتها
const wordSoundsMap = {
    'arnab': 'sounds/words/word_أ.mp3',
    'batta': 'sounds/words/word_ب.mp3',
    'tamrteen': 'sounds/words/word_ت.mp3',
    'thallaja': 'sounds/words/word_ث.mp3',
    'jamal': 'sounds/words/word_ج.mp3',
    'hamama': 'sounds/words/word_ح.mp3',
    'kharuf': 'sounds/words/word_خ.mp3',
    'dam': 'sounds/words/word_د.mp3',
    'dhayl': 'sounds/words/word_ذ.mp3',
    'rajul': 'sounds/words/word_ر.mp3',
    'zarafa': 'sounds/words/word_ز.mp3',
    'saaa': 'sounds/words/word_س.mp3',
    'shajara': 'sounds/words/word_ش.mp3',
    'saqr': 'sounds/words/word_ص.mp3',
    'daba': 'sounds/words/word_ض.mp3',
    'tayara': 'sounds/words/word_ط.mp3',
    'zarf': 'sounds/words/word_ظ.mp3',
    'ayn': 'sounds/words/word_ع.mp3',
    'ghazala': 'sounds/words/word_غ.mp3',
    'far': 'sounds/words/word_ف.mp3',
    'qalam': 'sounds/words/word_ق.mp3',
    'kalb': 'sounds/words/word_ك.mp3',
    'lemon': 'sounds/words/word_ل.mp3',
    'mooz': 'sounds/words/word_م.mp3',
    'nakhla': 'sounds/words/word_ن.mp3',
    'haram': 'sounds/words/word_ه.mp3',
    'warda': 'sounds/words/word_و.mp3',
    'yad': 'sounds/words/word_ي.mp3'
};

// خريطة الأصوات للحروف
const letterSoundsMap = {
    'أ': 'sounds/letters/letter_alef.mp3',
    'ب': 'sounds/letters/letter_ba.mp3',
    'ت': 'sounds/letters/letter_ta.mp3',
    'ث': 'sounds/letters/letter_tha.mp3',
    'ج': 'sounds/letters/letter_jeem.mp3',
    'ح': 'sounds/letters/letter_ha.mp3',
    'خ': 'sounds/letters/letter_kha.mp3',
    'د': 'sounds/letters/letter_dal.mp3',
    'ذ': 'sounds/letters/letter_dhal.mp3',
    'ر': 'sounds/letters/letter_ra.mp3',
    'ز': 'sounds/letters/letter_zay.mp3',
    'س': 'sounds/letters/letter_seen.mp3',
    'ش': 'sounds/letters/letter_sheen.mp3',
    'ص': 'sounds/letters/letter_sad.mp3',
    'ض': 'sounds/letters/letter_dad.mp3',
    'ط': 'sounds/letters/letter_tah.mp3',
    'ظ': 'sounds/letters/letter_zah.mp3',
    'ع': 'sounds/letters/letter_ayn.mp3',
    'غ': 'sounds/letters/letter_ghayn.mp3',
    'ف': 'sounds/letters/letter_fa.mp3',
    'ق': 'sounds/letters/letter_qaf.mp3',
    'ك': 'sounds/letters/letter_kaf.mp3',
    'ل': 'sounds/letters/letter_lam.mp3',
    'م': 'sounds/letters/letter_meem.mp3',
    'ن': 'sounds/letters/letter_noon.mp3',
    'ه': 'sounds/letters/ha_trimmed.mp3',
    'و': 'sounds/letters/letter_waw.mp3',
    'ي': 'sounds/letters/letter_ya.mp3'
};

const encouragementAudios = [
    new Audio("sounds/encouragement/rae3_trimmed.mp3"),
    new Audio("sounds/encouragement/gameel_trimmed_v2.mp3"),
];

const wrongAnswerAudios = [
    new Audio("sounds/wrong/7awel_trimmed.mp3"),
];

const correctAnswerAudios = [
    new Audio("sounds/encouragement/rae3_trimmed.mp3"),
    new Audio("sounds/encouragement/gameel_trimmed_v2.mp3"),
];

function stopAudio() {
    if (speechUtterance) {
        speechSynthesis.cancel();
    }
    encouragementAudios.forEach(audio => { audio.pause(); audio.currentTime = 0; });
    wrongAnswerAudios.forEach(audio => { audio.pause(); audio.currentTime = 0; });
    correctAnswerAudios.forEach(audio => { audio.pause(); audio.currentTime = 0; });
}

async function playLetterSound(letter) {
    // إزالة الفتحة من الحرف إذا كانت موجودة
    const cleanLetter = letter.replace(/َ/g, '');
    const soundPath = letterSoundsMap[cleanLetter];
    
    if (soundPath) {
        const audio = new Audio(soundPath);
        audio.playbackRate = 1.2;
        audio.volume = 1.0;
        audio.play().catch(e => console.error("Letter sound play failed:", e));
    } else {
        console.warn("No sound found for letter:", cleanLetter);
    }
}

async function playWordSound(wordKey) {
    const soundPath = wordSoundsMap[wordKey];
    
    if (soundPath) {
        const audio = new Audio(soundPath);
        audio.playbackRate = 1.0;
        audio.volume = 1.0;
        audio.play().catch(e => console.error("Word sound play failed:", e));
    } else {
        console.warn("No sound found for word:", wordKey);
    }
}

async function playEncouragement() {
    const randomAudio = encouragementAudios[Math.floor(Math.random() * encouragementAudios.length)];
    randomAudio.currentTime = 0;
    randomAudio.playbackRate = 1.0;
    randomAudio.volume = 1.0;
    randomAudio.play().catch(e => console.error("Encouragement play failed:", e));
}

async function playWrongAnswer() {
    const randomAudio = wrongAnswerAudios[Math.floor(Math.random() * wrongAnswerAudios.length)];
    randomAudio.currentTime = 0;
    randomAudio.playbackRate = 1.0;
    randomAudio.volume = 1.0;
    randomAudio.play().catch(e => console.error("Wrong answer play failed:", e));
}

async function playCorrectAnswer() {
    const randomAudio = correctAnswerAudios[Math.floor(Math.random() * correctAnswerAudios.length)];
    randomAudio.currentTime = 0;
    randomAudio.playbackRate = 1.0;
    randomAudio.volume = 1.0;
    randomAudio.play().catch(e => console.error("Correct answer play failed:", e));
}

let backgroundMusic = null;

function initializeMusic() {
    if (!backgroundMusic) {
        backgroundMusic = new Audio("sounds/background_piano.mp3");
        backgroundMusic.loop = true;
        backgroundMusic.volume = 0.3;
    }
}

function toggleMusic() {
    initializeMusic();
    const musicToggleButton = document.getElementById("musicToggle");
    if (!musicToggleButton) return;

    if (!backgroundMusic.paused) {
        backgroundMusic.pause();
        musicToggleButton.textContent = "🔇";
        musicToggleButton.classList.add("muted");
    } else {
        backgroundMusic.play().catch(e => console.error("Music play failed:", e));
        musicToggleButton.textContent = "🎵";
        musicToggleButton.classList.remove("muted");
    }
}

window.addEventListener("load", () => {
    initializeMusic();
    const musicToggleButton = document.getElementById("musicToggle");
    if (musicToggleButton) {
        musicToggleButton.addEventListener("click", toggleMusic);
    }
});
