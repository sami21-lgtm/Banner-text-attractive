document.addEventListener('DOMContentLoaded', () => {
    let currentSlideIndex = 0;
    const slides = document.querySelectorAll('.slide');
    let autoSlideTimer;

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

    // ২. data-image থেকে ব্যাকগ্রাউন্ড ইমেজ লোড করা
    function setBackgroundImages() {
        slides.forEach(slide => {
            const container = slide.querySelector('.image-container');
            if (container) {
                const imageUrl = container.getAttribute('data-image');
                if (imageUrl) {
                    container.style.backgroundImage = `url("${imageUrl}")`;
                }
            }
        });
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

    // ৪. অটো-প্লে টাইমার চালু করা (প্রতি ৪ সেকেন্ড পর পর)
    function startAutoSlide() {
        autoSlideTimer = setInterval(() => {
            changeSlide(); 
        }, 4000); 
    }

    // 🎵 ৫. ব্রাউজার সিকিউরিটি বাইপাস করে গান বাজানোর গ্যারান্টিড ফাংশন
    function initMusicController() {
        const music = document.getElementById('bg-music');
        if (!music) return;

        const playAudio = () => {
            if (music.paused) {
                music.play()
                    .then(() => {
                        console.log("SUCCESS: Music started playing!");
                        // গান সফলভাবে চালু হয়ে গেলে ইভেন্ট রিমুভ হবে
                        document.removeEventListener('click', playAudio);
                        document.removeEventListener('touchstart', playAudio);
                    })
                    .catch(error => {
                        console.log("Waiting for user interaction to play audio...", error);
                    });
            }
        };

        // মোবাইল টাচ (touchstart) অথবা ল্যাপটপ ক্লিক (click) পেলেই গান চালু হবে
        document.addEventListener('click', playAudio);
        document.addEventListener('touchstart', playAudio);
    }

    // সব ফাংশন একসাথে রান করা হলো
    prepareAnimatedTexts();
    setBackgroundImages();
    initMusicController();
    
    if (slides.length > 0) {
        slides[0].classList.add('active');
    }

    startAutoSlide();
});
