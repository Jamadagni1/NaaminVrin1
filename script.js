/* ======================================================
   SCRIPT.JS - FINAL COMPLETE VERSION
   (Includes: 2026 Horoscope, Favorites, Typing Animation)
   ====================================================== */

// ===========================
// GENDER THEME PERSISTENCE
// ===========================
const GenderTheme = {
    STORAGE_KEY: 'selectedGender',

    // Save gender selection to localStorage
    save(gender) {
        try {
            localStorage.setItem(this.STORAGE_KEY, gender);
            console.log('Gender saved:', gender);
        } catch (e) {
            console.error('Failed to save gender:', e);
        }
    },

    // Load gender from localStorage
    load() {
        try {
            return localStorage.getItem(this.STORAGE_KEY) || 'Boy';
        } catch (e) {
            console.error('Failed to load gender:', e);
            return 'Boy';
        }
    },

    // Apply theme based on gender
    apply(gender) {
        const html = document.documentElement;
        // Always enforce default (purple) theme regardless of gender
        html.removeAttribute('data-theme'); // Enforce default (purple) theme
        console.log('Applied default theme (Unified Purple)');
    },

    // Initialize theme on page load
    init() {
        const savedGender = this.load();
        this.apply(savedGender);
        return savedGender;
    }
};

// Apply theme immediately (before DOMContentLoaded for faster rendering)
GenderTheme.init();

if (document.body) {
    document.body.style.visibility = "visible";
    document.body.style.opacity = "1";
} else {
    document.addEventListener("DOMContentLoaded", () => {
        if (!document.body) return;
        document.body.style.visibility = "visible";
        document.body.style.opacity = "1";
    }, { once: true });
}

const HTML2CANVAS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
let html2canvasLoadPromise = null;
const JSPDF_CDN_SOURCES = [
    "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
    "https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js",
    "https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js"
];
let jsPdfLoadPromise = null;

function ensureHtml2Canvas() {
    if (typeof window.html2canvas === "function") {
        return Promise.resolve(window.html2canvas);
    }

    if (html2canvasLoadPromise) {
        return html2canvasLoadPromise;
    }

    html2canvasLoadPromise = new Promise((resolve, reject) => {
        const existingScript = document.querySelector(`script[src="${HTML2CANVAS_CDN}"]`);
        if (existingScript) {
            existingScript.addEventListener("load", () => {
                if (typeof window.html2canvas === "function") resolve(window.html2canvas);
                else reject(new Error("html2canvas loaded but unavailable"));
            }, { once: true });
            existingScript.addEventListener("error", () => reject(new Error("Failed to load html2canvas")), { once: true });
            return;
        }

        const loader = document.createElement("script");
        loader.src = HTML2CANVAS_CDN;
        loader.async = true;
        loader.onload = () => {
            if (typeof window.html2canvas === "function") resolve(window.html2canvas);
            else reject(new Error("html2canvas loaded but unavailable"));
        };
        loader.onerror = () => reject(new Error("Failed to load html2canvas"));
        document.head.appendChild(loader);
    }).catch((error) => {
        html2canvasLoadPromise = null;
        throw error;
    });

    return html2canvasLoadPromise;
}

function ensureJsPdf() {
    if (window.jspdf && typeof window.jspdf.jsPDF === "function") {
        return Promise.resolve(window.jspdf.jsPDF);
    }

    if (jsPdfLoadPromise) {
        return jsPdfLoadPromise;
    }

    jsPdfLoadPromise = new Promise((resolve, reject) => {
        const trySourceAt = (index) => {
            if (window.jspdf && typeof window.jspdf.jsPDF === "function") {
                resolve(window.jspdf.jsPDF);
                return;
            }
            if (index >= JSPDF_CDN_SOURCES.length) {
                reject(new Error("Failed to load jsPDF from all sources"));
                return;
            }

            const source = JSPDF_CDN_SOURCES[index];
            const existingScript = document.querySelector(`script[src="${source}"]`);
            if (existingScript) {
                existingScript.addEventListener("load", () => {
                    if (window.jspdf && typeof window.jspdf.jsPDF === "function") resolve(window.jspdf.jsPDF);
                    else trySourceAt(index + 1);
                }, { once: true });
                existingScript.addEventListener("error", () => trySourceAt(index + 1), { once: true });
                return;
            }

            const loader = document.createElement("script");
            loader.src = source;
            loader.async = true;
            loader.onload = () => {
                if (window.jspdf && typeof window.jspdf.jsPDF === "function") resolve(window.jspdf.jsPDF);
                else trySourceAt(index + 1);
            };
            loader.onerror = () => trySourceAt(index + 1);
            document.head.appendChild(loader);
        };

        trySourceAt(0);
    }).catch((error) => {
        jsPdfLoadPromise = null;
        throw error;
    });

    return jsPdfLoadPromise;
}

if (typeof window !== "undefined") {
    const warmupJsPdf = () => {
        ensureJsPdf().catch(() => {
            // Ignore warmup failures; click handler will retry all sources.
        });
    };
    if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(warmupJsPdf, { timeout: 3000 });
    } else {
        window.setTimeout(warmupJsPdf, 1600);
    }
}

const HI_FALLBACK_MAP = Object.freeze({
    "Home": "होम",
    "About": "हमारे बारे में",
    "Parents to Child": "माता-पिता से बच्चा",
    "More": "अधिक",
    "Popular Names": "लोकप्रिय नाम",
    "Unique Names": "अद्वितीय नाम",
    "Famous Personalities": "प्रसिद्ध हस्तियां",
    "Motto Creator": "मोटो क्रिएटर",
    "Zodiac Finder": "राशि खोजक",
    "Our Products": "हमारे उत्पाद",
    "Services": "सेवाएं",
    "Aura": "आभा",
    "Careers": "करियर",
    "Blog": "ब्लॉग",
    "Contact": "संपर्क करें",
    "Log in": "लॉग इन",
    "Sign up": "साइन अप",
    "Find your name": "अपना नाम खोजें",
    "Name Finder": "नाम खोजें",
    "Boy": "लड़का",
    "Girl": "लड़की",
    "Back to list": "सूची पर वापस जाएं",
    "Naming Inspiration": "नामकरण प्रेरणा",
    "Why Creators Choose Naamin": "क्रिएटर्स Naamin क्यों चुनते हैं",
    "Baby & Family Naming": "बेबी और फैमिली नामकरण",
    "Startup & Brand Naming": "स्टार्टअप और ब्रांड नामकरण",
    "Company & Institution Names": "कंपनी और संस्थान नाम",
    "Domain Naming Service": "डोमेन नामकरण सेवा",
    "Name Report": "नाम रिपोर्ट",
    "Pronunciation Support": "उच्चारण सहायता",
    "Testimonials": "प्रशंसापत्र",
    "Trusted Naming Scale": "विश्वसनीय नामकरण स्केल",
    "How It Works": "यह कैसे काम करता है",
    "Explore Services": "सेवाएं देखें",
    "Naamin Video Gallery": "Naamin वीडियो गैलरी",
    "Brand Naming Spotlight": "ब्रांड नेमिंग स्पॉटलाइट",
    "Baby Name Stories": "बेबी नेम स्टोरीज़",
    "Domains & Mottos": "डोमेन और मोटो",
    "Institutional Naming": "संस्थागत नामकरण",
    "View Large": "बड़ा देखें",
    "Quick Links": "त्वरित लिंक",
    "Our Services": "हमारी सेवाएं",
    "Follow Us": "हमें फॉलो करें",
    "Name Consultation": "नाम परामर्श",
    "Vedic Guidance": "वैदिक मार्गदर्शन",
    "Your Shortlist": "आपकी शॉर्टलिस्ट",
    "Clear All": "सभी हटाएं",
    "Ready to finalize your name with confidence?": "अपने नाम को आत्मविश्वास के साथ अंतिम रूप देने के लिए तैयार हैं?",
    "Book Name Report": "नाम रिपोर्ट बुक करें",
    "Request Your Report": "अपनी रिपोर्ट मांगें",
    "Explore Domain Service": "डोमेन सेवा देखें",
    "What is inside the report": "रिपोर्ट में क्या शामिल है",
    "How we prepare your report": "हम आपकी रिपोर्ट कैसे तैयार करते हैं",
    "What you receive": "आपको क्या मिलेगा",
    "Quick FAQs": "त्वरित प्रश्न",
    "Is this only for baby names?": "क्या यह केवल बेबी नामों के लिए है?",
    "Can I request domain and motto options too?": "क्या मैं डोमेन और मोटो विकल्प भी मांग सकता/सकती हूं?",
    "How fast will I get the report?": "मुझे रिपोर्ट कितनी जल्दी मिलेगी?",
    "premium naming document": "प्रीमियम नेमिंग दस्तावेज़",
    "Name Report, Designed to Impress": "नाम रिपोर्ट, प्रभाव छोड़ने के लिए डिज़ाइन की गई",
    "sample report preview": "सैंपल रिपोर्ट प्रीव्यू",
    "No Result Found": "कोई परिणाम नहीं मिला",
    "Start Name Search": "नाम खोज शुरू करें",
    "See Name Report": "नाम रिपोर्ट देखें",
    "Trusted by Families, Founders, and Teams": "परिवारों, फाउंडर्स और टीमों का भरोसा",
    "Choose Your Naming Journey": "अपनी नेमिंग यात्रा चुनें",
    "Naming Inspiration": "नामकरण प्रेरणा",
    "Name Finder": "नाम खोजक",
    "Why People Trust Naamin": "लोग Naamin पर भरोसा क्यों करते हैं",
    "How It Works": "यह कैसे काम करता है",
    "Naamin Video Gallery": "Naamin वीडियो गैलरी",
    "Popular & Trending Names": "लोकप्रिय और ट्रेंडिंग नाम",
    "Discover Exclusive Gems": "एक्सक्लूसिव नाम खोजें",
    "Names Inspired by Greatness": "महान व्यक्तित्वों से प्रेरित नाम",
    "Service Pages": "सेवा पेज",
    "Explore All Services": "सभी सेवाएं देखें",
    "Get Started": "शुरू करें",
    "Contact Us": "संपर्क करें",
    "Get in Touch": "संपर्क में रहें",
    "Search by Starting Letter": "शुरुआती अक्षर से खोजें",
    "Select Plan": "प्लान चुनें",
    "Order Now": "अभी ऑर्डर करें",
    "Detailed Name Report (PDF)": "विस्तृत नाम रिपोर्ट (पीडीएफ)",
    "Poster + PDF Report Bundle": "पोस्टर + पीडीएफ रिपोर्ट बंडल"
});

const HI_FALLBACK_REPLACEMENTS = Object.freeze([
    ["Naming-related services are free. Please feel free to contact us.", "नामकरण से जुड़ी सेवाएं मुफ्त हैं। कृपया बेझिझक संपर्क करें।"],
    ["Discover beautiful name ideas for every journey — families, founders, and institutions.", "हर सफर के लिए सुंदर नाम विचार खोजें — परिवार, फाउंडर्स और संस्थान।"],
    ["Meaning, origin, numerology, and pronunciation packed into a clean report.", "अर्थ, उत्पत्ति, अंकशास्त्र और उच्चारण — सब एक साफ रिपोर्ट में।"],
    ["Posters, announcement kits, and identity assets — beautifully designed.", "पोस्टर, अनाउंसमेंट किट और आइडेंटिटी एसेट्स — खूबसूरती से डिज़ाइन किए गए।"],
    ["Hear names, compare spellings, and choose what feels effortless.", "नाम सुनें, स्पेलिंग तुलना करें और जो सहज लगे उसे चुनें।"],
    ["Built on research, tradition, and modern brand craft.", "रिसर्च, परंपरा और आधुनिक ब्रांड क्राफ्ट पर आधारित।"],
    ["Explore our naming journeys, brand stories, and client showcases.", "हमारे नेमिंग सफर, ब्रांड स्टोरीज़ और क्लाइंट शोकेस देखें।"],
    ["Heartfelt journeys from shortlist to final name.", "शॉर्टलिस्ट से अंतिम नाम तक की भावनात्मक यात्राएं।"],
    ["See how we build unforgettable identities for modern startups.", "देखें हम आधुनिक स्टार्टअप्स के लिए यादगार पहचान कैसे बनाते हैं।"],
    ["How a domain and motto complete the identity story.", "कैसे डोमेन और मोटो पहचान की कहानी पूरी करते हैं।"],
    ["Clear, credible names for schools and organizations.", "स्कूल और संस्थाओं के लिए स्पष्ट और विश्वसनीय नाम।"],
    ["1) Tell us your category: baby, brand, startup, company, or institution. 2) Shortlist with meanings + insights. 3) Finalize with domain/motto options. 4) Download reports and assets.", "1) अपनी श्रेणी बताएं: बेबी, ब्रांड, स्टार्टअप, कंपनी या संस्थान। 2) अर्थ और इनसाइट्स के साथ शॉर्टलिस्ट। 3) डोमेन/मोटो विकल्पों के साथ फाइनल करें। 4) रिपोर्ट और एसेट डाउनलोड करें।"],
    ["Coming soon, please wait, we appreciate your patience.", "जल्द आ रहा है, कृपया प्रतीक्षा कर����ं, हम आपके धैर्य की सराहना करते हैं।"],
    ["Get a high-clarity report for baby names, brands, startups, companies, and institutions. Every report is crafted with meaning, pronunciation, numerology, brand-fit notes, and practical launch suggestions.", "बेबी नाम, ब्रांड, स्टार्टअप, कंपनियों और संस्थानों के लिए हाई-क्लैरिटी रिपोर्ट पाएं। हर रिपोर्ट अर्थ, उच्चारण, अंकशास्त्र, ब्रांड-फिट नोट्स और व्यावहारिक सुझावों के साथ तैयार की जाती है।"],
    ["Baby + Brand Friendly", "बेबी + ब्रांड फ्रेंडली"],
    ["Pronunciation clarity", "उच्चारण स्पष्टता"],
    ["Domain + Motto hints", "डोमेन + मोटो संकेत"],
    ["Share-ready PDF", "शेयर-रेडी पीडीएफ"],
    ["A practical and premium structure so decision-making becomes easier and faster.", "एक व्यावहारिक और प्रीमियम संरचना ताकि निर्णय लेना आसान और तेज हो।"],
    ["Simple process, transparent steps, and practical outcomes.", "सरल प्रक्रिया, पारदर्शी चरण और व्यावहारिक परिणाम।"],
    ["Built for fast decision-making and easy sharing with family or teams.", "तेज़ निर्णय और परिवार/टीम के साथ आसान शेयरिंग के लिए तैयार।"],
    ["Primary recommendation with rationale", "तर्क सहित मुख्य सिफारिश"],
    ["Top alternatives with strengths and weaknesses", "मुख्य विकल्प, खूबियां और कमियों सहित"],
    ["Pronunciation and spelling variants", "उच्चारण और वर्तनी के विकल्प"],
    ["Numerology plus meaning summary blocks", "अंकशास्त्र और अर्थ के सारांश ब्लॉक"],
    ["Optional domain and motto direction", "वैकल्पिक डोमेन और मोटो दिशा"],
    ["Visual preview", "विज़ुअल प्रीव्यू"],
    ["No. This report supports babies, brands, startups, companies, institutions, and more naming categories.", "नहीं। यह रिपोर्ट बेबी, ब्रांड, स्टार्टअप, कंपनियों, संस्थानों और अन्य नामकरण श्रेणियों के लिए है।"],
    ["Yes. Domain-friendly options and motto direction can be included based on your category and tone preference.", "हाँ। आपकी श्रेणी और टोन के आधार पर डोमेन-फ्रेंडली विकल्प और मोटो दिशा शामिल की जा सकती है।"],
    ["Usually the first draft is delivered within 24 to 48 hours after receiving clear inputs.", "आमतौर पर स्पष्ट इनपुट मिलने के 24 से 48 घंटों में पहला ड्राफ्ट दिया जाता है।"],
    ["Hyderabad, Telangana, India", "हैदराबाद, तेलंगाना, भारत"],
    ["© 2025 Naamin. All rights reserved.", "© 2025 Naamin. सर्वाधिकार सुरक्षित।"]
]);

const ORIGINAL_TEXT_NODE_MAP = new WeakMap();
const ORIGINAL_ATTRIBUTE_MAP = new WeakMap();
const TRANSLATABLE_ATTRS = Object.freeze(["placeholder", "title", "aria-label", "alt", "value"]);
const VALUE_TRANSLATABLE_INPUT_TYPES = Object.freeze(["button", "submit", "reset"]);

const HI_WORD_MAP = Object.freeze({
    "a": "एक",
    "about": "बारे",
    "all": "सभी",
    "and": "और",
    "are": "हैं",
    "as": "के रूप में",
    "at": "पर",
    "baby": "बेबी",
    "babies": "बेबी",
    "back": "वापस",
    "best": "सर्वश्रेष्ठ",
    "blog": "ब्लॉग",
    "book": "बुक",
    "brand": "ब्रांड",
    "brands": "ब्रांड्स",
    "by": "द्वारा",
    "can": "कर सकते",
    "careers": "करियर",
    "category": "श्रेणी",
    "child": "बच्चा",
    "choose": "चुनें",
    "clear": "साफ",
    "company": "कंपनी",
    "complete": "पूरा",
    "contact": "संपर्क",
    "creator": "क्रिएटर",
    "creators": "क्रिएटर्स",
    "decision": "निर्णय",
    "designed": "डिज़ाइन",
    "details": "विवरण",
    "domain": "डोमेन",
    "download": "डाउनलोड",
    "easy": "आसान",
    "explore": "देखें",
    "famous": "प्रसिद्ध",
    "family": "परिवार",
    "fast": "तेज़",
    "finder": "खोजक",
    "for": "के लिए",
    "founders": "फाउंडर्स",
    "free": "मुफ्त",
    "from": "से",
    "gallery": "गैलरी",
    "girl": "लड़की",
    "great": "बेहतरीन",
    "guide": "गाइड",
    "has": "है",
    "have": "है",
    "help": "मदद",
    "hi": "हाय",
    "hindi": "हिंदी",
    "home": "होम",
    "how": "कैसे",
    "in": "में",
    "inside": "अंदर",
    "institution": "संस्थान",
    "institutions": "संस्थाएं",
    "is": "है",
    "it": "यह",
    "its": "इसका",
    "language": "भाषा",
    "list": "सूची",
    "log": "लॉग",
    "login": "लॉग इन",
    "motto": "मोटो",
    "name": "नाम",
    "naming": "नामकरण",
    "naamin": "नामिन",
    "new": "नया",
    "no": "नहीं",
    "of": "का",
    "on": "पर",
    "only": "केवल",
    "or": "या",
    "our": "हमारे",
    "page": "पेज",
    "parents": "माता-पिता",
    "pdf": "पीडीएफ",
    "popular": "लोकप्रिय",
    "practical": "व्यावहारिक",
    "prepare": "तैयार",
    "preview": "प्रीव्यू",
    "pricing": "प्राइसिंग",
    "products": "उत्पाद",
    "pronunciation": "उच्चारण",
    "quick": "त्वरित",
    "ready": "तैयार",
    "receive": "प्राप्त",
    "report": "रिपोर्ट",
    "request": "अनुरोध",
    "result": "परिणाम",
    "search": "खोज",
    "section": "सेक्शन",
    "service": "सेवा",
    "services": "सेवाए��",
    "share": "शेयर",
    "shortlist": "शॉर्टलिस्ट",
    "show": "दिखाएं",
    "signup": "साइन अप",
    "start": "शुरू",
    "startup": "स्टार्टअप",
    "stories": "कहानियां",
    "support": "सहायता",
    "that": "वह",
    "the": "यह",
    "their": "उनका",
    "this": "यह",
    "to": "को",
    "today": "आज",
    "translate": "अनुवाद",
    "trusted": "विश्वसनीय",
    "unique": "अद्वितीय",
    "up": "ऊपर",
    "us": "हमसे",
    "use": "उपयोग",
    "video": "वीडियो",
    "view": "देखें",
    "what": "क्या",
    "why": "क्यों",
    "with": "के साथ",
    "work": "काम",
    "works": "काम करता",
    "you": "आप",
    "your": "आपका",
    "zodiac": "राशि"
});

