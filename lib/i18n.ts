import type { Lang, VoterState, JourneyStepId } from "./types"

/**
 * Public list of supported UI languages.
 * - `code`  — stable ISO 639-1 identifier used in storage / HTML `lang`
 * - `label` — English label shown in dev tools + meta
 * - `native` — endonym shown to end users
 * - `aiName` — canonical name sent to Gemini to lock output language
 * - `dir`   — text direction (all current languages are LTR)
 */
export const LANGUAGES: ReadonlyArray<{
  code: Lang
  label: string
  native: string
  aiName: string
  dir: "ltr" | "rtl"
}> = [
  { code: "en", label: "English", native: "English", aiName: "English", dir: "ltr" },
  { code: "hi", label: "Hindi", native: "हिन्दी", aiName: "Hindi (हिन्दी)", dir: "ltr" },
  { code: "mr", label: "Marathi", native: "मराठी", aiName: "Marathi (मराठी)", dir: "ltr" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી", aiName: "Gujarati (ગુજરાતી)", dir: "ltr" },
  { code: "ta", label: "Tamil", native: "தமிழ்", aiName: "Tamil (தமிழ்)", dir: "ltr" },
  { code: "te", label: "Telugu", native: "తెలుగు", aiName: "Telugu (తెలుగు)", dir: "ltr" },
  { code: "bn", label: "Bengali", native: "বাংলা", aiName: "Bengali (বাংলা)", dir: "ltr" },
] as const

export const DEFAULT_LANG: Lang = "en"

/** Narrow string → Lang at runtime (for reading untrusted localStorage). */
export function isLang(value: unknown): value is Lang {
  return typeof value === "string" && LANGUAGES.some((l) => l.code === value)
}

type Dict = Record<string, string>

// ---------------------------------------------------------------------------
// English master dictionary.
// This is also the fallback — every key *must* exist here. Other locales
// may be partial; missing keys fall back to English automatically.
// ---------------------------------------------------------------------------
const en: Dict = {
  // Nav
  "nav.features": "Features",
  "nav.journey": "The journey",
  "nav.faq": "FAQ",
  "nav.openDashboard": "Open dashboard",
  "nav.getStarted": "Get started",
  "nav.home": "Home",

  // Hero
  "hero.badge": "Powered by Gemini · Aligned with the Election Commission",
  "hero.titleA": "Your vote,",
  "hero.titleItalic": "unhurried",
  "hero.titleB": "and understood.",
  "hero.subtitle":
    "Matdaan is a smart, adaptive companion for first-time voters in India. Tell us a little about yourself and we'll walk you through eligibility, registration, and voting day — step by step.",
  "hero.cta.start": "Start my journey",
  "hero.cta.learn": "See how it works",
  "hero.stat.steps": "Steps",
  "hero.stat.languages": "Languages",
  "hero.stat.bias": "Bias",
  "hero.stat.bias.value": "None",
  "hero.preview.live": "Live preview",
  "hero.preview.status": "Status",
  "hero.preview.statusValue": "Eligible — ready to register",
  "hero.preview.stepOf": "Step 1 of 4",
  "hero.preview.check1": "Eligibility confirmed",
  "hero.preview.check2": "Register (Form 6)",
  "hero.preview.check3": "Verify Voter ID",
  "hero.preview.check4": "Cast your vote",
  "hero.preview.says": "Matdaan says",
  "hero.preview.quote":
    "You turn 18 this year — file **Form 6** on the NVSP portal to be added to the electoral roll. Takes about 10 minutes.",

  // Features
  "features.eyebrow": "What you get",
  "features.title": "A quiet, capable companion for a loud democracy.",
  "features.intro":
    "Designed for first-time voters who want a trustworthy, jargon-free path from curiosity to the polling booth.",
  "features.adaptive.title": "Adaptive guidance",
  "features.adaptive.body":
    "Tell us your age and registration status — we'll surface exactly the step you need next, nothing more.",
  "features.journey.title": "Four-step journey",
  "features.journey.body":
    "Eligibility, registration, verification, and polling day — each with clear actions and official links.",
  "features.chat.title": "Gemini chatbot",
  "features.chat.body":
    "Ask in your language. Answers are grounded in ECI guidelines and your personal context.",
  "features.private.title": "Private by default",
  "features.private.body":
    "We never ask for Aadhaar, OTPs, or passwords. Your details stay on your device unless you say otherwise.",

  // Journey (landing)
  "journey.landingEyebrow": "The journey",
  "journey.landingTitleA": "Four steps.",
  "journey.landingTitleB": "One vote.",
  "journey.landingIntro":
    "Matdaan unlocks each step as you progress. No scrolling through PDFs, no guessing which form is current — just the next right action.",
  "journey.landingCta": "Begin the first step",
  "journey.landing.s1.title": "Eligibility",
  "journey.landing.s1.body":
    "We check your age and state on the qualifying date. If you turn 18 this year, you can pre-enrol.",
  "journey.landing.s2.title": "Registration",
  "journey.landing.s2.body":
    "Guided Form 6 walkthrough with the exact documents you'll need — Aadhaar, address proof, and a photo.",
  "journey.landing.s3.title": "Verification",
  "journey.landing.s3.body":
    "Locate your name on the electoral roll, download your EPIC, and confirm your polling booth.",
  "journey.landing.s4.title": "Voting day",
  "journey.landing.s4.body":
    "A checklist for what to carry, where to go, and what to expect inside the booth.",

  // FAQ
  "faq.eyebrow": "FAQ",
  "faq.title": "Questions, answered.",
  "faq.intro": "Everything a first-time voter typically asks before registering.",
  "faq.q1": "Is Matdaan affiliated with the Election Commission?",
  "faq.a1":
    "No. Matdaan is an independent civic tool. All guidance is sourced from and links back to the official ECI and National Voter Services Portal.",
  "faq.q2": "Do I need to sign up or share personal details?",
  "faq.a2":
    "No account is required. Onboarding asks for your age, state, and voter status only to personalise guidance. This data stays on your device.",
  "faq.q3": "Can I use this if I'm not 18 yet?",
  "faq.a3":
    "Yes. If you turn 18 this year, you can pre-enrol once the electoral rolls open in your state. Matdaan explains exactly when and how.",
  "faq.q4": "Does the chatbot answer in my language?",
  "faq.a4":
    "Yes. The Gemini-powered assistant replies in whichever Indian language you choose from the switcher. Technical terms like EPIC and Form 6 stay in their standard form.",
  "faq.q5": "What if I already have a Voter ID?",
  "faq.a5":
    "You'll skip ahead to verification and polling-day prep. Matdaan adapts to your state and only shows steps you actually need.",

  // CTA
  "cta.eyebrow": "Ready when you are",
  "cta.titleA": "Your democracy,",
  "cta.titleB": "made effortless.",
  "cta.body":
    "Two questions, one dashboard, zero political noise. Take the first step in the next few minutes.",
  "cta.primary": "Start my journey",
  "cta.secondary": "I've already started",

  // Footer
  "footer.tagline":
    "An independent, civic-minded assistant that walks first-time voters through the Indian election process — from eligibility to ballot — in plain language.",
  "footer.disclaimer":
    "Information sourced from the Election Commission of India and the National Voter Services Portal. Not affiliated with any political party.",
  "footer.explore": "Explore",
  "footer.begin": "Begin onboarding",
  "footer.openDashboard": "Open dashboard",
  "footer.faq": "FAQ",
  "footer.official": "Official resources",
  "footer.eciPortal": "Voter Services Portal",
  "footer.eci": "Election Commission of India",
  "footer.nvsp": "National Voter Portal",
  "footer.rights": "© {year} Matdaan. Built with care for first-time voters.",

  // Language switcher
  "lang.switcher": "Language",
  "lang.changed": "Language updated",
  "lang.ariaLabel": "Change language",

  // Dashboard
  "dashboard.welcome": "Welcome back",
  "dashboard.hello": "Hello",
  "dashboard.editProfile": "Edit profile",
  "dashboard.reset": "Clear & restart",
  "dashboard.ageOf": "Age",
  "dashboard.state": "State",
  "dashboard.epic": "EPIC",
  "dashboard.epic.issued": "Issued",
  "dashboard.epic.pending": "Pending",
  "dashboard.overallProgress": "Overall progress",
  "dashboard.celebrate": "Celebrate",
  "dashboard.openMenu": "Open account menu",
  "dashboard.skipToMain": "Skip to main content",

  // Journey (dashboard)
  "journey.eyebrow": "Your journey",
  "journey.title": "Four steps to your vote",
  "journey.voterIn": "Voter in",
  "journey.status.completed": "Completed",
  "journey.status.current": "Current",
  "journey.status.locked": "Locked",
  "journey.status.ready": "Ready",

  // Steps
  "step.eligibility.title": "Check Eligibility",
  "step.eligibility.subtitle": "Confirm you meet the criteria set by the Election Commission.",
  "step.registration.title": "Register as a Voter",
  "step.registration.subtitle": "Apply via Form 6 on the National Voter Services Portal.",
  "step.verification.title": "Verify Voter ID",
  "step.verification.subtitle": "Locate your name in the electoral roll and download your EPIC.",
  "step.voting.title": "Cast Your Vote",
  "step.voting.subtitle": "Find your polling booth and prepare for voting day.",

  // Step guide
  "guide.step": "Step",
  "guide.inProgress": "In progress",
  "guide.available": "Available",
  "guide.checklist": "Checklist",
  "guide.resources": "Resources",
  "guide.markComplete": "Mark complete",
  "guide.completedPill": "Completed",
  "guide.lockedHint": "Finish the previous step to unlock this one.",
  "guide.toast.title": "Step marked complete",

  // Timeline
  "timeline.eyebrow": "Election timeline",
  "timeline.title": "Key stages at a glance",
  "timeline.past": "Passed",
  "timeline.active": "Active now",
  "timeline.upcoming": "Upcoming",

  // Chat
  "chat.heading": "Ask Matdaan",
  "chat.subtitle": "Gemini · tailored to your state",
  "chat.thinking": "Thinking",
  "chat.online": "Online",
  "chat.emptyGreet": "how can I help?",
  "chat.emptyBody":
    "Ask me about eligibility, Form 6, your EPIC, or what to expect on polling day. I'll tailor every answer to your state and status.",
  "chat.tryAsking": "Try asking",
  "chat.placeholder": "Ask about Form 6, EPIC, or voting day...",
  "chat.error": "I couldn't reach the assistant. Please try again in a moment.",
  "chat.rateLimited": "You're sending messages too quickly. Please wait a few seconds.",
  "chat.send": "Send message",
  "chat.input": "Message",

  // Celebration
  "celebration.eyebrow": "Voter Champion",
  "celebration.title": "You did it,",
  "celebration.subtitle":
    "Your voice is officially part of the world's largest democracy.",
  "celebration.stat1": "Steps completed",
  "celebration.stat2": "Days of guidance",
  "celebration.stat3": "Your state",
  "celebration.download": "Download certificate",
  "celebration.share": "Share your achievement",
  "celebration.close": "Back to dashboard",
  "celebration.shareText":
    "I just completed my voter journey on Matdaan. Ready for polling day!",

  // Polling station finder (Google Maps)
  "polling.eyebrow": "Google Maps",
  "polling.title": "Find your polling station",
  "polling.subtitle":
    "Search nearby booths using Google Maps. For your official assigned booth, verify on the ECI portal with your EPIC number.",
  "polling.queryLabel": "Area, city, or pincode",
  "polling.queryPlaceholder": "e.g. Andheri West, Mumbai 400058",
  "polling.search": "Search on map",
  "polling.openMaps": "Open in Google Maps",
  "polling.openEci": "Verify on ECI portal",
  "polling.hint":
    "Tip: Polling booths are assigned per constituency. Matdaan uses Google Maps to show nearby locations only.",
}

// ---------------------------------------------------------------------------
// Hindi
// ---------------------------------------------------------------------------
const hi: Dict = {
  "nav.features": "सुविधाएँ",
  "nav.journey": "यात्रा",
  "nav.faq": "सामान्य प्रश्न",
  "nav.openDashboard": "डैशबोर्ड खोलें",
  "nav.getStarted": "शुरू करें",
  "nav.home": "होम",

  "hero.badge": "Gemini द्वारा संचालित · चुनाव आयोग के अनुरूप",
  "hero.titleA": "आपका वोट,",
  "hero.titleItalic": "सहजता से",
  "hero.titleB": "और पूरी समझ के साथ।",
  "hero.subtitle":
    "मतदान पहली बार वोट देने वालों के लिए एक स्मार्ट साथी है। हमें थोड़ा अपने बारे में बताएं — हम आपको पात्रता, पंजीकरण और मतदान दिवस तक कदम-दर-कदम ले जाएंगे।",
  "hero.cta.start": "मेरी यात्रा शुरू करें",
  "hero.cta.learn": "यह कैसे काम करता है",
  "hero.stat.steps": "चरण",
  "hero.stat.languages": "भाषाएँ",
  "hero.stat.bias": "पक्षपात",
  "hero.stat.bias.value": "शून्य",
  "hero.preview.live": "लाइव पूर्वावलोकन",
  "hero.preview.status": "स्थिति",
  "hero.preview.statusValue": "पात्र — पंजीकरण के लिए तैयार",
  "hero.preview.stepOf": "चरण 1 / 4",
  "hero.preview.check1": "पात्रता पुष्ट",
  "hero.preview.check2": "पंजीकरण (फॉर्म 6)",
  "hero.preview.check3": "वोटर ID सत्यापन",
  "hero.preview.check4": "अपना वोट डालें",
  "hero.preview.says": "मतदान कहता है",
  "hero.preview.quote":
    "आप इस साल 18 के हो रहे हैं — NVSP पोर्टल पर **फॉर्म 6** भरकर मतदाता सूची में जुड़ें। केवल 10 मिनट लगते हैं।",

  "features.eyebrow": "आपको क्या मिलता है",
  "features.title": "एक शांत, सक्षम साथी — जोर-शोर भरे लोकतंत्र में।",
  "features.intro":
    "पहली बार वोट देने वालों के लिए — बिना तकनीकी शब्दों के, भरोसेमंद और सीधा रास्ता।",
  "features.adaptive.title": "आपके लिए अनुकूल",
  "features.adaptive.body":
    "अपनी उम्र और पंजीकरण स्थिति बताएं — हम ठीक वही अगला कदम दिखाएंगे, बस उतना ही।",
  "features.journey.title": "चार-चरण यात्रा",
  "features.journey.body":
    "पात्रता, पंजीकरण, सत्यापन और मतदान दिवस — हर चरण में स्पष्ट कार्य और आधिकारिक लिंक।",
  "features.chat.title": "Gemini चैटबॉट",
  "features.chat.body":
    "अपनी भाषा में पूछें। उत्तर ECI दिशानिर्देशों और आपके संदर्भ पर आधारित होते हैं।",
  "features.private.title": "ग��पनीय डिफ़ॉल्ट रूप से",
  "features.private.body":
    "हम कभी भी आधार, OTP या पासवर्ड नहीं मांगते। आपकी जानकारी आपके डिवाइस पर ही रहती है।",

  "journey.landingEyebrow": "यात्रा",
  "journey.landingTitleA": "चार चरण।",
  "journey.landingTitleB": "एक वोट।",
  "journey.landingIntro":
    "मतदान आपकी प्रगति के साथ हर चरण खोलता है। न PDF में भटकना, न सही फॉर्म की तलाश — बस अगला सही कदम।",
  "journey.landingCta": "पहला कदम उठाएं",
  "journey.landing.s1.title": "पात्रता",
  "journey.landing.s1.body":
    "योग्यता तिथि पर आपकी उम्र और राज्य की जांच। इस साल 18 हो रहे हैं तो पूर्व-पंजीकरण संभव है।",
  "journey.landing.s2.title": "पंजीकरण",
  "journey.landing.s2.body":
    "फॉर्म 6 की मार्गदर्शित प्रक्रिया — आधार, पता प्रमाण और फोटो के साथ।",
  "journey.landing.s3.title": "सत्यापन",
  "journey.landing.s3.body":
    "मतदाता सूची में अपना नाम खोजें, EPIC डाउनलोड करें और बूथ की पुष्टि करें।",
  "journey.landing.s4.title": "मतदान दिवस",
  "journey.landing.s4.body":
    "क्या साथ ले जाएँ, कहाँ जाएँ और बूथ में क्या अपेक्षित है — पूरी चेकलिस्ट।",

  "faq.eyebrow": "सामान्य प्रश्न",
  "faq.title": "सवाल, जवाब।",
  "faq.intro": "पंजीकरण से पहले नए मतदाता जो आमतौर पर पूछते हैं।",
  "faq.q1": "क्या मतदान चुनाव आयोग से संबद्ध है?",
  "faq.a1":
    "नहीं। मतदान एक स्वतंत्र नागरिक उपकरण है। सभी जानकारी आधिकारिक ECI और NVSP से ली गई है।",
  "faq.q2": "क्या मुझे साइन अप करना होगा?",
  "faq.a2":
    "कोई खाता आवश्यक नहीं। उम्र, राज्य और स्थिति केवल मार्गदर्शन को अनुकूलित करने के लिए पूछी जाती है। डेटा आपके डिवाइस पर रहता है।",
  "faq.q3": "अगर मैं अभी 18 का नहीं हूँ?",
  "faq.a3":
    "कोई बात नहीं। यदि आप इस साल 18 के हो रहे हैं, तो मतदाता सूची खुलते ही पूर्व-पंजीकरण किया जा सकता है। मतदान आपको समय पर बताएगा।",
  "faq.q4": "क्या चैटबॉट मेरी भाषा में उत्तर देता है?",
  "faq.a4":
    "हाँ। Gemini सहायक आपकी चुनी गई भारतीय भाषा में उत्तर देता है। EPIC और फॉर्म 6 जैसे तकनीकी शब्द अपने मूल रूप में रहते हैं।",
  "faq.q5": "अगर मेरे पास पहले से वोटर ID है?",
  "faq.a5":
    "तो आप सीधे सत्यापन और मतदान दिवस की तैयारी पर पहुँच जाएंगे। मतदान केवल वही कदम दिखाता है जो आपको चाहिए।",

  "cta.eyebrow": "जब आप तैयार हों",
  "cta.titleA": "आपका लोकतंत्र,",
  "cta.titleB": "सरल बनाया गया।",
  "cta.body":
    "दो सवाल, एक डैशबोर्ड, कोई राजनीतिक शोर नहीं। अगले कुछ मिनटों में पहला कदम उठाएं।",
  "cta.primary": "मेरी यात्रा शुरू करें",
  "cta.secondary": "मैं पहले से शुरू कर चुका हूँ",

  "footer.tagline":
    "एक स्वतंत्र, नागरिक-केंद्रित सहायक जो नए मतदाताओं को पात्रता से मतदान तक सरल भाषा में मार्गदर्शन देता है।",
  "footer.disclaimer":
    "जानकारी भारत के चुनाव आयोग और NVSP से ली गई है। किसी भी राजनीतिक दल से संबद्ध नहीं।",
  "footer.explore": "खोजें",
  "footer.begin": "ऑनबोर्डिंग शुरू करें",
  "footer.openDashboard": "डैशबोर्ड खोलें",
  "footer.faq": "सामान्य प्रश्न",
  "footer.official": "आधिकारिक संसाधन",
  "footer.eciPortal": "मतदाता सेवा पोर्टल",
  "footer.eci": "भारत का चुनाव आयोग",
  "footer.nvsp": "राष्ट्रीय मतदाता पोर्टल",
  "footer.rights": "© {year} मतदान। नए मतदाताओं के लिए ध्यान से बनाया गया।",

  "lang.switcher": "भाषा",
  "lang.changed": "भाषा बदल दी गई",
  "lang.ariaLabel": "भाषा बदलें",

  "dashboard.welcome": "वापसी पर स्वागत है",
  "dashboard.hello": "नमस्ते",
  "dashboard.editProfile": "प्रोफ़ाइल संपादित करें",
  "dashboard.reset": "साफ़ करें और पुनः आरंभ करें",
  "dashboard.ageOf": "उम्र",
  "dashboard.state": "राज्य",
  "dashboard.epic": "EPIC",
  "dashboard.epic.issued": "जारी",
  "dashboard.epic.pending": "प्रतीक्षित",
  "dashboard.overallProgress": "कुल प्रगति",
  "dashboard.celebrate": "जश्न मनाएं",
  "dashboard.openMenu": "खाता मेनू खोलें",
  "dashboard.skipToMain": "मुख्य सामग्री पर जाएं",

  "journey.eyebrow": "आपकी यात्रा",
  "journey.title": "आपके वोट तक चार कदम",
  "journey.voterIn": "मतदाता —",
  "journey.status.completed": "पूर्ण",
  "journey.status.current": "वर्तमान",
  "journey.status.locked": "बंद",
  "journey.status.ready": "तैयार",

  "step.eligibility.title": "पात्रता जांचें",
  "step.eligibility.subtitle": "पुष्टि करें कि आप चुनाव आयोग के मानदंड पूरे करते हैं।",
  "step.registration.title": "मतदाता पंजीकरण",
  "step.registration.subtitle": "NVSP पर फॉर्म 6 के माध्यम से आवेदन करें।",
  "step.verification.title": "वोटर आईडी सत्यापन",
  "step.verification.subtitle": "मतदाता सूची में अपना नाम खोजें और EPIC डाउनलोड करें।",
  "step.voting.title": "अपना वोट डालें",
  "step.voting.subtitle": "अपना मतदान बूथ खोजें और मतदान दिवस की तैयारी करें।",

  "guide.step": "चरण",
  "guide.inProgress": "प्रगति पर",
  "guide.available": "उपलब्ध",
  "guide.checklist": "सूची",
  "guide.resources": "संसाधन",
  "guide.markComplete": "पूर्ण चिह्नित करें",
  "guide.completedPill": "पूर्ण",
  "guide.lockedHint": "इसे खोलने के लिए पिछला चरण पूरा करें।",
  "guide.toast.title": "चरण पूर्ण के रूप में चिह्नित",

  "timeline.eyebrow": "चुनाव कार्यक्रम",
  "timeline.title": "एक नज़र में मुख्य चरण",
  "timeline.past": "बीता",
  "timeline.active": "अभी सक्रिय",
  "timeline.upcoming": "आगामी",

  "chat.heading": "मतदान से पूछें",
  "chat.subtitle": "Gemini · आपके राज्य के लिए अनुकूलित",
  "chat.thinking": "सोच रहा है",
  "chat.online": "ऑनलाइन",
  "chat.emptyGreet": "मैं कैसे मदद करूं?",
  "chat.emptyBody":
    "पात्रता, फॉर्म 6, अपने EPIC, या मतदान दिवस के बारे में पूछें। मैं आपके राज्य और स्थिति के अनुसार उत्तर दूंगा।",
  "chat.tryAsking": "यह पूछें",
  "chat.placeholder": "फॉर्म 6, EPIC, या मतदान दिवस के बारे में पूछें...",
  "chat.error": "सहायक तक पहुँच नहीं पाया। कृपया थोड़ी देर में फिर प्रयास करें।",
  "chat.rateLimited": "आप बहुत तेज़ी से संदेश भेज रहे हैं। कृपया कुछ सेकंड रुकें।",
  "chat.send": "संदेश भेजें",
  "chat.input": "संदेश",

  "celebration.eyebrow": "मतदाता चैंपियन",
  "celebration.title": "आपने यह कर दिखाया,",
  "celebration.subtitle":
    "आपकी आवाज़ अब दुनिया के सबसे बड़े लोकतंत्र का हिस्सा है।",
  "celebration.stat1": "चरण पूरे",
  "celebration.stat2": "दिनों का मार्गदर्शन",
  "celebration.stat3": "आपका राज्य",
  "celebration.download": "प्रमाणपत्र डाउनलोड करें",
  "celebration.share": "अपनी उपलब्धि साझा करें",
  "celebration.close": "डैशबोर्ड पर लौटें",
  "celebration.shareText":
    "मैंने मतदान पर अपनी मतदाता यात्रा पूरी कर ली है। मतदान दिवस के लिए तैयार!",
}

// ---------------------------------------------------------------------------
// Marathi
// ---------------------------------------------------------------------------
const mr: Dict = {
  "nav.features": "वैशिष्ट्ये",
  "nav.journey": "प्रवास",
  "nav.faq": "प्रश्न",
  "nav.openDashboard": "डॅशबोर्ड उघडा",
  "nav.getStarted": "सुरू करा",
  "nav.home": "मुख्यपृष्ठ",

  "hero.badge": "Gemini द्वारे चालित · निवडणूक आयोगाशी सुसंगत",
  "hero.titleA": "तुमचं मत,",
  "hero.titleItalic": "शांत",
  "hero.titleB": "आणि समजून घेतलेलं.",
  "hero.subtitle":
    "मतदान हा भारतातील प्रथम मतदारांसाठी एक स्मार्ट साथीदार आहे. थोडंसं स्वतःबद्दल सांगा — आम्ही तुम्हाला पात्रता, नोंदणी आणि मतदान दिवसापर्यंत प्रत्येक टप्प्यावर मार्गदर्शन करू.",
  "hero.cta.start": "माझा प्रवास सुरू करा",
  "hero.cta.learn": "हे कसे काम करते",
  "hero.stat.steps": "पायऱ्या",
  "hero.stat.languages": "भाषा",
  "hero.stat.bias": "पक्षपात",
  "hero.stat.bias.value": "शून्य",
  "hero.preview.live": "लाइव्ह पूर्वावलोकन",
  "hero.preview.status": "स्थिती",
  "hero.preview.statusValue": "पात्र — नोंदणीसाठी तयार",
  "hero.preview.stepOf": "पायरी 1 / 4",
  "hero.preview.check1": "पात्रता पुष्टी",
  "hero.preview.check2": "नोंदणी (फॉर्म 6)",
  "hero.preview.check3": "मतदार ओळखपत्र",
  "hero.preview.check4": "तुमचे मत द्या",
  "hero.preview.says": "मतदान सांगते",
  "hero.preview.quote":
    "तुम्ही यावर्षी 18 होत आहात — NVSP वर **फॉर्म 6** भरून मतदार यादीत या. फक्त 10 मिनिटे.",

  "features.eyebrow": "तुम्हाला काय मिळते",
  "features.title": "गोंगाटी लोकशाहीत एक शांत, सक्षम साथीदार.",
  "features.intro":
    "प्रथम मतदारांसाठी — विश्वासार्ह, स्पष्ट आणि सोप्या भाषेत.",
  "features.adaptive.title": "अनुकूल मार्गदर्शन",
  "features.adaptive.body":
    "तुमचे वय आणि नोंदणी स्थिती सांगा — आम्ही नेमकी पुढची पायरी दाखवू, आवश्यकतेपेक्षा जास्त नाही.",
  "features.journey.title": "चार-पायरी प्रवास",
  "features.journey.body":
    "पात्रता, नोंदणी, पडताळा, मतदान दिवस — प्रत्येकासाठी स्पष्ट कृती आणि अधिकृत दुवे.",
  "features.chat.title": "Gemini चॅटबॉट",
  "features.chat.body":
    "तुमच्या भाषेत विचारा. उत्तरे ECI मार्गदर्शक तत्त्वांवर आणि तुमच्या संदर्भावर आधारित.",
  "features.private.title": "डिफॉल्टने खाजगी",
  "features.private.body":
    "आम्ही कधीही आधार, OTP किंवा पासवर्ड मागत नाही. तुमची माहिती तुमच्या डिव्हाइसवरच राहते.",

  "journey.landingEyebrow": "प्रवास",
  "journey.landingTitleA": "चार पायऱ्या.",
  "journey.landingTitleB": "एक मत.",
  "journey.landingIntro":
    "प्रत्येक पायरी तुमच्या प्रगतीसह उघडते. PDF मध्ये शोधाशोध नाही — फक्त पुढची योग्य कृती.",
  "journey.landingCta": "पहिली पायरी घ्या",
  "journey.landing.s1.title": "पात्रता",
  "journey.landing.s1.body":
    "पात्रता तारखेला तुमचे वय आणि राज्य तपासू. यावर्षी 18 होत असल्यास पूर्व-नोंदणी शक्य.",
  "journey.landing.s2.title": "नोंदणी",
  "journey.landing.s2.body":
    "फॉर्म 6 चे मार्गदर्शित पाऊल — आधार, पत्ता पुरावा आणि फोटोसह.",
  "journey.landing.s3.title": "पडताळा",
  "journey.landing.s3.body":
    "मतदार यादीत नाव शोधा, EPIC डाउनलोड करा, बूथची पुष्टी करा.",
  "journey.landing.s4.title": "मतदान दिवस",
  "journey.landing.s4.body":
    "काय न्यायचं, कुठ�� जायचं आणि बूथमध्ये काय अपेक्षित — संपूर्ण चेकलिस्ट.",

  "faq.eyebrow": "प्रश्न",
  "faq.title": "उत्तरे.",
  "faq.intro": "नोंदणीपूर्वी प्रथम मतदार सहसा विचारतात त्या प्रश्नांची उत्तरे.",
  "faq.q1": "मतदान निवडणूक आयोगाशी संलग्न आहे का?",
  "faq.a1":
    "नाही. मतदान हे एक स्वतंत्र नागरी साधन आहे. सर्व मार्गदर्शन अधिकृत ECI आणि NVSP कडून घेतले आहे.",
  "faq.q2": "मला खाते तयार करावे लागेल का?",
  "faq.a2":
    "खाते आवश्यक नाही. वय, राज्य आणि स्थिती फक्त मार्गदर्शन अनुकूलित करण्यासाठी. डेटा तुमच्या डिव्हाइसवर राहतो.",
  "faq.q3": "मी अजून 18 चा नसेल तर?",
  "faq.a3":
    "हरकत नाही. यावर्षी 18 होणार असाल तर राज्यातील मतदार यादी उघडताच पूर्व-नोंदणी करता येते.",
  "faq.q4": "चॅटबॉट माझ्या भाषेत उत्तर देतो का?",
  "faq.a4":
    "हो. Gemini सहाय्यक तुम्ही निवडलेल्या भारतीय भाषेत उत्तर देतो. EPIC, फॉर्म 6 सारखे तांत्रिक शब्द मूळ स्वरूपात राहतात.",
  "faq.q5": "माझ्याकडे आधीच व्होटर ID असेल तर?",
  "faq.a5":
    "तुम्ही थेट पडताळा आणि मतदान दिवसाच्या तयारीकडे जाल. मतदान फक्त आवश्यक पायऱ्या दाखवते.",

  "cta.eyebrow": "तुम्ही तयार असाल तेव्हा",
  "cta.titleA": "तुमची लोकशाही,",
  "cta.titleB": "सोपी केली.",
  "cta.body":
    "दोन प्रश्न, एक डॅशबोर्ड, कोणताही राजकीय गोंगाट नाही. पुढच्या काही मिनिटांत पहिलं पाऊल.",
  "cta.primary": "माझा प्रवास सुरू करा",
  "cta.secondary": "मी आधीच सुरू केले आहे",

  "footer.tagline":
    "एक स्वतंत्र, नागरिक-केंद्रित सहाय्यक जो प्रथम मतदारांना पात्रतेपासून मतदानापर्यंत सोप्या भाषेत मार्गदर्शन करतो.",
  "footer.disclaimer":
    "माहिती भारतीय निवडणूक आयोग आणि NVSP कडून. कोणत्याही राजकीय पक्षाशी संबंधित नाही.",
  "footer.explore": "एक्सप्लोर",
  "footer.begin": "ऑनबोर्डिंग सुरू करा",
  "footer.openDashboard": "डॅशबोर्ड उघडा",
  "footer.faq": "प्रश्न",
  "footer.official": "अधिकृत स्रोत",
  "footer.eciPortal": "मतदार सेवा पोर्टल",
  "footer.eci": "भारतीय निवडणूक आयोग",
  "footer.nvsp": "राष्ट्रीय मतदार पोर्टल",
  "footer.rights": "© {year} मतदान. प्रथम मतदारांसाठी काळजीपूर्वक बनवले.",

  "lang.switcher": "भाषा",
  "lang.changed": "भाषा बदलली",
  "lang.ariaLabel": "भाषा बदला",

  "dashboard.welcome": "पुन्हा स्वागत आहे",
  "dashboard.hello": "नमस्कार",
  "dashboard.editProfile": "प्रोफाइल संपादित करा",
  "dashboard.reset": "साफ करा आणि पुन्हा सुरू करा",
  "dashboard.ageOf": "वय",
  "dashboard.state": "राज्य",
  "dashboard.epic": "EPIC",
  "dashboard.epic.issued": "जारी",
  "dashboard.epic.pending": "प्रलंबित",
  "dashboard.overallProgress": "एकूण प्रगती",
  "dashboard.celebrate": "साजरे करा",
  "dashboard.openMenu": "खाते मेनू उघडा",
  "dashboard.skipToMain": "मुख्य सामग्रीवर जा",

  "journey.eyebrow": "तुमचा प्रवास",
  "journey.title": "तुमच्या मतदानापर्यंत चार पावले",
  "journey.voterIn": "मतदार —",
  "journey.status.completed": "पूर्ण",
  "journey.status.current": "सध्या",
  "journey.status.locked": "बंद",
  "journey.status.ready": "तयार",

  "step.eligibility.title": "पात्रता तपासा",
  "step.eligibility.subtitle": "निवडणूक आयोगाच्या निकषांची पुष्टी करा.",
  "step.registration.title": "मतदार नोंदणी",
  "step.registration.subtitle": "NVSP वर फॉर्म 6 द्वारे अर्ज करा.",
  "step.verification.title": "मतदार ओळखपत्र पडताळा",
  "step.verification.subtitle": "मतदार यादीत नाव शोधा आणि EPIC डाउनलोड करा.",
  "step.voting.title": "आपले मत द्या",
  "step.voting.subtitle": "मतदान केंद्र शोधा आणि मतदान दिवसाची तयारी करा.",

  "guide.step": "पायरी",
  "guide.inProgress": "चालू",
  "guide.available": "उपलब्ध",
  "guide.checklist": "यादी",
  "guide.resources": "संसाधने",
  "guide.markComplete": "पूर्ण म्हणून चिन्हांकित करा",
  "guide.completedPill": "पूर्ण",
  "guide.lockedHint": "ही पायरी अनलॉक करण्यासाठी मागील पायरी पूर्ण करा.",
  "guide.toast.title": "पायरी पूर्ण म्हणून चिन्हांकित",

  "timeline.eyebrow": "निवडणूक कालरेखा",
  "timeline.title": "एका दृष्टीक्षेपात महत्त्वाचे टप्पे",
  "timeline.past": "पूर्ण",
  "timeline.active": "सध्या सुरू",
  "timeline.upcoming": "आगामी",

  "chat.heading": "मतदानला विचारा",
  "chat.subtitle": "Gemini · तुमच्या राज्यासाठी अनुकूलित",
  "chat.thinking": "विचार करत आहे",
  "chat.online": "ऑनलाइन",
  "chat.emptyGreet": "मी कशी मदत करू?",
  "chat.emptyBody":
    "पात्रता, फॉर्म 6, तुमचा EPIC किंवा मतदान दिवसाबद्दल विचारा. तुमच्या राज्यानुसार उत्तर देईन.",
  "chat.tryAsking": "हे विचारा",
  "chat.placeholder": "फॉर्म 6, EPIC किंवा मतदानाबद्दल विचारा...",
  "chat.error": "सहाय्यकाशी संपर्क होऊ शकला नाही. थोड्या वेळाने पुन्हा प्रयत्न करा.",
  "chat.rateLimited": "तुम्ही खूप लवकर संदेश पाठवत आहात. काही सेकंद थांबा.",
  "chat.send": "संदेश पाठवा",
  "chat.input": "संदेश",

  "celebration.eyebrow": "मतदार चॅम्पियन",
  "celebration.title": "तुम्ही केलेत,",
  "celebration.subtitle":
    "तुमचा आवाज आता जगातील सर्वात मोठ्या लोकशाहीचा भाग आहे.",
  "celebration.stat1": "पूर्ण पायऱ्या",
  "celebration.stat2": "मार्गदर्शनाचे दिवस",
  "celebration.stat3": "तुमचे राज्य",
  "celebration.download": "प्रमाणपत्र डाउनलोड करा",
  "celebration.share": "तुमचे यश सामायिक करा",
  "celebration.close": "डॅशबोर्डवर परत",
  "celebration.shareText":
    "मी मतदानवर माझा मतदार प्रवास पूर्ण केला. मतदान दिवसासाठी तयार!",
}

// ---------------------------------------------------------------------------
// Gujarati (NEW)
// ---------------------------------------------------------------------------
const gu: Dict = {
  "nav.features": "વિશેષતાઓ",
  "nav.journey": "યાત્રા",
  "nav.faq": "પ્રશ્નો",
  "nav.openDashboard": "ડેશબોર્ડ ખોલો",
  "nav.getStarted": "શરૂ કરો",
  "nav.home": "મુખ્યપૃષ્ઠ",

  "hero.badge": "Gemini દ્વારા સંચાલિત · ચૂંટણી પંચ સાથે અનુરૂપ",
  "hero.titleA": "તમારો મત,",
  "hero.titleItalic": "શાંત",
  "hero.titleB": "અને સમજી શકાય તેવો.",
  "hero.subtitle":
    "મતદાન ભારતના પ્રથમ મતદારો માટેનો સ્માર્ટ સાથી છે. થોડીક તમારા વિશે માહિતી આપો — અમે તમને યોગ્યતા, નોંધણી અને મતદાન દિવસ સુધી દરેક પગલે માર્ગદર્શન આપીશું.",
  "hero.cta.start": "મારી યાત્રા શરૂ કરો",
  "hero.cta.learn": "આ કેવી રીતે કાર્ય કરે છે",
  "hero.stat.steps": "પગલાં",
  "hero.stat.languages": "ભાષાઓ",
  "hero.stat.bias": "પક્ષપાત",
  "hero.stat.bias.value": "શૂન્ય",
  "hero.preview.live": "લાઇવ પૂર્વાવલોકન",
  "hero.preview.status": "સ્થિતિ",
  "hero.preview.statusValue": "યોગ્ય — નોંધણી માટે તૈયાર",
  "hero.preview.stepOf": "પગલું 1 / 4",
  "hero.preview.check1": "યોગ્યતા પુષ્ટિ",
  "hero.preview.check2": "નોંધણી (ફોર્મ 6)",
  "hero.preview.check3": "મતદાર ID ચકાસણી",
  "hero.preview.check4": "તમારો મત આપો",
  "hero.preview.says": "મતદાન કહે છે",
  "hero.preview.quote":
    "તમે આ વર્ષે 18 થઈ રહ્યા છો — NVSP પોર્ટલ પર **ફોર્મ 6** ભરીને મતદાર યાદીમાં જોડાઓ. ફક્ત 10 મિનિટ.",

  "features.eyebrow": "તમને શું મળે છે",
  "features.title": "ઘોંઘાટભરી લોકશાહીમાં એક શાંત, સક્ષમ સાથી.",
  "features.intro":
    "પ્રથમ મતદારો માટે — વિશ્વસનીય, સ્પષ્ટ અને સરળ ભાષામાં માર્ગદર્શન.",
  "features.adaptive.title": "અનુકૂલિત માર્ગદર્શન",
  "features.adaptive.body":
    "તમારી ઉંમર અને નોંધણી સ્થિતિ જણાવો — અમે બરાબર આગલું પગલું બતાવીશું, એથી વધુ નહીં.",
  "features.journey.title": "ચાર-પગલાંની યાત્રા",
  "features.journey.body":
    "યોગ્યતા, નોંધણી, ચકાસણી અને મતદાન દિવસ — દરેક માટે સ્પષ્ટ ક્રિયાઓ અને સત્તાવાર લિંક્સ.",
  "features.chat.title": "Gemini ચેટબોટ",
  "features.chat.body":
    "તમારી ભાષામાં પૂછો. જવાબો ECI માર્ગદર્શિકા અને તમારા સંદર્ભ પર આધારિત.",
  "features.private.title": "ડિફોલ્ટ રીતે ખાનગી",
  "features.private.body":
    "અમે ક્યારેય આધાર, OTP કે પાસવર્ડ માગતા નથી. તમારી માહિતી તમારા ડિવાઇસ પર જ રહે છે.",

  "journey.landingEyebrow": "યાત્રા",
  "journey.landingTitleA": "ચાર પગલાં.",
  "journey.landingTitleB": "એક મત.",
  "journey.landingIntro":
    "મતદાન દરેક પગલું તમારી પ્રગતિ સાથે ખોલે છે. PDF માં શોધવાનું નહીં — ફક્ત આગલું સાચું પગલું.",
  "journey.landingCta": "પહેલું પગલું લો",
  "journey.landing.s1.title": "યોગ્યતા",
  "journey.landing.s1.body":
    "યોગ્યતા તારીખે તમારી ઉંમર અને રાજ્યની તપાસ. આ વર્ષે 18 થતા હો તો પૂર્વ-નોંધણી શક્ય.",
  "journey.landing.s2.title": "નોંધણી",
  "journey.landing.s2.body":
    "ફોર્મ 6 નું માર્ગદર્શિત પગલું — આધાર, સરનામું પુરાવો અને ફોટો સાથે.",
  "journey.landing.s3.title": "ચકાસણી",
  "journey.landing.s3.body":
    "મતદાર યાદીમાં નામ શોધો, EPIC ડાઉનલોડ કરો અને બૂથની પુષ્ટિ કરો.",
  "journey.landing.s4.title": "મતદાન દિવસ",
  "journey.landing.s4.body":
    "શું લઈ ��વું, ક્યાં જવું અને બૂથમાં શું અપેક્ષિત — સંપૂર્ણ ચેકલિસ્ટ.",

  "faq.eyebrow": "પ્રશ્નો",
  "faq.title": "જવાબો.",
  "faq.intro": "નોંધણી પહેલાં પ્રથમ મતદાર સામાન્ય રીતે પૂછે છે તે પ્રશ્નો.",
  "faq.q1": "શું મતદાન ચૂંટણી પંચ સાથે સંલગ્ન છે?",
  "faq.a1":
    "ના. મતદાન એક સ્વતંત્ર નાગરિક સાધન છે. તમામ માહિતી સત્તાવાર ECI અને NVSP માંથી લેવામાં આવે છે.",
  "faq.q2": "શું મારે ખાતું બનાવવું પડશે?",
  "faq.a2":
    "કોઈ ખાતું જરૂરી નથી. ઉંમર, રાજ્ય અને સ્થિતિ ફક્ત માર્ગદર્શન અનુકૂલિત કરવા માટે. ડેટા તમારા ડિવાઇસ પર રહે છે.",
  "faq.q3": "હું હજી 18 નો ન હોય તો?",
  "faq.a3":
    "વાંધો નથી. આ વર્ષે 18 થતા હો તો રાજ્યની મતદાર યાદી ખુલતાં જ પૂર્વ-નોંધણી થઈ શકે છે.",
  "faq.q4": "શું ચેટબોટ મારી ભાષામાં જવાબ આપે છે?",
  "faq.a4":
    "હા. Gemini સહાયક તમારી પસંદ કરેલી ભારતીય ભાષામાં જવાબ આપે છે. EPIC, ફોર્મ 6 જેવા શબ્દો મૂળ સ્વરૂપે રહે.",
  "faq.q5": "મારી પાસે પહેલેથી જ વોટર ID હોય તો?",
  "faq.a5":
    "તમે સીધા ચકાસણી અને મતદાન દિવસની તૈયારી પર પહોંચશો. મતદાન ફક્ત જરૂરી પગલાં બતાવે છે.",

  "cta.eyebrow": "જ્યારે તમે તૈયાર હો",
  "cta.titleA": "તમારી લોકશાહી,",
  "cta.titleB": "સરળ બનાવી.",
  "cta.body":
    "બે પ્રશ્નો, એક ડેશબોર્ડ, કોઈ રાજકીય ઘોંઘાટ નહીં. આવતી થોડી મિનિટોમાં પહેલું પગલું.",
  "cta.primary": "મારી યાત્રા શરૂ કરો",
  "cta.secondary": "મેં પહેલેથી જ શરૂ કર્યું છે",

  "footer.tagline":
    "એક સ્વતંત્ર, નાગરિક-કેન્દ્રિત સહાયક જે પ્રથમ મતદારોને યોગ્યતાથી મતદાન સુધી સરળ ભાષામાં માર્ગદર્શન આપે છે.",
  "footer.disclaimer":
    "માહિતી ભારતીય ચૂંટણી પંચ અને NVSP માંથી. કોઈ પણ રાજકીય પક્ષ સાથે સંબંધિત નથી.",
  "footer.explore": "શોધો",
  "footer.begin": "ઓનબોર્ડિંગ શરૂ કરો",
  "footer.openDashboard": "ડેશબોર્ડ ખોલો",
  "footer.faq": "પ્રશ્નો",
  "footer.official": "સત્તાવાર સંસાધનો",
  "footer.eciPortal": "મતદાર સેવા પોર્ટલ",
  "footer.eci": "ભારતનું ચૂંટણી પંચ",
  "footer.nvsp": "રાષ્ટ્રીય મતદાર પોર્ટલ",
  "footer.rights": "© {year} મતદાન. પ્રથમ મતદારો માટે કાળજીપૂર્વક બનાવ્યું.",

  "lang.switcher": "ભાષા",
  "lang.changed": "ભાષા બદલાઈ",
  "lang.ariaLabel": "ભાષા બદલો",

  "dashboard.welcome": "ફરી સ્વાગત છે",
  "dashboard.hello": "નમસ્તે",
  "dashboard.editProfile": "પ્રોફાઇલ સંપાદિત કરો",
  "dashboard.reset": "સાફ કરો અને ફરી શરૂ કરો",
  "dashboard.ageOf": "ઉંમર",
  "dashboard.state": "રાજ્ય",
  "dashboard.epic": "EPIC",
  "dashboard.epic.issued": "જારી",
  "dashboard.epic.pending": "બાકી",
  "dashboard.overallProgress": "કુલ પ્રગતિ",
  "dashboard.celebrate": "ઉજવો",
  "dashboard.openMenu": "ખાતા મેનુ ખોલો",
  "dashboard.skipToMain": "મુખ્ય સામગ્રી પર જાઓ",

  "journey.eyebrow": "તમારી યાત્રા",
  "journey.title": "તમારા મત સુધી ચાર પગલાં",
  "journey.voterIn": "મતદાર —",
  "journey.status.completed": "પૂર્ણ",
  "journey.status.current": "વર્તમાન",
  "journey.status.locked": "બંધ",
  "journey.status.ready": "તૈયાર",

  "step.eligibility.title": "યોગ્યતા તપાસો",
  "step.eligibility.subtitle": "ચૂંટણી પંચના માપદંડો પૂર્ણ કરો છો તેની પુષ્ટિ કરો.",
  "step.registration.title": "મતદાર નોંધણી",
  "step.registration.subtitle": "NVSP પર ફોર્મ 6 દ્વારા અરજી કરો.",
  "step.verification.title": "મતદાર ID ચકાસણી",
  "step.verification.subtitle": "મતદાર યાદીમાં તમારું નામ શોધો અને EPIC ડાઉનલોડ કરો.",
  "step.voting.title": "તમારો મત આપો",
  "step.voting.subtitle": "તમારું મતદાન કેન્દ્ર શોધો અને મતદાન દિવસની તૈયારી કરો.",

  "guide.step": "પગલું",
  "guide.inProgress": "ચાલુ",
  "guide.available": "ઉપલબ્ધ",
  "guide.checklist": "યાદી",
  "guide.resources": "સંસાધનો",
  "guide.markComplete": "પૂર્ણ તરીકે ચિહ્નિત કરો",
  "guide.completedPill": "પૂર્ણ",
  "guide.lockedHint": "આને ખોલવા માટે પાછળનું પગલું પૂર્ણ કરો.",
  "guide.toast.title": "પગલું પૂર્ણ તરીકે ચિહ્નિત",

  "timeline.eyebrow": "ચૂંટણી સમયરેખા",
  "timeline.title": "એક નજરમાં મુખ્ય તબક્કા",
  "timeline.past": "વીતી ગયું",
  "timeline.active": "હાલ સક્રિય",
  "timeline.upcoming": "આવનારું",

  "chat.heading": "મતદાનને પૂછો",
  "chat.subtitle": "Gemini · તમારા રાજ્ય માટે અનુકૂલિત",
  "chat.thinking": "વિચારી રહ્યો છે",
  "chat.online": "ઓનલાઇન",
  "chat.emptyGreet": "હું કેવી રીતે મદદ કરું?",
  "chat.emptyBody":
    "યોગ્યતા, ફોર્મ 6, તમારા EPIC કે મતદાન દિવસ વિશે પૂછો. તમારા રાજ્ય અને સ્થિતિ પ્રમાણે જવાબ આપીશ.",
  "chat.tryAsking": "આ પૂછો",
  "chat.placeholder": "ફોર્મ 6, EPIC કે મતદાન વિશે પૂછો...",
  "chat.error": "સહાયક સુધી પહોંચી શકાયું નહીં. થોડી વારમાં ફરી પ્રયત્ન કરો.",
  "chat.rateLimited": "તમે ખૂબ ઝડપથી સંદેશા મોકલો છો. થોડી સેકન્ડ રોકાઓ.",
  "chat.send": "સંદેશો મોકલો",
  "chat.input": "સંદેશો",

  "celebration.eyebrow": "મતદાર ચેમ્પિયન",
  "celebration.title": "તમે કરી બતાવ્યું,",
  "celebration.subtitle":
    "તમારો અવાજ હવે વિશ્વની સૌથી મોટી લોકશાહીનો ભાગ છે.",
  "celebration.stat1": "પૂર્ણ પગલાં",
  "celebration.stat2": "માર્ગદર્શનના દિવસો",
  "celebration.stat3": "તમારું રાજ્ય",
  "celebration.download": "પ્રમાણપત્ર ડાઉનલોડ",
  "celebration.share": "તમારી સિદ્ધિ શેર કરો",
  "celebration.close": "ડેશબોર્ડ પર પાછા",
  "celebration.shareText":
    "મેં મતદાન પર મારી મતદાર યાત્રા પૂર્ણ કરી. મતદાન દિવસ માટે તૈયાર!",
}

// ---------------------------------------------------------------------------
// Tamil
// ---------------------------------------------------------------------------
const ta: Dict = {
  "nav.features": "அம்சங்கள்",
  "nav.journey": "பயணம்",
  "nav.faq": "கேள்விகள்",
  "nav.openDashboard": "டாஷ்போர்டு திற",
  "nav.getStarted": "தொடங்கு",
  "nav.home": "முகப்பு",

  "hero.badge": "Gemini மூலம் · தேர்தல் ஆணையத்துடன் இணக்கம்",
  "hero.titleA": "உங்கள் வாக்கு,",
  "hero.titleItalic": "அவசரமில்லாமல்",
  "hero.titleB": "மற்றும் புரிந்துகொள்ளப்பட்டது.",
  "hero.subtitle":
    "மத்தான் என்பது இந்தியாவின் முதல்-முறை வாக்காளர்களுக்கான ஸ்மார்ட் துணை. உங்களைப் பற்றி கொஞ்சம் சொல்லுங்கள் — தகுதி, பதிவு, வாக்களிப்பு நாள் வரை வழிநடத்துவோம்.",
  "hero.cta.start": "எனது பயணத்தை தொடங்கு",
  "hero.cta.learn": "இது எப்படி வேலை செய்கிறது",
  "hero.stat.steps": "படிகள்",
  "hero.stat.languages": "மொழிகள்",
  "hero.stat.bias": "பக்கச்சார்பு",
  "hero.stat.bias.value": "இல்லை",
  "hero.preview.live": "நேரலை முன்னோட்டம்",
  "hero.preview.status": "நிலை",
  "hero.preview.statusValue": "தகுதியானவர் — பதிவுக்கு தயார்",
  "hero.preview.stepOf": "படி 1 / 4",
  "hero.preview.check1": "தகுதி உறுதி",
  "hero.preview.check2": "பதிவு (படிவம் 6)",
  "hero.preview.check3": "வாக்காளர் ID",
  "hero.preview.check4": "உங்கள் வாக்கை அளி",
  "hero.preview.says": "மத்தான் சொல்கிறது",
  "hero.preview.quote":
    "இந்த ஆண்டு 18 வயதாகிறீர்கள் — NVSP-ல் **படிவம் 6** நிரப்பி வாக்காளர் பட்டியலில் சேர. 10 நிமிடம் போதும்.",

  "features.eyebrow": "நீங்கள் பெறுவது",
  "features.title": "சத்தமான ஜனநாயகத்தில் அமைதியான, திறமையான துணை.",
  "features.intro":
    "முதல்-முறை வாக்காளர்களுக்காக — நம்பகமான, எளிய மொழியில்.",
  "features.adaptive.title": "உங்களுக்கேற்ற வழிகாட்டல்",
  "features.adaptive.body":
    "வயதையும் பதிவு நிலையையும் சொல்லுங்கள் — சரியான அடுத்த படியை மட்டும் காட்டுவோம்.",
  "features.journey.title": "நான்கு-படி பயணம்",
  "features.journey.body":
    "தகுதி, பதிவு, சரிபார்ப்பு, வாக்களிப்பு நாள் — ஒவ்வொன்றுக்கும் தெளிவான செயல்கள் மற்றும் அதிகாரப்பூர்வ இணைப்புகள்.",
  "features.chat.title": "Gemini சாட்பாட்",
  "features.chat.body":
    "உங்கள் மொழியில் கேள்வி கேளுங்கள். ECI வழிகாட்டுதல்களின் அடிப்படையில் பதில்.",
  "features.private.title": "இயல்பாகவே தனிப்பட்ட",
  "features.private.body":
    "ஆதார், OTP, கடவுச்சொல் எதையும் கேட்பதில்லை. உங்கள் விவரங்கள் உங்கள் சாதனத்திலேயே.",

  "journey.landingEyebrow": "பயணம்",
  "journey.landingTitleA": "நான்கு படிகள்.",
  "journey.landingTitleB": "ஒரு வாக்கு.",
  "journey.landingIntro":
    "நீங்கள் முன்னேறும்போது ஒவ்வொரு படியையும் திறக்கிறோம். PDF தேடல் இல்லை — அடுத்த சரியான செயல் மட்டுமே.",
  "journey.landingCta": "முதல் படியைத் தொடங்கு",
  "journey.landing.s1.title": "தகுதி",
  "journey.landing.s1.body":
    "தகுதி தேதியில் உங்கள் வயது மற்றும் மாநிலத்தை சரிபார்ப்போம். இந்த ஆண்டு 18 ஆனால் முன்-பதிவு முடியும்.",
  "journey.landing.s2.title": "பதிவு",
  "journey.landing.s2.body":
    "படிவம் 6 வழிநடத்தப்பட்ட நடைமுறை — ஆதார், முகவரி சான்று, புகைப்படம்.",
  "journey.landing.s3.title": "சரிபார்ப்பு",
  "journey.landing.s3.body":
    "வாக்காளர் பட்டியலில் பெயரை கண்டுபிடித்து EPIC பதிவிறக்க, வாக்குச்சாவடியை உறுதிசெய்.",
  "journey.landing.s4.title": "வாக்களிப்பு நாள்",
  "journey.landing.s4.body":
    "என்ன கொண்டு செல்வது, எங்கே செல்வது, என்ன எதிர்பார்ப்பது — முழு பட்டியல்.",

  "faq.eyebrow": "கேள்விகள்",
  "faq.title": "பதில்கள்.",
  "faq.intro": "பதிவுக்கு முன் முதல்-முறை வாக்காளர் பொதுவாக கேட்கும் கேள்விகள்.",
  "faq.q1": "மத்தான் தேர்தல் ஆணையத்துடன் தொடர்பா?",
  "faq.a1":
    "இல்லை. மத்தான் ஒரு சுயாதீன குடிமை கருவி. அனைத்து வழிகாட்டலும் அதிகாரப்பூர்வ ECI மற்றும் NVSP இலிருந்து.",
  "faq.q2": "கணக்கு தேவையா?",
  "faq.a2":
    "கணக்கு தேவையில்லை. வயது, மாநிலம், நிலை வழிகாட்டலை தனிப்பயனாக்க மட்டுமே. தரவு உங்கள் சாதனத்திலேயே.",
  "faq.q3": "18 வயது ஆகவில்லை என்றால்?",
  "faq.a3":
    "பிரச்சினை இல்லை. இந்த ஆண்டு 18 ஆனால் மாநில வாக்காளர் பட்டியல் திறந்ததும் முன்-பதிவு செய்யலாம்.",
  "faq.q4": "சாட்பாட் எனது மொழியில் பதில் தருமா?",
  "faq.a4":
    "ஆம். Gemini சாட்பாட் நீங்கள் தேர்வு செய்த இந்திய மொழியில் பதில் தரும். EPIC, படிவம் 6 போன்ற தொழில்நுட்ப சொற்கள் அசல் வடிவத்தில்.",
  "faq.q5": "என்னிடம் ஏற்கனவே வாக்காளர் ID இருந்தால்?",
  "faq.a5":
    "நேரடியாக சரிபார்ப்பு மற்றும் வாக்களிப்பு நாள் தயாரிப்புக்கு செல்வீர்கள். தேவையான படிகளை மட்டுமே மத்தான் காட்டுகிறது.",

  "cta.eyebrow": "நீங்கள் தயாராகும்போது",
  "cta.titleA": "உங்கள் ஜனநாயகம்,",
  "cta.titleB": "எளிமையாக்கப்பட்டது.",
  "cta.body":
    "இரண்டு கேள்விகள், ஒரு டாஷ்போர்டு, அரசியல் ஆரவாரம் இல்லை. அடுத்த சில நிமிடங்களில் முதல் படி.",
  "cta.primary": "எனது பயணத்தை தொடங்கு",
  "cta.secondary": "நான் ஏற்கனவே தொடங்கியுள்ளேன்",

  "footer.tagline":
    "சுயாதீன, குடிமை-சார்ந்த உதவியாளர் — முதல்-முறை வாக்காளர்களுக்கு தகுதி முதல் வாக்களிப்பு வரை எளிய மொழியில்.",
  "footer.disclaimer":
    "தகவல் இந்தியத் தேர்தல் ஆணையம் மற்றும் NVSP இலிருந்து. எந்த அரசியல் கட்சியுடனும் தொடர்பில்லை.",
  "footer.explore": "ஆராய்",
  "footer.begin": "ஆன்போர்டிங் தொடங்கு",
  "footer.openDashboard": "டாஷ்போர்டு திற",
  "footer.faq": "கேள்விகள்",
  "footer.official": "அதிகாரப்பூர்வ ஆதாரங்கள்",
  "footer.eciPortal": "வாக்காளர் சேவை போர்டல்",
  "footer.eci": "இந்தியத் தேர்தல் ஆணையம்",
  "footer.nvsp": "தேசிய வாக்காளர் போர்டல்",
  "footer.rights": "© {year} மத்தான். முதல்-முறை வாக்காளர்களுக்காக கவனமாக.",

  "lang.switcher": "மொழி",
  "lang.changed": "மொழி புதுப்பிக்கப்பட்டது",
  "lang.ariaLabel": "மொழியை மாற்று",

  "dashboard.welcome": "மீண்டும் வருக",
  "dashboard.hello": "வணக்கம்",
  "dashboard.editProfile": "சுயவிவரத்தை திருத்து",
  "dashboard.reset": "அழித்து மீண்டும் தொடங்கு",
  "dashboard.ageOf": "வயது",
  "dashboard.state": "மாநிலம்",
  "dashboard.epic": "EPIC",
  "dashboard.epic.issued": "வழங்கப்பட்டது",
  "dashboard.epic.pending": "நிலுவையில்",
  "dashboard.overallProgress": "மொத்த முன்னேற்றம்",
  "dashboard.celebrate": "கொண்டாடு",
  "dashboard.openMenu": "கணக்கு மெனுவை திற",
  "dashboard.skipToMain": "முக்கிய உள்ளடக்கத்திற்கு தாவு",

  "journey.eyebrow": "உங்கள் பயணம்",
  "journey.title": "வாக்களிப்பிற்கு நான்கு படிகள்",
  "journey.voterIn": "வாக்காளர் —",
  "journey.status.completed": "முடிந்தது",
  "journey.status.current": "தற்போதைய",
  "journey.status.locked": "பூட்டப்பட்டது",
  "journey.status.ready": "தயார்",

  "step.eligibility.title": "தகுதியைச் சரிபார்",
  "step.eligibility.subtitle": "தேர்தல் ஆணையத்தின் அளவுகோல்களை பூர்த்திசெய்வதை உறுதிசெய்.",
  "step.registration.title": "வாக்காளராக பதிவு",
  "step.registration.subtitle": "NVSP-ல் படிவம் 6 மூலம் விண்ணப்பிக்க.",
  "step.verification.title": "வாக்காளர் அடையாள அட்டையை சரிபார்",
  "step.verification.subtitle": "வாக்காளர் பட்டியலில் பெயரைக் கண்டு EPIC ஐ பதிவிறக்கு.",
  "step.voting.title": "உங்கள் வாக்கை அளியுங்கள்",
  "step.voting.subtitle": "வாக்களிப்பு மையத்தைக் கண்டறிந்து வாக்களிப்பு நாளுக்கு தயாராகு.",

  "guide.step": "படி",
  "guide.inProgress": "செயல்பாட்டில்",
  "guide.available": "கிடைக்கிறது",
  "guide.checklist": "பட்டியல்",
  "guide.resources": "வளங்கள்",
  "guide.markComplete": "முடிந்ததாகக் குறி",
  "guide.completedPill": "முடிந்தது",
  "guide.lockedHint": "இதை திறக்க முந்தைய படியை முடிக்கவும்.",
  "guide.toast.title": "படி முடிந்ததாகக் குறிக்கப்பட்டது",

  "timeline.eyebrow": "தேர்தல் காலவரிசை",
  "timeline.title": "முக்கிய கட்டங்கள் ஒரே பார்வையில்",
  "timeline.past": "கடந்தது",
  "timeline.active": "இப்போது செயலில்",
  "timeline.upcoming": "வரவிருக்கிறது",

  "chat.heading": "மத்தானை கேளுங்கள்",
  "chat.subtitle": "Gemini · உங்கள் மாநிலத்திற்கு தகவமைக்கப்பட்டது",
  "chat.thinking": "யோசிக்கிறது",
  "chat.online": "ஆன்லைனில்",
  "chat.emptyGreet": "நான் எப்படி உதவட்டும்?",
  "chat.emptyBody":
    "தகுதி, படிவம் 6, உங்கள் EPIC அல்லது வாக்களிப்பு நாள் பற்றி கேளுங்கள். உங்கள் மாநிலம் மற்றும் நிலைக்கு ஏற்ப பதில் தருவேன்.",
  "chat.tryAsking": "இதைக் கேள்",
  "chat.placeholder": "படிவம் 6, EPIC அல்லது வாக்களிப்பு பற்றி கேள்...",
  "chat.error": "உதவியாளரை அணுக முடியவில்லை. சிறிது நேரத்தில் மீண்டும் முயற்சி செய்.",
  "chat.rateLimited": "நீங்கள் மிக வேகமாக செய்திகள் அனுப்புகிறீர்கள். சில வினாடிகள் காத்திருக்கவும்.",
  "chat.send": "செய்தி அனுப்பு",
  "chat.input": "செய்தி",

  "celebration.eyebrow": "வாக்காளர் சாம்பியன்",
  "celebration.title": "நீங்கள் செய்து முடித்தீர்கள்,",
  "celebration.subtitle":
    "உங்கள் குரல் இப்போது உலகின் மிகப்பெரிய ஜனநாயகத்தின் பகுதி.",
  "celebration.stat1": "முடிந்த படிகள்",
  "celebration.stat2": "வழிகாட்டிய நாட்கள்",
  "celebration.stat3": "உங்கள் மாநிலம்",
  "celebration.download": "சான்றிதழை பதிவிறக்கு",
  "celebration.share": "உங்கள் சாதனையை பகிரு",
  "celebration.close": "டாஷ்போர்டுக்கு திரும்பு",
  "celebration.shareText":
    "மத்தானில் என் வாக்காளர் பயணத்தை முடித்தேன். வாக்களிப்பு நாளுக்கு தயார்!",
}

// ---------------------------------------------------------------------------
// Telugu
// ---------------------------------------------------------------------------
const te: Dict = {
  "nav.features": "విశేషాలు",
  "nav.journey": "ప్రయాణం",
  "nav.faq": "ప్రశ్నలు",
  "nav.openDashboard": "డాష్‌బోర్డ్ తెరువు",
  "nav.getStarted": "ప్రారంభించండి",
  "nav.home": "హోమ్",

  "hero.badge": "Gemini చేత · ఎన్నికల సంఘంతో అనుగుణం",
  "hero.titleA": "మీ ఓటు,",
  "hero.titleItalic": "తొందరలేదు",
  "hero.titleB": "మరియు అర్థమైంది.",
  "hero.subtitle":
    "మత్‌దాన్ భారతదేశంలోని మొదటిసారి ఓటర్లకు స్మార్ట్ సహచరుడు. మీ గురించి కొంచెం చెప్పండి — అర్హత, నమోదు, పోలింగ్ రోజు వరకు అడుగడుగునా మార్గదర్శనం.",
  "hero.cta.start": "నా ప్రయాణం ప్రారంభించు",
  "hero.cta.learn": "ఇది ఎలా పని చేస్తుంది",
  "hero.stat.steps": "అడుగులు",
  "hero.stat.languages": "భాషలు",
  "hero.stat.bias": "పక్షపాతం",
  "hero.stat.bias.value": "శూన్యం",
  "hero.preview.live": "లైవ్ ప్రివ్యూ",
  "hero.preview.status": "స్థితి",
  "hero.preview.statusValue": "అర్హులు — నమోదుకు సిద్ధం",
  "hero.preview.stepOf": "అడుగు 1 / 4",
  "hero.preview.check1": "అర్హత ధృవీకరణ",
  "hero.preview.check2": "నమోదు (ఫారం 6)",
  "hero.preview.check3": "ఓటర్ ID",
  "hero.preview.check4": "మీ ఓటు వేయండి",
  "hero.preview.says": "మత్‌దాన్ చెబుతుంది",
  "hero.preview.quote":
    "మీరు ఈ సంవత్సరం 18 అవుతున్నారు — NVSP లో **ఫారం 6** నింపి ఓటర్ జాబితాలో చేరండి. 10 నిమిషాలు చాలు.",

  "features.eyebrow": "మీకు ఏమి లభిస్తుంది",
  "features.title": "గందరగోళ ప్రజాస్వామ్యంలో నిశ్శబ్ద, సమర్థ సహచరుడు.",
  "features.intro":
    "మొదటిసారి ఓటర్లకు — నమ్మదగ్గ, సరళమైన భాషలో.",
  "features.adaptive.title": "అనుకూల మార్గదర్శనం",
  "features.adaptive.body":
    "వయస్సు మరియు నమోదు స్థితి చెప్పండి — సరైన తదుపరి అడుగు మాత్రమే చూపిస్తాము.",
  "features.journey.title": "నాలుగు-అడుగుల ప్రయాణం",
  "features.journey.body":
    "అర్హత, నమోదు, ధృవీకరణ, పోలింగ్ రోజు — ప్రతిదానికి స్పష్టమైన చర్యలు మరియు అధికారిక లింక్‌లు.",
  "features.chat.title": "Gemini చాట్‌బాట్",
  "features.chat.body":
    "మీ భాషలో అడగండి. జవాబులు ECI మార్గదర్శకాల ఆధారంగా.",
  "features.private.title": "డిఫాల్ట్‌గా ప్రైవేట్",
  "features.private.body":
    "ఆధార్, OTP, పాస్‌వర్డ్ ఎప్పుడూ అడగము. మీ వివరాలు మీ పరికరంలోనే.",

  "journey.landingEyebrow": "ప్రయాణం",
  "journey.landingTitleA": "నాలుగు అడుగులు.",
  "journey.landingTitleB": "ఒక ఓటు.",
  "journey.landingIntro":
    "మీరు ముందుకు వెళ్తున్న కొద్దీ ప్రతి అడుగును తెరుస్తుంది. PDF లో వెతకడం లేదు — తదుపరి సరైన చర్య మాత్రమే.",
  "journey.landingCta": "మొదటి అడుగు వేయండి",
  "journey.landing.s1.title": "అర్హత",
  "journey.landing.s1.body":
    "అర్హత తేదీలో మీ వయస్సు మరియు రాష్ట్రాన్ని తనిఖీ. ఈ సంవత్సరం 18 అవుతుంటే ముందస్తు నమోదు.",
  "journey.landing.s2.title": "నమోదు",
  "journey.landing.s2.body":
    "ఫారం 6 యొక్క మార్గదర్శిత విధానం — ఆధార్, చిరునామా, ఫోటో.",
  "journey.landing.s3.title": "ధృవీకరణ",
  "journey.landing.s3.body":
    "ఓటర్ జాబితాలో పేరు కనుగొని EPIC డౌన్‌లోడ్, బూత్ ధృవీకరణ.",
  "journey.landing.s4.title": "పోలింగ్ రోజు",
  "journey.landing.s4.body":
    "ఏమి తీసుకెళ్ళాలి, ఎక్కడికి, ఏమి ఆశించాలి — సంపూర్ణ జాబితా.",

  "faq.eyebrow": "ప్రశ్నలు",
  "faq.title": "జవాబులు.",
  "faq.intro": "నమోదుకు ముందు మొదటిసారి ఓటర్లు సాధారణంగా అడిగే ప్రశ్నలు.",
  "faq.q1": "మత్‌దాన్ ఎన్నికల సంఘంతో సంబంధం ఉందా?",
  "faq.a1":
    "కాదు. మత్‌దాన్ స్వతంత్ర పౌర సాధనం. అన్ని మార్గదర్శనం అధికారిక ECI మరియు NVSP నుండి.",
  "faq.q2": "ఖాతా అవసరమా?",
  "faq.a2":
    "ఖాతా అవసరం లేదు. వయస్సు, రాష్ట్రం, స్థితి మార్గదర్శనం అనుకూలీకరించడానికి మాత్రమే.",
  "faq.q3": "నేను 18 లేకపోతే?",
  "faq.a3":
    "సరే. ఈ సంవత్సరం 18 అవుతుంటే రాష్ట్ర ఓటర్ జాబితా తెరుచుకోగానే ముందస్తు నమోదు చేయవచ్చు.",
  "faq.q4": "చాట్‌బాట్ నా భాషలో సమాధానం ఇస్తుందా?",
  "faq.a4":
    "అవును. Gemini సహాయకుడు మీరు ఎంచుకున్న భారతీయ భాషలో జవాబు ఇస్తాడు. EPIC, ఫారం 6 వంటి సాంకేతిక పదాలు అసలు రూపంలో.",
  "faq.q5": "నాకు ఇప్పటికే ఓటర్ ID ఉంటే?",
  "faq.a5":
    "నేరుగా ధృవీకరణ మరియు పోలింగ్ రోజు తయారీకి వెళ్తారు. అవసరమైన అడుగులను మాత్రమే చూపుతుంది.",

  "cta.eyebrow": "మీరు సిద్ధంగా ఉన్నప్పుడు",
  "cta.titleA": "మీ ప్రజాస్వామ్యం,",
  "cta.titleB": "సులభం చేయబడింది.",
  "cta.body":
    "రెండు ప్రశ్నలు, ఒక డాష్‌బోర్డ్, రాజకీయ గందరగోళం లేదు. తదుపరి కొన్ని నిమిషాల్లో మొదటి అడుగు.",
  "cta.primary": "నా ప్రయాణం ప్రారంభించు",
  "cta.secondary": "నేను ఇప్పటికే ప్రారంభించాను",

  "footer.tagline":
    "స్వతంత్ర, పౌర-కేంద్రిత సహాయకుడు. మొదటిసారి ఓటర్లకు అర్హత నుండి ఓటు వరకు సరళ భాషలో.",
  "footer.disclaimer":
    "సమాచారం భారత ఎన్నికల సంఘం మరియు NVSP నుండి. ఏ రాజకీయ పార్టీతో సంబంధం లేదు.",
  "footer.explore": "అన్వేషించండి",
  "footer.begin": "ఆన్‌బోర్డింగ్ ప్రారంభం",
  "footer.openDashboard": "డాష్‌బోర్డ్ తెరువు",
  "footer.faq": "ప్రశ్నలు",
  "footer.official": "అధికారిక వనరులు",
  "footer.eciPortal": "ఓటర్ సేవా పోర్టల్",
  "footer.eci": "భారత ఎన్నికల సంఘం",
  "footer.nvsp": "జాతీయ ఓటర్ పోర్టల్",
  "footer.rights": "© {year} మత్‌దాన్. మొదటిసారి ఓటర్లకు జాగ్రత్తగా.",

  "lang.switcher": "భాష",
  "lang.changed": "భాష అప్‌డేట్ అయింది",
  "lang.ariaLabel": "భాష మార్చండి",

  "dashboard.welcome": "తిరిగి స్వాగతం",
  "dashboard.hello": "నమస్తే",
  "dashboard.editProfile": "ప్రొఫైల్ సవరించు",
  "dashboard.reset": "తొలగించి మళ్ళీ ప్రారంభించు",
  "dashboard.ageOf": "వయస్సు",
  "dashboard.state": "రాష్ట్రం",
  "dashboard.epic": "EPIC",
  "dashboard.epic.issued": "జారీ అయింది",
  "dashboard.epic.pending": "వేచి ఉంది",
  "dashboard.overallProgress": "మొత్తం పురోగతి",
  "dashboard.celebrate": "��రుపుకోండి",
  "dashboard.openMenu": "ఖాతా మెనూ తెరువు",
  "dashboard.skipToMain": "ప్రధాన కంటెంట్‌కు దాటు",

  "journey.eyebrow": "మీ ప్రయాణం",
  "journey.title": "మీ ఓటు వరకు నాలుగు అడుగులు",
  "journey.voterIn": "ఓటరు —",
  "journey.status.completed": "పూర్తి",
  "journey.status.current": "ప్రస్తుత",
  "journey.status.locked": "లాక్",
  "journey.status.ready": "సిద్ధం",

  "step.eligibility.title": "అర్హత తనిఖీ",
  "step.eligibility.subtitle": "ఎన్నికల సంఘ ప్రమాణాలను మీరు చేరుతున్నారని నిర్ధారించు.",
  "step.registration.title": "ఓటరుగా నమోదు",
  "step.registration.subtitle": "NVSP లో ఫారం 6 ద్వారా దరఖాస్తు.",
  "step.verification.title": "ఓటర్ ID ధృవీకరణ",
  "step.verification.subtitle": "ఓటర్ జాబితాలో పేరు కనుగొని EPIC డౌన్‌లోడ్ చేయి.",
  "step.voting.title": "మీ ఓటు వేయండి",
  "step.voting.subtitle": "పోలింగ్ బూత్ కనుగొని ఓటింగ్ రోజుకు సిద్ధపడు.",

  "guide.step": "దశ",
  "guide.inProgress": "ప్రగతిలో",
  "guide.available": "అందుబాటులో",
  "guide.checklist": "జాబితా",
  "guide.resources": "వనరులు",
  "guide.markComplete": "పూర్తిగా గుర్తు పెట్టు",
  "guide.completedPill": "పూర్తి",
  "guide.lockedHint": "దీన్ని తెరవడానికి మునుపటి దశను పూర్తి చేయండి.",
  "guide.toast.title": "దశ పూర్తిగా గుర్తు పెట్టబడింది",

  "timeline.eyebrow": "ఎన్నికల కాలక్రమం",
  "timeline.title": "ప్రధాన దశలు ఒక చూపులో",
  "timeline.past": "గడిచింది",
  "timeline.active": "ఇప్పుడు సక్రియం",
  "timeline.upcoming": "రాబోయేది",

  "chat.heading": "మత్‌దాన్‌ని అడగండి",
  "chat.subtitle": "Gemini · మీ రాష్ట్రానికి తగినది",
  "chat.thinking": "ఆలోచిస్తోంది",
  "chat.online": "ఆన్‌లైన్",
  "chat.emptyGreet": "నేను ఎలా సహాయపడగలను?",
  "chat.emptyBody":
    "అర్హత, ఫారం 6, మీ EPIC లేదా పోలింగ్ రోజు గురించి అడగండి. మీ రాష్ట్రం మరియు స్థితికి సరిపోయే సమాధానాలు ఇస్తాను.",
  "chat.tryAsking": "ఇది అడగండి",
  "chat.placeholder": "ఫారం 6, EPIC లేదా ఓటింగ్ రోజు గురించి అడగండి...",
  "chat.error": "సహాయకుడిని చేరుకోలేకపోయాను. కొంత సమయం తర్వాత మళ్ళీ ప్రయత్నించండి.",
  "chat.rateLimited": "మీరు చాలా వేగంగా సందేశాలు పంపుతున్నారు. కొన్ని సెకన్లు వేచి ఉండండి.",
  "chat.send": "సందేశం పంపు",
  "chat.input": "సందేశం",

  "celebration.eyebrow": "ఓటర్ ఛాంపియన్",
  "celebration.title": "మీరు సాధించారు,",
  "celebration.subtitle":
    "మీ గొంతు ఇప్పుడు ప్రపంచంలోని అతిపెద్ద ప్రజాస్వామ్యంలో భాగం.",
  "celebration.stat1": "పూర్తైన దశలు",
  "celebration.stat2": "మార్గదర్శక రోజులు",
  "celebration.stat3": "మీ రాష్ట్రం",
  "celebration.download": "సర్టిఫికెట్ డౌన్‌లోడ్",
  "celebration.share": "మీ విజయాన్ని పంచుకోండి",
  "celebration.close": "డాష్‌బోర్డ్‌కి తిరిగి",
  "celebration.shareText":
    "నేను మత్‌దాన్‌లో నా ఓటర్ ప్రయాణాన్ని పూర్తి చేశాను. పోలింగ్ రోజుకు సిద్ధం!",
}

// ---------------------------------------------------------------------------
// Bengali
// ---------------------------------------------------------------------------
const bn: Dict = {
  "nav.features": "বৈশিষ্ট্য",
  "nav.journey": "যাত্রা",
  "nav.faq": "প্রশ্ন",
  "nav.openDashboard": "ড্যাশবোর্ড খুলুন",
  "nav.getStarted": "শুরু করুন",
  "nav.home": "হোম",

  "hero.badge": "Gemini দ্বারা চালিত · নির্বাচন কমিশনের সাথে সামঞ্জস্যপূর্ণ",
  "hero.titleA": "আপনার ভোট,",
  "hero.titleItalic": "শান্ত",
  "hero.titleB": "এবং বোধগম্য।",
  "hero.subtitle":
    "মতদান ভারতের প্রথম-ভোটারদের জন্য একটি স্মার্ট সঙ্গী। আপনার সম্পর্কে একটু বলুন — যোগ্যতা, নিবন্ধন থেকে ভোটের দিন পর্যন্ত ধাপে ধাপে নিয়ে যাব।",
  "hero.cta.start": "আমার যাত্রা শুরু করি",
  "hero.cta.learn": "এটি কীভাবে কাজ করে",
  "hero.stat.steps": "ধাপ",
  "hero.stat.languages": "ভাষা",
  "hero.stat.bias": "পক্ষপাত",
  "hero.stat.bias.value": "শূন্য",
  "hero.preview.live": "লাইভ প্রিভিউ",
  "hero.preview.status": "অবস্থা",
  "hero.preview.statusValue": "যোগ্য — নিবন্ধনের জন্য প্রস্তুত",
  "hero.preview.stepOf": "ধাপ 1 / 4",
  "hero.preview.check1": "যোগ্যতা নিশ্চিত",
  "hero.preview.check2": "নিবন্ধন (ফর্ম 6)",
  "hero.preview.check3": "ভোটার ID",
  "hero.preview.check4": "আপনার ভোট দিন",
  "hero.preview.says": "মতদান বলছে",
  "hero.preview.quote":
    "আপনি এ বছর 18 হচ্ছেন — NVSP তে **ফর্ম 6** পূরণ করে ভোটার তালিকায় যোগ দিন। ১০ মিনিট যথেষ্ট।",

  "features.eyebrow": "আপনি কী পান",
  "features.title": "উচ্চকণ্ঠ গণতন্ত্রে একজন শান্ত, দক্ষ সঙ্গী।",
  "features.intro":
    "প্রথম-ভোটারদের জন্য — বিশ্বস্ত, স্পষ্ট এবং সহজ ভাষায়।",
  "features.adaptive.title": "অভিযোজিত নির্দেশনা",
  "features.adaptive.body":
    "বয়স ও নিবন্ধন অবস্থা বলুন — ঠিক পরের ধাপ দেখাব, তার বেশি নয়।",
  "features.journey.title": "চার-ধাপের যাত্রা",
  "features.journey.body":
    "যোগ্যতা, নিবন্ধন, যাচাই, ভোটের দিন — প্রতিটির জন্য স্পষ্ট পদক্ষেপ এবং সরকারি লিঙ্ক।",
  "features.chat.title": "Gemini চ্যাটবট",
  "features.chat.body":
    "আপনার ভাষায় জিজ্ঞাসা করুন। উত্তর ECI নির্দেশিকার ভিত্তিতে।",
  "features.private.title": "ডিফল্টভাবে ব্যক্তিগত",
  "features.private.body":
    "আধার, OTP বা পাসওয়ার্ড কখনোই চাই না। আপনার তথ্য আপনার ডিভাইসেই থাকে।",

  "journey.landingEyebrow": "যাত্রা",
  "journey.landingTitleA": "চারটি ধাপ।",
  "journey.landingTitleB": "একটি ভোট।",
  "journey.landingIntro":
    "আপনি এগিয়ে গেলে প্রতিটি ধাপ খুলে যায়। PDF খোঁজাখুঁজি নয় — শুধু পরবর্তী সঠিক কাজ।",
  "journey.landingCta": "প্রথম ধাপ নিন",
  "journey.landing.s1.title": "যোগ্যতা",
  "journey.landing.s1.body":
    "যোগ্যতার তারিখে বয়স ও রাজ্য যাচাই। এ বছর 18 হলে প্রাক-নিবন্ধন সম্ভব।",
  "journey.landing.s2.title": "নিবন্ধন",
  "journey.landing.s2.body":
    "ফর্ম 6 এর নির্দেশিত ধাপ — আধার, ঠিকানা প্রমাণ, ছবি।",
  "journey.landing.s3.title": "যাচাই",
  "journey.landing.s3.body":
    "ভোটার তালিকায় নাম খুঁজে EPIC ডাউনলোড, বুথ নিশ্চিত।",
  "journey.landing.s4.title": "ভোটের দিন",
  "journey.landing.s4.body":
    "কী নিতে হবে, কোথায় যেতে হবে, কী প্রত্যাশিত — পূর্ণ চেকলিস্ট।",

  "faq.eyebrow": "প্রশ্ন",
  "faq.title": "উত্তর।",
  "faq.intro": "নিবন্ধনের আগে প্রথম-ভোটাররা সাধারণত যে প্রশ্ন করেন।",
  "faq.q1": "মতদান কি নির্বাচন কমিশনের সাথে যুক্ত?",
  "faq.a1":
    "না। মতদান একটি স্বাধীন নাগরিক সরঞ্জাম। সমস্ত নির্দেশনা সরকারি ECI ও NVSP থেকে।",
  "faq.q2": "অ্যাকাউন্ট লাগবে?",
  "faq.a2":
    "অ্যাকাউন্ট দরকার নেই। বয়স, রাজ্য, অবস্থা শুধু ব্যক্তিগত নির্দেশনার জন্য।",
  "faq.q3": "আমি 18 না হলে?",
  "faq.a3":
    "সমস্যা নেই। এ বছর 18 হলে রাজ্যের ভোটার তালিক�� খুললেই প্রাক-নিবন্ধন করা যায়।",
  "faq.q4": "চ্যাটবট কি আমার ভাষায় উত্তর দেয়?",
  "faq.a4":
    "হ্যাঁ। Gemini সহায়ক আপনার নির্বাচিত ভারতীয় ভাষায় উত্তর দেয়। EPIC, ফর্ম 6 এর মতো প্রযুক্তিগত শব্দ মূল রূপে।",
  "faq.q5": "আমার ইতিমধ্যে ভোটার ID থাকলে?",
  "faq.a5":
    "সরাসরি যাচাই ও ভোটের দিন প্রস্তুতিতে যাবেন। মতদান শুধু দরকারি ধাপ দেখায়।",

  "cta.eyebrow": "যখন আপনি প্রস্তুত",
  "cta.titleA": "আপনার গণতন্ত্র,",
  "cta.titleB": "সহজ করা হয়েছে।",
  "cta.body":
    "দুটি প্রশ্ন, একটি ড্যাশবোর্ড, কোনো রাজনৈতিক কোলাহল নেই। কয়েক মিনিটে প্রথম ধাপ।",
  "cta.primary": "আমার যাত্রা শুরু করি",
  "cta.secondary": "আমি ইতিমধ্যে শুরু করেছি",

  "footer.tagline":
    "একটি স্বাধীন, নাগরিক-কেন্দ্রিক সহায়ক যা প্রথম-ভোটারদের যোগ্যতা থেকে ব্যালট পর্যন্ত সহজ ভাষায় নির্দেশনা দেয়।",
  "footer.disclaimer":
    "তথ্য ভারতীয় নির্বাচন কমিশন ও NVSP থেকে। কোনো রাজনৈতিক দলের সাথে সম্পর্কিত নয়।",
  "footer.explore": "অন্বেষণ",
  "footer.begin": "অনবোর্ডিং শুরু",
  "footer.openDashboard": "ড্যাশবোর্ড খুলুন",
  "footer.faq": "প্রশ্ন",
  "footer.official": "সরকারি সংস্থান",
  "footer.eciPortal": "ভোটার পরিষেবা পোর্টাল",
  "footer.eci": "ভারতের নির্বাচন কমিশন",
  "footer.nvsp": "জাতীয় ভোটার পোর্টাল",
  "footer.rights": "© {year} মতদান। প্রথম-ভোটারদের জন্য যত্নসহকারে।",

  "lang.switcher": "ভাষা",
  "lang.changed": "ভাষা আপডেট হয়েছে",
  "lang.ariaLabel": "ভাষা পরিবর্তন করুন",

  "dashboard.welcome": "আবার স্বাগতম",
  "dashboard.hello": "নমস্কার",
  "dashboard.editProfile": "প্রোফাইল সম্পাদনা",
  "dashboard.reset": "মুছে পুনরায় শুরু",
  "dashboard.ageOf": "বয়স",
  "dashboard.state": "রাজ্য",
  "dashboard.epic": "EPIC",
  "dashboard.epic.issued": "জারি হয়েছে",
  "dashboard.epic.pending": "অপেক্ষমাণ",
  "dashboard.overallProgress": "সামগ্রিক অগ্রগতি",
  "dashboard.celebrate": "উদযাপন",
  "dashboard.openMenu": "অ্যাকাউন্ট মেনু খুলুন",
  "dashboard.skipToMain": "প্রধান বিষয়বস্তুতে যান",

  "journey.eyebrow": "আপনার যাত্রা",
  "journey.title": "আপনার ভোট পর্যন্ত চারটি ধাপ",
  "journey.voterIn": "ভোটার —",
  "journey.status.completed": "সম্পন্ন",
  "journey.status.current": "বর্তমান",
  "journey.status.locked": "লক",
  "journey.status.ready": "প্রস্তুত",

  "step.eligibility.title": "যোগ্যতা যাচাই",
  "step.eligibility.subtitle": "নির্বাচন কমিশনের মানদণ্ড পূরণ নিশ্চিত করুন।",
  "step.registration.title": "ভোটার নিবন্ধন",
  "step.registration.subtitle": "NVSP তে ফর্ম 6 এর মাধ্যমে আবেদন।",
  "step.verification.title": "ভোটার আইডি যাচাই",
  "step.verification.subtitle": "ভোটার তালিকায় নাম খুঁজে EPIC ডাউনলোড করুন।",
  "step.voting.title": "আপনার ভোট দিন",
  "step.voting.subtitle": "ভোট কেন্দ্র খুঁজে ভোটের দিনের জন্য প্রস্তুতি নিন।",

  "guide.step": "ধাপ",
  "guide.inProgress": "চলমান",
  "guide.available": "উপলব্ধ",
  "guide.checklist": "তালিকা",
  "guide.resources": "সংস্থান",
  "guide.markComplete": "সম্পন্ন হিসেবে চিহ্নিত",
  "guide.completedPill": "সম্পন্ন",
  "guide.lockedHint": "এটি খুলতে আগের ধাপটি সম্পূর্ণ করুন।",
  "guide.toast.title": "ধাপ সম্পন্ন হিসেবে চিহ্নিত",

  "timeline.eyebrow": "নির্বাচনের সময়রেখা",
  "timeline.title": "এক নজরে মূল ধাপসমূহ",
  "timeline.past": "পার হয়েছে",
  "timeline.active": "এখন সক্রিয়",
  "timeline.upcoming": "আসন্ন",

  "chat.heading": "মতদান-কে জিজ্ঞাসা",
  "chat.subtitle": "Gemini · আপনার রাজ্যের জন্য তৈরি",
  "chat.thinking": "ভাবছে",
  "chat.online": "অনলাইনে",
  "chat.emptyGreet": "আমি কীভাবে সাহায্য করব?",
  "chat.emptyBody":
    "যোগ্যতা, ফর্ম 6, আপনার EPIC বা ভোটের দিন সম্পর্কে জিজ্ঞাসা করুন। আপনার রাজ্য ও অবস্থা অনুযায়ী উত্তর দেব।",
  "chat.tryAsking": "এটি জিজ্ঞাসা করুন",
  "chat.placeholder": "ফর্ম 6, EPIC বা ভোট সম্পর্কে জিজ্ঞাসা...",
  "chat.error": "সহায়কের কাছে পৌঁছাতে পারিনি। একটু পরে আবার চেষ্টা করুন।",
  "chat.rateLimited": "আপনি খুব দ্রুত বার্তা পাঠাচ্ছেন। কয়েক সেকেন্ড অপেক্ষা করুন।",
  "chat.send": "বার্তা পাঠান",
  "chat.input": "বার্তা",

  "celebration.eyebrow": "ভোটার চ্যাম্পিয়ন",
  "celebration.title": "আপনি পেরেছেন,",
  "celebration.subtitle":
    "আপনার কণ্ঠস্বর এখন বিশ্বের বৃহত্তম গণতন্ত্রের অংশ।",
  "celebration.stat1": "সম্পন্ন ধাপ",
  "celebration.stat2": "গাইডেন্সের দিন",
  "celebration.stat3": "আপনার রাজ্য",
  "celebration.download": "সার্টিফিকেট ডাউনলোড",
  "celebration.share": "আপনার অর্জন ভাগ করুন",
  "celebration.close": "ড্যাশবোর্ডে ফিরে",
  "celebration.shareText":
    "আমি মতদানে আমার ভোটার যাত্রা সম্পন্ন করেছি। ভোটের দিনের জন্য প্রস্তুত!",
}

const DICTS: Record<Lang, Dict> = { en, hi, mr, gu, ta, te, bn }

/**
 * Translate a key for a given language with English fallback.
 * Supports `{param}` interpolation — e.g. t(lang, "footer.rights", { year: 2026 }).
 */
export function t(
  lang: Lang,
  key: string,
  params?: Record<string, string | number>,
): string {
  const raw = DICTS[lang]?.[key] ?? DICTS.en[key] ?? key
  if (!params) return raw
  return raw.replace(/\{(\w+)\}/g, (_, k) =>
    k in params ? String(params[k]) : `{${k}}`,
  )
}

// ---------------------------------------------------------------------------
// Banner state metadata (labels + descriptions for the voter-state banner).
// ---------------------------------------------------------------------------

type StateCopy = { label: string; headline: string; description: string }

export const STATE_META: Record<VoterState, Record<Lang, StateCopy>> = {
  NOT_ELIGIBLE: {
    en: {
      label: "Not yet eligible",
      headline: "You're almost there.",
      description:
        "You must be at least 18 years old on the qualifying date to register. We'll help you prepare in the meantime.",
    },
    hi: {
      label: "अभी पात्र नहीं",
      headline: "आप लगभग तैयार हैं।",
      description:
        "पंजीकरण के लिए आपकी आयु योग्यता तिथि पर कम से कम 18 वर्ष होनी चाहिए। तब तक हम आपकी तैयारी में मदद करेंगे।",
    },
    mr: {
      label: "अद्याप पात्र नाही",
      headline: "तुम्ही जवळपास तयार आहात.",
      description:
        "नोंदणीसाठी पात्रता तारखेला तुमचे वय किमान 18 असावे. तोपर्यंत आम्ही तुमची तयारी करून घेऊ.",
    },
    gu: {
      label: "હજી યોગ્ય નથી",
      headline: "તમે લગભગ પહોંચી ગયા છો.",
      description:
        "નોંધણી માટે યોગ્યતા તારીખે તમારી ઉંમર ઓછામાં ઓછી 18 હોવી જોઈએ. ત્યાં સુધી અમે તૈયાર કરીશું.",
    },
    ta: {
      label: "இன்னும் தகுதியற்றவர்",
      headline: "நீங்கள் கிட்டத்தட்ட தயார்.",
      description:
        "பதிவுக்கு தகுதி நாளில் குறைந்தது 18 வயது இருக்க வேண்டும். அதுவரை நாங்கள் தயார்படுத்துவோம்.",
    },
    te: {
      label: "ఇంకా అర్హత లేదు",
      headline: "మీరు దాదాపు సిద్ధం.",
      description:
        "నమోదుకు అర్హత తేదీలో కనీసం 18 ఏళ్ళు ఉండాలి. అప్పటి వరకు సిద్ధంచేస్తాం.",
    },
    bn: {
      label: "এখনো যোগ্য নয়",
      headline: "আপনি প্রায় প্রস্তুত।",
      description:
        "নিবন্ধনের জন্য যোগ্যতার তারিখে বয়স অন্তত ১৮ হতে হবে। ততদিন আমরা প্রস্তুত করব।",
    },
  },
  ELIGIBLE_NOT_REGISTERED: {
    en: {
      label: "Eligible — not registered",
      headline: "Let's get you on the electoral roll.",
      description:
        "You meet the age requirement. The next step is to file Form 6 with the Election Commission of India.",
    },
    hi: {
      label: "पात्र — पंजीकृत नहीं",
      headline: "आपको मतदाता सूची में जोड़ते हैं।",
      description:
        "आप आयु की आवश्यकता पूरी करते हैं। अगला कदम भारत निर्वाचन आयोग के साथ फॉर्म 6 दाखिल करना है।",
    },
    mr: {
      label: "पात्र — नोंदणीकृत नाही",
      headline: "तुम्हाला मतदार यादीत घेऊ.",
      description:
        "तुम्ही वयोगट पूर्ण करता. पुढील पाऊल म्हणजे भारत निवडणूक आयोगाकडे फॉर्म 6 दाखल करणे.",
    },
    gu: {
      label: "યોગ્ય — નોંધણી થઈ નથી",
      headline: "તમને મતદાર યાદીમાં લાવીએ.",
      description:
        "તમે ઉંમરની શરત પૂરી કરો છો. આગલું પગલું ભારતીય ચૂંટણી પંચ પાસે ફોર્મ 6 દાખલ કરવું.",
    },
    ta: {
      label: "தகுதியுடைய — பதிவு இல்லை",
      headline: "வாக்காளர் பட்டியலில் சேர்ப்போம்.",
      description:
        "நீங்கள் வயது தேவையை பூர்த்திசெய்கிறீர்கள். அடுத்த படி தேர்தல் ஆணையத்தில் படிவம் 6 தாக்கல் செய்வது.",
    },
    te: {
      label: "అర్హత — నమోదు కాలేదు",
      headline: "మిమ్మల్ని ఓటర్ జాబితాలో చేరుద్దాం.",
      description:
        "మీరు వయస్సు అర్హత చేరారు. తదుపరి అడుగు ఎన్నికల సంఘంలో ఫారం 6 దాఖలు చేయడం.",
    },
    bn: {
      label: "যোগ্য — নিবন্ধিত নয়",
      headline: "আপনাকে ভোটার তালিকায় নিয়ে যাই।",
      description:
        "আপনি বয়সের শর্ত পূরণ করেন। পরবর্তী ধাপ ভারতীয় নির্বাচন কমিশনে ফর্ম 6 জমা দেওয়া।",
    },
  },
  REGISTERED: {
    en: {
      label: "Registered — pending EPIC",
      headline: "You're registered. Let's verify your card.",
      description:
        "Locate your name in the electoral roll and download your Voter ID (EPIC) before polling day.",
    },
    hi: {
      label: "पंजीकृत — EPIC लंबित",
      headline: "आप पंजीकृत हैं। अब कार्ड सत्यापित करें।",
      description:
        "मतदाता सूची में अपना नाम खोजें और मतदान दिवस से पहले अपना वोटर आईडी (EPIC) डाउनलोड करें।",
    },
    mr: {
      label: "नोंदणीकृत — EPIC प्रलंबित",
      headline: "तुम्ही नोंदणीकृत आहात. आता कार्ड पडताळा.",
      description:
        "मतदार यादीत तुमचे नाव शोधा आणि मतदान दिवसापूर्वी EPIC डाउनलोड करा.",
    },
    gu: {
      label: "નોંધણી થઈ — EPIC બાકી",
      headline: "તમે નોંધાયેલા છો. હવે કાર્ડ ચકાસો.",
      description:
        "મતદાર યાદીમાં નામ શોધો અને મતદાન દિવસ પહેલાં EPIC ડાઉનલોડ કરો.",
    },
    ta: {
      label: "பதிவு — EPIC நிலுவையில்",
      headline: "நீங்கள் பதிவு செய்துள்ளீர்கள். அட்டையை சரிபார்ப்போம்.",
      description:
        "வாக்காளர் பட்டியலில் பெயரைக் கண்டு வாக்களிப்பு நாளுக்கு முன் EPIC ஐ பதிவிறக்கு.",
    },
    te: {
      label: "నమోదు — EPIC వేచి ఉంది",
      headline: "మీరు నమోదయ్యారు. కార్డ్ ధృవీకరిద్దాం.",
      description:
        "ఓటర్ జాబితాలో పేరు కనుగొని పోలింగ్ రోజుకు ముందు EPIC డౌన్‌లోడ్ చేయండి.",
    },
    bn: {
      label: "নিবন্ধিত — EPIC অপেক্ষমাণ",
      headline: "আপনি নিবন্ধিত। এখন কার্ড যাচাই করি।",
      description:
        "ভোটার তালিকায় নাম খুঁজে ভোটের দিনের আগে EPIC ডাউনলোড করুন।",
    },
  },
  READY_TO_VOTE: {
    en: {
      label: "Ready to vote",
      headline: "You're ready for the booth.",
      description:
        "Confirm your polling station and plan your voting day. Carry your EPIC or an approved ID.",
    },
    hi: {
      label: "मतदान के लिए तैयार",
      headline: "आप बूथ के लिए तैयार हैं।",
      description:
        "अपना मतदान केंद्र पुष्ट करें और मतदान दिवस की योजना बनाएं। EPIC या स्वीकृत आईडी साथ रखें।",
    },
    mr: {
      label: "मतदानासाठी तयार",
      headline: "तुम्ही बूथसाठी तयार आहात.",
      description:
        "तुमचे मतदान केंद्र निश्चित करा आणि मतदान दिवसाची तयारी करा. EPIC किंवा मान्य ID सोबत ठेवा.",
    },
    gu: {
      label: "મતદાન માટે તૈયાર",
      headline: "તમે બૂથ માટે તૈયાર છો.",
      description:
        "તમારું મતદાન કેન્દ્ર ખાતરી કરો અને મતદાન દિવસની યોજના બનાવો. EPIC કે માન્ય ID સાથે રાખો.",
    },
    ta: {
      label: "வாக்களிக்க தயார்",
      headline: "நீங்கள் வாக்குச்சாவடிக்கு தயார்.",
      description:
        "உங்கள் வாக்குச்சாவடியை உறுதிசெய்து, வாக்களிப்பு நாளை திட்டமிடு. EPIC அல்லது அங்கீகரிக்கப்பட்ட ID எடுத்துசெல்.",
    },
    te: {
      label: "ఓటు వేయడానికి సిద్ధం",
      headline: "మీరు బూత్‌కు సిద్ధం.",
      description:
        "మీ పోలింగ్ కేంద్రాన్ని నిర్ధారించి రోజును ప్లాన్ చేయండి. EPIC లేదా ఆమోదిత ID తీసుకెళ్ళండి.",
    },
    bn: {
      label: "ভোটের জন্য প্রস্তুত",
      headline: "আপনি বুথের জন্য প্রস্তুত।",
      description:
        "আপনার ভোটকেন্দ্র নিশ্চিত করে ভোটের দিন পরিকল্পনা করুন। EPIC বা অনুমোদিত ID সঙ্গে রাখুন।",
    },
  },
}

// ---------------------------------------------------------------------------
// Step titles + subtitles for the four-step journey.
// ---------------------------------------------------------------------------
export const STEP_TITLES: Record<
  JourneyStepId,
  Record<Lang, { title: string; subtitle: string }>
> = {
  eligibility: {
    en: { title: "Check Eligibility", subtitle: "Confirm you meet the criteria set by the Election Commission." },
    hi: { title: "पात्रता जांचें", subtitle: "पुष्टि करें कि आप चुनाव आयोग के मानदंड पूरे करते हैं।" },
    mr: { title: "पात्रता तपासा", subtitle: "निवडणूक आयोगाच्या निकषांची पुष्टी करा." },
    gu: { title: "યોગ્યતા તપાસો", subtitle: "ચૂંટણી પંચના માપદંડો પૂર્ણ કરો છો તેની પુષ્ટિ કરો." },
    ta: { title: "தகுதியைச் சரிபார்", subtitle: "தேர்தல் ஆணையத்தின் அளவுகோல்களை பூர்த்திசெய்வதை உறுதிசெய்." },
    te: { title: "అర్హత తనిఖీ", subtitle: "ఎన్నికల సంఘ ప్రమాణాలను మీరు చేరుతున్నారని నిర్ధారించు." },
    bn: { title: "যোগ্যতা যাচাই", subtitle: "নির্বাচন কমিশনের মানদণ্ড পূরণ নিশ্চিত করুন।" },
  },
  registration: {
    en: { title: "Register as a Voter", subtitle: "Apply via Form 6 on the National Voter Services Portal." },
    hi: { title: "मतदाता पंजीकरण", subtitle: "NVSP पर फॉर्म 6 के माध्यम से आवेदन करें।" },
    mr: { title: "मतदार नोंदणी", subtitle: "NVSP वर फॉर्म 6 द्वारे अर्ज करा." },
    gu: { title: "મતદાર નોંધણી", subtitle: "NVSP પર ફોર્મ 6 દ્વારા અરજી કરો." },
    ta: { title: "வாக்காளராக பதிவு", subtitle: "NVSP-ல் படிவம் 6 மூலம் விண்ணப்பிக்க." },
    te: { title: "ఓటరుగా నమోదు", subtitle: "NVSP లో ఫారం 6 ద్వారా దరఖాస్తు." },
    bn: { title: "ভোটার নিবন্ধন", subtitle: "NVSP তে ফর্ম 6 এর মাধ্যমে আবেদন।" },
  },
  verification: {
    en: { title: "Verify Voter ID", subtitle: "Locate your name in the electoral roll and download your EPIC." },
    hi: { title: "वोटर आईडी सत्यापन", subtitle: "मतदाता सूची में अपना नाम खोजें और EPIC डाउनलोड करें।" },
    mr: { title: "मतदार ओळखपत्र पडताळा", subtitle: "मतदार यादीत नाव शोधा आणि EPIC डाउनलोड करा." },
    gu: { title: "મતદાર ID ચકાસણી", subtitle: "મતદાર યાદીમાં તમારું નામ શોધો અને EPIC ડાઉનલોડ કરો." },
    ta: { title: "வாக்காளர் ID சரிபார்", subtitle: "வாக்காளர் பட்டியலில் பெயரைக் கண்டு EPIC ஐ பதிவிறக்கு." },
    te: { title: "ఓటర్ ID ధృవీకరణ", subtitle: "ఓటర్ జాబితాలో పేరు కనుగొని EPIC డౌన్‌లోడ్ చేయి." },
    bn: { title: "ভোটার আইডি যাচাই", subtitle: "ভোটার তালিকায় নাম খুঁজে EPIC ডাউনলোড করুন।" },
  },
  voting: {
    en: { title: "Cast Your Vote", subtitle: "Find your polling booth and prepare for voting day." },
    hi: { title: "अपना वोट डालें", subtitle: "अपना मतदान बूथ खोजें और मतदान दिवस की तैयारी करें।" },
    mr: { title: "आपले मत द्या", subtitle: "मतदान केंद्र शोधा आणि मतदान दिवसाची तयारी करा." },
    gu: { title: "તમારો મત આપો", subtitle: "તમારું મતદાન કેન્દ્ર શોધો અને મતદાન દિવસની તૈયારી કરો." },
    ta: { title: "உங்கள் வாக்கை அளியுங்கள்", subtitle: "வாக்களிப்பு மையத்தைக் கண்டறிந்து வாக்களிப்பு நாளுக்கு தயாராகு." },
    te: { title: "మీ ఓటు వేయండి", subtitle: "పోలింగ్ బూత్ కనుగొని ఓటింగ్ రోజుకు సిద్ధపడు." },
    bn: { title: "আপনার ভোট দিন", subtitle: "ভোট কেন্দ্র খুঁজে ভোটের দিনের জন্য প্রস্তুতি নিন।" },
  },
}
