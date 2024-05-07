// Global variables
const translations = {
    en: {
        greet: "Hello",
        intro: "Welcome to our website"
    },
    fr: {
        greet: "Bonjour",
        intro: "Bienvenue sur notre site web"
    },
    pl:{
        greet: "Cześć",
        intro: "Witaj na naszej stronie internetowej"
    }
};

const language = "fr"; // "en", "fr" or "pl"
const greeting = "greet";
const introduction = "intro";

// LOCALIZE FUNCTION
function localize(...keys) {
    const selectedLanguage = language || 'en';
    const selectedTranslations = translations[selectedLanguage];

    const localizedStrings = keys.map(key => {
        return selectedLanguage && selectedTranslations ? selectedTranslations[key] : key;
    });
    return localizedStrings.join('');
}


module.exports = {localize};

// Test
const localizedGreeting = localize`${greeting}`;
const localizedIntroduction = localize`${introduction}`;

console.log(localizedGreeting); 
console.log(localizedIntroduction); 