function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function transliterateEnglishWord(word) {
    const map = {
        a: "अ", b: "ब", c: "क", d: "द", e: "ए", f: "फ", g: "ग", h: "ह",
        i: "इ", j: "ज", k: "क", l: "ल", m: "म", n: "न", o: "ओ", p: "प",
        q: "क", r: "र", s: "स", t: "ट", u: "उ", v: "व", w: "व", x: "क्स",
        y: "य", z: "ज"
    };
    return word
        .toLowerCase()
        .split("")
        .map((ch) => map[ch] || ch)
        .join("");
}

function translateWordsToHindi(text) {
    const tokens = String(text).match(/[A-Za-z']+|[^A-Za-z']+/g) || [String(text)];
    return tokens.map((token) => {
        if (!/^[A-Za-z']+$/.test(token)) return token;
        const lower = token.toLowerCase();
        if (HI_WORD_MAP[lower]) return HI_WORD_MAP[lower];
        return transliterateEnglishWord(token);
    }).join("");
}

function fallbackHindiCopy(englishText) {
    if (!englishText) return "";
    const clean = String(englishText).replace(/\s+/g, " ").trim();
    if (!clean) return "";

    if (HI_FALLBACK_MAP[clean]) return HI_FALLBACK_MAP[clean];

    let translated = clean;
    HI_FALLBACK_REPLACEMENTS.forEach(([from, to]) => {
        translated = translated.replace(new RegExp(escapeRegExp(from), "gi"), to);
    });

    if (translated === clean && /[A-Za-z]/.test(clean)) {
        translated = translateWordsToHindi(clean);
    }

    return translated;
}

function sanitizeFileToken(value) {
    return String(value || "name")
        .replace(/[^\w-]+/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_+|_+$/g, "") || "name";
}

function triggerBlobDownload(blob, filename) {
    if (!blob) return false;

    if (window.navigator && typeof window.navigator.msSaveOrOpenBlob === "function") {
        window.navigator.msSaveOrOpenBlob(blob, filename);
        return true;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.setAttribute("download", filename);
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1400);
    return true;
}

async function downloadCanvasAsPng(canvas, filename) {
    if (!canvas) return false;
    const pngFilename = `${filename}.png`;

    if (typeof canvas.toBlob === "function") {
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png", 1));
        if (blob) return triggerBlobDownload(blob, pngFilename);
    }

    const dataUrl = canvas.toDataURL("image/png", 1.0);
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = pngFilename;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();
    return true;
}

function createExportReportNode(data) {
    const reportNameEn = data.name_en || data.name || "Name";
    const reportNameHi = data.name_hi || getHindiName(reportNameEn) || "नाम";
    const reportMeaning = data.meaning_en || data.meaning || "Meaning not available";
    const reportGender = data.gender || "Unknown";
    const reportOrigin = data.origin_en || data.origin || "Sanskrit/Indian";
    const reportNakshatra = data.nakshatra || "Ashwini";
    const reportRashi = data.rashi_en || data.rashi || "Aries (Mesha)";
    const reportNumber = data.num || "1";
    const reportPlanet = data.planet_en || "Sun";
    const reportColor = data.color_en || "Golden";
    const reportPrediction = data.rashiphal_en || "A steady year of growth, discipline, and good opportunities.";
    const reportAura = data.phal_en || "Energetic and optimistic personality.";
    const reportYear = String(data.year || new Date().getFullYear());

    const root = document.createElement("section");
    root.style.width = "1400px";
    root.style.minHeight = "910px";
    root.style.boxSizing = "border-box";
    root.style.padding = "34px";
    root.style.borderRadius = "28px";
    root.style.border = "2px solid rgba(91, 59, 214, 0.28)";
    root.style.background = "linear-gradient(135deg, #f8f2ff 0%, #f3f7ff 55%, #ffffff 100%)";
    root.style.boxShadow = "0 16px 36px rgba(40, 26, 82, 0.18)";
    root.style.display = "flex";
    root.style.flexDirection = "column";
    root.style.gap = "20px";
    root.style.fontFamily = "'Poppins','Inter',sans-serif";
    root.style.color = "#1f1b2e";

    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";
    header.style.paddingBottom = "14px";
    header.style.borderBottom = "1.5px solid rgba(108, 43, 217, 0.2)";

    const brandWrap = document.createElement("div");
    const brand = document.createElement("div");
    brand.textContent = "NAAMIN";
    brand.style.fontSize = "42px";
    brand.style.fontWeight = "800";
    brand.style.letterSpacing = "4px";
    brand.style.color = "#6C2BD9";
    const subtitle = document.createElement("div");
    subtitle.textContent = "PREMIUM NAME REPORT";
    subtitle.style.fontSize = "14px";
    subtitle.style.fontWeight = "700";
    subtitle.style.letterSpacing = "2.3px";
    subtitle.style.color = "#5b4a80";
    brandWrap.appendChild(brand);
    brandWrap.appendChild(subtitle);

    const badge = document.createElement("div");
    badge.textContent = "Verified Naming Insight";
    badge.style.padding = "10px 16px";
    badge.style.borderRadius = "999px";
    badge.style.fontSize = "14px";
    badge.style.fontWeight = "700";
    badge.style.background = "linear-gradient(135deg, #ffd77a, #f9bb4d)";
    badge.style.color = "#4d2b00";
    badge.style.border = "1px solid rgba(212, 145, 27, 0.42)";
    header.appendChild(brandWrap);
    header.appendChild(badge);

    const hero = document.createElement("div");
    hero.style.background = "linear-gradient(145deg, #f3e9ff, #eaf2ff)";
    hero.style.border = "1px solid rgba(108, 43, 217, 0.22)";
    hero.style.borderRadius = "22px";
    hero.style.padding = "26px 28px";
    hero.style.display = "grid";
    hero.style.gridTemplateColumns = "1.2fr 0.8fr";
    hero.style.gap = "16px";

    const nameBlock = document.createElement("div");
    const nEn = document.createElement("h1");
    nEn.textContent = reportNameEn;
    nEn.style.margin = "0";
    nEn.style.fontSize = "64px";
    nEn.style.fontWeight = "800";
    nEn.style.lineHeight = "1.03";
    nEn.style.color = "#241638";
    const nHi = document.createElement("div");
    nHi.textContent = reportNameHi;
    nHi.style.marginTop = "6px";
    nHi.style.fontSize = "36px";
    nHi.style.fontWeight = "700";
    nHi.style.color = "#6C2BD9";
    nHi.style.fontFamily = "'Noto Sans Devanagari','Poppins','Inter',sans-serif";
    const meaning = document.createElement("p");
    meaning.textContent = reportMeaning;
    meaning.style.margin = "12px 0 0 0";
    meaning.style.fontSize = "20px";
    meaning.style.lineHeight = "1.45";
    meaning.style.color = "#4d4463";
    nameBlock.appendChild(nEn);
    nameBlock.appendChild(nHi);
    nameBlock.appendChild(meaning);

    const snapshot = document.createElement("div");
    snapshot.style.display = "grid";
    snapshot.style.gridTemplateColumns = "1fr 1fr";
    snapshot.style.gap = "12px";

    const makeMetric = (label, value) => {
        const cell = document.createElement("div");
        cell.style.background = "#ffffff";
        cell.style.border = "1px solid rgba(108,43,217,0.2)";
        cell.style.borderRadius = "12px";
        cell.style.padding = "12px";

        const l = document.createElement("div");
        l.textContent = label;
        l.style.fontSize = "12px";
        l.style.fontWeight = "700";
        l.style.textTransform = "uppercase";
        l.style.letterSpacing = "1.1px";
        l.style.color = "#7255b6";

        const v = document.createElement("div");
        v.textContent = value;
        v.style.marginTop = "4px";
        v.style.fontSize = "16px";
        v.style.fontWeight = "700";
        v.style.color = "#1f1b2e";
        cell.appendChild(l);
        cell.appendChild(v);
        return cell;
    };

    snapshot.appendChild(makeMetric("Gender", reportGender));
    snapshot.appendChild(makeMetric("Origin", reportOrigin));
    snapshot.appendChild(makeMetric("Nakshatra", reportNakshatra));
    snapshot.appendChild(makeMetric("Rashi", reportRashi));

    hero.appendChild(nameBlock);
    hero.appendChild(snapshot);

    const detailsGrid = document.createElement("div");
    detailsGrid.style.display = "grid";
    detailsGrid.style.gridTemplateColumns = "repeat(3, minmax(0, 1fr))";
    detailsGrid.style.gap = "14px";

    const makeCard = (title, content) => {
        const card = document.createElement("div");
        card.style.background = "rgba(255,255,255,0.92)";
        card.style.border = "1px solid rgba(108,43,217,0.18)";
        card.style.borderRadius = "14px";
        card.style.padding = "16px";
        card.style.minHeight = "114px";

        const h = document.createElement("div");
        h.textContent = title;
        h.style.fontSize = "13px";
        h.style.fontWeight = "700";
        h.style.textTransform = "uppercase";
        h.style.letterSpacing = "1px";
        h.style.color = "#6C2BD9";
        h.style.marginBottom = "8px";

        const p = document.createElement("div");
        p.textContent = content;
        p.style.fontSize = "18px";
        p.style.fontWeight = "600";
        p.style.lineHeight = "1.4";
        p.style.color = "#2e2740";
        card.appendChild(h);
        card.appendChild(p);
        return card;
    };

    detailsGrid.appendChild(makeCard("Numerology Number", String(reportNumber)));
    detailsGrid.appendChild(makeCard("Planet", reportPlanet));
    detailsGrid.appendChild(makeCard("Lucky Color", reportColor));
    detailsGrid.appendChild(makeCard("Core Aura", reportAura));
    detailsGrid.appendChild(makeCard(`${reportYear} Prediction`, reportPrediction));
    detailsGrid.appendChild(makeCard("Prepared For", "Baby, Brand, Startup, Company, Institution"));

    const footer = document.createElement("div");
    footer.style.marginTop = "auto";
    footer.style.display = "flex";
    footer.style.justifyContent = "space-between";
    footer.style.alignItems = "center";
    footer.style.paddingTop = "12px";
    footer.style.borderTop = "1.5px solid rgba(108, 43, 217, 0.2)";

    const quote = document.createElement("div");
    quote.textContent = "\"A strong name carries identity, memory, and momentum.\"";
    quote.style.fontSize = "18px";
    quote.style.fontStyle = "italic";
    quote.style.color = "#4e4663";

    const site = document.createElement("div");
    site.textContent = "www.naamin.com";
    site.style.fontSize = "15px";
    site.style.fontWeight = "700";
    site.style.letterSpacing = "1.3px";
    site.style.color = "#6C2BD9";
    site.style.textTransform = "uppercase";

    footer.appendChild(quote);
    footer.appendChild(site);

    root.appendChild(header);
    root.appendChild(hero);
    root.appendChild(detailsGrid);
    root.appendChild(footer);

    return root;
}

function createReportCanvas(data) {
    const reportNameEn = data.name_en || data.name || "Name";
    const reportNameHi = data.name_hi || getHindiName(reportNameEn) || "नाम";
    const reportMeaning = data.meaning_en || data.meaning || "A meaningful and elegant name.";
    const reportGender = data.gender || "Unknown";
    const reportOrigin = data.origin_en || data.origin || "Sanskrit/Indian";
    const reportNakshatra = data.nakshatra || "Ashwini";
    const reportRashi = data.rashi_en || data.rashi || "Aries (Mesha)";
    const reportNumber = String(data.num || "1");
    const reportPlanet = data.planet_en || "Sun";
    const reportColor = data.color_en || "Golden";
    const reportPrediction = data.rashiphal_en || "A steady year of growth, discipline, and new opportunities.";
    const reportAura = data.phal_en || "Energetic and optimistic personality.";
    const reportYear = String(data.year || new Date().getFullYear());
    const primaryNakshatra = String(reportNakshatra).split(",")[0].trim() || "Ashwini";
    const primaryRashi = String(reportRashi).split("(")[0].trim() || "Aries";
    const cleanedMeaning = String(reportMeaning).replace(/\s+/g, " ").trim();
    const cleanedAura = String(reportAura).replace(/\s+/g, " ").trim();
    const cleanedPrediction = String(reportPrediction).replace(/\s+/g, " ").trim();

    const canvas = document.createElement("canvas");
    canvas.width = 1240;
    canvas.height = 2080;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context unavailable");

    const drawRoundRect = (x, y, w, h, r = 16) => {
        const radius = Math.min(r, w / 2, h / 2);
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + w - radius, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
        ctx.lineTo(x + w, y + h - radius);
        ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
        ctx.lineTo(x + radius, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    };

    const wrapLines = (text, maxWidth) => {
        const words = String(text || "").split(/\s+/).filter(Boolean);
        if (!words.length) return [""];
        const lines = [];
        let current = "";
        words.forEach((word) => {
            const test = current ? `${current} ${word}` : word;
            if (ctx.measureText(test).width <= maxWidth) {
                current = test;
            } else {
                if (current) lines.push(current);
                current = word;
            }
        });
        if (current) lines.push(current);
        return lines.length ? lines : [String(text || "")];
    };

    const clampLines = (lines, maxLines, maxWidth) => {
        if (lines.length <= maxLines) return lines;
        const trimmed = lines.slice(0, maxLines);
        let last = trimmed[maxLines - 1];
        while (last.length > 2 && ctx.measureText(`${last}…`).width > maxWidth) {
            last = last.slice(0, -1).trim();
        }
        trimmed[maxLines - 1] = `${last}…`;
        return trimmed;
    };

    const drawParagraph = (text, x, y, maxWidth, lineHeight, maxLines, align = "left") => {
        let lines = wrapLines(text, maxWidth);
        lines = clampLines(lines, maxLines, maxWidth);
        ctx.textAlign = align;
        lines.forEach((line, index) => {
            ctx.fillText(line, x, y + (index * lineHeight));
        });
        ctx.textAlign = "left";
        return y + (Math.max(lines.length, 1) * lineHeight);
    };

    const drawCornerOrnament = (x, y, flipX = 1, flipY = 1) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(flipX, flipY);
        ctx.strokeStyle = "rgba(90,40,128,0.62)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 44);
        ctx.quadraticCurveTo(0, 0, 44, 0);
        ctx.stroke();

        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(8, 40);
        ctx.quadraticCurveTo(8, 8, 40, 8);
        ctx.stroke();
        ctx.restore();
    };

    const drawDivider = (centerX, y, width) => {
        const half = width / 2;
        ctx.strokeStyle = "rgba(90,40,128,0.46)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX - half, y);
        ctx.lineTo(centerX - 26, y);
        ctx.moveTo(centerX + 26, y);
        ctx.lineTo(centerX + half, y);
        ctx.stroke();
        ctx.fillStyle = "#6a2e94";
        ctx.font = "700 18px Lora, Georgia, serif";
        ctx.textAlign = "center";
        ctx.fillText("◇", centerX, y + 6);
        ctx.textAlign = "left";
    };

    const drawCircleInfo = (x, y, symbol, label) => {
        ctx.beginPath();
        ctx.arc(x, y, 66, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.97)";
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgba(90,40,128,0.56)";
        ctx.stroke();

        ctx.fillStyle = "#6a2e94";
        ctx.font = symbol === "ॐ"
            ? "700 30px 'Noto Sans Devanagari', Poppins, Inter, sans-serif"
            : "700 30px Lora, Georgia, serif";
        ctx.textAlign = "center";
        ctx.fillText(symbol, x, y - 14);

        const cleanLabel = String(label || "-")
            .replace(/\s*\/\s*/g, " / ")
            .replace(/\s+/g, " ")
            .trim() || "-";
        const labelWidth = 104;
        const labelFontSize = cleanLabel.length > 12 ? 16 : 18;
        ctx.fillStyle = "#241833";
        ctx.font = `700 ${labelFontSize}px Poppins, Inter, sans-serif`;

        let labelLines = wrapLines(cleanLabel, labelWidth);
        labelLines = clampLines(labelLines, 2, labelWidth);
        const lineHeight = labelFontSize + 4;
        const startY = y + 22 - (((labelLines.length - 1) * lineHeight) / 2);
        labelLines.forEach((line, index) => {
            ctx.fillText(line, x, startY + (index * lineHeight));
        });
        ctx.textAlign = "left";
    };

    const drawPanel = (x, y, w, h, title, body, opts = {}) => {
        drawRoundRect(x, y, w, h, 18);
        const panelBg = ctx.createLinearGradient(x, y, x, y + h);
        panelBg.addColorStop(0, "rgba(255,255,255,0.95)");
        panelBg.addColorStop(1, "rgba(249,244,255,0.95)");
        ctx.fillStyle = panelBg;
        ctx.fill();
        ctx.strokeStyle = "rgba(90,40,128,0.42)";
        ctx.lineWidth = 2.2;
        ctx.stroke();

        ctx.fillStyle = "#4f216f";
        ctx.font = "700 42px Lora, Georgia, serif";
        ctx.textAlign = "center";
        ctx.fillText(title, x + (w / 2), y + 56);
        drawDivider(x + (w / 2), y + 70, 300);

        ctx.fillStyle = "#221930";
        ctx.font = opts.font || "600 35px Poppins, Inter, sans-serif";
        drawParagraph(body, x + (w / 2), y + 120, w - 120, opts.lineHeight || 44, opts.maxLines || 3, "center");
        ctx.textAlign = "left";
    };

    const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bg.addColorStop(0, "#f9f5ff");
    bg.addColorStop(0.55, "#f5eefc");
    bg.addColorStop(1, "#f9f6ff");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawRoundRect(36, 36, 1168, 2008, 36);
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.fill();
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = "rgba(90,40,128,0.46)";
    ctx.stroke();

    drawRoundRect(58, 58, 1124, 1964, 30);
    ctx.strokeStyle = "rgba(90,40,128,0.30)";
    ctx.lineWidth = 2;
    ctx.stroke();

    drawCornerOrnament(56, 56, 1, 1);
    drawCornerOrnament(1184, 56, -1, 1);
    drawCornerOrnament(56, 2024, 1, -1);
    drawCornerOrnament(1184, 2024, -1, -1);

    ctx.textAlign = "center";
    ctx.fillStyle = "#111018";
    ctx.font = "800 82px Poppins, Inter, sans-serif";
    ctx.fillText("Naam", 594, 156);
    ctx.fillStyle = "#7b31af";
    ctx.fillText("in", 713, 156);
    ctx.fillStyle = "#2b2038";
    ctx.font = "700 34px Lora, Georgia, serif";
    ctx.fillText("NAMING SOLUTIONS", 620, 206);

    drawRoundRect(170, 254, 900, 282, 20);
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.fill();
    ctx.strokeStyle = "rgba(90,40,128,0.52)";
    ctx.lineWidth = 2.4;
    ctx.stroke();

    drawRoundRect(184, 268, 872, 254, 16);
    ctx.strokeStyle = "rgba(90,40,128,0.22)";
    ctx.lineWidth = 1.8;
    ctx.stroke();

    ctx.fillStyle = "#6d2f96";
    ctx.font = "700 112px Lora, Georgia, serif";
    drawParagraph(reportNameEn, 620, 372, 760, 112, 1, "center");

    ctx.fillStyle = "#5b277f";
    ctx.font = "700 82px 'Noto Sans Devanagari', Poppins, Inter, sans-serif";
    drawParagraph(reportNameHi, 620, 470, 760, 82, 1, "center");

    ctx.fillStyle = "#2f203e";
    ctx.font = "italic 48px Lora, Georgia, serif";
    drawParagraph(cleanedMeaning, 620, 628, 900, 56, 3, "center");

    drawDivider(620, 748, 250);

    drawCircleInfo(235, 886, reportGender.toLowerCase().includes("girl") ? "♀" : "♂", reportGender);
    drawCircleInfo(495, 886, "ॐ", reportOrigin);
    drawCircleInfo(745, 886, "✿", primaryNakshatra);
    drawCircleInfo(1005, 886, "☾", primaryRashi);

    const numerologyBody = `Number: ${reportNumber} | Planet: ${reportPlanet} | Lucky Color: ${reportColor}`;
    drawPanel(112, 1008, 1016, 224, "Numerology", numerologyBody, { font: "600 33px Poppins, Inter, sans-serif", lineHeight: 40, maxLines: 3 });

    drawPanel(112, 1266, 1016, 226, "Naamin Aura Analysis", cleanedAura, { font: "600 33px Poppins, Inter, sans-serif", lineHeight: 42, maxLines: 3 });

    drawPanel(112, 1526, 1016, 272, `${reportYear} Prediction`, cleanedPrediction, { font: "600 33px Poppins, Inter, sans-serif", lineHeight: 42, maxLines: 4 });

    ctx.fillStyle = "#332044";
    ctx.font = "italic 46px Lora, Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText('"A name is the first gift you give your child."', 620, 1860);

    drawRoundRect(372, 1890, 496, 86, 43);
    const ctaGrad = ctx.createLinearGradient(372, 1890, 868, 1976);
    ctaGrad.addColorStop(0, "#6f2f98");
    ctaGrad.addColorStop(1, "#8d46b8");
    ctx.fillStyle = ctaGrad;
    ctx.fill();
    ctx.strokeStyle = "rgba(90,40,128,0.52)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#fdf5ff";
    ctx.font = "700 42px Poppins, Inter, sans-serif";
    ctx.fillText("Visit: naamin.com", 620, 1948);

    ctx.beginPath();
    ctx.arc(150, 1930, 62, 0, Math.PI * 2);
    const sealGrad = ctx.createRadialGradient(150, 1922, 10, 150, 1930, 62);
    sealGrad.addColorStop(0, "#f8e5b7");
    sealGrad.addColorStop(1, "#d2a150");
    ctx.fillStyle = sealGrad;
    ctx.fill();
    ctx.strokeStyle = "rgba(118,78,21,0.6)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#6b4d1f";
    ctx.font = "700 42px Poppins, Inter, sans-serif";
    ctx.fillText("✓", 150, 1944);
    ctx.fillStyle = "rgba(107,77,31,0.86)";
    ctx.font = "700 15px Poppins, Inter, sans-serif";
    ctx.fillText("VALIDATED", 150, 1984);
    ctx.textAlign = "left";

    return canvas;
}

async function savePdfWithFilename(pdf, filename) {
    if (!pdf || typeof pdf.save !== "function") return false;
    try {
        const saveResult = pdf.save(filename, { returnPromise: true });
        if (saveResult && typeof saveResult.then === "function") {
            await saveResult;
        }
        return true;
    } catch (_error) {
        return false;
    }
}

function decodeHindiMojibake(text) {
    if (!text) return text;
    const raw = String(text);
    if (!/(?:à¤|à¥)/.test(raw)) return raw;

    try {
        const bytes = new Uint8Array(raw.length);
        for (let i = 0; i < raw.length; i++) {
            const code = raw.charCodeAt(i);
            if (code > 255) return raw;
            bytes[i] = code;
        }
        const decoded = new TextDecoder('utf-8').decode(bytes);
        if (!decoded || decoded.includes('�')) return raw;
        if (!/[\u0900-\u097F]/.test(decoded)) return raw;
        return decoded;
    } catch (_e) {
        return raw;
    }
}

function repairHindiMojibake(root = document.body) {
    if (!root) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    let node = walker.nextNode();
    while (node) {
        const parentTag = node.parentElement ? node.parentElement.tagName : '';
        if (!['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA'].includes(parentTag)) {
            const raw = node.nodeValue || '';
            if (/(?:à¤|à¥)/.test(raw)) {
                const fixed = decodeHindiMojibake(raw);
                if (fixed && fixed !== raw) {
                    node.nodeValue = fixed;
                }
            }
        }
        node = walker.nextNode();
    }

    const mockHindiName = document.querySelector('.mock-name-hi');
    if (mockHindiName) {
        const value = (mockHindiName.textContent || '').trim();
        if (!value || /(?:Ã|Â|â|à¤|�)/.test(value)) {
            mockHindiName.textContent = 'स्तुति';
        }
    }

    const posterHindiName = document.getElementById('poster-name-hi');
    if (posterHindiName) {
        const value = (posterHindiName.textContent || '').trim();
        if (!value || /(?:Ã|Â|â|à¤|�)/.test(value)) {
            posterHindiName.textContent = 'नाम';
        }
    }
}

function shouldTranslateAttribute(el, attr) {
    if (attr === "value") {
        if (!el || el.tagName !== "INPUT") return false;
        const inputType = String(el.getAttribute("type") || "text").toLowerCase();
        return VALUE_TRANSLATABLE_INPUT_TYPES.includes(inputType);
    }
    return true;
}

function snapshotOriginalLanguageState(root = document.body) {
    if (!root) return;

    if (root.nodeType === Node.TEXT_NODE) {
        if (!ORIGINAL_TEXT_NODE_MAP.has(root)) {
            ORIGINAL_TEXT_NODE_MAP.set(root, root.nodeValue || "");
        }
        return;
    }

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    let node = walker.nextNode();
    while (node) {
        if (!ORIGINAL_TEXT_NODE_MAP.has(node)) {
            ORIGINAL_TEXT_NODE_MAP.set(node, node.nodeValue || "");
        }
        node = walker.nextNode();
    }

    const elements = [];
    if (root.nodeType === Node.ELEMENT_NODE) {
        elements.push(root);
        if (root.querySelectorAll) {
            elements.push(...root.querySelectorAll("*"));
        }
    }

    elements.forEach((el) => {
        let record = ORIGINAL_ATTRIBUTE_MAP.get(el);
        if (!record) record = {};
        TRANSLATABLE_ATTRS.forEach((attr) => {
            if (!shouldTranslateAttribute(el, attr)) return;
            if (!el.hasAttribute(attr)) return;
            if (Object.prototype.hasOwnProperty.call(record, attr)) return;
            record[attr] = el.getAttribute(attr) || "";
        });
        if (Object.keys(record).length > 0) {
            ORIGINAL_ATTRIBUTE_MAP.set(el, record);
        }
    });
}

function isBrokenCopy(text) {
    if (!text) return true;
    const trimmed = String(text).trim();
    if (!trimmed) return true;
    if (/^\?+$/.test(trimmed)) return true;
    if (/^\?\s*/.test(trimmed)) return true;
    if (/[\?]{2,}/.test(trimmed)) return true;
    if (/[A-Za-z\u0900-\u097F0-9]\s+\?+\s+[A-Za-z\u0900-\u097F0-9]/.test(trimmed)) return true;
    if (trimmed.includes("�")) return true;
    if (/(?:Ã‚|Ãƒ|Ã¢|Ã|Â|â|à¤|à¥)/.test(trimmed)) return true;
    return false;
}

function translateLooseAttributes(lang) {
    if (!document.body) return;

    const nodes = document.body.querySelectorAll("*");
    nodes.forEach((el) => {
        let record = ORIGINAL_ATTRIBUTE_MAP.get(el);
        if (!record) {
            record = {};
            TRANSLATABLE_ATTRS.forEach((attr) => {
                if (!shouldTranslateAttribute(el, attr)) return;
                if (!el.hasAttribute(attr)) return;
                record[attr] = el.getAttribute(attr) || "";
            });
            if (Object.keys(record).length > 0) {
                ORIGINAL_ATTRIBUTE_MAP.set(el, record);
            }
        }

        if (!record) return;

        TRANSLATABLE_ATTRS.forEach((attr) => {
            if (!shouldTranslateAttribute(el, attr)) return;
            if (!Object.prototype.hasOwnProperty.call(record, attr)) return;

            const original = record[attr];
            if (!String(original || "").trim()) return;

            const preferredAttr = `data-${lang}-${attr}`;
            const fallbackAttr = `data-en-${attr}`;
            const preferredRaw = el.getAttribute(preferredAttr) || "";
            const fallbackRaw = el.getAttribute(fallbackAttr) || original;

            if (lang === "hi") {
                const translated = isBrokenCopy(preferredRaw) ? fallbackHindiCopy(fallbackRaw) : preferredRaw;
                if (translated) {
                    el.setAttribute(attr, translated);
                }
            } else {
                el.setAttribute(attr, fallbackRaw);
            }
        });
    });

    if (typeof window !== "undefined") {
        if (!window.__naaminOriginalTitle) {
            window.__naaminOriginalTitle = document.title || "";
        }
        if (lang === "hi") {
            const sourceTitle = window.__naaminOriginalTitle || document.title || "";
            document.title = fallbackHindiCopy(sourceTitle);
        } else if (window.__naaminOriginalTitle) {
            document.title = window.__naaminOriginalTitle;
        }
    }
}

function translateLooseTextNodes(lang) {
    if (!document.body) return;
    snapshotOriginalLanguageState(document.body);

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    let node = walker.nextNode();
    while (node) {
        const parent = node.parentElement;
        const parentTag = parent ? parent.tagName : "";

        if (
            parent &&
            !["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "CODE", "PRE"].includes(parentTag)
        ) {
            const current = node.nodeValue || "";
            const trimmed = current.trim();
            if (trimmed) {
                if (!ORIGINAL_TEXT_NODE_MAP.has(node)) {
                    ORIGINAL_TEXT_NODE_MAP.set(node, current);
                }
                const original = ORIGINAL_TEXT_NODE_MAP.get(node) || current;

                if (lang === "hi") {
                    const translated = fallbackHindiCopy(original);
                    if (translated && translated !== original.trim()) {
                        const leading = (original.match(/^\s*/) || [""])[0];
                        const trailing = (original.match(/\s*$/) || [""])[0];
                        node.nodeValue = `${leading}${translated}${trailing}`;
                    }
                } else {
                    node.nodeValue = original;
                }
            }
        }
        node = walker.nextNode();
    }
}

let languageMutationObserver = null;
function ensureLanguageMutationObserver() {
    if (languageMutationObserver || !document.body) return;
    languageMutationObserver = new MutationObserver((mutations) => {
        let sawNewNodes = false;
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                snapshotOriginalLanguageState(node);
                sawNewNodes = true;
            });
        });

        if (!sawNewNodes) return;
        const activeLang = (document.documentElement.lang || "en") === "hi" ? "hi" : "en";
        if (activeLang === "hi") {
            translateLooseTextNodes("hi");
            translateLooseAttributes("hi");
        }
    });
    languageMutationObserver.observe(document.body, { childList: true, subtree: true });
}

