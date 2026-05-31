document.addEventListener('DOMContentLoaded', () => {
    let currentSlideIndex = 0;
    const slides = document.querySelectorAll('.slide');
    const music = document.getElementById('bg-music');
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

    // ২. ইমেজ ব্যাকগ্রাউন্ড লোড করা (ইমেজ লোডিং প্রমিজসহ)
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
                        img.onerror = () => resolve(); // কোনো কারণে ইমেজ মিস হলে আটকে থাকবে না
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

    // ৪. অটো-প্লে টাইমার চালু করা (প্রতি ৪ সেকেন্ড পর পর)
    function startAutoSlide() {
        if (!autoSlideTimer) {
            autoSlideTimer = setInterval(() => {
                changeSlide(); 
            }, 4000); 
        }
    }

    // 🎵 ৫. গান এবং স্লাইডার একসাথে শুরু করার জন্য মাস্টার কন্ট্রোলার
    function startExperience() {
        if (music) {
            music.volume = 0.5; // সাউন্ড লেভেল ৫০%
            music.play()
                .then(() => {
                    console.log("SUCCESS: Music & Experience started!");
                })
                .catch(error => {
                    console.log("Autoplay blocked. Click required.");
                });
        }
        // গান চালুর সাথে সাথেই স্লাইড চলা শুরু হবে
        startAutoSlide();
        
        // একবার এক্সপেরিয়েন্স চালু হলে ইভেন্ট রিমুভ করে দেওয়া হবে
        removeInteractionEvents();
    }

    const interactionEvents = ['click', 'touchstart', 'pointerdown'];
    
    function removeInteractionEvents() {
        interactionEvents.forEach(event => {
            document.removeEventListener(event, startExperience);
        });
    }

    // সব ইনিশিয়াল সেটআপ রান করা হলো
    prepareAnimatedTexts();

    // ইমেজ লোড হওয়ার পর ইউজার অ্যাকশনের জন্য রেডি হবে
    preloadImages().then(() => {
        console.log("All Images Loaded Perfectly!");
        
        // নিজে থেকে ট্রাই করবে (যদি ব্রাউজার আগে থেকে অনুমতি দেয়)
        startExperience();

        // ব্রাউজার যদি ব্লক করে, তবে প্রথম ক্লিকেই গান আর ছবি একসাথে চালু হবে
        interactionEvents.forEach(event => {
            document.addEventListener(event, startExperience, { passive: true });
        });
    });
});
