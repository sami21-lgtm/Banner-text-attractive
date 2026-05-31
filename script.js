document.addEventListener('DOMContentLoaded', () => {
    let currentSlideIndex = 0;
    const slides = document.querySelectorAll('.slide');
    const music = document.getElementById('bg-music');
    const playOverlay = document.getElementById('play-overlay');
    const startBtn = document.getElementById('start-btn');
    let autoSlideTimer;

    // শুরুতে স্লাইডার পজ (Pause) করে রাখা হয়েছে
    slides.forEach(slide => slide.classList.remove('active'));

    // ১. টেক্সট ভেঙে আলাদা অক্ষরে রূপান্তর এবং অ্যানিমেশন সেটআপ
    function prepareAnimatedTexts() {
        slides.forEach(slide => {
            const nameElement = slide.querySelector('.image-name');
            if (nameElement) {
                const originalText = nameElement.textContent.trim();
                nameElement.innerHTML = ''; 
                
                for (let i = 0; i < originalText.length; i++) {
                    const span = document.createElement('span');
                    span.innerText = originalText[i];
                    span.style.transitionDelay = `${i * 0.12}s`; 
                    nameElement.appendChild(span);
                }
            }
        });
    }

    // ২. ইমেজ ব্যাকগ্রাউন্ড লোড করা ও প্রি-লোড করা
    function preloadImages() {
        const promises = Array.from(slides).map(slide => {
            return new Promise((resolve) => {
                const container = slide.querySelector('.image-container');
                if (container) {
                    const imageUrl = container.getAttribute('data-image');
                    if (imageUrl) {
                        const img = new Image();
                        img.src = imageUrl;
                        img.onload = () => {
                            container.style.backgroundImage = `url("${imageUrl}")`;
                            resolve();
                        };
                        img.onerror = () => resolve(); 
                    } else {
                        resolve();
                    }
                } else {
                    resolve();
                }
            });
        });
        return Promise.all(promises);
    }

    // ৩. স্লাইড পরিবর্তন করার মেইন লজিক
    function changeSlide() {
        if(slides.length === 0) return;
        slides[currentSlideIndex].classList.remove('active');
        currentSlideIndex++;
        
        if (currentSlideIndex >= slides.length) {
            currentSlideIndex = 0;
        }

        slides[currentSlideIndex].classList.add('active');
    }

    // ৪. অটো-প্লে টাইমার চালু করা
    function startAutoSlide() {
        if (!autoSlideTimer) {
            autoSlideTimer = setInterval(() => {
                changeSlide(); 
            }, 4000); 
        }
    }

    // 🎵 ৫. বাটন ক্লিকের পর গান এবং ছবি একসাথে চালু করার মাস্টার ফাংশন
    function startEverything() {
        // ওভারলে স্ক্রিন থেকে সরিয়ে ফেলা
        if (playOverlay) {
            playOverlay.style.opacity = '0';
            setTimeout(() => playOverlay.remove(), 500); // স্মুথলি ভ্যানিশ হবে
        }

        // প্রথম স্লাইড একটিভ করা (ছবি ও টেক্সট অ্যানিমেশন স্টার্ট)
        if (slides.length > 0) {
            slides[0].classList.add('active');
        }

        // গান প্লে করা
        if (music) {
            music.volume = 0.6; // সাউন্ড ৬০%
            music.play().catch(err => console.log("Audio Play Failed: ", err));
        }

        // ৪ সেকেন্ড পর পর স্লাইড চেঞ্জ হওয়া শুরু হবে
        startAutoSlide();
    }

    // সব ইনিশিয়াল সেটআপ রান করা হলো
    prepareAnimatedTexts();

    // ইমেজ লোড হওয়ার পর বাটনটি ক্লিকের জন্য রেডি হবে
    preloadImages().then(() => {
        console.log("All Images loaded.");
        startBtn.innerText = "START EXPERIENCE"; // লোড শেষ হলে লেখা দেখাবে
        startBtn.style.cursor = "pointer";
        
        // বাটনে ক্লিক করলেই ম্যাজিক শুরু
        startBtn.addEventListener('click', startEverything);
        startBtn.addEventListener('touchstart', startEverything, { passive: true });
    });
});