function enforceAnnouncementBanner() {
    const banner = document.querySelector(".scrolling-banner");
    if (!banner) return;

    // Force visibility in case any stale style/preloader rule hides it.
    banner.style.setProperty("display", "block", "important");
    banner.style.setProperty("visibility", "visible", "important");
    banner.style.setProperty("opacity", "1", "important");
    banner.style.setProperty("min-height", "42px");

    const track = banner.querySelector(".scrolling-track");
    if (track) {
        track.style.setProperty("display", "flex");
        track.style.setProperty("white-space", "nowrap");
        track.style.setProperty("animation-play-state", "running");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    enforceAnnouncementBanner();

    const heroVideo = document.querySelector('.hero-video');
    if (!heroVideo) return;
    heroVideo.removeAttribute('poster');
    heroVideo.classList.add('is-ready');
    heroVideo.muted = true;
    heroVideo.defaultMuted = true;
    heroVideo.playsInline = true;
    const autoplayAttempt = heroVideo.play();
    if (autoplayAttempt && typeof autoplayAttempt.catch === 'function') {
        autoplayAttempt.catch(() => { });
    }
});

// Let preloader know the app has finished initial DOM setup to avoid first-state flash.
document.addEventListener('DOMContentLoaded', () => {
    const heroVideo = document.querySelector('.hero-video');
    let signaled = false;

    const signalReady = () => {
        if (signaled) return;
        signaled = true;
        window.requestAnimationFrame(() => {
            window.dispatchEvent(new CustomEvent('naamin:app-ready'));
        });
    };

    if (!heroVideo) {
        signalReady();
        return;
    }

    const onVideoReady = () => {
        heroVideo.classList.add('is-ready');
        signalReady();
    };

    if (heroVideo.readyState >= 2) {
        onVideoReady();
    } else {
        heroVideo.addEventListener('canplay', onVideoReady, { once: true });
        heroVideo.addEventListener('loadeddata', onVideoReady, { once: true });
        heroVideo.addEventListener('error', signalReady, { once: true });
        window.setTimeout(signalReady, 1800);
    }
}, { once: true });

document.addEventListener('DOMContentLoaded', () => {
    const nameFinderSection = document.getElementById('name-finder');
    const namingInspirationSection = document.getElementById('baby-showcase');
    if (nameFinderSection && namingInspirationSection && namingInspirationSection.parentNode) {
        namingInspirationSection.parentNode.insertBefore(nameFinderSection, namingInspirationSection);
    }

    const heroMedia = document.querySelector('.hero-media');
    if (heroMedia) {
        heroMedia.querySelectorAll('.hero-media-placeholder').forEach(node => node.remove());
    }

    const heroContent = document.querySelector('.hero-content');
    if (heroContent && !heroContent.querySelector('.hero-scroll-hint')) {
        const hintTextEn = 'Find your name';
        const hintTextHi = 'अपना नाम खोजें';
        const isHindiUI = (document.documentElement.lang || 'en') === 'hi';
        const hintLink = document.createElement('a');
        hintLink.className = 'hero-scroll-hint';
        hintLink.href = '#name-finder';
        hintLink.setAttribute('data-en', hintTextEn);
        hintLink.setAttribute('data-hi', hintTextHi);
        hintLink.innerHTML = `${isHindiUI ? hintTextHi : hintTextEn} <i class="fas fa-arrow-down" aria-hidden="true"></i>`;
        heroContent.appendChild(hintLink);
    }

    document.querySelectorAll('.back-btn').forEach(backBtn => {
        const cleaned = (backBtn.textContent || '').replace(/^\?\s*/, '').trim() || 'Back to list';
        const backBtnHindi = 'सूची पर वापस जाएं';
        backBtn.textContent = cleaned;
        backBtn.setAttribute('data-en', cleaned);
        backBtn.setAttribute('data-hi', backBtnHindi);
    });

    const posterSeal = document.querySelector('.p-seal');
    if (posterSeal && /^[\?\s]+$/.test(posterSeal.textContent || '')) {
        posterSeal.textContent = '★';
    }

    const posterHindiName = document.getElementById('poster-name-hi');
    if (posterHindiName && /^[\?\s]+$/.test(posterHindiName.textContent || '')) {
        posterHindiName.textContent = 'नाम';
    }

    const videoCards = document.querySelectorAll('.video-card');
    if (!videoCards.length) return;

    const curatedVideos = [
        { src: 'assets/baby-name-hero.mp4', poster: 'IMG1.jpeg', title: 'Brand Naming Spotlight' },
        { src: 'assets/hero.mp4', poster: 'IMG2.jpeg', title: 'Baby Name Stories' },
        { src: 'assets/baby-name-hero.mp4', poster: 'IMG3.jpeg', title: 'Domains & Mottos' },
        { src: 'assets/hero.mp4', poster: 'IMG4.jpeg', title: 'Institutional Naming' }
    ];

    let lightbox = document.getElementById('video-lightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'video-lightbox';
        lightbox.className = 'video-lightbox';
        lightbox.hidden = true;
        lightbox.innerHTML = `
            <div class="video-lightbox-backdrop" data-close-video-lightbox></div>
            <div class="video-lightbox-dialog" role="dialog" aria-modal="true" aria-labelledby="video-lightbox-title">
                <button class="video-lightbox-close" type="button" data-close-video-lightbox aria-label="Close video">
                    <i class="fas fa-times" aria-hidden="true"></i>
                </button>
                <h3 id="video-lightbox-title">Naamin Video</h3>
                <video id="video-lightbox-player" controls playsinline></video>
            </div>
        `;
        document.body.appendChild(lightbox);
    }

    const lightboxTitle = lightbox.querySelector('#video-lightbox-title');
    const lightboxPlayer = lightbox.querySelector('#video-lightbox-player');
    if (!lightboxPlayer || !lightboxTitle) return;

    const closeVideoLightbox = () => {
        lightboxPlayer.pause();
        lightboxPlayer.removeAttribute('src');
        lightboxPlayer.load();
        lightbox.setAttribute('hidden', '');
        document.body.classList.remove('video-lightbox-open');
        document.body.style.overflow = '';
    };

    const openVideoLightbox = (videoEl, fallbackTitle) => {
        if (!videoEl) return;
        const src = videoEl.currentSrc || videoEl.querySelector('source')?.src;
        if (!src) return;

        document.querySelectorAll('.video-card video').forEach(v => v.pause());
        lightboxPlayer.src = src;
        lightboxPlayer.poster = videoEl.getAttribute('poster') || '';
        lightboxTitle.textContent = fallbackTitle || 'Naamin Video';
        lightbox.removeAttribute('hidden');
        document.body.classList.add('video-lightbox-open');
        document.body.style.overflow = 'hidden';
        lightboxPlayer.currentTime = 0;
        const playPromise = lightboxPlayer.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => { });
        }
    };

    videoCards.forEach((card, cardIndex) => {
        const videoEl = card.querySelector('video');
        const preferredVideo = curatedVideos[cardIndex % curatedVideos.length];
        const title =
            card.dataset.videoTitle ||
            card.querySelector('.video-card-title')?.textContent?.trim() ||
            preferredVideo.title ||
            'Naamin Video';
        let expandBtn = card.querySelector('.video-expand-btn');

        if (!expandBtn) {
            const content = card.querySelector('.video-card-content');
            if (content) {
                expandBtn = document.createElement('button');
                expandBtn.className = 'video-expand-btn';
                expandBtn.type = 'button';
                expandBtn.setAttribute('data-en', 'View Large');
                expandBtn.setAttribute('data-hi', 'बड़ा देखें');
                expandBtn.textContent = (document.documentElement.lang || 'en') === 'hi' ? 'बड़ा देखें' : 'View Large';
                content.appendChild(expandBtn);
            }
        }

        if (videoEl) {
            if (preferredVideo.poster) {
                videoEl.setAttribute('poster', preferredVideo.poster);
            }
            videoEl.setAttribute('preload', 'metadata');

            const sourceEl = videoEl.querySelector('source');
            if (sourceEl) {
                const existingSrc = sourceEl.getAttribute('src') || '';
                if (existingSrc !== preferredVideo.src) {
                    sourceEl.setAttribute('src', preferredVideo.src);
                    videoEl.load();
                }
            }
            card.dataset.videoTitle = title;

            videoEl.addEventListener('click', (event) => {
                event.preventDefault();
                openVideoLightbox(videoEl, title);
            });
        }

        if (expandBtn && videoEl) {
            expandBtn.addEventListener('click', () => openVideoLightbox(videoEl, title));
        }
    });

    lightbox.querySelectorAll('[data-close-video-lightbox]').forEach(closeEl => {
        closeEl.addEventListener('click', closeVideoLightbox);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !lightbox.hasAttribute('hidden')) {
            closeVideoLightbox();
        }
    });

    enforceAnnouncementBanner();
});

