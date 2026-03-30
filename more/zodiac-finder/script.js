document.addEventListener('DOMContentLoaded', () => {
    // --- NAV LOGIC ---
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

    const rashiMap = [
        {
            rashi_en: "Aries (Mesh)",
            rashi_hi: "मेष (Aries)",
            letters: ["chu", "che", "cho", "la", "li", "lu", "le", "lo", "a"],
            nakshatra: "Ashwini, Bharani, Krittika",
            nakshatra_hi: "अश्विनी, भरणी, कृतिका",
            traits: "Courageous, energetic, and a born leader. Your personality reflects fire and determination. You are always ready for new challenges and possess a natural charisma that draws people toward you.",
            traits_hi: "साहसी, ऊर्जावान और जन्मजात नेता। आपका व्यक्तित्व अग्नि और दृढ़ संकल्प को दर्शाता है। आप नई चुनौतियों के लिए हमेशा तैयार रहते हैं और एक स्वाभाविक आकर्षण रखते हैं।"
        },
        {
            rashi_en: "Taurus (Vrishabh)",
            rashi_hi: "वृषभ (Taurus)",
            letters: ["i", "ee", "u", "oo", "e", "o", "va", "vi", "vu", "ve", "vo"],
            nakshatra: "Krittika, Rohini, Mrigashira",
            nakshatra_hi: "कृतिका, रोहिणी, मृगशिरा",
            traits: "Calm, reliable, and a lover of arts. You value stability and have a strong aesthetic sense. Your practical nature combined with your appreciation for beauty makes you a grounded and dependable individual.",
            traits_hi: "शांत, विश्वसनीय और कला प्रेमी। आप स्थिरता को महत्व देते हैं और आपकी सौंदर्य बोध की भावना प्रबल है। आपकी व्यावहारिक प्रकृति और सौंदर्य के प्रति सराहना आपको एक विश्वसनीय व्यक्ति बनाती है।"
        },
        {
            rashi_en: "Gemini (Mithun)",
            rashi_hi: "मिथुन (Gemini)",
            letters: ["ka", "ki", "ku", "gh", "ng", "ch", "ke", "ko", "ha"],
            nakshatra: "Mrigashira, Ardra, Punarvasu",
            nakshatra_hi: "मृगशिरा, आर्द्रा, पुनर्वसु",
            traits: "Intelligent, talkative, and versatile. You have a dual nature that allows you to see both sides of every situation. Curious and communicative, you thrive in social environments and enjoy learning new things.",
            traits_hi: "बुद्धिमान, बातूनी और बहुमुखी। आपकी दोहरी प्रकृति आपको हर स्थिति के दोनों पहलुओं को देखने की अनुमति देती है। जिज्ञासु और मिलनसार, आप सामाजिक वातावरण में पनपते हैं।"
        },
        {
            rashi_en: "Cancer (Kark)",
            rashi_hi: "कर्क (Cancer)",
            letters: ["hi", "hu", "he", "ho", "da", "di", "du", "de", "do"],
            nakshatra: "Punarvasu, Pushya, Ashlesha",
            nakshatra_hi: "पुनर्वसु, पुष्य, अश्लेषा",
            traits: "Emotional, sensitive, and family-oriented. You are the nurturer of the zodiac, with a deep protective instinct for those you love. Your intuition is your greatest guide, and you value emotional security above all.",
            traits_hi: "भावुक, संवेदनशील और परिवार-उन्मुख। आप राशि चक्र के पोषणकर्ता हैं। आपकी अंतर्ज्ञान शक्ति आपकी सबसे बड़ी मार्गदर्शक है, और आप भावनात्मक सुरक्षा को सबसे ऊपर रखते हैं।"
        },
        {
            rashi_en: "Leo (Simha)",
            rashi_hi: "सिंह (Leo)",
            letters: ["ma", "mi", "mu", "me", "mo", "ta", "ti", "tu", "te"],
            nakshatra: "Magha, Purva Phalguni, Uttara Phalguni",
            nakshatra_hi: "मघा, पूर्वा फाल्गुनी, उत्तरा फाल्गुनी",
            traits: "Confident, generous, and regal nature. You possess a natural leadership quality and a magnetic personality. Like the sun, you love to be at the center of attention and inspire others with your courage and vitality.",
            traits_hi: "आत्मविश्वासी, उदार और शाही स्वभाव। आपके पास स्वाभाविक नेतृत्व गुण और चुंबकीय व्यक्तित्व है। सूर्य की तरह, आप ध्यान का केंद्र बनना पसंद करते हैं।"
        },
        {
            rashi_en: "Virgo (Kanya)",
            rashi_hi: "कन्या (Virgo)",
            letters: ["to", "pa", "pi", "pu", "sha", "na", "th", "pe", "po"],
            nakshatra: "Uttara Phalguni, Hasta, Chitra",
            nakshatra_hi: "उत्तरा फाल्गुनी, हस्त, चित्रा",
            traits: "Analytical, practical, and hardworking. You have a keen eye for detail and a desire for perfection. Your systematic approach to life makes you incredibly efficient, and you find joy in being of service to others.",
            traits_hi: "विश्लेषणात्मक, व्यावहारिक और मेहनती। आपकी नजर बारीकियों पर होती है और आप पूर्णता की इच्छा रखते हैं। जीवन के प्रति आपका व्यवस्थित दृष्टिकोण आपको कुशल बनाता है।"
        },
        {
            rashi_en: "Libra (Tula)",
            rashi_hi: "तुला (Libra)",
            letters: ["ra", "ri", "ru", "re", "ro", "ta", "ti", "tu", "te"],
            nakshatra: "Chitra, Swati, Vishakha",
            nakshatra_hi: "चित्रा, स्वाति, विशाखा",
            traits: "Fair, balanced, and social. You seek harmony in all aspects of life and have a natural talent for diplomacy. Your charming personality and sense of justice make you a beloved friend and a peacemaker.",
            traits_hi: "निष्पक्ष, संतुलित और सामाजिक। आप जीवन के सभी पहलुओं में सामंजस्य खोजते हैं। आपका आकर्षक व्यक्तित्व और न्याय की भावना आपको एक प्रिय मित्र बनाती है।"
        },
        {
            rashi_en: "Scorpio (Vrishchik)",
            rashi_hi: "वृश्चिक (Scorpio)",
            letters: ["to", "na", "ni", "nu", "ne", "no", "ya", "yi", "yu"],
            nakshatra: "Vishakha, Anuradha, Jyeshtha",
            nakshatra_hi: "विशाखा, अनुराधा, ज्येष्ठा",
            traits: "Intense, mysterious, and determined. You possess great emotional depth and an unwavering focus. Once you set your sights on a goal, nothing can stop you. You are deeply intuitive and value authenticity.",
            traits_hi: "तीव्र, रहस्यमय और दृढ़। आपके पास महान भावनात्मक गहराई और अटूट ध्यान है। एक बार जब आप किसी लक्ष्य को निर्धारित कर लेते हैं, तो आपको कोई रोक नहीं सकता।"
        },
        {
            rashi_en: "Sagittarius (Dhanu)",
            rashi_hi: "धनु (Sagittarius)",
            letters: ["ye", "yo", "bha", "bhi", "bhu", "dha", "pha", "dha", "bhe"],
            nakshatra: "Mula, Purva Ashadha, Uttara Ashadha",
            nakshatra_hi: "मूल, पूर्वाषाढ़ा, उत्तराषाढ़ा",
            traits: "Optimistic, philosophical, and independent. You are the eternal traveler, always seeking truth and adventure. Your enthusiastic spirit and love for freedom make you a source of inspiration for everyone around you.",
            traits_hi: "आशावादी, दार्शनिक और स्वतंत्र। आप सत्य और रोमांच की खोज में रहते हैं। आपकी उत्साही भावना और स्वतंत्रता के प्रति प्रेम आपको सभी के लिए प्रेरणा का स्रोत बनाता है।"
        },
        {
            rashi_en: "Capricorn (Makar)",
            rashi_hi: "मकर (Capricorn)",
            letters: ["bho", "ja", "ji", "ju", "je", "jo", "kha", "ga", "gi"],
            nakshatra: "Uttara Ashadha, Shravana, Dhanishtha",
            nakshatra_hi: "उत्तराषाढ़ा, श्रवण, धनिष्ठा",
            traits: "Ambitious, disciplined, and patient. You are the builder of the zodiac, reaching the summit through hard work and persistence. Your responsible nature and wisdom earn you respect in all your endeavors.",
            traits_hi: "महत्वाकांक्षी, अनुशासित और धैर्यवान। आप कड़ी मेहनत और दृढ़ता के माध्यम से शिखर तक पहुंचते हैं। आपकी जिम्मेदार प्रकृति और ज्ञान आपको सम्मान दिलाती है।"
        },
        {
            rashi_en: "Aquarius (Kumbh)",
            rashi_hi: "कुंभ (Aquarius)",
            letters: ["gu", "ge", "go", "sa", "si", "su", "se", "so", "da"],
            nakshatra: "Dhanishtha, Shatabhisha, Purva Bhadrapada",
            nakshatra_hi: "धनिष्ठा, शतभिषा, पूर्वा भाद्रपद",
            traits: "Innovative, humanitarian, and friendly. You think outside the box and value your individuality. Your progressive mindset and desire to make the world a better place define your unique personality.",
            traits_hi: "नवीन, मानवतावादी और मैत्रीपूर्ण। आप लीक से हटकर सोचते हैं। आपकी प्रगतिशील मानसिकता और दुनिया को बेहतर बनाने की इच्छा आपके अद्वितीय व्यक्तित्व को परिभाषित करती है।"
        },
        {
            rashi_en: "Pisces (Meen)",
            rashi_hi: "मीन (Pisces)",
            letters: ["di", "du", "th", "jha", "yna", "de", "do", "cha", "chi"],
            nakshatra: "Purva Bhadrapada, Uttara Bhadrapada, Revati",
            nakshatra_hi: "पूर्वा भाद्रपद, उत्तरा भाद्रपद, रेवती",
            traits: "Compassionate, spiritual, and imaginative. You are deeply connected to the emotional and mystical realms. Your artistic soul and empathetic nature allow you to understand others in a way few can.",
            traits_hi: "दयालु, आध्यात्मिक और कल्पनाशील। आप भावनात्मक और रहस्यमय लोकों से गहराई से जुड़े हैं। आपकी कलात्मक आत्मा और सहानुभूतिपूर्ण स्वभाव आपको दूसरों को समझने की अद्भुत क्षमता देती है।"
        }
    ];

    const findBtn = document.getElementById('find-zodiac-btn');
    const nameInput = document.getElementById('user-name');
    const resultsSection = document.getElementById('zodiac-results');
    const loadingSpinner = document.getElementById('loading-spinner');

    const rashiOutput = document.getElementById('rashi-output');
    const nakshatraOutput = document.getElementById('nakshatra-output');
    const traitsOutput = document.getElementById('traits-output');

    // --- LANGUAGE LOGIC ---
    // Full implementation
    const updateContent = (lang) => {
        document.documentElement.lang = lang;
        localStorage.setItem("language", lang);

        // Update all static text
        document.querySelectorAll("[data-en]").forEach(el => {
            const text = el.getAttribute(lang === "hi" ? "data-hi" : "data-en");
            if (text) el.textContent = text;
        });

        const isHindi = lang === 'hi';
        if (nameInput) nameInput.placeholder = isHindi ? "उदा: आरव या आ" : "e.g. Aarav or Aa";

        // Re-display results if currently showing
        if (resultsSection.style.display !== 'none' && window.lastZodiacResult) {
            const result = window.lastZodiacResult;
            rashiOutput.textContent = isHindi ? result.rashi_hi : result.rashi_en;
            nakshatraOutput.textContent = isHindi ? result.nakshatra_hi : result.nakshatra;
            traitsOutput.textContent = isHindi ? result.traits_hi : result.traits;
        }
    };

    const getLanguage = () => localStorage.getItem("language") || "en";

    // Initialize
    updateContent(getLanguage());

    const langBtns = document.querySelectorAll('#language-toggle, #language-toggle-mobile');
    langBtns.forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            const newLang = getLanguage() === "hi" ? "en" : "hi";
            updateContent(newLang);
        };
    });
    // Initial call
    updateContent(getLanguage());

    findBtn.addEventListener('click', () => {
        const name = nameInput.value.trim().toLowerCase();
        const lang = document.documentElement.lang || 'en';
        const isHindi = lang === 'hi';

        if (!name) {
            alert(isHindi ? 'कृपया नाम दर्ज करें' : 'Please enter a name');
            return;
        }

        // UI Transition
        resultsSection.style.display = 'none';
        loadingSpinner.style.display = 'block';

        // Simulate star alignment
        setTimeout(() => {
            const result = findZodiacByName(name);
            window.lastZodiacResult = result; // Save for language toggle

            rashiOutput.textContent = isHindi ? result.rashi_hi : result.rashi_en;
            nakshatraOutput.textContent = isHindi ? result.nakshatra_hi : result.nakshatra;
            traitsOutput.textContent = isHindi ? result.traits_hi : result.traits;

            loadingSpinner.style.display = 'none';
            resultsSection.style.display = 'block';
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }, 1500);
    });

    function findZodiacByName(name) {
        // Simple phonetic-based mapping logic
        // We check the first 2 characters first, then fallback to first 1
        const prefix2 = name.substring(0, 2);
        const prefix1 = name.substring(0, 1);

        let match = rashiMap.find(r => r.letters.some(l => prefix2.startsWith(l)));
        if (!match) {
            match = rashiMap.find(r => r.letters.some(l => prefix1 === l));
        }

        // Return a default or randomized one if no match found for demo
        return match || rashiMap[Math.floor(Math.random() * rashiMap.length)];
    }

    // Enter key support
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') findBtn.click();
    });
});
