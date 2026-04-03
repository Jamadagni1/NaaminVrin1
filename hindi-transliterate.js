// Universal English to Hindi Transliteration
function getHindiName(englishName) {
    // Simple phonetic transliteration mapping
    const map = {
        'a': 'अ', 'aa': 'आ', 'i': 'इ', 'ee': 'ई', 'u': 'उ', 'oo': 'ऊ',
        'e': 'ए', 'ai': 'ऐ', 'o': 'ओ', 'au': 'औ',
        'k': 'क', 'kh': 'ख', 'g': 'ग', 'gh': 'घ',
        'ch': 'च', 'chh': 'छ', 'j': 'ज', 'jh': 'झ',
        't': 'ट', 'th': 'ठ', 'd': 'ड', 'dh': 'ढ',
        'n': 'न', 'p': 'प', 'ph': 'फ', 'b': 'ब', 'bh': 'भ',
        'm': 'म', 'y': 'य', 'r': 'र', 'l': 'ल', 'v': 'व', 'w': 'व',
        's': 'स', 'sh': 'श', 'h': 'ह', 'z': 'ज़',
        // Compound syllables
        'ka': 'का', 'ki': 'कि', 'ku': 'कु', 'ke': 'के', 'ko': 'को',
        'ga': 'गा', 'gi': 'गि', 'gu': 'गु', 'ge': 'गे', 'go': 'गो',
        'ja': 'जा', 'ji': 'जि', 'ju': 'जु', 'je': 'जे', 'jo': 'जो',
        'ta': 'टा', 'ti': 'टि', 'tu': 'टु', 'te': 'टे', 'to': 'टो',
        'da': 'डा', 'di': 'डि', 'du': 'डु', 'de': 'डे', 'do': 'डो',
        'na': 'ना', 'ni': 'नि', 'nu': 'नु', 'ne': 'ने', 'no': 'नो',
        'pa': 'पा', 'pi': 'पि', 'pu': 'पु', 'pe': 'पे', 'po': 'पो',
        'ba': 'बा', 'bi': 'बि', 'bu': 'बु', 'be': 'बे', 'bo': 'बो',
        'ma': 'मा', 'mi': 'मि', 'mu': 'मु', 'me': 'मे', 'mo': 'मो',
        'ya': 'या', 'yi': 'यि', 'yu': '	यु', 'ye': 'ये', 'yo': 'यो',
        'ra': 'रा', 'ri': 'रि', 'ru': 'रु', 're': 'रे', 'ro': 'रो',
        'la': 'ला', 'li': 'लि', 'lu': 'लु', 'le': 'ले', 'lo': 'लो',
        'va': 'वा', 'vi': 'वि', 'vu': 'वु', 've': 'वे', 'vo': 'वो',
        'sa': 'सा', 'si': 'सि', 'su': 'सु', 'se': 'से', 'so': 'सो',
        'ha': 'हा', 'hi': 'हि', 'hu': 'हु', 'he': 'हे', 'ho': 'हो',
        'sha': 'शा', 'shi': 'शि', 'shu': 'शु', 'she': 'शे', 'sho': 'शो'
    };

    let name = englishName.toLowerCase();
    let hindi = '';
    let i = 0;

    while (i < name.length) {
        let matched = false;
        // Try 3-char, then 2-char, then 1-char matches
        for (let len = 3; len >= 1; len--) {
            const sub = name.substring(i, i + len);
            if (map[sub]) {
                hindi += map[sub];
                i += len;
                matched = true;
                break;
            }
        }
        if (!matched) {
            i++; // Skip unmatched characters
        }
    }

    return hindi || englishName; // Fallback to English if transliteration fails
}