// Comprehensive English to Hindi Name Mapping & Transliteration
function getHindiName(englishName) {
    if (!englishName) return "";

    // 1. Precise Mapping for common names
    const preciseMapping = {
        'Aarav': 'आरव', 'Aditya': 'आदित्य', 'Arjun': 'अर्जुन', 'Aryan': 'आर्यन',
        'Ayaan': 'अयान', 'Dev': 'देव', 'Dhruv': 'ध्रुव', 'Harsh': 'हर्ष',
        'Ishan': 'ईशान', 'Ishaan': 'ईशान', 'Karan': 'करण', 'Krishna': 'कृष्ण',
        'Om': 'ॐ', 'Pranav': 'प्रणव', 'Rohan': 'रोहन', 'Rahul': 'राहुल',
        'Sahil': 'साहिल', 'Shiv': 'शिव', 'Vihaan': 'विहान', 'Yash': 'यश',
        'Ansi': 'अंसी', 'Ananya': 'अनन्या', 'Aisha': 'आयशा', 'Aditi': 'अदिति',
        'Diya': 'दीया', 'Isha': 'ईशा', 'Kavya': 'काव्या', 'Prisha': 'प्रिशा'
    };

    if (preciseMapping[englishName]) return preciseMapping[englishName];

    // 2. Fallback: Phonetic Transliteration logic
    const phoneticMap = {
        'a': 'अ', 'i': 'इ', 'u': 'उ', 'e': 'ए', 'o': 'ओ',
        'k': 'क', 'kh': 'ख', 'g': 'ग', 'gh': 'घ',
        'ch': 'च', 'chh': 'छ', 'j': 'ज', 'jh': 'झ',
        't': 'त', 'th': 'थ', 'd': 'द', 'dh': 'ध', 'n': 'न',
        'p': 'प', 'ph': 'फ', 'b': 'ब', 'bh': 'भ', 'm': 'म',
        'y': 'य', 'r': 'र', 'l': 'ल', 'v': 'व', 'w': 'व',
        's': 'स', 'sh': 'श', 'h': 'ह'
    };

    let name = englishName.toLowerCase();
    let result = '';
    let i = 0;

    while (i < name.length) {
        // Try double characters first (e.g., 'sh', 'kh')
        let char2 = name.substring(i, i + 2);
        if (phoneticMap[char2]) {
            result += phoneticMap[char2];
            i += 2;
        } else {
            let char1 = name.substring(i, i + 1);
            result += phoneticMap[char1] || '';
            i += 1;
        }
    }

    return result || englishName;
}
window.getHindiName = getHindiName;


// 🌟 ASTRO ENGINE
class AstroEngine {
    constructor() {
        this.numerologyMap = { 'A': 1, 'I': 1, 'J': 1, 'Q': 1, 'Y': 1, 'B': 2, 'K': 2, 'R': 2, 'C': 3, 'G': 3, 'L': 3, 'S': 3, 'D': 4, 'M': 4, 'T': 4, 'E': 5, 'H': 5, 'N': 5, 'X': 5, 'U': 6, 'V': 6, 'W': 6, 'O': 7, 'Z': 7, 'F': 8, 'P': 8 };

        // --- 2026 FULL HOROSCOPE DATA (COMPLETE TEXT) ---
        this.rashiMap = [
            {
                rashi_en: "Aries (Mesh)", rashi_hi: "मेष (Aries)",
                letters: ["chu", "che", "cho", "la", "li", "lu", "le", "lo", "a"],
                nakshatras: ["Ashwini", "Bharani", "Krittika"],
                phal_en: "Courageous, energetic, and a born leader.",
                phal_hi: "साहसी, ऊर्जावान और नेतृत्व करने वाला।",
                rashiphal_en: "2026 brings massive career growth and energy. Focus on health in the second half. New beginnings are favored.",
                rashiphal_hi: "2026 करियर में भारी वृद्धि और ऊर्जा लाएगा। वर्ष के दूसरे भाग में स्वास्थ्य पर ध्यान दें। नई शुरुआत के लिए समय अनुकूल है।"
            },
            {
                rashi_en: "Taurus (Vrishabh)", rashi_hi: "वृषभ (Taurus)",
                letters: ["i", "ee", "u", "oo", "e", "o", "va", "vi", "vu", "ve", "vo"],
                nakshatras: ["Krittika", "Rohini", "Mrigashira"],
                phal_en: "Calm, reliable, and lover of arts.",
                phal_hi: "शांत, विश्वसनीय और कला प्रेमी।",
                rashiphal_en: "Financial stability improves significantly in 2026. Relationships will deepen. Avoid stubbornness in family matters.",
                rashiphal_hi: "2026 में आर्थिक स्थिरता काफी बेहतर होगी। रिश्ते गहरे होंगे। पारिवारिक मामलों में जिद्दी होने से बचें।"
            },
            {
                rashi_en: "Gemini (Mithun)", rashi_hi: "मिथुन (Gemini)",
                letters: ["ka", "ki", "ku", "gh", "ng", "ch", "ke", "ko", "ha"],
                nakshatras: ["Mrigashira", "Ardra", "Punarvasu"],
                phal_en: "Intelligent, talkative, and versatile.",
                phal_hi: "बुद्धिमान, वाचाल और बहुमुखी प्रतिभा वाला।",
                rashiphal_en: "A great year for learning, travel, and communication. New opportunities arise in business. Stay focused.",
                rashiphal_hi: "सीखने, यात्रा और संचार के लिए यह एक बेहतरीन वर्ष है। व्यापार में नए अवसर मिलेंगे। अपने लक्ष्य पर केंद्रित रहें।"
            },
            {
                rashi_en: "Cancer (Kark)", rashi_hi: "कर्क (Cancer)",
                letters: ["hi", "hu", "he", "ho", "da", "di", "du", "de", "do"],
                nakshatras: ["Punarvasu", "Pushya", "Ashlesha"],
                phal_en: "Emotional, sensitive, and family-oriented.",
                phal_hi: "भावुक, संवेदनशील और परिवार प्रेमी।",
                rashiphal_en: "Focus on home and property in 2026. Emotional strength increases. Career stability is indicated mid-year.",
                rashiphal_hi: "2026 में घर और संपत्ति पर ध्यान केंद्रित रहेगा। भावनात्मक शक्ति बढ़ेगी। वर्ष के मध्य में करियर में स्थिरता आएगी।"
            },
            {
                rashi_en: "Leo (Simha)", rashi_hi: "सिंह (Leo)",
                letters: ["ma", "mi", "mu", "me", "mo", "ta", "ti", "tu", "te"],
                nakshatras: ["Magha", "Purva Phalguni", "Uttara Phalguni"],
                phal_en: "Confident, generous, and regal nature.",
                phal_hi: "आत्मविश्वासी, उदार और राजा जैसा स्वभाव।",
                rashiphal_en: "Leadership roles await you in 2026. Your creativity will shine. Recognition and fame are on the cards.",
                rashiphal_hi: "2026 में नेतृत्व की भूमिकाएँ आपका इंतज़ार कर रही हैं। आपकी रचनात्मकता चमकेगी। मान-सम्मान और प्रसिद्धि मिलने के योग हैं।"
            },
            {
                rashi_en: "Virgo (Kanya)", rashi_hi: "कन्या (Virgo)",
                letters: ["to", "pa", "pi", "pu", "sha", "na", "th", "pe", "po"],
                nakshatras: ["Uttara Phalguni", "Hasta", "Chitra"],
                phal_en: "Analytical, practical, and hardworking.",
                phal_hi: "विश्लेषण करने वाला, व्यावहारिक और मेहनती।",
                rashiphal_en: "Hard work pays off this year. Excellent time for skill development and education. Health requires care.",
                rashiphal_hi: "इस वर्ष कड़ी मेहनत का फल मिलेगा। कौशल विकास और शिक्षा के लिए उत्तम समय है। स्वास्थ्य का ध्यान रखने की आवश्यकता है।"
            },
            {
                rashi_en: "Libra (Tula)", rashi_hi: "तुला (Libra)",
                letters: ["ra", "ri", "ru", "re", "ro", "ta", "ti", "tu", "te"],
                nakshatras: ["Chitra", "Swati", "Vishakha"],
                phal_en: "Fair, balanced, and social.",
                phal_hi: "न्यायप्रिय, संतुलित और मिलनसार।",
                rashiphal_en: "Balance in partnerships is key in 2026. Artistic pursuits flourish. A good year for marriage or new alliances.",
                rashiphal_hi: "2026 में साझेदारी में संतुलन महत्वपूर्ण रहेगा। कलात्मक कार्यों में सफलता मिलेगी। विवाह या नए गठबंधनों के लिए अच्छा वर्ष है।"
            },
            {
                rashi_en: "Scorpio (Vrishchik)", rashi_hi: "वृश्चिक (Scorpio)",
                letters: ["to", "na", "ni", "nu", "ne", "no", "ya", "yi", "yu"],
                nakshatras: ["Vishakha", "Anuradha", "Jyeshtha"],
                phal_en: "Intense, mysterious, and determined.",
                phal_hi: "तीव्र, रहस्यमयी और दृढ़ निश्चय वाला।",
                rashiphal_en: "A transformative year. Trust your intuition and take calculated risks. Sudden gains are possible.",
                rashiphal_hi: "यह एक परिवर्तनकारी वर्ष है। अपनी अंतर्ज्ञान पर भरोसा करें और सोच-समझकर जोखिम लें। अचानक धन लाभ संभव है।"
            },
            {
                rashi_en: "Sagittarius (Dhanu)", rashi_hi: "धनु (Sagittarius)",
                letters: ["ye", "yo", "bha", "bhi", "bhu", "dha", "pha", "dha", "bhe"],
                nakshatras: ["Mula", "Purva Ashadha", "Uttara Ashadha"],
                phal_en: "Optimistic, philosophical, and independent.",
                phal_hi: "आशावादी, दार्शनिक और स्वतंत्र।",
                rashiphal_en: "Luck favors you in 2026. Spiritual growth and long-distance travel are strongly indicated. Optimism returns.",
                rashiphal_hi: "2026 में भाग्य आपका साथ देगा। आध्यात्मिक विकास और लंबी दूरी की यात्रा के प्रबल संकेत हैं। जीवन में आशावाद लौटेगा।"
            },
            {
                rashi_en: "Capricorn (Makar)", rashi_hi: "मकर (Capricorn)",
                letters: ["bho", "ja", "ji", "ju", "je", "jo", "kha", "ga", "gi"],
                nakshatras: ["Uttara Ashadha", "Shravana", "Dhanishtha"],
                phal_en: "Ambitious, disciplined, and patient.",
                phal_hi: "महत्वाकांक्षी, अनुशासित और धैर्यवान।",
                rashiphal_en: "Career goals will be met through discipline. 2026 rewards your patience. Real estate investments look good.",
                rashiphal_hi: "अनुशासन के माध्यम से करियर के लक्ष्य पूरे होंगे। 2026 आपके धैर्य का फल देगा। अचल संपत्ति में निवेश शुभ रहेगा।"
            },
            {
                rashi_en: "Aquarius (Kumbh)", rashi_hi: "कुम्भ (Aquarius)",
                letters: ["gu", "ge", "go", "sa", "si", "su", "se", "so", "da"],
                nakshatras: ["Dhanishtha", "Shatabhisha", "Purva Bhadrapada"],
                phal_en: "Innovative, humanitarian, and friendly.",
                phal_hi: "नवीन सोच वाला, मानवीय और मित्रवत।",
                rashiphal_en: "Innovation leads to success. Your social circle expands significantly in 2026. Financial gains from networks.",
                rashiphal_hi: "नवचार से सफलता मिलेगी। 2026 में आपका सामाजिक दायरा काफी बढ़ेगा। नेटवर्किंग से आर्थिक लाभ होगा।"
            },
            {
                rashi_en: "Pisces (Meen)", rashi_hi: "मीन (Pisces)",
                letters: ["di", "du", "th", "jha", "yna", "de", "do", "cha", "chi"],
                nakshatras: ["Purva Bhadrapada", "Uttara Bhadrapada", "Revati"],
                phal_en: "Compassionate, spiritual, and imaginative.",
                phal_hi: "दयालु, आध्यात्मिक और कल्पनाशील।",
                rashiphal_en: "Spiritual peace and overseas connections. Manage expenses wisely. Intuition will be your best guide.",
                rashiphal_hi: "आध्यात्मिक शांति मिलेगी और विदेशी संबंध बनेंगे। खर्चों का प्रबंधन समझदारी से करें। अंतर्ज्ञान आपका सबसे अच्छा मार्गदर्शक होगा।"
            }
        ];

        this.astroDetails = {
            1: { planet_en: "Sun", planet_hi: "सूर्य", color_en: "Golden", color_hi: "सुनहरा", lucky_nos: "1, 2, 3, 9", fal_en: "Leader...", fal_hi: "नेता..." },
            2: { planet_en: "Moon", planet_hi: "चन्द्र", color_en: "White", color_hi: "सफेद", lucky_nos: "2, 6, 7", fal_en: "Emotional...", fal_hi: "भावुक..." },
            3: { planet_en: "Jupiter", planet_hi: "बृहस्पति", color_en: "Yellow", color_hi: "पीला", lucky_nos: "1, 3, 5, 9", fal_en: "Wise...", fal_hi: "ज्ञानी..." },
            4: { planet_en: "Rahu", planet_hi: "राहू", color_en: "Blue", color_hi: "नीला", lucky_nos: "1, 4, 5, 6", fal_en: "Practical...", fal_hi: "व्यावहारिक..." },
            5: { planet_en: "Mercury", planet_hi: "बुध", color_en: "Green", color_hi: "हरा", lucky_nos: "1, 5, 6", fal_en: "Intelligent...", fal_hi: "बुद्धिमान..." },
            6: { planet_en: "Venus", planet_hi: "शुक्र", color_en: "Pink", color_hi: "गुलाबी", lucky_nos: "3, 6, 9", fal_en: "Charming...", fal_hi: "आकर्षक..." },
            7: { planet_en: "Ketu", planet_hi: "केतु", color_en: "Multi", color_hi: "चितकबरा", lucky_nos: "2, 7", fal_en: "Spiritual...", fal_hi: "आध्यात्मिक..." },
            8: { planet_en: "Saturn", planet_hi: "शनि", color_en: "Black", color_hi: "काला", lucky_nos: "1, 4, 8", fal_en: "Ambitious...", fal_hi: "महत्वाकांक्षी..." },
            9: { planet_en: "Mars", planet_hi: "मंगल", color_en: "Red", color_hi: "लाल", lucky_nos: "3, 6, 9", fal_en: "Energetic...", fal_hi: "ऊर्जावान..." }
        };
    }

    calculateNumerology(name) {
        if (!name) return 1;
        let total = 0, clean = name.toUpperCase().replace(/[^A-Z]/g, '');
        for (let c of clean) total += this.numerologyMap[c] || 0;
        while (total > 9) { let s = 0; while (total > 0) { s += total % 10; total = Math.floor(total / 10); } total = s; }
        return total || 1;
    }

    calculateRashi(name) {
        if (!name) return this.rashiMap[0];
        let n = name.toLowerCase().trim();
        for (let r of this.rashiMap) {
            for (let l of r.letters) if (n.startsWith(l)) return r;
        }
        return this.rashiMap[0];
    }

    processName(data, lang) {
        let safeName = data.name || data.Name;
        if (!safeName) return null;

        const num = this.calculateNumerology(safeName);
        const rashi = this.calculateRashi(safeName);
        const astro = this.astroDetails[num] || this.astroDetails[1];

        const isHindi = lang === 'hi';

        // Get Hindi Name if available in data, or fallback to mapping
        const hName = data.hindiName || data.hindi_name || data.name_hindi || getHindiName(safeName) || "";

        return {
            ...data,
            name: safeName, // English Name
            name_en: safeName,
            name_hi: hName,

            // Meaning logic: preserve whatever is in data (might be English or Hindi based on source)
            meaning: data.meaning || (isHindi ? "डेटाबेस में नहीं मिला" : "Meaning not in database"),
            meaning_en: data.meaning_en || data.meaning || "Meaning not available", // Attempt to have an En version
            gender: data.gender || "Unknown",
            origin: data.origin || (isHindi ? "संस्कृत/भारतीय" : "Sanskrit/Indian"),
            origin_en: data.origin_en || data.origin || "Sanskrit/Indian",

            // Bilingual versions for poster control
            rashi: isHindi ? rashi.rashi_hi : rashi.rashi_en,
            rashi_en: rashi.rashi_en,
            rashi_hi: rashi.rashi_hi,

            nakshatra: rashi.nakshatras.join(", "),

            phal: isHindi ? rashi.phal_hi : rashi.phal_en,
            phal_en: rashi.phal_en,
            phal_hi: rashi.phal_hi,

            rashiphal: isHindi ? rashi.rashiphal_hi : rashi.rashiphal_en,
            rashiphal_en: rashi.rashiphal_en,
            rashiphal_hi: rashi.rashiphal_hi,

            num: num,
            planet: isHindi ? astro.planet_hi : astro.planet_en,
            planet_en: astro.planet_en,
            planet_hi: astro.planet_hi,

            color: isHindi ? astro.color_hi : astro.color_en,
            color_en: astro.color_en,
            color_hi: astro.color_hi,

            luckyNumbers: astro.lucky_nos,
            numFal: isHindi ? astro.fal_hi : astro.fal_en,
            numFal_en: astro.fal_en,
            numFal_hi: astro.fal_hi,

            labels: {
                meaning: isHindi ? "अर्थ" : "Meaning",
                gender: isHindi ? "लिंग" : "Gender",
                origin: isHindi ? "मूल" : "Origin",
                vedicTitle: isHindi ? "🔮 वैदिक ज्योतिष" : "🔮 Vedic Astrology",
                rashi: isHindi ? "राशि" : "Rashi",
                nakshatra: isHindi ? "नक्षत्र" : "Nakshatra",
                personality: isHindi ? "2026 भविष्यवाणी" : "2026 Prediction",
                rashiphalTitle: isHindi ? "✨ 2026 राशिफल" : "✨ 2026 Horoscope",
                numTitle: isHindi ? "🔢 अंक ज्योतिष" : "🔢 Numerology",
                number: isHindi ? "अंक" : "Number",
                planet: isHindi ? "ग्रह" : "Planet",
                luckyColor: isHindi ? "शुभ रंग" : "Lucky Color",
                luckyNos: isHindi ? "शुभ अंक" : "Lucky Numbers",
                prediction: isHindi ? "भविष्यफल" : "Prediction"
            }
        };
    }
}

const engine = new AstroEngine();
window.astroEngine = engine;
window.AstroEngine = AstroEngine;

let namesData = [];

