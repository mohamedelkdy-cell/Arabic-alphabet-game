let speechUtterance = null;
let voices = [];

// خريطة الأصوات للكلمات - استخدام الملفات المعاد تسميتها
const wordSoundsMap = {
    'arnab': 'words/word_أ.mp3',
    'batta': 'words/word_ب.mp3',
    'tamrteen': 'words/word_ت.mp3',
    'thallaja': 'words/word_ث.mp3',
    'jamal': 'words/word_ج.mp3',
    'hamama': 'words/word_ح.mp3',
    'kharuf': 'words/word_خ.mp3',
    'dam': 'words/word_د.mp3',
    'dhayl': 'words/word_ذ.mp3',
    'rajul': 'words/word_ر.mp3',
    'zarafa': 'words/word_ز.mp3',
    'saaa': 'words/word_س.mp3',
    'shajara': 'words/word_ش.mp3',
    'saqr': 'words/word_ص.mp3',
    'daba': 'words/word_ض.mp3',
    'tayara': 'words/word_ط.mp3',
    'zarf': 'words/word_ظ.mp3',
    'ayn': 'words/word_ع.mp3',
    'ghazala': 'words/word_غ.mp3',
    'far': 'words/word_ف.mp3',
    'qalam': 'words/word_ق.mp3',
    'kalb': 'words/word_ك.mp3',
    'lemon': 'words/word_ل.mp3',
    'mooz': 'words/word_م.mp3',
    'nakhla': 'words/word_ن.mp3',
    'haram': 'words/word_ه.mp3',
    'warda': 'words/word_و.mp3',
    'yad': 'words/word_ي.mp3'
};

// خريطة الأصوات للحروف
const letterSoundsMap = {
    'أ': 'letters/letter_alef.mp3',
    'ب': 'letters/letter_ba.mp3',
    'ت': 'letters/letter_ta.mp3',
    'ث': 'letters/letter_tha.mp3',
    'ج': 'letters/letter_jeem.mp3',
    'ح': 'letters/letter_ha.mp3',
    'خ': 'letters/letter_kha.mp3',
    'د': 'letters/letter_dal.mp3',
    'ذ': 'letters/letter_dhal.mp3',
    'ر': 'letters/letter_ra.mp3',
    'ز': 'letters/letter_zay.mp3',
    'س': 'letters/letter_seen.mp3',
    'ش': 'letters/letter_sheen.mp3',
    'ص': 'letters/letter_sad.mp3',
    'ض': 'letters/letter_dad.mp3',
    'ط': 'letters/letter_tah.mp3',
    'ظ': 'letters/letter_zah.mp3',
    'ع': 'letters/letter_ayn.mp3',
    'غ': 'letters/letter_ghayn.mp3',
    'ف': 'letters/letter_fa.mp3',
    'ق': 'letters/letter_qaf.mp3',
    'ك': 'letters/letter_kaf.mp3',
    'ل': 'letters/letter_lam.mp3',
    'م': 'letters/letter_meem.mp3',
    'ن': 'letters/letter_noon.mp3',
    'ه': 'letters/ha_trimmed.mp3',
    'و': 'letters/letter_waw.mp3',
    'ي': 'letters/letter_ya.mp3'
};

const encouragementAudios = [
    new Audio("encouragement/rae3_trimmed.mp3"),
    new Audio("encouragement/gameel_trimmed_v2.mp3"),
];

const wrongAnswerAudios = [
    new Audio("wrong/7awel_trimmed.mp3"),
];

const correctAnswerAudios = [
    new Audio("encouragement/rae3_trimmed.mp3"),
    new Audio("encouragement/gameel_trimmed_v2.mp3"),
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
        backgroundMusic = new Audio("background_piano.mp3");
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
