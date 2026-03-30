// --- REFINED MOTTO SCRIPT ---
class FavoritesManager {
    constructor() {
        this.storageKey = 'naamin_favorites_v1';
        this.favorites = this.load();
        this.updateHeaderCount();
    }

    load() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.favorites));
        this.updateHeaderCount();
    }

    toggle(nameObj) {
        const name = nameObj.name || nameObj.Name;
        const index = this.favorites.findIndex(item => (item.name || item.Name) === name);

        if (index > -1) {
            this.favorites.splice(index, 1);
            return false; // Removed
        } else {
            this.favorites.push(nameObj);
            return true; // Added
        }
    }

    isFavorite(name) {
        return this.favorites.some(item => (item.name || item.Name) === name);
    }

    updateHeaderCount() {
        const countSpan = document.getElementById('fav-count');
        if (countSpan) countSpan.textContent = this.favorites.length;
    }
}

const favManager = new FavoritesManager();

document.addEventListener('DOMContentLoaded', () => {
    // --- NAV LOGIC ---
    // ========== MOBILE MENU FIXED ==========
    const hamburger = document.getElementById("hamburger-menu");
    const mobileMenu = document.getElementById("mobile-menu");
    const mobileDropdown = document.querySelector(".mobile-dropdown");
    const mobileDropdownToggle = document.querySelector(".mobile-dropdown-toggle");

    // Toggle mobile menu
    if (hamburger && mobileMenu) {
        hamburger.addEventListener("click", (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle("open");

            // Icon toggle
            const icon = hamburger.querySelector('i');
            if (icon) {
                icon.className = mobileMenu.classList.contains("open") ? 'fas fa-times' : 'fas fa-bars';
            }
        });
    }

    // Mobile dropdown toggle
    if (mobileDropdownToggle && mobileDropdown) {
        mobileDropdownToggle.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            mobileDropdown.classList.toggle("open");
        });
    }

    // Close when clicking outside
    document.addEventListener("click", (e) => {
        if (mobileMenu && mobileMenu.classList.contains("open")) {
            if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
                mobileMenu.classList.remove("open");
                const icon = hamburger.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            }
        }
    });

    // Dropdown toggle logic
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const parent = toggle.parentElement;
            parent.classList.toggle('open');
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        document.querySelectorAll('.dropdown.open').forEach(opened => {
            if (!opened.contains(e.target)) {
                opened.classList.remove('open');
            }
        });
    });

    const favViewBtn = document.getElementById('fav-view-btn');
    if (favViewBtn) {
        favViewBtn.onclick = () => {
            window.location.href = '../../wishlist.html';
        };
    }

    // --- LANGUAGE LOGIC ---
    // --- LANGUAGE LOGIC ---
    // Full implementation since main script is not included
    const updateContent = (lang) => {
        document.documentElement.lang = lang;
        localStorage.setItem("language", lang);

        // Update all static text
        document.querySelectorAll("[data-en]").forEach(el => {
            const text = el.getAttribute(lang === "hi" ? "data-hi" : "data-en");
            if (text) el.textContent = text;
        });

        // Update inputs
        const isHindi = lang === 'hi';
        const input = document.getElementById('user-input');
        const tone = document.getElementById('tone');

        if (input) input.placeholder = isHindi ? "e.g. LunaWave or Courage (optional)" : "e.g. LunaWave or Courage (optional)";
        if (tone) tone.placeholder = isHindi ? "उदा: आधुनिक, प्रेरणादायक, न्यूनतम" : "e.g. Modern, Inspiring, Minimal";
    };

    const getLanguage = () => localStorage.getItem("language") || "en";

    // Initialize
    updateContent(getLanguage());

    // Listeners
    const langBtns = document.querySelectorAll('#language-toggle, #language-toggle-mobile');
    langBtns.forEach(btn => {
        // Remove old listeners to be safe (though cloning is better, here we just attach new logic)
        btn.onclick = (e) => {
            e.preventDefault();
            const newLang = getLanguage() === "hi" ? "en" : "hi";
            updateContent(newLang);
        };
    });

    // --- GENERATOR LOGIC ---
    const form = document.getElementById('motto-form');
    const mottoList = document.getElementById('motto-list');
    const resultsSection = document.getElementById('results-section');
    const loadingSpinner = document.getElementById('loading-spinner');

    form.onsubmit = async (e) => {
        e.preventDefault();
        const type = (document.getElementById('motto-type').value || 'Brand Motto').trim();
        const input = (document.getElementById('user-input').value || '').trim();
        const tone = (document.getElementById('tone').value || '').trim();

        resultsSection.style.display = 'none';
        loadingSpinner.style.display = 'block';

        // Mock delay
        await new Promise(r => setTimeout(r, 1200));

        const mottos = generateMottos(type, input, tone);
        renderMottos(mottos, type);

        loadingSpinner.style.display = 'none';
        resultsSection.style.display = 'block';
    };

    function renderMottos(mottos, type) {
        mottoList.innerHTML = '';
        mottos.forEach(text => {
            const isLiked = favManager.isFavorite(text);
            const item = document.createElement('div');
            item.className = 'motto-item';
            item.innerHTML = `
                <div class="motto-text">${text}</div>
                <button class="like-btn-motto ${isLiked ? 'liked' : ''}">
                    <i class="${isLiked ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                </button>
            `;

            // Copy on text click
            item.querySelector('.motto-text').onclick = () => {
                navigator.clipboard.writeText(text);
                const lang = document.documentElement.lang || 'en';
                alert(lang === 'hi' ? 'आदर्श वाक्य कॉपी किया गया!' : 'Motto copied!');
            };

            // Like on heart click
            const btn = item.querySelector('.like-btn-motto');
            btn.onclick = (e) => {
                e.stopPropagation();
                const added = favManager.toggle({
                    name: text,
                    meaning: `Motto for ${type}`,
                    origin: 'Motto Generator'
                });
                favManager.save();

                btn.classList.toggle('liked', added);
                btn.querySelector('i').className = added ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
            };

            mottoList.appendChild(item);
        });
    }

    function generateMottos(type, input, tone) {
        const lang = document.documentElement.lang || 'en';
        const isHindi = lang === 'hi';

        const safeInput = input || (isHindi ? 'आपका विचार' : 'Your Idea');
        let displayInput = safeInput;
        let displayTone = tone;

        if (isHindi && window.getHindiName && input) {
            displayInput = window.getHindiName(safeInput);
            if (tone) displayTone = window.getHindiName(tone);
        }

        if (isHindi) {
            const base = [
                `${displayInput}: लालित्य की नई परिभाषा`,
                `${displayInput}: जहां दृष्टि मूल्य से मिलती है`,
                `${displayInput}: साधारण से परे`,
                `${displayInput}: जुनून से प्रेरित`,
                `${displayInput} की भावना`,
                `सिर्फ ${displayInput}`
            ];
            if (displayTone) base.push(`${displayTone} और ${displayInput}: एक सही मेल`);
            return base;
        }

        const base = [
            `${safeInput}: Elegance redefined`,
            `${safeInput}: Where vision meets value`,
            `${safeInput}: Beyond the ordinary`,
            `${safeInput}: Driven by passion`,
            `The spirit of ${safeInput}`,
            `Simply ${safeInput}`
        ];
        if (tone) base.push(`${tone} & ${safeInput}: A perfect match`);
        return base;
    }
});