// --- FALLBACK DATA FOR OFFLINE MODE ---
const FALLBACK_DATA = {
    Boy: [
        { "name": "Aarav", "meaning": "Peaceful, calm, melodious sound" }, { "name": "Aditya", "meaning": "Sun, son of Aditi" },
        { "name": "Arjun", "meaning": "Bright, shining, white" }, { "name": "Aryan", "meaning": "Noble, honorable" },
        { "name": "Ayaan", "meaning": "Gift of God" }, { "name": "Avik", "meaning": "Brave, fearless" },
        { "name": "Anay", "meaning": "Without a leader, supreme" }, { "name": "Arnav", "meaning": "Ocean, vast" },
        { "name": "Aarush", "meaning": "First ray of sun" }, { "name": "Aahan", "meaning": "Dawn, sunrise" },
        { "name": "Bhavesh", "meaning": "Lord of the world" }, { "name": "Bhuvan", "meaning": "Earth, world" },
        { "name": "Bharat", "meaning": "India, universal monarch" }, { "name": "Brijesh", "meaning": "Lord of Brij" },
        { "name": "Chirag", "meaning": "Lamp, light" }, { "name": "Chetan", "meaning": "Consciousness, intelligence" },
        { "name": "Dev", "meaning": "God, divine" }, { "name": "Darshan", "meaning": "Sight, vision" },
        { "name": "Dhruv", "meaning": "Pole star" }, { "name": "Dinesh", "meaning": "Lord of the day, sun" },
        { "name": "Eshan", "meaning": "Lord Shiva" }, { "name": "Ekansh", "meaning": "Whole, complete" },
        { "name": "Farhan", "meaning": "Happy, joyful" }, { "name": "Faisal", "meaning": "Decisive" },
        { "name": "Gaurav", "meaning": "Honor, pride" }, { "name": "Gagan", "meaning": "Sky" },
        { "name": "Harsh", "meaning": "Happiness, joy" }, { "name": "Hriday", "meaning": "Heart, soul" },
        { "name": "Ishan", "meaning": "Sun, Lord Shiva" }, { "name": "Ishaan", "meaning": "Sun, Lord Vishnu" },
        { "name": "Jay", "meaning": "Victory" }, { "name": "Jatin", "meaning": "Disciplined" },
        { "name": "Karan", "meaning": "Helper" }, { "name": "Kunal", "meaning": "Lotus" },
        { "name": "Lakshya", "meaning": "Aim" }, { "name": "Manish", "meaning": "God of mind" },
        { "name": "Nikhil", "meaning": "Complete" }, { "name": "Om", "meaning": "Sacred syllable" },
        { "name": "Pranav", "meaning": "Sacred syllable Om" }, { "name": "Rohan", "meaning": "Ascending" },
        { "name": "Rahul", "meaning": "Conqueror of miseries" }, { "name": "Sahil", "meaning": "Guide, Shore" },
        { "name": "Samar", "meaning": "Battle, War" }, { "name": "Shaurya", "meaning": "Bravery" },
        { "name": "Shiv", "meaning": "Lord Shiva" }, { "name": "Tanish", "meaning": "Ambition" },
        { "name": "Uday", "meaning": "Sunrise" }, { "name": "Vihaan", "meaning": "Dawn" },
        { "name": "Yash", "meaning": "Fame, Glory" }, { "name": "Zaid", "meaning": "Abundance" }
    ],
    Girl: [
        { "name": "Ansi", "meaning": "God's Gift" }, { "name": "Ananya", "meaning": "Unique" },
        { "name": "Aisha", "meaning": "Life" }, { "name": "Aditi", "meaning": "Boundless" },
        { "name": "Anika", "meaning": "Grace" }, { "name": "Avni", "meaning": "Earth" },
        { "name": "Bhavya", "meaning": "Magnificent" }, { "name": "Bina", "meaning": "Musical instrument" },
        { "name": "Chhavi", "meaning": "Reflection" }, { "name": "Charvi", "meaning": "Beautiful" },
        { "name": "Diya", "meaning": "Lamp" }, { "name": "Deepika", "meaning": "Light" },
        { "name": "Eesha", "meaning": "Purity" }, { "name": "Eshita", "meaning": "Desired" },
        { "name": "Falak", "meaning": "Sky" }, { "name": "Farah", "meaning": "Happiness" },
        { "name": "Gauri", "meaning": "Fair" }, { "name": "Gitanjali", "meaning": "Songs" },
        { "name": "Harini", "meaning": "Deer" }, { "name": "Himani", "meaning": "Snow" },
        { "name": "Isha", "meaning": "Protector" }, { "name": "Ira", "meaning": "Earth" },
        { "name": "Jahnavi", "meaning": "Ganga River" }, { "name": "Jivika", "meaning": "Source of Life" },
        { "name": "Kavya", "meaning": "Poetry" }, { "name": "Kiara", "meaning": "Bright" },
        { "name": "Laxmi", "meaning": "Wealth" }, { "name": "Lavanya", "meaning": "Grace" },
        { "name": "Mira", "meaning": "Ocean" }, { "name": "Madhavi", "meaning": "Sweet" },
        { "name": "Nisha", "meaning": "Night" }, { "name": "Nandini", "meaning": "Daughter" },
        { "name": "Ojasvi", "meaning": "Energetic" }, { "name": "Omisha", "meaning": "Goddess of Birth" },
        { "name": "Prisha", "meaning": "Gift of God" }, { "name": "Pavitra", "meaning": "Pure" },
        { "name": "Riya", "meaning": "Singer" }, { "name": "Radhika", "meaning": "Success" },
        { "name": "Saanvi", "meaning": "Goddess Lakshmi" }, { "name": "Shruti", "meaning": "Scripture" },
        { "name": "Tanya", "meaning": "Fairy Princess" }, { "name": "Trisha", "meaning": "Desire" },
        { "name": "Urvashi", "meaning": "Celestial" }, { "name": "Ujjwala", "meaning": "Bright" },
        { "name": "Vaishnavi", "meaning": "Devotee of Vishnu" }, { "name": "Vanya", "meaning": "Grace" },
        { "name": "Waniya", "meaning": "Gift" }, { "name": "Yashvi", "meaning": "Fame" },
        { "name": "Zara", "meaning": "Princess" }, { "name": "Zoya", "meaning": "Life" }
    ]
};

// --- FAVORITES MANAGER CLASS ---
const FAVORITES_PRIMARY_KEY = 'naamin_favorites_v1';
const FAVORITES_LEGACY_KEY = 'favorites';

function loadFavoritesFromStorage() {
    const primary = localStorage.getItem(FAVORITES_PRIMARY_KEY);
    if (primary) {
        try { return JSON.parse(primary) || []; } catch (e) { }
    }
    const legacy = localStorage.getItem(FAVORITES_LEGACY_KEY);
    if (legacy) {
        try { return JSON.parse(legacy) || []; } catch (e) { }
    }
    return [];
}

function saveFavoritesToStorage(list) {
    const payload = JSON.stringify(list || []);
    localStorage.setItem(FAVORITES_PRIMARY_KEY, payload);
    localStorage.setItem(FAVORITES_LEGACY_KEY, payload);
}

class FavoritesManager {
    constructor() {
        this.storageKey = FAVORITES_PRIMARY_KEY;
        this.favorites = this.load();
        this.updateHeaderCount();
    }

    load() {
        return loadFavoritesFromStorage();
    }

    save() {
        saveFavoritesToStorage(this.favorites);
        this.updateHeaderCount();
        try {
            document.dispatchEvent(new CustomEvent('favoritesUpdated'));
        } catch (e) { }
    }

    toggle(nameObj) {
        const name = nameObj.name || nameObj.Name;
        const exists = this.favorites.find(item => (item.name || item.Name) === name);

        if (exists) {
            this.favorites = this.favorites.filter(item => (item.name || item.Name) !== name);
            return false; // Removed
        } else {
            this.favorites.push(nameObj);
            return true; // Added
        }
    }

    isFavorite(name) {
        return this.favorites.some(item => (item.name || item.Name) === name);
    }

    clear() {
        this.favorites = [];
        this.save();
    }

    updateHeaderCount() {
        const count = this.favorites.length;
        document.querySelectorAll('#fav-count, #fav-count-mobile').forEach(span => {
            span.textContent = count;
            span.style.display = 'inline-flex';
        });
    }
}

const favManager = new FavoritesManager();
window.favManager = favManager;
window.FavoritesManager = FavoritesManager;


