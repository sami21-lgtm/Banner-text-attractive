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

    // 🎵 ৫. ব্রাউজার সিকিউরিটি বাইপাস করে গান বাজানোর আপডেট করা ফাংশন
    function initMusicController() {
        const music = document.getElementById('bg-music');
        if (!music) return;

        // সাউন্ড লেভেল কিছুটা কমিয়ে রাখা হলো (ঐচ্ছিক)
        music.volume = 0.5;

        const playAudio = () => {
            if (music.paused) {
                music.play()
                    .then(() => {
                        console.log("SUCCESS: Music started playing!");
                        // গান সফলভাবে চালু হয়ে গেলে সব ইভেন্ট রিমুভ হবে
                        removeMusicEvents();
                    })
                    .catch(error => {
                        console.log("Waiting for user interaction to play audio...", error);
                    });
            }
        };

        // নিজে থেকে বাজানোর চেষ্টা করবে (যদি ব্রাউজার অ্যালাউ করে)
        playAudio();

        // ইভেন্ট লিসেনারগুলো একসাথে হ্যান্ডেল করার ফাংশন
        const musicEvents = ['click', 'touchstart', 'pointerdown'];
        
        function removeMusicEvents() {
            musicEvents.forEach(event => {
                document.removeEventListener(event, playAudio);
            });
        }

        // ব্রাউজার ব্লক করলে মোবাইল টাচ, ক্লিক বা পয়েন্টার ডাউনের জন্য ওয়েট করবে
        musicEvents.forEach(event => {
            document.addEventListener(event, playAudio, { passive: true });
        });
    }

    // সব ফাংশন একসাথে রান করা হলো
    prepareAnimatedTexts();
    setBackgroundImages();
    initMusicController();
    
    // ❌ slides[0].classList.add('active'); -> এই লাইনটি রিমুভ করা হয়েছে কারণ HTML-এ অলরেডি active দেওয়া আছে।

    startAutoSlide();
});
