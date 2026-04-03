// Unique Names - Curated rare and uncommon names
// Integration with global astroEngine, favManager and showDetails

document.addEventListener('DOMContentLoaded', () => {
    // Show the body once loaded
    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';

    const namesGrid = document.getElementById('names-grid');
    const showingCount = document.getElementById('showing-count');
    const genderPills = document.querySelectorAll('[data-filter="gender"]');
    const letterSelect = document.getElementById('letter-filter');
    const detailContainer = document.querySelector('.name-details-container');
    const detailBox = document.querySelector('.name-details');
    const backBtn = document.querySelector('.back-btn');
    const namesSection = document.querySelector('.names-section');

    let currentFilters = {
        gender: 'all',
        startsWith: 'all'
    };

    // Curated Unique/Rare names dataset
    const uniqueNames = [
        // Rare - Male
        { name: 'Abhivira', name_hi: 'अभिवीरा', gender: 'male', meaning: 'Heroic, brave', meaning_hi: 'वीर, बहादुर', origin: 'Sanskrit', origin_hi: 'संस्कृत', rarity: 'rare', rarity_hi: 'दुर्लभ' },
        { name: 'Ivaan', name_hi: 'इवान', gender: 'male', meaning: 'Glorious, gift of God', meaning_hi: 'यशस्वी, भगवान का उपहार', origin: 'Global', origin_hi: 'वैश्विक', rarity: 'rare', rarity_hi: 'दुर्लभ' },
        { name: 'Kshiraj', name_hi: 'क्षीरज', gender: 'male', meaning: 'Nectar, born of the moon', meaning_hi: 'अमृत, चंद्रमा से उत्पन्न', origin: 'Sanskrit', origin_hi: 'संस्कृत', rarity: 'rare', rarity_hi: 'दुर्लभ' },
        { name: 'Ojasvat', name_hi: 'ओजस्वत', gender: 'male', meaning: 'Powerful, energetic', meaning_hi: 'शक्तिशाली, ऊर्जावान', origin: 'Sanskrit', origin_hi: 'संस्कृत', rarity: 'rare', rarity_hi: 'दुर्लभ' },
        { name: 'Zian', name_hi: 'जियान', gender: 'male', meaning: 'Self-peace, bold', meaning_hi: 'आत्म-शांति, साहसी', origin: 'Global', origin_hi: 'वैश्विक', rarity: 'rare', rarity_hi: 'दुर्लभ' },

        // Very Rare - Male
        { name: 'Hridaan', name_hi: 'हृदान', gender: 'male', meaning: 'Gift of heart', meaning_hi: 'हृदय का उपहार', origin: 'Modern Indian', origin_hi: 'आधुनिक भारतीय', rarity: 'very rare', rarity_hi: 'अति दुर्लभ' },
        { name: 'Nyraan', name_hi: 'नायरान', gender: 'male', meaning: 'Luminous, bright', meaning_hi: 'चमकदार, उज्ज्वल', origin: 'Modern Indian', origin_hi: 'आधुनिक भारतीय', rarity: 'very rare', rarity_hi: 'अति दुर्लभ' },
        { name: 'Taksheel', name_hi: 'तक्षील', gender: 'male', meaning: 'Strong character', meaning_hi: 'मजबूत चरित्र', origin: 'Sanskrit', origin_hi: 'संस्कृत', rarity: 'very rare', rarity_hi: 'अति दुर्लभ' },
        { name: 'Yuvik', name_hi: 'युविक', gender: 'male', meaning: 'Young, youthful', meaning_hi: 'युवा, जवान', origin: 'Sanskrit', origin_hi: 'संस्कृत', rarity: 'very rare', rarity_hi: 'अति दुर्लभ' },

        // Exclusive - Male
        { name: 'Aavira', name_hi: 'आविरा', gender: 'male', meaning: 'First ray of sun', meaning_hi: 'सूर्य की पहली किरण', origin: 'Fusion', origin_hi: 'फ्यूजन', rarity: 'exclusive', rarity_hi: 'विशिष्ट' },
        { name: 'Ekansh', name_hi: 'एकांश', gender: 'male', meaning: 'Whole, complete', meaning_hi: 'पूर्ण, संपूर्ण', origin: 'Sanskrit', origin_hi: 'संस्कृत', rarity: 'exclusive', rarity_hi: 'विशिष्ट' },
        { name: 'Idhant', name_hi: 'ईधांत', gender: 'male', meaning: 'Luminous, shining', meaning_hi: 'चमकदार, दीप्तिमान', origin: 'Sanskrit', origin_hi: 'संस्कृत', rarity: 'exclusive', rarity_hi: 'विशिष्ट' },
        { name: 'Viraaj', name_hi: 'विराज', gender: 'male', meaning: 'Resplendent, king', meaning_hi: 'दीप्यमान, राजा', origin: 'Sanskrit', origin_hi: 'संस्कृत', rarity: 'exclusive', rarity_hi: 'विशिष्ट' },

        // Rare - Female
        { name: 'Amaya', name_hi: 'अमाया', gender: 'female', meaning: 'Night rain', meaning_hi: 'रात की बारिश', origin: 'Global', origin_hi: 'वैश्विक', rarity: 'rare', rarity_hi: 'दुर्लभ' },
        { name: 'Inara', name_hi: 'इनारा', gender: 'female', meaning: 'Ray of light', meaning_hi: 'प्रकाश की किरण', origin: 'Arabic', origin_hi: 'अरबी', rarity: 'rare', rarity_hi: 'दुर्लभ' },
        { name: 'Kyra', name_hi: 'कायरा', gender: 'female', meaning: 'Sun, lady', meaning_hi: 'सूर्य, महिला', origin: 'Global', origin_hi: 'वैश्विक', rarity: 'rare', rarity_hi: 'दुर्लभ' },
        { name: 'Myra', name_hi: 'मायरा', gender: 'female', meaning: 'Beloved, sweet', meaning_hi: 'प्रिय, मीठा', origin: 'Global', origin_hi: 'वैश्विक', rarity: 'rare', rarity_hi: 'दुर्लभ' },
        { name: 'Suhana', name_hi: 'सुहाना', gender: 'female', meaning: 'Beautiful, pleasant', meaning_hi: 'सुंदर, सुखद', origin: 'Hindi', origin_hi: 'हिंदी', rarity: 'rare', rarity_hi: 'दुर्लभ' },

        // Very Rare - Female
        { name: 'Advika', name_hi: 'अद्विका', gender: 'female', meaning: 'Unique, world', meaning_hi: 'अद्वितीय, दुनिया', origin: 'Sanskrit', origin_hi: 'संस्कृत', rarity: 'very rare', rarity_hi: 'अति दुर्लभ' },
        { name: 'Eshna', name_hi: 'एश्ना', gender: 'female', meaning: 'Desire, wish', meaning_hi: 'इच्छा, कामना', origin: 'Sanskrit', origin_hi: 'संस्कृत', rarity: 'very rare', rarity_hi: 'अति दुर्लभ' },
        { name: 'Inaya', name_hi: 'इनाया', gender: 'female', meaning: 'Gift of God, concern', meaning_hi: 'भगवान का उपहार, चिंता', origin: 'Arabic', origin_hi: 'अरबी', rarity: 'very rare', rarity_hi: 'अति दुर्लभ' },
        { name: 'Navya', name_hi: 'नाव्या', gender: 'female', meaning: 'New, modern', meaning_hi: 'नया, आधुनिक', origin: 'Sanskrit', origin_hi: 'संस्कृत', rarity: 'very rare', rarity_hi: 'अति दुर्लभ' },
        { name: 'Vanya', name_hi: 'वान्या', gender: 'female', meaning: 'Graceful gift of God', meaning_hi: 'भगवान का सुंदर उपहार', origin: 'Sanskrit', origin_hi: 'संस्कृत', rarity: 'very rare', rarity_hi: 'अति दुर्लभ' },

        // Exclusive - Female
        { name: 'Aashvi', name_hi: 'आश्वी', gender: 'female', meaning: 'Blessed, victorious', meaning_hi: 'धन्य, विजयी', origin: 'Sanskrit', origin_hi: 'संस्कृत', rarity: 'exclusive', rarity_hi: 'विशिष्ट' },
        { name: 'Ira', name_hi: 'इरा', gender: 'female', meaning: 'Earth, wisdom', meaning_hi: 'पृथ्वी, ज्ञान', origin: 'Sanskrit', origin_hi: 'संस्कृत', rarity: 'exclusive', rarity_hi: 'विशिष्ट' },
        { name: 'Nyra', name_hi: 'नायरा', gender: 'female', meaning: 'Goddess Saraswati, beauty', meaning_hi: 'देवी सरस्वती, सुंदरता', origin: 'Sanskrit', origin_hi: 'संस्कृत', rarity: 'exclusive', rarity_hi: 'विशिष्ट' },
        { name: 'Siya', name_hi: 'सिया', gender: 'female', meaning: 'Goddess Sita', meaning_hi: 'देवी सीता', origin: 'Sanskrit', origin_hi: 'संस्कृत', rarity: 'exclusive', rarity_hi: 'विशिष्ट' },
        { name: 'Zoya', name_hi: 'ज़ोया', gender: 'female', meaning: 'Alive, loving', meaning_hi: 'जीवंत, प्यारा', origin: 'Global', origin_hi: 'वैश्विक', rarity: 'exclusive', rarity_hi: 'विशिष्ट' },

        // Unisex / Fusion
        { name: 'Arya', name_hi: 'आर्या', gender: 'unisex', meaning: 'Noble', meaning_hi: 'कुलीन', origin: 'Sanskrit', origin_hi: 'संस्कृत', rarity: 'rare', rarity_hi: 'दुर्लभ' },
        { name: 'Kia', name_hi: 'किया', gender: 'unisex', meaning: 'Earth queen', meaning_hi: 'पृथ्वी की रानी', origin: 'Global', origin_hi: 'वैश्विक', rarity: 'very rare', rarity_hi: 'अति दुर्लभ' },
        { name: 'Rei', name_hi: 'रेई', gender: 'unisex', meaning: 'Grace, spirit', meaning_hi: 'कृपा, आत्मा', origin: 'Fusion', origin_hi: 'फ्यूजन', rarity: 'exclusive', rarity_hi: 'विशिष्ट' }
    ];

    // Language Toggle Listener
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

    // Initialize display
    const savedLang = localStorage.getItem('language') || 'en';
    document.documentElement.lang = savedLang;
    updateLanguage();

    // Gender filter event
    genderPills.forEach(pill => {
        pill.addEventListener('click', () => {
            genderPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            currentFilters.gender = pill.dataset.value;
            applyFilters();
        });
    });

    // Letter filter event
    if (letterSelect) {
        letterSelect.addEventListener('change', () => {
            currentFilters.startsWith = letterSelect.value.toLowerCase();
            applyFilters();
        });
    }

    function applyFilters() {
        let filtered = uniqueNames.filter(name => {
            const genderMatch = currentFilters.gender === 'all' || name.gender === currentFilters.gender;
            const startsWithMatch = currentFilters.startsWith === 'all' || name.name.toLowerCase().startsWith(currentFilters.startsWith);
            return genderMatch && startsWithMatch;
        });

        displayNames(filtered);
    }

    function displayNames(names) {
        if (!namesGrid) return;

        const lang = document.documentElement.lang || 'en';
        const isHindi = lang === 'hi';

        showingCount.textContent = names.length;
        namesGrid.innerHTML = '';

        if (names.length === 0) {
            namesGrid.innerHTML = `<p class="no-results">${isHindi ? 'इस अक्षर से कोई नाम नहीं मिला।' : 'No names found for this starting letter.'}</p>`;
            return;
        }

        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

        names.forEach((nameObj, index) => {
            const isLiked = favorites.some(fav => fav.name === nameObj.name);
            const genderIcon = nameObj.gender === 'male' ? 'mars' : (nameObj.gender === 'female' ? 'venus' : 'venus-mars');

            // Language selection
            const displayName = isHindi ? (nameObj.name_hi || nameObj.name) : nameObj.name;
            const displayMeaning = isHindi ? (nameObj.meaning_hi || nameObj.meaning) : nameObj.meaning;
            const displayOrigin = isHindi ? (nameObj.origin_hi || nameObj.origin) : nameObj.origin;
            const displayRarity = isHindi ? (nameObj.rarity_hi || nameObj.rarity) : nameObj.rarity;

            const card = document.createElement('div');
            card.className = `name-card ${nameObj.gender}-card`;
            card.setAttribute('data-gender', nameObj.gender);
            card.style.animationDelay = `${index * 0.05}s`;

            card.innerHTML = `
                <div class="rarity-badge rarity-${nameObj.rarity}">${displayRarity}</div>
                <button class="like-btn-card ${isLiked ? 'liked' : ''}" data-name="${nameObj.name}">
                    <i class="fas fa-heart"></i>
                </button>
                <div class="name-display">${displayName}</div>
                <div class="gender-badge">
                    <i class="fas fa-${genderIcon}"></i> ${capitalize(nameObj.gender)}
                </div>
                <div class="origin-tag">
                    <i class="fas fa-globe"></i> ${displayOrigin}
                </div>
                <div class="name-meaning">${displayMeaning}</div>
            `;

            // Click Handlers
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.like-btn-card')) {
                    // showDetails(nameObj); // Assuming showDetails isn't fully implemented in this standalone version or handled elsewhere
                    console.log('Details clicked for', nameObj.name);
                }
            });

            const likeBtn = card.querySelector('.like-btn-card');
            likeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleLike(likeBtn, nameObj);
            });

            namesGrid.appendChild(card);
        });
    }

    function toggleLike(button, nameData) {
        let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const index = favorites.findIndex(fav => fav.name === nameData.name);

        // Always save english name as ID, but persist additional data if needed
        if (index > -1) {
            favorites.splice(index, 1);
            button.classList.remove('liked');
        } else {
            favorites.push({
                name: nameData.name,
                gender: capitalize(nameData.gender),
                meaning: nameData.meaning,
                origin: nameData.origin
            });
            button.classList.add('liked');
        }

        localStorage.setItem('favorites', JSON.stringify(favorites));
        localStorage.setItem('naamin_favorites_v1', JSON.stringify(favorites));
        try { document.dispatchEvent(new CustomEvent('favoritesUpdated')); } catch (e) { }
        updateFavoriteCount();
    }

    function updateFavoriteCount() {
        const count = JSON.parse(localStorage.getItem('favorites') || '[]').length;
        const favCountEl = document.getElementById('fav-count');
        if (favCountEl) favCountEl.textContent = count;
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
});