document.addEventListener("DOMContentLoaded", () => {

    // Initialize Speech Synthesis voices (needed for pronunciation feature)
    if ('speechSynthesis' in window) {
        // Load voices - some browsers need this explicitly
        let voicesLoaded = false;

        function loadVoices() {
            const voices = speechSynthesis.getVoices();
            if (voices.length > 0) {
                voicesLoaded = true;
                console.log('Speech synthesis voices loaded:', voices.length);
            }
            return voices;
        }

        // Initial load
        loadVoices();

        // Some browsers fire this event when voices are loaded
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = loadVoices;
        }

        // Fallback: try loading after a short delay
        setTimeout(() => {
            if (!voicesLoaded) {
                loadVoices();
            }
        }, 100);
    }

    // Header Padding
    const header = document.querySelector('header');
    if (header) document.body.style.paddingTop = `${header.offsetHeight}px`;

    // Theme Toggle
    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
        const saved = localStorage.getItem("theme") || "light";
        document.body.setAttribute("data-theme", saved);
        themeBtn.innerHTML = saved === "dark" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        themeBtn.onclick = () => {
            const current = document.body.getAttribute("data-theme");
            const next = current === "dark" ? "light" : "dark";
            document.body.setAttribute("data-theme", next);
            localStorage.setItem("theme", next);
            themeBtn.innerHTML = next === "dark" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        };
    }

    // ========== MOBILE MENU - RIGHT SIDE DRAWER ==========
    const hamburger = document.getElementById("hamburger-menu");
    const mobileMenu = document.getElementById("mobile-menu");
    const mobileDropdown = document.querySelector(".mobile-dropdown");
    const mobileDropdownToggle = document.querySelector(".mobile-dropdown-toggle");
    const topNavbar = document.querySelector(".navbar");

    // Create overlay for mobile menu
    let mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    if (!mobileMenuOverlay && mobileMenu) {
        mobileMenuOverlay = document.createElement('div');
        mobileMenuOverlay.className = 'mobile-menu-overlay';
        document.body.appendChild(mobileMenuOverlay);
    }

    if (topNavbar) {
        const syncNavbarState = () => {
            topNavbar.classList.toggle("is-scrolled", window.scrollY > 8);
        };
        syncNavbarState();
        window.addEventListener("scroll", syncNavbarState, { passive: true });
    }

    // Helper function to close mobile menu
    function closeMobileMenu() {
        if (mobileMenu) mobileMenu.classList.remove("open");
        if (mobileMenuOverlay) mobileMenuOverlay.classList.remove("active");
        if (hamburger) {
            const icon = hamburger.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
        }
        document.body.style.overflow = '';
    }

    // Helper function to open mobile menu
    function openMobileMenu() {
        if (mobileMenu) mobileMenu.classList.add("open");
        if (mobileMenuOverlay) mobileMenuOverlay.classList.add("active");
        if (hamburger) {
            const icon = hamburger.querySelector('i');
            if (icon) icon.className = 'fas fa-times';
        }
        document.body.style.overflow = 'hidden';
    }

    // Toggle mobile menu
    if (hamburger && mobileMenu) {
        hamburger.addEventListener("click", (e) => {
            e.stopPropagation();
            if (mobileMenu.classList.contains("open")) {
                closeMobileMenu();
            } else {
                openMobileMenu();
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

    // Close mobile menu when clicking overlay
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener("click", closeMobileMenu);
    }

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
        if (mobileMenu && hamburger) {
            if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target) && mobileMenu.classList.contains("open")) {
                closeMobileMenu();
            }
        }
    });

    // Close mobile menu when clicking a link
    if (mobileMenu) {
        const mobileLinks = mobileMenu.querySelectorAll('a:not(.mobile-dropdown-toggle)');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });
    }

    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
            closeMobileMenu();
        }
    });

    // Language toggle sync removed because they now have direct handlers below


    // Sync favorites button between desktop and mobile
    const favBtnDesktop = document.getElementById('fav-view-btn');
    const favBtnMobile = document.getElementById('fav-view-btn-mobile');

    if (favBtnMobile && favBtnDesktop) {
        favBtnMobile.addEventListener('click', () => {
            favBtnDesktop.click();
        });
    }

    // Sync favorites count
    function syncFavoritesCount() {
        const countDesktop = document.getElementById('fav-count');
        const countMobile = document.getElementById('fav-count-mobile');
        if (countDesktop && countMobile) {
            countMobile.textContent = countDesktop.textContent;
        }
    }

    // Watch for changes in favorites count
    const favCountObserver = new MutationObserver(syncFavoritesCount);
    const favCountElement = document.getElementById('fav-count');
    if (favCountElement) {
        favCountObserver.observe(favCountElement, { childList: true, characterData: true, subtree: true });
    }

    // Initial sync
    favManager?.updateHeaderCount();
    syncFavoritesCount();

    // Dropdown behavior for new navbar
    document.querySelectorAll('.dropdown-toggle').forEach(function (toggle) {
        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var li = toggle.closest('.dropdown');
            if (!li) return;
            li.classList.toggle('open');
        });
    });

    // Close dropdowns when clicking elsewhere
    document.addEventListener('click', function (e) {
        document.querySelectorAll('.dropdown.open').forEach(function (d) {
            if (!d.contains(e.target)) d.classList.remove('open');
        });
    });

    // Allow keyboard toggle with Enter/Space
    document.querySelectorAll('.dropdown-toggle').forEach(function (el) {
        el.setAttribute('tabindex', '0');
        el.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); el.click(); } });
    });

    // Scroll To Top
    const scrollBtn = document.getElementById("scrollToTopBtn");
    if (scrollBtn) {
        window.addEventListener("scroll", () => {
            scrollBtn.classList.toggle("show", window.scrollY > 300);
            scrollBtn.style.opacity = window.scrollY > 300 ? "1" : "0";
            scrollBtn.style.visibility = window.scrollY > 300 ? "visible" : "hidden";
        });
        scrollBtn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Language Handling
    function getLanguage() {
        return localStorage.getItem("language") || "en";
    }

    function isAuthPagePath(pathname = "") {
        const normalized = String(pathname || "").toLowerCase();
        return normalized.endsWith("/login.html") || normalized.endsWith("/signup.html");
    }

    function setupAuthIntentRedirects() {
        const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
        const currentPathSafe = isAuthPagePath(window.location.pathname) ? "" : currentPath;
        const redirectStorageKey = 'naamin-auth-redirect';

        document.querySelectorAll('a[href*="login.html"], a[href*="signup.html"]').forEach((link) => {
            const rawHref = link.getAttribute('href');
            if (!rawHref || rawHref.startsWith('javascript:')) return;

            let parsed;
            try {
                parsed = new URL(rawHref, window.location.href);
            } catch (_e) {
                return;
            }

            if (!isAuthPagePath(parsed.pathname)) return;
            if (!currentPathSafe) return;

            if (link.dataset.redirectBound !== 'true') {
                link.dataset.redirectBound = 'true';
                link.addEventListener('click', () => {
                    try {
                        localStorage.setItem(redirectStorageKey, currentPathSafe);
                    } catch (_e) {
                        // ignore storage edge cases
                    }
                });
            }

            if (!parsed.searchParams.has('redirect')) {
                parsed.searchParams.set('redirect', currentPathSafe);
                link.setAttribute('href', `${parsed.pathname}${parsed.search}${parsed.hash}`);
            }
        });
    }

    function applyPlatformNavUpdates() {
        const isInMore = window.location.pathname.includes("/more/");
        const rootPrefix = isInMore ? "../../" : "";
        const domainHref = isInMore
            ? "../domain-name-creator/index.html"
            : "more/domain-name-creator/index.html";
        const productsHref = `${rootPrefix}product.html`;
        const servicesHref = `${rootPrefix}services.html`;
        const mottoHref = `${rootPrefix}more/motto-for-everything/index.html`;
        const nameReportHref = `${rootPrefix}name-report.html`;

        document.querySelectorAll('footer a[href*="services.html#posters"]').forEach(a => {
            a.href = productsHref;
            a.setAttribute('data-en', 'Our Products');
            a.setAttribute('data-hi', 'Our Products');
            a.textContent = 'Our Products';
        });

        document.querySelectorAll('a[href*="name-report"]').forEach(a => {
            a.href = nameReportHref;
        });

        // Rename Motto Generator -> Motto Creator
        document.querySelectorAll('a[href*="motto-for-everything"]').forEach(a => {
            a.setAttribute('data-en', 'Motto Creator');
            a.setAttribute('data-hi', 'Motto Creator');
            if (!a.querySelector('*')) a.textContent = 'Motto Creator';
        });

        // Rename Products -> Our Products
        document.querySelectorAll('a[href$="product.html"]').forEach(a => {
            a.setAttribute('data-en', 'Our Products');
            a.setAttribute('data-hi', 'Our Products');
            if (!a.querySelector('*')) a.textContent = 'Our Products';
        });

        // Hide Plans (pricing)
        document.querySelectorAll('nav a[href$="pricing.html"], nav a[href*="pricing.html"], footer a[href$="pricing.html"]').forEach(a => {
            a.classList.add('nav-hidden');
        });

        // Insert Domain Naming Service + Name Report in dropdowns if missing
        document.querySelectorAll('.dropdown-menu, .mobile-dropdown-menu').forEach(menu => {
            const ensureMenuLink = (href, enText, hiText, insertAfterSelector) => {
                if (menu.querySelector(`a[href="${href}"], a[href*="${href}"]`)) return;

                const li = document.createElement('li');
                const link = document.createElement('a');
                link.href = href;
                link.setAttribute('data-en', enText);
                link.setAttribute('data-hi', hiText);
                link.textContent = enText;
                li.appendChild(link);

                const afterLink = menu.querySelector(insertAfterSelector);
                if (afterLink && afterLink.parentElement) {
                    afterLink.parentElement.insertAdjacentElement('afterend', li);
                } else {
                    menu.appendChild(li);
                }
            };

            ensureMenuLink(domainHref, 'Domain Naming Service', 'Domain Naming Service', 'a[href*="motto-for-everything"]');
            ensureMenuLink(nameReportHref, 'Name Report', 'Name Report', 'a[href*="domain-name-creator"]');
        });

        // Keep "Our Products" outside "More" dropdown (desktop + mobile)
        document.querySelectorAll('.dropdown-menu a[href$="product.html"], .mobile-dropdown-menu a[href$="product.html"]').forEach(a => {
            const li = a.closest('li');
            if (li) li.remove();
        });

        document.querySelectorAll('ul.nav-links.desktop-only').forEach(navList => {
            let topProductsLink = navList.querySelector(':scope > li > a[href$="product.html"]');
            if (!topProductsLink) {
                const li = document.createElement('li');
                const anchor = document.createElement('a');
                anchor.href = productsHref;
                anchor.setAttribute('data-en', 'Our Products');
                anchor.setAttribute('data-hi', 'Our Products');
                anchor.textContent = 'Our Products';
                li.appendChild(anchor);
                const dropdownLi = navList.querySelector(':scope > li.dropdown');
                if (dropdownLi) navList.insertBefore(li, dropdownLi);
                else navList.appendChild(li);
            } else {
                topProductsLink.href = productsHref;
                topProductsLink.setAttribute('data-en', 'Our Products');
                topProductsLink.setAttribute('data-hi', 'Our Products');
                if (!topProductsLink.querySelector('*')) topProductsLink.textContent = 'Our Products';
            }
        });

        document.querySelectorAll('ul.mobile-nav-links').forEach(navList => {
            let topProductsLink = navList.querySelector(':scope > li > a[href$="product.html"]');
            if (!topProductsLink) {
                const li = document.createElement('li');
                const anchor = document.createElement('a');
                anchor.href = productsHref;
                anchor.setAttribute('data-en', 'Our Products');
                anchor.setAttribute('data-hi', 'Our Products');
                anchor.textContent = 'Our Products';
                li.appendChild(anchor);
                const dropdownLi = navList.querySelector(':scope > li.mobile-dropdown');
                if (dropdownLi) navList.insertBefore(li, dropdownLi);
                else navList.appendChild(li);
            } else {
                topProductsLink.href = productsHref;
                topProductsLink.setAttribute('data-en', 'Our Products');
                topProductsLink.setAttribute('data-hi', 'Our Products');
                if (!topProductsLink.querySelector('*')) topProductsLink.textContent = 'Our Products';
            }
        });

        // Update footer services list
        document.querySelectorAll('footer .footer-grid').forEach(grid => {
            const columns = Array.from(grid.children || []);
            const servicesCol = columns.find(col => {
                const h = col.querySelector('h3');
                if (!h) return false;
                const en = (h.getAttribute('data-en') || h.textContent || '').trim().toLowerCase();
                return en === 'our services';
            });
            if (!servicesCol) return;
            servicesCol.querySelectorAll('a').forEach(a => a.remove());

            const links = [
                { href: `${servicesHref}#consultation`, en: 'Name Consultation', hi: 'Name Consultation' },
                { href: `${servicesHref}#brand`, en: 'Brand & Startup Naming', hi: 'Brand & Startup Naming' },
                { href: `${servicesHref}#company`, en: 'Company & Institution Naming', hi: 'Company & Institution Naming' },
                { href: domainHref, en: 'Domain Naming Service', hi: 'Domain Naming Service' },
                { href: mottoHref, en: 'Motto Creator', hi: 'Motto Creator' },
                { href: nameReportHref, en: 'Name Report', hi: 'Name Report' },
                { href: productsHref, en: 'Our Products', hi: 'Our Products' }
            ];
            links.forEach(l => {
                const a = document.createElement('a');
                a.href = l.href;
                a.setAttribute('data-en', l.en);
                a.setAttribute('data-hi', l.hi);
                a.textContent = l.en;
                servicesCol.appendChild(a);
            });
        });
    }

    function setupServicesCardRedirects() {
        const serviceCards = document.querySelectorAll('#services .service-card');
        if (!serviceCards.length) return;

        serviceCards.forEach(card => {
            card.classList.add('service-card-clickable');
            card.setAttribute('role', 'link');
            card.setAttribute('tabindex', '0');

            const serviceTitle = (card.querySelector('h3')?.textContent || card.id || 'Service').trim();
            const redirectToContact = () => {
                const target = `contact.html?service=${encodeURIComponent(serviceTitle)}`;
                window.location.href = target;
            };

            card.addEventListener('click', (event) => {
                if (event.target.closest('a, button, input, select, textarea')) return;
                redirectToContact();
            });

            card.addEventListener('keydown', (event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
                redirectToContact();
            });
        });
    }

    function setupAnimatedCounters() {
        const counters = document.querySelectorAll('[data-counter-target]');
        if (!counters.length) return;
        const formatNumber = (value, format) => {
            if (format === 'indian') return value.toLocaleString('en-IN');
            return value.toLocaleString('en-US');
        };
        const animateCounter = (el) => {
            const target = parseInt(el.dataset.counterTarget, 10) || 0;
            const suffix = el.dataset.counterSuffix || '';
            const format = el.dataset.counterFormat || 'indian';
            const duration = target >= 100000 ? 3800 : 2800;
            const start = performance.now();

            const step = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const value = Math.floor(progress * target);
                el.textContent = `${formatNumber(value, format)}${suffix}`;
                if (progress < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                if (el.dataset.counterDone === 'true') return;
                el.dataset.counterDone = 'true';
                animateCounter(el);
                obs.unobserve(el);
            });
        }, { threshold: 0.4 });

        counters.forEach(counter => observer.observe(counter));
    }

    applyPlatformNavUpdates();
    setupAuthIntentRedirects();
    setupServicesCardRedirects();
    setupAnimatedCounters();

    function namesFileForGender(gender) {
        const lang = getLanguage() === 'hi' ? 'hi' : 'en';
        // return a list of candidate filenames (some files in the repo use slightly different suffixes)
        if (lang === 'hi') {
            return gender === 'Boy'
                ? ['boy_names_hi.json', 'boy_names_hin.json', 'boy_names_hi.json', 'boy_names.json']
                : ['girl_names_hi.json', 'girl_names_hi.json', 'girl_names.json'];
        }
        return gender === 'Boy'
            ? ['boy_names_eng.json', 'boy_names_en.json', 'bnames.json']
            : ['girl_names_eng.json', 'girl_names_en.json', 'gnames.json'];
    }

    async function fetchFirstJson(candidates) {
        if (!Array.isArray(candidates)) candidates = [candidates];
        // Stable version key keeps browser caching effective while still allowing controlled refreshes.
        const cacheBuster = '?v=name-data-20260330d';
        for (const f of candidates) {
            try {
                const res = await fetch(f + cacheBuster);
                if (!res.ok) { console.debug('fetchFirstJson: skip', f, res.status); continue; }
                const j = await res.json();
                console.debug('fetchFirstJson: loaded', f, Array.isArray(j) ? j.length + ' items' : typeof j);
                return { data: j, file: f };
            } catch (err) {
                console.debug('fetchFirstJson: error', f, err);
                continue;
            }
        }
        return null;
    }

    // Expose helper functions for tests
    if (typeof window !== 'undefined') {
        window.namesFileForGender = namesFileForGender;
        window.fetchFirstJson = fetchFirstJson;
        window.getLanguage = getLanguage;
    }

    function updateContent(lang) {
        console.log("Script.js: updateContent called with lang:", lang);

        const WIN1252_REVERSE = {
            8364: 128, 8218: 130, 402: 131, 8222: 132, 8230: 133, 8224: 134, 8225: 135,
            710: 136, 8240: 137, 352: 138, 8249: 139, 338: 140, 381: 142,
            8216: 145, 8217: 146, 8220: 147, 8221: 148, 8226: 149, 8211: 150, 8212: 151,
            732: 152, 8482: 153, 353: 154, 8250: 155, 339: 156, 382: 158, 376: 159
        };

        function normalizeMaybeMojibake(text) {
            if (!text) return text;
            let normalizedText = String(text);

            const quickFixMap = [
                [/©/g, '©'],
                [/’/g, '’'],
                [/‘/g, '‘'],
                [/“/g, '“'],
                [/”/g, '”'],
                [/—/g, '—'],
                [/–/g, '–'],
                [/•/g, '•'],
                [/▼/g, '▼'],
                [/₹/g, '₹']
            ];

            quickFixMap.forEach(([pattern, replacement]) => {
                normalizedText = normalizedText.replace(pattern, replacement);
            });

            // Only attempt decoding for common mojibake markers seen in this repo.
            if (!/(?:[\u00C2\u00C3\u00E2]|\u00E0\u00A4|\u00E0\u00A5)/.test(normalizedText)) return normalizedText;

            try {
                const bytes = new Uint8Array(normalizedText.length);
                for (let i = 0; i < normalizedText.length; i++) {
                    const code = normalizedText.charCodeAt(i);
                    if (code <= 255) {
                        bytes[i] = code;
                        continue;
                    }
                    const mapped = WIN1252_REVERSE[code];
                    if (mapped === undefined) return text;
                    bytes[i] = mapped;
                }

                const decoded = new TextDecoder('utf-8').decode(bytes);

                if (!decoded || decoded === normalizedText) return normalizedText;
                if (decoded.includes('�')) return normalizedText;

                const devanagariCount = (decoded.match(/[\u0900-\u097F]/g) || []).length;
                if (devanagariCount > 0) return decoded;

                // Fix common symbol mojibake like "©" -> "©", "’" -> "’", "▼" -> "▼"
                if (/(?:[\u00C2\u00C3\u00E2])/.test(normalizedText) && !/(?:[\u00C2\u00C3\u00E2])/.test(decoded)) return decoded;

                return normalizedText;
            } catch (_e) {
                return normalizedText;
            }
        }

        function setTextPreserveChildren(el, translated) {
            // If element contains child elements (icons/spans), don't wipe them with textContent.
            const hasElementChildren = Array.from(el.childNodes).some(n => n.nodeType === 1);
            if (!hasElementChildren) {
                el.textContent = translated;
                return;
            }

            let textNode = null;
            for (let i = 0; i < el.childNodes.length; i++) {
                const n = el.childNodes[i];
                if (n.nodeType === 3 && n.nodeValue.trim().length > 0) {
                    textNode = n;
                    break;
                }
            }

            const suffix = translated.endsWith(' ') ? '' : ' ';
            if (textNode) {
                textNode.nodeValue = translated + suffix;
            } else {
                el.insertBefore(document.createTextNode(translated + suffix), el.firstChild);
            }
        }

        function hasPlaceholderQuestionMarks(text) {
            if (!text) return true;
            const trimmed = String(text).trim();
            if (!trimmed) return true;
            if (/^\?+$/.test(trimmed)) return true;
            if (/^\?\s*/.test(trimmed)) return true;
            if (/[\?]{2,}/.test(trimmed)) return true;
            if (/[A-Za-z\u0900-\u097F0-9]\s+\?+\s+[A-Za-z\u0900-\u097F0-9]/.test(trimmed)) return true;
            if (trimmed.includes('�')) return true;
            if (/(?:Ã‚|Ãƒ|Ã¢|Ã|Â|â|à¤|à¥)/.test(trimmed)) return true;
            return false;
        }

        function sanitizeVisibleCopy(text) {
            if (!text) return '';
            return String(text)
                .replace(/\uFFFD+/g, ' - ')
                .replace(/\s*-\s*-\s*/g, ' - ')
                .replace(/^\?\s*/g, '')
                .replace(/[A-Za-z\u0900-\u097F0-9]\s+\?+\s+(?=[A-Za-z\u0900-\u097F0-9])/g, (match) => match.replace(/\s+\?+\s+/, ' '))
                .replace(/\?{2,}/g, '')
                .replace(/\s{2,}/g, ' ')
                .replace(/^-\s+/, '')
                .trim();
        }

        function scrubVisibleQuestionArtifacts() {
            if (!document.body) return;
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
            let node = walker.nextNode();
            while (node) {
                const parentTag = node.parentElement ? node.parentElement.tagName : '';
                if (!['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA'].includes(parentTag)) {
                    const raw = node.nodeValue || '';
                    if (/(?:\uFFFD|©|’|‘|“|”|—|–|•|▼|₹|\?{2,})/.test(raw) || /^\?\s*/.test(raw.trim()) || /[A-Za-z\u0900-\u097F0-9]\s+\?+\s+[A-Za-z\u0900-\u097F0-9]/.test(raw)) {
                        const fixed = sanitizeVisibleCopy(normalizeMaybeMojibake(raw));
                        if (fixed && fixed !== raw.trim()) {
                            node.nodeValue = fixed;
                        }
                    }
                }
                node = walker.nextNode();
            }
        }

        document.documentElement.lang = lang;
        localStorage.setItem("language", lang);
        const translatableElements = document.querySelectorAll("[data-en]");
        translatableElements.forEach(el => {
            const preferredRaw = el.getAttribute(lang === "hi" ? "data-hi" : "data-en");
            const fallbackRaw = el.getAttribute("data-en");
            const normalizedPreferred = sanitizeVisibleCopy(normalizeMaybeMojibake(preferredRaw));
            const normalizedFallback = sanitizeVisibleCopy(normalizeMaybeMojibake(fallbackRaw));
            const useFallback = hasPlaceholderQuestionMarks(normalizedPreferred);
            const shouldUseHindiFallback =
                lang === "hi" &&
                (useFallback || normalizedPreferred === normalizedFallback || hasPlaceholderQuestionMarks(normalizedPreferred));

            let text = useFallback ? normalizedFallback : normalizedPreferred;
            if (shouldUseHindiFallback) {
                text = fallbackHindiCopy(normalizedFallback);
            }
            if (text) {
                if (el.getAttribute('href') && el.getAttribute('href').includes('popular-names')) {
                    console.log("Script.js: Translating Popular Names element to: " + text);
                }
                setTextPreserveChildren(el, text);
            }
        });
        translateLooseTextNodes(lang);
        translateLooseAttributes(lang);
        scrubVisibleQuestionArtifacts();
        repairHindiMojibake();
        enforceAnnouncementBanner();

        [120, 420, 900].forEach((delay) => {
            window.setTimeout(() => {
                if ((document.documentElement.lang || "en") !== lang) return;
                translateLooseTextNodes(lang);
                translateLooseAttributes(lang);
                scrubVisibleQuestionArtifacts();
                repairHindiMojibake();
            }, delay);
        });

        // Dispatch global event for other scripts to react
        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: lang } }));

        const inp = document.getElementById("hero-search-input");
        if (inp) inp.placeholder = lang === "hi" ? "\u0909\u0926\u093e: \u0906\u0930\u0935, \u0905\u0926\u094d\u0935\u093f\u0915..." : "e.g., Aarav, Advik...";

        // If name finder is visible, reload names for currently selected gender so JSON file/language updates instantly
        try {
            const activeGenderBtn = document.querySelector('.gender-btn.active-boy, .gender-btn.active-girl');
            if (activeGenderBtn) {
                // trigger click to reload names using existing handlers
                activeGenderBtn.click();
            }
        } catch (e) {
            console.debug('updateContent: no gender controls yet');
        }
    }

    // Keep full-platform naming navigation; do not apply legacy baby-only overrides.
    const langBtn = document.getElementById("language-toggle");
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            const newLang = getLanguage() === "hi" ? "en" : "hi";
            updateContent(newLang);
        });
    }

    const langBtnMobile = document.getElementById("language-toggle-mobile");
    if (langBtnMobile) {
        langBtnMobile.addEventListener('click', () => {
            const newLang = getLanguage() === "hi" ? "en" : "hi";
            updateContent(newLang);
        });
    }

    snapshotOriginalLanguageState(document.body);
    ensureLanguageMutationObserver();
    repairHindiMojibake();
    updateContent(getLanguage());

    // --- Aura Plan Click Logic ---
    const pricingSection = document.querySelector('.pricing-grid');
    if (pricingSection) {
        pricingSection.addEventListener('click', function (e) {
            const header = e.target.closest('.pricing-card-header');
            if (header) {
                const card = header.closest('.pricing-card');
                if (card) {
                    card.classList.toggle('expanded');
                }
            }
        });
    }

    // Helper: Show Details UI (UPDATED WITH HEART BUTTON)
    function showDetails(box, data) {
        window.showDetails = showDetails;

        if (!box || !data) return;
        const L = data.labels;
        const isFav = favManager.isFavorite(data.name);

        // Determine gender class for pink/purple coloring
        const gender = data.gender || 'Boy';
        const genderClass = gender === 'Girl' ? 'girl-name' : 'boy-name';

        box.innerHTML = `
            <div class="name-details-head">
                <h2 class="${genderClass}">${data.name}</h2>
                <div class="name-details-actions">
                    <button class="pronounce-name-btn" id="pronounce-name-btn" title="Play name pronunciation" aria-label="Play name pronunciation">
                        <i class="fas fa-volume-up"></i>
                    </button>
                    <button class="download-btn" id="download-poster-btn" type="button" title="Download Poster">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="card-heart-btn ${isFav ? 'active' : ''}" id="detail-heart-btn">
                        <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                </div>
            </div>
            <div class="detail-grid" style="text-align: left; margin-top: 20px;">
                <p><strong>${L.meaning}:</strong> ${data.meaning}</p>
                <p><strong>${L.gender}:</strong> ${getLanguage() === 'hi' ? (data.gender === 'Boy' ? 'लड़का' : 'लड़की') : data.gender}</p> 
                <p><strong>${L.origin}:</strong> ${data.origin}</p>
                <hr style="margin: 15px 0; border: 0; border-top: 1px solid #ddd;">
                <h3>${L.vedicTitle}</h3>
                <p><strong>${L.rashi}:</strong> ${data.rashi}</p>
                <p><strong>${L.nakshatra}:</strong> ${data.nakshatra}</p>
                <p><strong>${L.personality}:</strong> ${data.phal}</p>
                <p style="margin-top:10px; background: rgba(0,0,0,0.05); padding:10px; border-radius:8px;">
                    <strong>${L.rashiphalTitle}:</strong><br> ${data.rashiphal}
                </p>
                <hr style="margin: 15px 0; border: 0; border-top: 1px solid #ddd;">
                <h3>${L.numTitle}</h3>
                <p><strong>${L.number}:</strong> ${data.num}</p>
                <p><strong>${L.planet}:</strong> ${data.planet}</p>
                <p><strong>${L.luckyColor}:</strong> ${data.color}</p>
                <p><strong>${L.luckyNos}:</strong> ${data.luckyNumbers}</p>
                <p style="margin-top:10px;">
                    <strong>${L.prediction}:</strong> ${data.numFal}
                </p>
            </div>
        `;

        // --- HEART BUTTON LOGIC ---
        const hb = document.getElementById('detail-heart-btn');
        if (hb) {
            hb.onclick = (e) => {
                e.stopPropagation();
                const added = favManager.toggle(data);
                favManager.save();
                hb.classList.toggle('active', added);
                hb.querySelector('i').className = added ? 'fas fa-heart' : 'far fa-heart';
                renderNames();
            };
        }



        // --- PRONUNCIATION BUTTON LOGIC (NEW) ---
        const pronounceBtn = document.getElementById('pronounce-name-btn');
        if (pronounceBtn) {
            // Check if browser supports speech synthesis
            const speechSupported = 'speechSynthesis' in window;

            if (!speechSupported) {
                // Disable button if not supported
                pronounceBtn.style.opacity = '0.5';
                pronounceBtn.style.cursor = 'not-allowed';
                pronounceBtn.title = 'Pronunciation not supported on this device';
            } else {
                let currentUtterance = null;

                pronounceBtn.onclick = () => {
                    // Cancel any ongoing speech
                    if (currentUtterance) {
                        speechSynthesis.cancel();
                    }

                    // Create new utterance
                    currentUtterance = new SpeechSynthesisUtterance(data.name);

                    // Get best available voice
                    const voices = speechSynthesis.getVoices();
                    const priorities = [
                        (v) => v.lang.includes('en-IN'),  // Indian English
                        (v) => v.lang.includes('en-GB'),  // British English
                        (v) => v.lang.startsWith('en'),   // Any English
                        (v) => v.name.toLowerCase().includes('female'), // Female voice
                        (v) => true  // Any voice
                    ];

                    for (const priorityFn of priorities) {
                        const voice = voices.find(priorityFn);
                        if (voice) {
                            currentUtterance.voice = voice;
                            break;
                        }
                    }

                    // Configure speech settings
                    currentUtterance.rate = 0.85;  // Slightly slower for clarity
                    currentUtterance.pitch = 1.0;  // Natural pitch
                    currentUtterance.volume = 1.0; // Full volume

                    // Add playing class for animation
                    currentUtterance.onstart = () => {
                        pronounceBtn.classList.add('playing');
                    };

                    currentUtterance.onend = () => {
                        pronounceBtn.classList.remove('playing');
                        currentUtterance = null;
                    };

                    currentUtterance.onerror = (event) => {
                        console.error('Speech synthesis error:', event);
                        pronounceBtn.classList.remove('playing');
                        currentUtterance = null;
                    };

                    // Speak the name
                    speechSynthesis.speak(currentUtterance);
                };

                // Keyboard accessibility
                pronounceBtn.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        pronounceBtn.click();
                    }
                });
            }
        }

        // --- POSTER DOWNLOAD LOGIC ---
        const downloadBtn = document.getElementById('download-poster-btn');
        if (downloadBtn) {
            downloadBtn.onclick = async (event) => {
                if (event) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                const activeLang = ((document.documentElement.lang || getLanguage() || 'en') === 'hi') ? 'hi' : 'en';
                const safeName = sanitizeFileToken(data?.name || data?.name_en || "name");
                const baseFilename = `Naamin_${safeName}_Report`;

                const originalHTML = downloadBtn.innerHTML;
                let canvas = null;
                try {
                    // Show loading state
                    downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                    downloadBtn.disabled = true;

                    // Wait for styles/fonts to settle before capture
                    if (document.fonts && document.fonts.ready) {
                        try {
                            await document.fonts.ready;
                        } catch (fontErr) {
                            console.debug('Font readiness check skipped:', fontErr);
                        }
                    }
                    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

                    canvas = createReportCanvas({
                        ...data,
                        year: new Date().getFullYear()
                    });

                    const pdfFilename = `${baseFilename}.pdf`;

                    const jsPDFCtor = await ensureJsPdf();
                    const pdf = new jsPDFCtor({
                        orientation: canvas.width >= canvas.height ? 'landscape' : 'portrait',
                        unit: 'px',
                        format: [canvas.width, canvas.height],
                        compress: true
                    });

                    const imageData = canvas.toDataURL('image/png', 1.0);
                    pdf.addImage(imageData, 'PNG', 0, 0, canvas.width, canvas.height, undefined, 'FAST');

                    let pdfSaved = await savePdfWithFilename(pdf, pdfFilename);
                    if (!pdfSaved) {
                        try {
                            const pdfBlob = pdf.output('blob');
                            pdfSaved = triggerBlobDownload(pdfBlob, pdfFilename);
                        } catch (_blobErr) {
                            pdfSaved = false;
                        }
                    }

                    if (!pdfSaved) {
                        throw new Error('Unable to save PDF file');
                    }

                } catch (error) {
                    console.error('Report generation error:', error);
                    try {
                        if (canvas) {
                            await downloadCanvasAsPng(canvas, baseFilename);
                            return;
                        }
                    } catch (pngFallbackError) {
                        console.error('PNG fallback download failed:', pngFallbackError);
                    }
                    const errorMessage = activeLang === 'hi'
                        ? 'रिपोर्ट डाउनलोड नहीं हो पाई। कृपया दोबारा कोशिश करें।'
                        : 'Failed to download report. Please try again.';
                    alert(errorMessage);
                } finally {
                    downloadBtn.innerHTML = originalHTML;
                    downloadBtn.disabled = false;
                }
            };
        }


    }

    // === SEARCH LOGIC ===
    async function handleHeroSearch() {
        const input = document.getElementById('hero-search-input');
        if (!input || !input.value.trim()) return;
        const term = input.value.trim().toLowerCase();

        const section = document.getElementById('name-finder');
        const detailsBox = document.querySelector('.name-details');
        const listContainer = document.querySelector('.name-list-container');
        const detailsContainer = document.querySelector('.name-details-container');

        if (section) {
            window.scrollTo({ top: section.offsetTop - 100, behavior: 'smooth' });
            if (listContainer) listContainer.style.display = 'none';
            if (detailsContainer) detailsContainer.style.display = 'block';
            if (detailsBox) detailsBox.innerHTML = '<div class="spinner">Searching...</div>';

            try {
                const bCandidates = namesFileForGender('Boy');
                const gCandidates = namesFileForGender('Girl');
                const bLoaded = await fetchFirstJson(bCandidates);
                const gLoaded = await fetchFirstJson(gCandidates);

                const bRaw = bLoaded && bLoaded.data ? bLoaded.data : [];
                const gRaw = gLoaded && gLoaded.data ? gLoaded.data : [];

                const boys = (Array.isArray(bRaw) ? bRaw : Object.values(bRaw).find(v => Array.isArray(v)) || []).map(item => ({ ...item, gender: 'Boy' }));
                const girls = (Array.isArray(gRaw) ? gRaw : Object.values(gRaw).find(v => Array.isArray(v)) || []).map(item => ({ ...item, gender: 'Girl' }));

                const all = [].concat(boys, girls);
                const found = all.find(n => (n.name || n.Name).toLowerCase() === term);

                if (found) {
                    const smartData = engine.processName(found, getLanguage());
                    showDetails(detailsBox, smartData);
                } else {
                    const isHindi = getLanguage() === 'hi';
                    const msg = isHindi
                        ? "जल्दी आ रहा है, कृपया प्रतीक्षा करें, हम आपके धैर्य की सराहना करते हैं।"
                        : "Coming soon, please wait, we appreciate your patience.";

                    detailsBox.innerHTML = `
                        <div style="text-align: center; padding: 40px;">
                            <i class="fas fa-hourglass-half" style="font-size: 3rem; color: var(--accent-primary); margin-bottom: 20px;"></i>
                            <h3 style="color: var(--text-dark);">${isHindi ? "परिणाम नहीं मिला" : "No Result Found"}</h3>
                            <p style="font-size: 1.2rem; color: var(--text-medium); margin-top: 10px;">${msg}</p>
                        </div>
                    `;
                }

            } catch (e) {
                console.error(e);
                detailsBox.innerHTML = "<p>Search error. Please try again.</p>";
            }
        }
    }

    const sBtn = document.getElementById('hero-search-btn');
    const sInp = document.getElementById('hero-search-input');
    if (sBtn) sBtn.onclick = handleHeroSearch;
    if (sInp) sInp.onkeypress = (e) => { if (e.key === "Enter") handleHeroSearch(); };

    // === A-Z LIST LOGIC (UPDATED WITH HEARTS) ===
    const nameFinderSection = document.getElementById('name-finder');
    if (nameFinderSection) {
        const alphabetContainer = document.querySelector('.alphabet-selector');
        const nameListContainer = document.querySelector('.name-list');
        const nameDetailsBox = document.querySelector('.name-details');
        const nameDetailsContainer = document.querySelector('.name-details-container');
        const genderBtns = document.querySelectorAll('.gender-btn');
        const backBtn = document.querySelector('.back-btn');
        const aiPromptInput = document.getElementById('ai-name-prompt');
        const aiCountSelect = document.getElementById('ai-name-count');
        const aiGenerateBtn = document.getElementById('ai-generate-btn');
        const aiStatus = document.getElementById('ai-generate-status');

        let currentGender = "Boy";
        let currentLetter = "A";

        function setAiStatus(message, type = 'info') {
            if (!aiStatus) return;
            aiStatus.textContent = message || '';
            aiStatus.className = 'ai-generate-status';
            if (type === 'success') aiStatus.classList.add('success');
            if (type === 'error') aiStatus.classList.add('error');
        }

        function setActiveAlphabet(letter) {
            if (!/^[A-Z]$/.test(letter)) return;
            currentLetter = letter;
            document.querySelectorAll('.alphabet-btn').forEach((b) => {
                b.classList.toggle('active', b.textContent === letter);
            });
        }

        function normalizeAiNames(list, gender) {
            if (!Array.isArray(list)) return [];
            const unique = new Set();
            return list
                .map((entry) => {
                    if (typeof entry === 'string') return { name: entry };
                    return entry;
                })
                .filter((entry) => entry && typeof entry === 'object')
                .map((entry) => {
                    const name = String(entry.name || '').trim();
                    if (!name || name.length < 2 || name.length > 40) return null;
                    const key = name.toLowerCase();
                    if (unique.has(key)) return null;
                    unique.add(key);
                    return {
                        name: name,
                        meaning: String(entry.meaning || '').trim() || (getLanguage() === 'hi' ? 'AI द्वारा सुझाया गया नाम' : 'AI suggested name'),
                        gender: gender,
                        origin: 'AI Generated'
                    };
                })
                .filter(Boolean);
        }

        function nameApiCandidates() {
            const candidates = ['/api/name-generator'];
            try {
                const host = window.location.hostname || '';
                const isLocalhost = host === 'localhost' || host === '127.0.0.1';
                if (!isLocalhost) {
                    candidates.push('http://127.0.0.1:3000/api/name-generator');
                    candidates.push('http://localhost:3000/api/name-generator');
                }
            } catch (_err) {
                // fallback to default candidate
            }
            return candidates;
        }

        async function requestGeneratedNames(requestBody) {
            const urls = nameApiCandidates();
            let lastError = null;
            for (const url of urls) {
                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(requestBody)
                    });
                    const payload = await response.json().catch(() => ({}));
                    if (response.ok) return payload;
                    lastError = new Error(payload?.error || `HTTP ${response.status}`);
                    if (![404, 405, 501].includes(response.status)) break;
                } catch (err) {
                    lastError = err;
                }
            }
            throw lastError || new Error('API request failed');
        }

        async function handleAiNameGenerate() {
            const isHindi = getLanguage() === 'hi';
            if (!aiPromptInput) return;
            const theme = aiPromptInput.value.trim();
            const count = Math.min(Math.max(parseInt(aiCountSelect?.value || '8', 10) || 8, 3), 20);

            if (!theme) {
                setAiStatus(isHindi ? 'कृपया theme या style लिखें।' : 'Please enter a theme or style.', 'error');
                aiPromptInput.focus();
                return;
            }

            const originalBtnText = aiGenerateBtn ? aiGenerateBtn.textContent : '';
            if (aiGenerateBtn) {
                aiGenerateBtn.disabled = true;
                aiGenerateBtn.textContent = isHindi ? 'Generating...' : 'Generating...';
            }
            setAiStatus(isHindi ? 'AI names generate ho rahe hain...' : 'Generating names with AI...');

            try {
                const payload = await requestGeneratedNames({
                    gender: currentGender,
                    theme: theme,
                    count: count,
                    language: isHindi ? 'hi' : 'en'
                });

                const generated = normalizeAiNames(payload?.names || [], currentGender);
                if (!generated.length) {
                    throw new Error(isHindi ? 'AI response me valid names nahi mile.' : 'No valid names were returned by AI.');
                }

                const existing = new Set((namesData || []).map((item) => String(item?.name || item?.Name || '').toLowerCase()));
                const fresh = generated.filter((item) => !existing.has(item.name.toLowerCase()));
                if (!fresh.length) {
                    setAiStatus(isHindi ? 'Generated names already list me मौजूद हैं।' : 'Generated names are already present in the list.', 'success');
                    return;
                }

                namesData = [...fresh, ...namesData];
                const firstLetter = String(fresh[0].name || 'A').charAt(0).toUpperCase();
                if (/^[A-Z]$/.test(firstLetter)) {
                    setActiveAlphabet(firstLetter);
                }
                renderNames();

                setAiStatus(
                    isHindi
                        ? `${fresh.length} नए names add हो गए (${currentGender}).`
                        : `${fresh.length} new names added for ${currentGender}.`,
                    'success'
                );
            } catch (error) {
                console.error('AI name generation failed:', error);
                const lowerErr = String(error?.message || '').toLowerCase();
                const message = (lowerErr.includes('failed to fetch') || lowerErr.includes('networkerror'))
                    ? (isHindi
                        ? 'API server connect nahi ho pa raha. `npm start` run karke page refresh karein.'
                        : 'API server is unreachable. Run `npm start` and refresh the page.')
                    : (error?.message || (isHindi ? 'Name generation failed.' : 'Name generation failed.'));
                setAiStatus(message, 'error');
            } finally {
                if (aiGenerateBtn) {
                    aiGenerateBtn.disabled = false;
                    aiGenerateBtn.textContent = originalBtnText || 'Generate Names';
                }
            }
        }

        async function loadNames(gender) {
            const candidates = namesFileForGender(gender);
            try {
                if (nameListContainer) nameListContainer.innerHTML = '<div class="spinner">Loading...</div>';
                let loaded = await fetchFirstJson(candidates);

                // FALLBACK IF FETCH FAILS
                if (!loaded || !loaded.data) {
                    console.warn('loadNames: fetch failed, using fallback data');
                    const fallbackKey = gender === 'Boy' ? 'Boy' : 'Girl';
                    loaded = { data: FALLBACK_DATA[fallbackKey], file: 'fallback_builtin' };

                    // Show user notification about offline mode
                    if (!document.getElementById('offline-toast')) {
                        const toast = document.createElement('div');
                        toast.id = 'offline-toast';
                        toast.style.cssText = "position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background:rgba(50,50,50,0.9); color:white; padding:10px 20px; border-radius:30px; z-index:9999; font-size:12px; pointer-events:none; opacity:0; transition:opacity 0.5s;";
                        toast.textContent = "Offline Mode: Using sample names. Run local server for full list.";
                        document.body.appendChild(toast);
                        setTimeout(() => toast.style.opacity = '1', 100);
                        setTimeout(() => toast.style.opacity = '0', 5000);
                    }
                }

                if (!loaded || !loaded.data) {
                    // This should not happen with fallback
                    if (nameListContainer) nameListContainer.innerHTML = `<p>Error loading names.</p>`;
                    namesData = [];
                    renderNames();
                    return;
                }

                let rawData = loaded.data;
                let rawArray = [];
                if (Array.isArray(rawData)) rawArray = rawData;
                else rawArray = Object.values(rawData).find(v => Array.isArray(v)) || [];

                namesData = rawArray.map(item => ({ ...item, gender: gender }));
                console.debug('loadNames: using file', loaded.file, 'items', namesData.length);
                renderNames();
            } catch (error) {
                console.error('loadNames error', error);
                if (nameListContainer) nameListContainer.innerHTML = `<p>Error loading names. See console.</p>`;
            }
        }

        function generateAlphabet() {
            if (!alphabetContainer) return;
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
            alphabetContainer.innerHTML = "";
            chars.forEach(char => {
                const btn = document.createElement("button");
                btn.className = `alphabet-btn ${char === currentLetter ? 'active' : ''}`;
                btn.textContent = char;
                btn.onclick = () => {
                    setActiveAlphabet(char);
                    renderNames();
                };
                alphabetContainer.appendChild(btn);
            });
        }

        // Updated Render Names to include Heart Icon
        function renderNames() {
            if (!nameListContainer) return;
            nameListContainer.innerHTML = "";
            const listSection = document.querySelector('.name-list-container');
            if (listSection) listSection.style.display = 'block';
            if (nameDetailsContainer) nameDetailsContainer.style.display = 'none';

            if (!Array.isArray(namesData)) return;
            console.debug('renderNames: namesData length', namesData.length, 'currentLetter', currentLetter);
            const filtered = namesData.filter(n => {
                let nName = n.name || n.Name;
                if (!nName) return false;
                try { return nName.toUpperCase().startsWith(currentLetter); } catch (e) { return false; }
            });
            console.debug('renderNames: filtered length', filtered.length);

            if (filtered.length === 0) {
                nameListContainer.innerHTML = `<p style="width:100%; text-align:center;">No names found.</p>`;
                return;
            }

            filtered.forEach(person => {
                const pName = person.name || person.Name;
                const isFav = favManager.isFavorite(pName);
                const gender = person.gender || 'Boy';
                const genderClass = gender === 'Girl' ? 'girl-name' : 'boy-name';

                const div = document.createElement("div");
                div.className = `name-item ${genderClass}`;
                // Structure: Name text + Speaker Button + Heart Button
                div.innerHTML = `
                    <span class="${genderClass}">${pName}</span>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <button class="pronounce-name-btn" title="Play name pronunciation" aria-label="Play name pronunciation" data-name="${pName}">
                            <i class="fas fa-volume-up"></i>
                        </button>
                        <button class="card-heart-btn ${isFav ? 'active' : ''}" title="Add to favorites">
                            <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
                        </button>
                    </div>
                `;

                // Card Click -> Open Details (but not if clicking buttons)
                div.onclick = (e) => {
                    if (e.target.closest('button')) return;

                    if (listSection) listSection.style.display = 'none';
                    if (nameDetailsContainer) nameDetailsContainer.style.display = 'block';

                    const smartData = engine.processName(person, getLanguage());
                    showDetails(nameDetailsBox, smartData);
                };

                // Speaker Button Click -> Pronounce Name
                const speakerBtn = div.querySelector('.pronounce-name-btn');
                if (speakerBtn) {
                    speakerBtn.onclick = (e) => {
                        e.stopPropagation();

                        if (!('speechSynthesis' in window)) {
                            alert('Speech synthesis not supported on this browser');
                            return;
                        }

                        // Cancel any ongoing speech
                        speechSynthesis.cancel();

                        // Create utterance
                        const utterance = new SpeechSynthesisUtterance(pName);

                        // Get and set best voice
                        const voices = speechSynthesis.getVoices();
                        const priorities = [
                            (v) => v.lang.includes('en-IN'),
                            (v) => v.lang.includes('en-GB'),
                            (v) => v.lang.startsWith('en'),
                            (v) => v.name.toLowerCase().includes('female'),
                            (v) => true
                        ];

                        for (const priorityFn of priorities) {
                            const voice = voices.find(priorityFn);
                            if (voice) {
                                utterance.voice = voice;
                                break;
                            }
                        }

                        // Configure speech
                        utterance.rate = 0.85;
                        utterance.pitch = 1.0;
                        utterance.volume = 1.0;

                        // Visual feedback
                        utterance.onstart = () => speakerBtn.classList.add('playing');
                        utterance.onend = () => speakerBtn.classList.remove('playing');
                        utterance.onerror = (event) => {
                            console.error('Speech error:', event);
                            speakerBtn.classList.remove('playing');
                        };

                        // Speak!
                        speechSynthesis.speak(utterance);
                    };
                }

                // Heart Click -> Toggle Save
                const heartBtn = div.querySelector('.card-heart-btn');
                heartBtn.onclick = (e) => {
                    e.stopPropagation();
                    const added = favManager.toggle(person);
                    favManager.save();
                    heartBtn.classList.toggle('active', added);
                    heartBtn.querySelector('i').className = added ? 'fas fa-heart' : 'far fa-heart';
                };

                nameListContainer.appendChild(div);
            });
        }

        genderBtns.forEach(btn => {
            btn.onclick = () => {
                // Remove both active classes from all buttons
                genderBtns.forEach(b => {
                    b.classList.remove('active-boy');
                    b.classList.remove('active-girl');
                });

                // Add the appropriate active class based on gender
                currentGender = btn.dataset.gender;
                if (currentGender === 'Girl') {
                    btn.classList.add('active-girl');
                } else {
                    btn.classList.add('active-boy');
                }

                // Save gender selection and apply theme
                GenderTheme.save(currentGender);
                GenderTheme.apply(currentGender);
                setAiStatus('');

                loadNames(currentGender);
            };
        });

        if (backBtn) backBtn.onclick = () => {
            if (nameDetailsContainer) nameDetailsContainer.style.display = 'none';
            const listSection = document.querySelector('.name-list-container');
            if (listSection) listSection.style.display = 'block';
            renderNames(); // Re-render to update hearts if changed inside details
        };

        if (aiGenerateBtn) aiGenerateBtn.onclick = handleAiNameGenerate;
        if (aiPromptInput) {
            aiPromptInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAiNameGenerate();
                }
            });
        }

        generateAlphabet();
        loadNames("Boy");
    }

    // --- FAVORITES MODAL LOGIC ---
    const favBtn = document.getElementById('fav-view-btn');
    const favOverlay = document.getElementById('fav-overlay');
    const closeFavBtn = document.getElementById('close-fav-btn');
    const clearFavBtn = document.getElementById('clear-fav-btn');
    const favListContainer = document.getElementById('fav-list-container');

    const shortlistHub = document.getElementById('shortlist-hub');
    const hubShortlist = document.getElementById('hub-shortlist');
    const hubEmpty = document.getElementById('hub-empty');
    const hubCopyBtn = document.getElementById('hub-copy-btn');
    const hubShareBtn = document.getElementById('hub-share-btn');
    const hubClearBtn = document.getElementById('hub-clear-btn');
    const hubTopPicksBtn = document.getElementById('hub-top-picks-btn');
    const hubCompareBtn = document.getElementById('hub-compare-btn');

    function isHubVisible() {
        if (!shortlistHub) return false;
        try {
            return window.getComputedStyle(shortlistHub).display !== 'none';
        } catch (e) {
            return true;
        }
    }

    function openFavoriteDetails(item) {
        if (favOverlay) favOverlay.style.display = 'none';

        const section = document.getElementById('name-finder');
        const listSection = document.querySelector('.name-list-container');
        const nameDetailsBox = document.querySelector('.name-details');
        const nameDetailsContainer = document.querySelector('.name-details-container');

        if (section) {
            window.scrollTo({ top: section.offsetTop - 100, behavior: 'smooth' });
            if (listSection) listSection.style.display = 'none';
            if (nameDetailsContainer) nameDetailsContainer.style.display = 'block';
            try {
                const smartData = engine.processName(item, getLanguage());
                showDetails(nameDetailsBox, smartData);
            } catch (e) { }
        }
    }

    if (favBtn) {
        favBtn.addEventListener('click', () => {
            if (isHubVisible()) {
                shortlistHub.scrollIntoView({ behavior: 'smooth', block: 'start' });
                return;
            }
            if (favOverlay) {
                favOverlay.style.display = 'flex';
                renderFavoritesList();
                return;
            }

            const onWishlistPage = /(^|\/)wishlist\.html$/i.test(window.location.pathname || '');
            if (onWishlistPage) {
                const target = document.getElementById('wishlist-section') || document.querySelector('main');
                if (target && typeof target.scrollIntoView === 'function') {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                return;
            }

            window.location.href = 'wishlist.html';
        });
    }

    // If the in-page overlay exists we keep its handlers for backward compatibility
    if (favOverlay) {
        if (closeFavBtn) closeFavBtn.onclick = () => { favOverlay.style.display = 'none'; };
        favOverlay.onclick = (e) => { if (e.target === favOverlay) favOverlay.style.display = 'none'; };
        if (clearFavBtn) clearFavBtn.onclick = () => {
            if (confirm("Are you sure you want to clear all favorites?")) {
                favManager.clear();
                renderFavoritesList();
                renderNames();
            }
        };
    }

    function renderFavoritesList() {
        if (!favListContainer) return;
        favListContainer.innerHTML = "";
        const list = favManager.favorites;
        const favFooter = clearFavBtn ? clearFavBtn.closest('.fav-footer') : null;

        if (list.length === 0) {
            if (clearFavBtn) clearFavBtn.style.display = 'none';
            if (favFooter) favFooter.style.display = 'none';
            favListContainer.innerHTML = '<p style="text-align:center; color:var(--text-medium);">No names saved yet.</p>';
            return;
        }

        if (clearFavBtn) clearFavBtn.style.display = 'inline-flex';
        if (favFooter) favFooter.style.display = 'block';

        list.forEach(item => {
            const name = item.name || item.Name;
            const row = document.createElement('div');
            row.className = 'fav-item-row';
            row.innerHTML = `
                <span>${name}</span>
                <button class="fav-remove-btn"><i class="fas fa-trash"></i></button>
            `;

            // Remove item
            row.querySelector('.fav-remove-btn').onclick = (e) => {
                e.stopPropagation();
                favManager.toggle(item);
                favManager.save();
                renderFavoritesList(); // Re-render this list
                renderNames(); // Update background list
            };

            // Click to view details
            row.onclick = () => {
                openFavoriteDetails(item);
            };

            favListContainer.appendChild(row);
        });
    }

    // Product wishlist panel removed (site-wide heart = saved baby-name shortlist).

    function setBtnFeedback(btn, text, ms = 1100) {
        if (!btn) return;
        const original = btn.textContent;
        btn.textContent = text;
        setTimeout(() => { btn.textContent = original; }, ms);
    }

    async function copyText(text) {
        if (!text) return false;
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (e) {
            try {
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.setAttribute('readonly', 'true');
                ta.style.position = 'fixed';
                ta.style.top = '-1000px';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                ta.remove();
                return true;
            } catch (err) {
                return false;
            }
        }
    }

    function favoriteNamesText() {
        return (favManager.favorites || [])
            .map(item => (item && typeof item === 'object') ? (item.name || item.Name) : String(item))
            .filter(Boolean)
            .join('\n');
    }

    function renderShortlistHub() {
        if (!hubShortlist || !hubEmpty) return;
        hubShortlist.innerHTML = '';

        const list = favManager.favorites || [];
        hubEmpty.style.display = list.length ? 'none' : 'block';

        list.slice().reverse().forEach(item => {
            const name = (item && typeof item === 'object') ? (item.name || item.Name) : String(item);
            const row = document.createElement('div');
            row.className = 'hub-item';

            const label = document.createElement('div');
            label.className = 'hub-item-name';
            label.textContent = name;

            const actions = document.createElement('div');
            actions.className = 'hub-item-actions';

            const removeBtn = document.createElement('button');
            removeBtn.className = 'hub-item-btn';
            removeBtn.textContent = 'Remove';
            removeBtn.onclick = (e) => {
                e.stopPropagation();
                favManager.toggle(item);
                favManager.save();
                renderNames();
            };

            const openBtn = document.createElement('button');
            openBtn.className = 'hub-item-btn';
            openBtn.textContent = 'Open';
            openBtn.onclick = (e) => {
                e.stopPropagation();
                openFavoriteDetails(item);
            };

            actions.appendChild(removeBtn);
            actions.appendChild(openBtn);

            row.appendChild(label);
            row.appendChild(actions);
            row.onclick = () => openFavoriteDetails(item);

            hubShortlist.appendChild(row);
        });
    }

    if (hubCopyBtn) {
        hubCopyBtn.addEventListener('click', async () => {
            setBtnFeedback(hubCopyBtn, 'Copying…', 1200);
            const ok = await copyText(favoriteNamesText());
            setBtnFeedback(hubCopyBtn, ok ? 'Copied' : 'Failed', 1100);
        });
    }

    if (hubShareBtn) {
        hubShareBtn.addEventListener('click', async () => {
            const text = favoriteNamesText().replace(/\n/g, ', ');
            if (!text) {
                setBtnFeedback(hubShareBtn, 'Empty', 900);
                return;
            }
            if (navigator.share) {
                try {
                    await navigator.share({ title: 'Naamin Shortlist', text });
                    setBtnFeedback(hubShareBtn, 'Shared', 1100);
                    return;
                } catch (e) { }
            }
            const ok = await copyText(text);
            setBtnFeedback(hubShareBtn, ok ? 'Copied' : 'Failed', 1100);
        });
    }

    if (hubClearBtn) {
        hubClearBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to clear all favorites?")) {
                favManager.clear();
                renderNames();
            }
        });
    }

    if (hubTopPicksBtn) {
        hubTopPicksBtn.addEventListener('click', () => {
            const section = document.getElementById('name-finder');
            if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    if (hubCompareBtn) {
        hubCompareBtn.addEventListener('click', () => {
            window.location.href = 'wishlist.html';
        });
    }

    document.addEventListener('favoritesUpdated', () => {
        renderShortlistHub();
        if (favOverlay && favOverlay.style.display !== 'none') {
            renderFavoritesList();
        }
    });

    renderShortlistHub();

    // --- NAAMIN TYPING ANIMATION (GUARANTEED LOOP) ---
    const typeNaam = document.getElementById("type-naam");
    const typeIn = document.getElementById("type-in");

    if (typeNaam && typeIn) {
        const text1 = "Naam";
        const text2 = "in";
        const typeSpeed = 200;
        const delayBeforeRestart = 2000; // 2 seconds wait

        const runAnimation = () => {
            typeNaam.textContent = "";
            typeIn.textContent = "";

            let i = 0;
            let j = 0;

            const step = () => {
                if (i < text1.length) {
                    typeNaam.textContent += text1.charAt(i);
                    i++;
                    setTimeout(step, typeSpeed);
                }
                else if (j < text2.length) {
                    typeIn.textContent += text2.charAt(j);
                    j++;
                    setTimeout(step, typeSpeed);
                }
                else {
                    setTimeout(runAnimation, delayBeforeRestart);
                }
            };
            step();
        };
        runAnimation();
    }
});
/* ======================================================
   SLIDESHOW FUNCTIONALITY
   ====================================================== */
document.addEventListener('DOMContentLoaded', function () {
    const slideshowContainer = document.querySelector('.slideshow-container');
    if (!slideshowContainer) return;

    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slide-dots .dot');
    const prevBtn = document.querySelector('.slide-prev');
    const nextBtn = document.querySelector('.slide-next');
    if (!slides.length || !dots.length) return;

    let currentSlide = 0;
    let autoplayInterval;
    const autoplayDelay = 2000; // 2 seconds

    function showSlide(n) {
        if (n >= slides.length) currentSlide = 0;
        if (n < 0) currentSlide = slides.length - 1;

        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Add active class to current slide and dot
        if (slides[currentSlide]) slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        currentSlide++;
        showSlide(currentSlide);
        resetAutoplay();
    }

    function prevSlide() {
        currentSlide--;
        showSlide(currentSlide);
        resetAutoplay();
    }

    function goToSlide(n) {
        currentSlide = n;
        showSlide(currentSlide);
        resetAutoplay();
    }

    function autoplay() {
        nextSlide();
    }

    function startAutoplay() {
        autoplayInterval = setInterval(autoplay, autoplayDelay);
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    // Event listeners for navigation buttons
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });

    // Pause autoplay on hover
    slideshowContainer.addEventListener('mouseenter', stopAutoplay);
    slideshowContainer.addEventListener('mouseleave', startAutoplay);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
    // Start autoplay on page load
    startAutoplay();
    showSlide(currentSlide);
});

