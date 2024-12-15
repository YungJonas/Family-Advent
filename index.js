// Config
const CONFIG = {
    CARDS_COUNT: 24,
    TOAST_DURATION: 2000,
    TITLES: [
        "Hallo, bittschön! Salat, alles?", "Kastelruther Atzen", "Fahrlehrer Pepe",
        "Immer rein mit dem Wein", "All you can fluff", "Ed von Schleck", "3 Bier sind eine Mahlzeit",
        "Hat jemand Party gesagt?", "Das blühende Leben", "3 Touristen in Hamburg?",
        "Firsty Safe am Strand", "Send help", "Gleiche Blondierung", "1 Kg geplfückt, 3 Kg gegessen",
        "Isemarkt Double Trouble", "Baywatch Aarhus", "Knödel-Trio", "Peek a Bo",
        "Gute Gespräche", "Bergziegen in freier Natur", "Familie Vogel-Jahn",
        "Traum von Amsterdam", "Air Jail", "Merry Crisis"
    ],
    
};

// Add this function to your existing code
function addPreloadLinks() {
    const currentDay = utils.getCurrentDay();
    
    // Create preload links for current day, day before, and day after
    const daysToPreload = [currentDay - 1, currentDay, currentDay + 1];
    
    daysToPreload.forEach(day => {
        // Only create links for valid days (1-24)
        if (day >= 1 && day <= 24) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = `https://yungjonas.github.io/Fadventhost/Fadvent/Tag${day}.jpg`;
            link.as = 'image';
            link.type = 'image/jpg';
            document.head.appendChild(link);
        }
    });
};

const MEME_DATA = CONFIG.TITLES.map((title, i) => ({
    title,
    src: `https://yungjonas.github.io/Fadventhost/Fadvent/Tag${i + 1}.jpg`
}));

const CARD_BACKGROUNDS = [
  //  "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExcnpvNW84YTVrYmdrdGRiMmoxc2YzMGt2ZWd2MzV2dWs0dnZiNGtjYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKpWNYDRZtChgs0/giphy.webp",
    // "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGk3b2IwYTFtcnN6enk0dHh2M29xdDNwNTgycnRpbmtzMHBma3c1byZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LBAv3HJDl2WwU/giphy.webp",
    // Add the rest of your backgrounds here
];

// DOM Elements
// DOM Elements
const DOM = {
    slider: document.getElementById('slider'),
    navList: document.getElementById('navList'),
    sliderContainer: document.getElementById('sliderContainer'),
    popup: document.getElementById('popup'),
    popupTitle: document.getElementById('popupTitle'),
    popupImage: document.getElementById('popupImage'),
    teamsBtn: document.getElementById('teamsBtn'),
    shareBtn: document.getElementById('shareBtn'),
    toastContainer: document.getElementById('toastContainer'),
    intro: document.querySelector('.intro'),
    heading: document.querySelector('h1')
};

// Utils
const utils = {
    getCurrentDay() {
        //return new Date().getDate();
        return 24;
    },

    getTimeUntilUnlock(targetDay) {
        const currentDay = this.getCurrentDay();
        const currentHour = new Date().getHours();
        const daysLeft = targetDay - currentDay;
        const hoursLeft = 24 - currentHour;
        
        return daysLeft === 1 
            ? `🎅🏿 Öffnet in ${hoursLeft} Stunden`
            : `🎅🏿 Öffnet in ${daysLeft} Tagen und ${hoursLeft} Stunden`;
    },

    createToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        
        const removeToast = () => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), CONFIG.ANIMATION_DURATION);
        };
        
        toast.addEventListener('click', removeToast);
        DOM.toastContainer.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('show'));
        setTimeout(removeToast, CONFIG.TOAST_DURATION);
    },

    isMobile() {
        return window.innerWidth < 1024;
    }
};

