// Popular Names - Curated trending names with filters
// Integration with existing favorites and detail view system

document.addEventListener('DOMContentLoaded', () => {
    const namesGrid = document.getElementById('names-grid');
    const showingCount = document.getElementById('showing-count');
    const genderPills = document.querySelectorAll('[data-filter="gender"]');
    const searchInput = document.getElementById('name-search');

    let currentFilters = {
        gender: 'all',
        startsWith: ''
    };

    // Curated popular names dataset
    const popularNames = [
        // Hindu - Male
        { name: 'Aarav', gender: 'male', meaning: 'Peaceful and calm', origin: 'Sanskrit', culture: 'hindu', region: 'pan-india', trend: 'trending' },
        { name: 'Vihaan', gender: 'male', meaning: 'Dawn, morning', origin: 'Sanskrit', culture: 'hindu', region: 'pan-india', trend: 'popular' },
        { name: 'Arjun', gender: 'male', meaning: 'Bright, shining', origin: 'Sanskrit', culture: 'hindu', region: 'north', trend: 'popular' },
        { name: 'Reyansh', gender: 'male', meaning: 'Ray of light', origin: 'Sanskrit', culture: 'hindu', region: 'pan-india', trend: 'trending' },
        { name: 'Aditya', gender: 'male', meaning: 'Sun', origin: 'Sanskrit', culture: 'hindu', region: 'pan-india', trend: 'popular' },
        { name: 'Vivaan', gender: 'male', meaning: 'Full of life', origin: 'Sanskrit', culture: 'hindu', region: 'pan-india', trend: 'rising' },
        { name: 'Atharv', gender: 'male', meaning: 'Knowledgeable', origin: 'Sanskrit', culture: 'hindu', region: 'west', trend: 'rising' },
        { name: 'Dhruv', gender: 'male', meaning: 'Pole star', origin: 'Sanskrit', culture: 'hindu', region: 'north', trend: 'popular' },
        { name: 'Krishna', gender: 'male', meaning: 'Dark, divine', origin: 'Sanskrit', culture: 'hindu', region: 'pan-india', trend: 'popular' },
        { name: 'Shivansh', gender: 'male', meaning: 'Part of Lord Shiva', origin: 'Sanskrit', culture: 'hindu', region: 'north', trend: 'rising' },

        // Hindu - Female
        { name: 'Ansi', gender: 'female', meaning: 'God\'s Gift', origin: 'Sanskrit', culture: 'hindu', region: 'pan-india', trend: 'trending' },
        { name: 'Ananya', gender: 'female', meaning: 'Unique', origin: 'Sanskrit', culture: 'hindu', region: 'pan-india', trend: 'popular' },
        { name: 'Diya', gender: 'female', meaning: 'Lamp, light', origin: 'Sanskrit', culture: 'hindu', region: 'pan-india', trend: 'trending' },
        { name: 'Saanvi', gender: 'female', meaning: 'Goddess Lakshmi', origin: 'Sanskrit', culture: 'hindu', region: 'south', trend: 'popular' },
        { name: 'Pari', gender: 'female', meaning: 'Fairy, angel', origin: 'Sanskrit', culture: 'hindu', region: 'north', trend: 'rising' },
        { name: 'Anika', gender: 'female', meaning: 'Grace', origin: 'Sanskrit', culture: 'hindu', region: 'pan-india', trend: 'popular' },
        { name: 'Kavya', gender: 'female', meaning: 'Poetry', origin: 'Sanskrit', culture: 'hindu', region: 'south', trend: 'popular' },
        { name: 'Myra', gender: 'female', meaning: 'Sweet', origin: 'Sanskrit', culture: 'hindu', region: 'west', trend: 'rising' },
        { name: 'Navya', gender: 'female', meaning: 'New, young', origin: 'Sanskrit', culture: 'hindu', region: 'south', trend: 'rising' },
        { name: 'Isha', gender: 'female', meaning: 'Goddess', origin: 'Sanskrit', culture: 'hindu', region: 'pan-india', trend: 'popular' },

        // Muslim - Male
        { name: 'Ayaan', gender: 'male', meaning: 'Gift of God', origin: 'Arabic', culture: 'muslim', region: 'pan-india', trend: 'trending' },
        { name: 'Zayan', gender: 'male', meaning: 'Graceful', origin: 'Arabic', culture: 'muslim', region: 'pan-india', trend: 'popular' },
        { name: 'Aariz', gender: 'male', meaning: 'Respectable', origin: 'Arabic', culture: 'muslim', region: 'north', trend: 'rising' },
        { name: 'Rayyan', gender: 'male', meaning: 'Gates of heaven', origin: 'Arabic', culture: 'muslim', region: 'pan-india', trend: 'popular' },
        { name: 'Armaan', gender: 'male', meaning: 'Desire, wish', origin: 'Persian', culture: 'muslim', region: 'north', trend: 'popular' },
        { name: 'Kabir', gender: 'male', meaning: 'Great, powerful', origin: 'Arabic', culture: 'muslim', region: 'pan-india', trend: 'popular' },
        { name: 'Rayan', gender: 'male', meaning: 'Little king', origin: 'Arabic', culture: 'muslim', region: 'west', trend: 'rising' },

        // Muslim - Female
        { name: 'Aisha', gender: 'female', meaning: 'Living, prosperous', origin: 'Arabic', culture: 'muslim', region: 'pan-india', trend: 'trending' },
        { name: 'Zara', gender: 'female', meaning: 'Princess', origin: 'Arabic', culture: 'muslim', region: 'pan-india', trend: 'popular' },
        { name: 'Inaya', gender: 'female', meaning: 'Concern, care', origin: 'Arabic', culture: 'muslim', region: 'north', trend: 'rising' },
        { name: 'Alina', gender: 'female', meaning: 'Noble', origin: 'Arabic', culture: 'muslim', region: 'pan-india', trend: 'popular' },
        { name: 'Rida', gender: 'female', meaning: 'Contentment', origin: 'Arabic', culture: 'muslim', region: 'west', trend: 'rising' },
        { name: 'Sara', gender: 'female', meaning: 'Pure, happy', origin: 'Arabic', culture: 'muslim', region: 'pan-india', trend: 'popular' },

        // Sikh - Male
        { name: 'Arman', gender: 'male', meaning: 'Wish, desire', origin: 'Punjabi', culture: 'sikh', region: 'north', trend: 'popular' },
        { name: 'Veer', gender: 'male', meaning: 'Brave', origin: 'Punjabi', culture: 'sikh', region: 'north', trend: 'trending' },
        { name: 'Ekam', gender: 'male', meaning: 'Oneness with God', origin: 'Punjabi', culture: 'sikh', region: 'north', trend: 'rising' },
        { name: 'Angad', gender: 'male', meaning: 'Part of body', origin: 'Punjabi', culture: 'sikh', region: 'north', trend: 'popular' },

        // Sikh - Female
        { name: 'Kiara', gender: 'female', meaning: 'Dark-haired', origin: 'Punjabi', culture: 'sikh', region: 'north', trend: 'trending' },
        { name: 'Simran', gender: 'female', meaning: 'Remembrance', origin: 'Punjabi', culture: 'sikh', region: 'north', trend: 'popular' },
        { name: 'Navleen', gender: 'female', meaning: 'New', origin: 'Punjabi', culture: 'sikh', region: 'north', trend: 'rising' },

        // Christian - Male
        { name: 'Aaron', gender: 'male', meaning: 'Mountain of strength', origin: 'Hebrew', culture: 'christian', region: 'pan-india', trend: 'popular' },
        { name: 'Daniel', gender: 'male', meaning: 'God is my judge', origin: 'Hebrew', culture: 'christian', region: 'south', trend: 'popular' },
        { name: 'Ethan', gender: 'male', meaning: 'Strong, firm', origin: 'Hebrew', culture: 'christian', region: 'pan-india', trend: 'rising' },

        // Christian - Female
        { name: 'Anna', gender: 'female', meaning: 'Grace', origin: 'Hebrew', culture: 'christian', region: 'south', trend: 'popular' },
        { name: 'Eva', gender: 'female', meaning: 'Life', origin: 'Hebrew', culture: 'christian', region: 'pan-india', trend: 'rising' },
        { name: 'Sophia', gender: 'female', meaning: 'Wisdom', origin: 'Greek', culture: 'christian', region: 'pan-india', trend: 'trending' },

        // Modern/Global - Male
        { name: 'Aryan', gender: 'male', meaning: 'Noble', origin: 'Indo-European', culture: 'modern', region: 'pan-india', trend: 'popular' },
        { name: 'Ryan', gender: 'male', meaning: 'Little king', origin: 'Irish', culture: 'modern', region: 'pan-india', trend: 'trending' },
        { name: 'Neil', gender: 'male', meaning: 'Champion', origin: 'Irish', culture: 'modern', region: 'pan-india', trend: 'popular' },
        { name: 'Ayan', gender: 'male', meaning: 'Path, direction', origin: 'Sanskrit', culture: 'modern', region: 'pan-india', trend: 'rising' },

        // Modern/Global - Female
        { name: 'Aria', gender: 'female', meaning: 'Melody', origin: 'Italian', culture: 'modern', region: 'pan-india', trend: 'trending' },
        { name: 'Maya', gender: 'female', meaning: 'Illusion', origin: 'Sanskrit', culture: 'modern', region: 'pan-india', trend: 'popular' },
        { name: 'Mia', gender: 'female', meaning: 'Mine', origin: 'Italian', culture: 'modern', region: 'pan-india', trend: 'trending' },
        { name: 'Riya', gender: 'female', meaning: 'Singer', origin: 'Sanskrit', culture: 'modern', region: 'pan-india', trend: 'popular' },
        { name: 'Tara', gender: 'female', meaning: 'Star', origin: 'Sanskrit', culture: 'modern', region: 'pan-india', trend: 'popular' }
    ];

    // Initialize
    displayNames(popularNames);

    // Gender filter
    genderPills.forEach(pill => {
        pill.addEventListener('click', () => {
            genderPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            currentFilters.gender = pill.dataset.value;
            applyFilters();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const onlyLetters = searchInput.value.replace(/[^a-zA-Z]/g, '');
            const firstLetter = onlyLetters.trim().slice(0, 1).toLowerCase();
            searchInput.value = firstLetter ? firstLetter.toUpperCase() : '';
            currentFilters.startsWith = firstLetter;
            applyFilters();
        });
    }

    // Language Toggle logic
    const updateLanguage = () => {
        const lang = document.documentElement.lang || 'en';
        const isHindi = lang === 'hi';

        document.querySelectorAll("[data-en]").forEach(el => {
            const text = el.getAttribute(isHindi ? "data-hi" : "data-en");
            if (text) el.textContent = text;
        });

        // Re-apply filters to refresh grid content
        applyFilters();
    };

    // React to global language changes
    document.addEventListener('languageChanged', (e) => {
        updateLanguage();
    });

    // Initial language setup
    const savedLang = localStorage.getItem('language') || 'en';
    document.documentElement.lang = savedLang;
    updateLanguage();

    function applyFilters() {
        let filtered = popularNames.filter(name => {
            const genderMatch = currentFilters.gender === 'all' || name.gender === currentFilters.gender;
            const startsWithMatch = !currentFilters.startsWith || name.name.toLowerCase().startsWith(currentFilters.startsWith);

            return genderMatch && startsWithMatch;
        });

        displayNames(filtered);
    }

    function displayNames(names) {
        showingCount.textContent = names.length;

        const lang = (window.getLanguage && window.getLanguage()) || document.documentElement.lang || 'en';
        const isHindi = lang === 'hi';

        if (names.length === 0) {
            namesGrid.innerHTML = `<p style="text-align: center; grid-column: 1/-1; font-size: 1.2rem; color: #6B6B6B;">${isHindi ? 'इस अक्षर से कोई नाम नहीं मिला' : 'No names found for this starting letter'}</p>`;
            return;
        }

        const favorites = (window.favManager && Array.isArray(window.favManager.favorites))
            ? window.favManager.favorites
            : JSON.parse(localStorage.getItem('naamin_favorites_v1') || localStorage.getItem('favorites') || '[]');

        // Translation Maps
        const trendLabelMap = {
            'trending': isHindi ? 'ट्रेंडिंग' : 'Trending',
            'popular': isHindi ? 'सबसे लोकप्रिय' : 'Most Loved',
            'rising': isHindi ? 'उभरता हुआ' : 'Rising'
        };
        const genderLabelMap = {
            'male': isHindi ? 'लड़का' : 'Male',
            'female': isHindi ? 'लड़की' : 'Female'
        };
        const originMap = {
            'Sanskrit': 'संस्कृत',
            'Arabic': 'अरबी',
            'Persian': 'फ़ारसी',
            'Punjabi': 'पंजाबी',
            'Hebrew': 'हिब्रू',
            'Greek': 'ग्रीक',
            'Indo-European': 'भरोपीय',
            'Irish': 'आयरिश',
            'Italian': 'इतालवी'
        };

        namesGrid.innerHTML = names.map((nameObj, index) => {
            const isLiked = favorites.some(fav => fav.name === nameObj.name);
            const trendEmoji = {
                'trending': '🔥',
                'popular': '⭐',
                'rising': '📈'
            };

            const genderIcon = nameObj.gender === 'male' ? '<i class="fas fa-mars"></i>' : '<i class="fas fa-venus"></i>';

            let displayName = nameObj.name;
            let displayOrigin = nameObj.origin;
            let displayGender = capitalize(nameObj.gender);

            if (isHindi) {
                if (window.getHindiName) {
                    displayName = `${nameObj.name} <span class="hindi-script">(${window.getHindiName(nameObj.name)})</span>`;
                }
                if (originMap[nameObj.origin]) displayOrigin = originMap[nameObj.origin];
                if (genderLabelMap[nameObj.gender]) displayGender = genderLabelMap[nameObj.gender];
            }

            return `
                <div class="name-card ${nameObj.gender}-card" style="animation-delay: ${index * 0.05}s" data-name="${nameObj.name}">
                    <div class="trend-badge ${nameObj.trend}">
                        ${trendEmoji[nameObj.trend]} ${trendLabelMap[nameObj.trend]}
                    </div>
                    
                    <button class="like-btn-card ${isLiked ? 'liked' : ''}" data-name="${nameObj.name}">
                        <i class="fas fa-heart"></i>
                    </button>

                    <div class="name-display">${displayName}</div>
                    
                    <div class="gender-badge">
                        ${genderIcon} ${displayGender}
                    </div>

                    <div class="origin-badge">
                        <i class="fas fa-globe"></i> ${displayOrigin}
                    </div>

                    <div class="name-meaning">${nameObj.meaning}</div>
                </div>
            `;
        }).join('');

        // Add click handlers
        document.querySelectorAll('.name-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.like-btn-card')) {
                    const name = card.dataset.name;
                    const nameData = names.find(n => n.name === name);
                    // TODO: Open detail modal (integrate with existing system)
                    console.log('Open detail for:', nameData);
                }
            });
        });

        // Like button handlers
        document.querySelectorAll('.like-btn-card').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const name = btn.dataset.name;
                const nameData = names.find(n => n.name === name);
                toggleLike(btn, nameData);
            });
        });
    }

    function toggleLike(button, nameData) {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const index = favorites.findIndex(fav => fav.name === nameData.name);

        if (index > -1) {
            favorites.splice(index, 1);
            button.classList.remove('liked');
        } else {
            favorites.push({
                name: nameData.name,
                gender: nameData.gender === 'male' ? 'Boy' : 'Girl',
                meaning: nameData.meaning
            });
            button.classList.add('liked');
        }

        localStorage.setItem('favorites', JSON.stringify(favorites));
        localStorage.setItem('naamin_favorites_v1', JSON.stringify(favorites));
        try { document.dispatchEvent(new CustomEvent('favoritesUpdated')); } catch (e) { }
        updateFavoriteCount();
    }

    function updateFavoriteCount() {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const count = favorites.length;

        const desktopCount = document.getElementById('fav-count');
        const mobileCount = document.getElementById('fav-count-mobile');

        if (desktopCount) desktopCount.textContent = count;
        if (mobileCount) mobileCount.textContent = count;
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
});