/* ======================================================
   BABY SHOWCASE CAROUSEL FUNCTIONALITY
   ====================================================== */
document.addEventListener('DOMContentLoaded', function () {
    const babyCarousel = document.querySelector('.baby-carousel');
    if (!babyCarousel) return;

    const babyCards = document.querySelectorAll('.baby-card');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dotsContainer = document.querySelector('.carousel-dots');
    if (!babyCards.length || !dotsContainer) return;

    let currentIndex = 0;
    let autoplayInterval;
    const autoplayDelay = 4000; // 4 seconds
    let touchStartX = 0;
    let touchEndX = 0;

    // Create dots
    babyCards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.carousel-dot');

    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function scrollToCard(index) {
        if (!babyCards[0]) return;
        const cardWidth = babyCards[0].offsetWidth;
        const gap = 30;
        const scrollPosition = (cardWidth + gap) * index;
        babyCarousel.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        currentIndex = index;
        updateDots();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % babyCards.length;
        scrollToCard(currentIndex);
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + babyCards.length) % babyCards.length;
        scrollToCard(currentIndex);
    }

    function goToSlide(index) {
        scrollToCard(index);
        resetAutoplay();
    }

    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, autoplayDelay);
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    // Navigation buttons
    if (prevBtn) prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoplay();
    });

    if (nextBtn) nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoplay();
    });

    // Touch swipe support
    babyCarousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    babyCarousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next
                nextSlide();
            } else {
                // Swipe right - prev
                prevSlide();
            }
            resetAutoplay();
        }
    }

    // Pause on hover (desktop)
    babyCarousel.addEventListener('mouseenter', stopAutoplay);
    babyCarousel.addEventListener('mouseleave', startAutoplay);

    // Start autoplay
    startAutoplay();

    // Update language content
    const updateBabyCarouselLanguage = () => {
        const lang = getLanguage();
        const sectionTitle = document.querySelector('#baby-showcase h2');
        const sectionSubtitle = document.querySelector('#baby-showcase .section-subtitle');
        const pickText = (element) => {
            if (!element) return '';
            const preferred = element.getAttribute(lang === 'hi' ? 'data-hi' : 'data-en') || '';
            const fallback = element.getAttribute('data-en') || '';
            const normalizedPreferred = String(preferred).replace(/\uFFFD+/g, ' - ').replace(/\s{2,}/g, ' ').trim();
            const normalizedFallback = String(fallback).replace(/\uFFFD+/g, ' - ').replace(/\s{2,}/g, ' ').trim();
            const looksBroken = !normalizedPreferred || /^\?+$/.test(normalizedPreferred) || /[\?]{2,}/.test(normalizedPreferred) || normalizedPreferred.includes('�') || /(?:Ã‚|Ãƒ|Ã¢|Ã|Â|â|à¤|à¥)/.test(normalizedPreferred);
            if (lang === 'hi' && (looksBroken || normalizedPreferred === normalizedFallback)) {
                return fallbackHindiCopy(normalizedFallback);
            }
            return looksBroken ? normalizedFallback : normalizedPreferred;
        };

        if (sectionTitle) {
            sectionTitle.textContent = pickText(sectionTitle);
        }

        if (sectionSubtitle) {
            sectionSubtitle.textContent = pickText(sectionSubtitle);
        }
    };

    // Initial language update