// Calendar functionality
const Calendar = {
    init() {
        addPreloadLinks();
        this.createCards();
        this.createNavButtons();
        this.setupEventListeners();
        //this.scrollToCurrentDay();
        this.updateHeading();
    },

    createCards() {
        const currentDay = utils.getCurrentDay();
        
        for (let i = 1; i <= CONFIG.CARDS_COUNT; i++) {
            this.createCard(i, currentDay);
            //this.createNavButton(i, currentDay);
        }
    },

        createCard(number, currentDay) {
            const card = document.createElement('div');
            card.className = `card${number <= currentDay ? '' : ' locked'}${number === currentDay ? ' today' : ''}`;
            card.id = `card${number}`;
            
            // Past and current days are unlocked
            if (number <= currentDay) {
                if (CARD_BACKGROUNDS[number-1]) {
                    card.style.cssText = `background: url(${CARD_BACKGROUNDS[number-1]}) center/cover`;
                }
                card.addEventListener('click', () => this.showPopup(number - 1));
            } 
            // Future days are locked
            else {
                card.addEventListener('click', () => {
                    utils.createToast(utils.getTimeUntilUnlock(number));
                });
            }
            
            card.innerHTML = `<div class="content">${number}</div>`;
            DOM.slider.appendChild(card);
        },

        scrollToElement(element, shouldScroll = false) {
            if (!element) return;
        
            // Update active states immediately before scroll
            document.querySelectorAll('.card').forEach(card => {
                card.classList.remove('selected');
            });
            element.classList.add('selected');
            
            const cardNumber = parseInt(element.textContent);
            this.updateActiveButton(cardNumber);
        
            // Then scroll if needed
            if (shouldScroll) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        },

        createNavButtons() {
            const todayButton = document.getElementById('todayButton');
            const calendarButton = document.getElementById('calendarButton');
            const calendarDropdown = document.getElementById('calendarDropdown');
    
            // Today button click
            todayButton.addEventListener('click', () => {
                const currentDay = utils.getCurrentDay();
                const todayCard = document.getElementById(`card${currentDay}`);
                this.scrollToElement(todayCard, true);
            });
    
            // Calendar button click
            calendarButton.addEventListener('click', (e) => {
                e.stopPropagation();
                const isVisible = calendarDropdown.style.display === 'grid';
                calendarDropdown.style.display = isVisible ? 'none' : 'grid';
    
                if (!isVisible) {
                    // Only populate calendar if we're showing it
                    calendarDropdown.innerHTML = '';
                    for (let i = 1; i <= CONFIG.CARDS_COUNT; i++) {
                        const dayButton = document.createElement('button');
                        dayButton.textContent = i;
                        dayButton.addEventListener('click', () => {
                            const card = document.getElementById(`card${i}`);
                            this.scrollToElement(card, true);
                            calendarDropdown.style.display = 'none';
                        });
                        calendarDropdown.appendChild(dayButton);
                    }
                }
            });
    
            // Close calendar when clicking outside
            document.addEventListener('click', () => {
                calendarDropdown.style.display = 'none';
            });
        },

    showPopup(index) {
        const meme = MEME_DATA[index];
        
        DOM.popupTitle.textContent = meme.title;
        DOM.popupImage.src = meme.src;
        DOM.popupImage.alt = meme.title;
        
        DOM.shareBtn.onclick = async () => {
            try {
                await navigator.share({
                    title: meme.title,
                    text: `Check out this sticker: ${meme.title}`,
                    url: meme.src
                });
            } catch {
                navigator.clipboard.writeText(meme.src)
                    .then(() => utils.createToast('Sticker URL kopiert!'))
                    .catch(() => utils.createToast('Teilen abgebrochen'));
            }
        };
        
        DOM.popup.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    },

    updateActiveButton(activeNumber) {
        document.querySelectorAll('.nav-button').forEach((btn, index) => {
            btn.classList.toggle('active', index + 1 === activeNumber);
        });
    },

    setupEventListeners() {
        const popup = document.getElementById('popup');
        popup.addEventListener('click', (e) => {
            // Close on either popup overlay click OR the × button click
            if (e.target === popup || e.target.textContent === '×') {
                popup.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            const currentCard = document.querySelector('.card.selected');
            if (currentCard) {
                this.scrollToElement(currentCard);
            }
        });
    },

   /* scrollToCurrentDay() {
    const currentDay = utils.getCurrentDay();
    const todayCard = document.getElementById(`card${currentDay}`);
    if (todayCard) {
        // Pass true to indicate we want to scroll on initial load
        setTimeout(() => this.scrollToElement(todayCard, true), 100);
    }
},*/

updateHeading() {
    console.log("updateHeading is running");
    const daysLeft = 24 - utils.getCurrentDay();
    console.log("Days left:", daysLeft);
    DOM.intro.innerHTML = `Noch ${daysLeft} Tage bis Weihnachten 🎄`;
}
};

function toggleDarkMode() {
    document.documentElement.classList.toggle('dark-mode');
  };

// Initialize
document.addEventListener('DOMContentLoaded', () => Calendar.init());
console.log("DOM.intro element:", DOM.intro);
