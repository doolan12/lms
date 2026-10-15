// Languages learners can show translations in (top 10 languages other than English, 2021 Census).
export type Lang = {
  code: string;
  english: string;
  native: string;
  dir: "ltr" | "rtl";
  /** Notice shown with every translation, in that language. */
  notice: string;
  /** Label for the quiz "show translation" toggle, in that language. */
  show: string;
};

export const LANGUAGES: Lang[] = [
  { code: "zh-Hans", english: "Mandarin (Simplified Chinese)", native: "简体中文", dir: "ltr",
    notice: "翻译仅帮助您学习。英文版本为正式版本，您的考核将以英文进行。", show: "显示中文翻译" },
  { code: "ar", english: "Arabic", native: "العربية", dir: "rtl",
    notice: "الترجمة لمساعدتك على التعلّم فقط. النسخة الإنجليزية هي النسخة الرسمية، وسيكون تقييمك باللغة الإنجليزية.", show: "عرض الترجمة العربية" },
  { code: "vi", english: "Vietnamese", native: "Tiếng Việt", dir: "ltr",
    notice: "Bản dịch chỉ giúp bạn học. Bản tiếng Anh là bản chính thức, và bài đánh giá của bạn sẽ bằng tiếng Anh.", show: "Hiện bản dịch tiếng Việt" },
  { code: "zh-Hant", english: "Cantonese (Traditional Chinese)", native: "繁體中文", dir: "ltr",
    notice: "翻譯只為幫助你學習。英文版本為正式版本，你的考核將以英文進行。", show: "顯示中文翻譯" },
  { code: "pa", english: "Punjabi", native: "ਪੰਜਾਬੀ", dir: "ltr",
    notice: "ਅਨੁਵਾਦ ਸਿਰਫ਼ ਤੁਹਾਨੂੰ ਸਿੱਖਣ ਵਿੱਚ ਮਦਦ ਲਈ ਹੈ। ਅੰਗਰੇਜ਼ੀ ਵਾਲਾ ਰੂਪ ਹੀ ਅਧਿਕਾਰਤ ਹੈ, ਅਤੇ ਤੁਹਾਡਾ ਮੁਲਾਂਕਣ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਹੋਵੇਗਾ।", show: "ਪੰਜਾਬੀ ਅਨੁਵਾਦ ਦਿਖਾਓ" },
  { code: "el", english: "Greek", native: "Ελληνικά", dir: "ltr",
    notice: "Η μετάφραση είναι μόνο για να σας βοηθήσει να μάθετε. Η αγγλική έκδοση είναι η επίσημη και η αξιολόγησή σας θα γίνει στα αγγλικά.", show: "Εμφάνιση μετάφρασης" },
  { code: "it", english: "Italian", native: "Italiano", dir: "ltr",
    notice: "La traduzione serve solo ad aiutarti a imparare. La versione inglese è quella ufficiale e la tua valutazione sarà in inglese.", show: "Mostra la traduzione" },
  { code: "tl", english: "Filipino / Tagalog", native: "Filipino", dir: "ltr",
    notice: "Ang salin ay para lamang tulungan kang matuto. Ang bersyong Ingles ang opisyal, at sa Ingles gagawin ang iyong pagtatasa.", show: "Ipakita ang salin" },
  { code: "hi", english: "Hindi", native: "हिन्दी", dir: "ltr",
    notice: "अनुवाद केवल सीखने में आपकी मदद के लिए है। अंग्रेज़ी संस्करण ही आधिकारिक है, और आपका मूल्यांकन अंग्रेज़ी में होगा।", show: "हिन्दी अनुवाद दिखाएँ" },
  { code: "es", english: "Spanish", native: "Español", dir: "ltr",
    notice: "La traducción es solo para ayudarte a aprender. La versión en inglés es la oficial y tu evaluación será en inglés.", show: "Mostrar traducción" },
];

export const LANG_COOKIE = "lang";
export const findLang = (code?: string | null) => LANGUAGES.find((l) => l.code === code);