updateBabyCarouselLanguage();
});

// === TESTIMONIAL ROTATION (HOMEPAGE) ===
(function () {
    const grid = document.querySelector('.testimonial-grid[data-rotate]');
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll('.testimonial-card'));
    if (cards.length < 2) return;

    let current = 0;
    const rotate = () => {
        cards[current].classList.remove('active');
        current = (current + 1) % cards.length;
        cards[current].classList.add('active');
    };

    setInterval(rotate, 5000);
})();

// === HERO MODALS (SEARCH & REPORT) ===
(function() {
    // Search Modal
    const searchModalOverlay = document.getElementById('search-modal-overlay');
    const openSearchBtn = document.getElementById('open-search-modal-btn');
    const closeSearchBtn = document.getElementById('close-search-modal');
    const modalSearchInput = document.getElementById('modal-name-search');
    const modalSearchBtn = document.getElementById('modal-search-btn');
    const modalSearchResults = document.getElementById('modal-search-results');
    const modalGenderBtns = document.querySelectorAll('.modal-gender-btn');
    
    // Report Modal
    const reportModalOverlay = document.getElementById('report-modal-overlay');
    const openReportBtn = document.getElementById('open-report-modal-btn');
    const closeReportBtn = document.getElementById('close-report-modal');
    const reportNameInput = document.getElementById('report-name-input');
    const reportDobInput = document.getElementById('report-dob-input');
    const generateReportBtn = document.getElementById('modal-generate-report-btn');

    let selectedGender = 'all';
    let cachedNames = { boy: [], girl: [] };

    // Helper: Open Modal
    function openModal(overlay) {
        if (!overlay) return;
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Focus first input
        const input = overlay.querySelector('input');
        if (input) setTimeout(() => input.focus(), 100);
    }

    // Helper: Close Modal
    function closeModal(overlay) {
        if (!overlay) return;
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Load names for search
    async function loadNamesForSearch() {
        if (cachedNames.boy.length > 0) return;
        try {
            const [boyRes, girlRes] = await Promise.all([
                fetch('boy_names_eng.json'),
                fetch('girl_names_eng.json')
            ]);
            cachedNames.boy = await boyRes.json();
            cachedNames.girl = await girlRes.json();
        } catch (e) {
            console.error('Failed to load names for search modal:', e);
        }
    }

    // Search names
    function searchNames(query) {
        if (!query || query.length < 1) {
            if (modalSearchResults) modalSearchResults.innerHTML = '';
            return;
        }

        const q = query.toLowerCase();
        let results = [];

        if (selectedGender === 'all' || selectedGender === 'Boy') {
            results = results.concat(
                cachedNames.boy
                    .filter(n => n.name.toLowerCase().includes(q))
                    .slice(0, 5)
                    .map(n => ({ ...n, gender: 'Boy' }))
            );
        }
        if (selectedGender === 'all' || selectedGender === 'Girl') {
            results = results.concat(
                cachedNames.girl
                    .filter(n => n.name.toLowerCase().includes(q))
                    .slice(0, 5)
                    .map(n => ({ ...n, gender: 'Girl' }))
            );
        }

        results = results.slice(0, 8);

        if (modalSearchResults) {
            if (results.length === 0) {
                modalSearchResults.innerHTML = '<p style="text-align:center;color:#666;padding:20px;">No names found. Try a different search.</p>';
            } else {
                modalSearchResults.innerHTML = results.map(n => `
                    <div class="modal-result-item" data-name="${n.name}" data-gender="${n.gender}">
                        <div>
                            <div class="modal-result-name">${n.name}</div>
                            <div class="modal-result-meaning">${n.meaning || 'Beautiful name'}</div>
                        </div>
                        <span style="font-size:0.8rem;color:#999;">${n.gender}</span>
                    </div>
                `).join('');

                // Click to navigate
                modalSearchResults.querySelectorAll('.modal-result-item').forEach(item => {
                    item.addEventListener('click', () => {
                        const gender = item.dataset.gender;
                        window.location.href = `popular-names.html?gender=${gender}&search=${item.dataset.name}`;
                    });
                });
            }
        }
    }

    // Wire up search modal
    if (openSearchBtn && searchModalOverlay) {
        openSearchBtn.addEventListener('click', () => {
            loadNamesForSearch();
            openModal(searchModalOverlay);
        });
    }

    if (closeSearchBtn && searchModalOverlay) {
        closeSearchBtn.addEventListener('click', () => closeModal(searchModalOverlay));
    }

    if (searchModalOverlay) {
        searchModalOverlay.addEventListener('click', (e) => {
            if (e.target === searchModalOverlay) closeModal(searchModalOverlay);
        });
    }

    if (modalSearchInput) {
        let debounceTimer;
        modalSearchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => searchNames(modalSearchInput.value.trim()), 200);
        });
        modalSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchNames(modalSearchInput.value.trim());
        });
    }

    if (modalSearchBtn) {
        modalSearchBtn.addEventListener('click', () => {
            if (modalSearchInput) searchNames(modalSearchInput.value.trim());
        });
    }

    modalGenderBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modalGenderBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedGender = btn.dataset.gender;
            if (modalSearchInput && modalSearchInput.value.trim()) {
                searchNames(modalSearchInput.value.trim());
            }
        });
    });

    // Wire up report modal
    if (openReportBtn && reportModalOverlay) {
        openReportBtn.addEventListener('click', () => openModal(reportModalOverlay));
    }

    if (closeReportBtn && reportModalOverlay) {
        closeReportBtn.addEventListener('click', () => closeModal(reportModalOverlay));
    }

    if (reportModalOverlay) {
        reportModalOverlay.addEventListener('click', (e) => {
            if (e.target === reportModalOverlay) closeModal(reportModalOverlay);
        });
    }

    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', () => {
            const name = reportNameInput ? reportNameInput.value.trim() : '';
            const dob = reportDobInput ? reportDobInput.value : '';
            
            if (!name) {
                alert('Please enter a name');
                return;
            }
            
            // Navigate to name-report page with query params
            let url = `name-report.html?name=${encodeURIComponent(name)}`;
            if (dob) url += `&dob=${encodeURIComponent(dob)}`;
            window.location.href = url;
        });
    }

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (searchModalOverlay && searchModalOverlay.classList.contains('active')) {
                closeModal(searchModalOverlay);
            }
            if (reportModalOverlay && reportModalOverlay.classList.contains('active')) {
                closeModal(reportModalOverlay);
            }
        }
    });
})();
