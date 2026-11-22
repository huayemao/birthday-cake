import { Language } from "@/types";

export interface BlogCopy {
  seoTitleSuffix: string;
  seoDescription: string;
  seoKeywords: string;
  introParagraph1: string;
  latestHeading: string;
  readMore: string;
  noPosts: string;
  backToBlog: string;
  homeSectionTitle: string;
  homeSectionSubtitle: string;
  viewAllPosts: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

export const BLOG_COPY: Record<Language, BlogCopy> = {
  zh: {
    seoTitleSuffix: "博客与技术手记",
    seoDescription:
      "探索电子生日蛋糕与线上吹蜡烛背后的产品故事、麦克风吹气识别算法优化、远程庆生创意与使用技巧，助你随时随地打造难忘的虚拟吹蜡烛体验。",
    seoKeywords:
      "线上吹蜡烛博客,电子生日蛋糕开发日志,麦克风吹气检测算法,虚拟生日蛋糕教程,异地庆生惊喜,浏览器吹蜡烛",
    introParagraph1:
      "欢迎来到电子生日蛋糕（birthday-cake.online）官方博客。在这里，我们记录这款浏览器端虚拟吹蜡烛 Web App 背后的故事。",
    latestHeading: "全部文章",
    readMore: "阅读全文",
    noPosts: "暂无博客文章。",
    backToBlog: "返回博客列表",
    homeSectionTitle: "最新博客文章",
    homeSectionSubtitle:
      "了解线上吹蜡烛背后的产品故事、麦克风吹气检测技术与远程庆生灵感",
    viewAllPosts: "查看全部博客",
    ctaTitle: "准备好体验线上吹蜡烛了吗？",
    ctaDescription:
      "无需下载安装，一分钟即可定制你的专属 3D 虚拟生日蛋糕、设置年龄数字蜡烛与祝福语，并一键分享给远方好友。",
    ctaPrimary: "立即定制生日蛋糕",
    ctaSecondary: "查看使用指南",
  },
  en: {
    seoTitleSuffix: "Blog, Stories & Tech Notes",
    seoDescription:
      "Read behind-the-scenes stories, microphone blow-detection engineering deep dives, and creative virtual birthday celebration tips from Electronic Birthday Cake (birthday-cake.online).",
    seoKeywords:
      "online birthday cake blog, blow candles online tips, microphone blow detection algorithm, virtual birthday surprise ideas, digital birthday cake web app",
    introParagraph1:
      "Welcome to the official Electronic Birthday Cake (birthday-cake.online) blog. Here, we share the stories behind this browser-based virtual candle-blowing web app.",
    latestHeading: "All Articles",
    readMore: "Read more",
    noPosts: "No posts yet.",
    backToBlog: "Back to Blog",
    homeSectionTitle: "Latest from the Blog",
    homeSectionSubtitle:
      "Explore product stories, microphone blow-detection insights, and virtual birthday tips",
    viewAllPosts: "View All Articles",
    ctaTitle: "Ready to Light Your Virtual Birthday Candles?",
    ctaDescription:
      "Customize a 3D birthday cake, pick classic or digit candles, write a heartfelt wish, and share an interactive blow-out link in seconds—no app download required.",
    ctaPrimary: "Customize Your Cake",
    ctaSecondary: "Read the Guide",
  },
  "zh-Hant": {
    seoTitleSuffix: "部落格與技術手記",
    seoDescription:
      "探索電子生日蛋糕與線上吹蠟燭背後的產品故事、麥克風吹氣偵測演算法優化、遠端慶生靈感與使用技巧，隨時隨地打造難忘的虛擬吹蠟燭體驗。",
    seoKeywords:
      "線上吹蠟燭部落格,電子生日蛋糕開發日誌,麥克風吹氣偵測,虛擬生日蛋糕教學,異地慶生驚喜",
    introParagraph1:
      "歡迎來到電子生日蛋糕（birthday-cake.online）官方部落格。在這裡，我們記錄這款瀏覽器端虛擬吹蠟燭 Web App 背後的故事。",
    latestHeading: "全部文章",
    readMore: "閱讀全文",
    noPosts: "目前尚無文章。",
    backToBlog: "返回文章列表",
    homeSectionTitle: "最新部落格文章",
    homeSectionSubtitle:
      "了解線上吹蠟燭背後的開發故事、麥克風吹氣技術與遠端慶生靈感",
    viewAllPosts: "查看全部文章",
    ctaTitle: "準備好體驗線上吹蠟燭了嗎？",
    ctaDescription:
      "免下載安裝，一分鐘即可自訂專屬 3D 虛擬生日蛋糕、設定年齡數字蠟燭與祝福語，並一鍵分享給親友。",
    ctaPrimary: "立即自訂生日蛋糕",
    ctaSecondary: "查看使用指南",
  },
  ja: {
    seoTitleSuffix: "ブログ・開発ストーリーと活用ガイド",
    seoDescription:
      "電子誕生日ケーキ（birthday-cake.online）の開発秘話、マイク吹き消し検知アルゴリズムの改善記録、オンライン誕生日サプライズのアイデアをお届けします。",
    seoKeywords:
      "オンラインろうそく吹き消し ブログ,バーチャル誕生日ケーキ,マイク吹き消し検知,リモート誕生日サプライズ",
    introParagraph1:
      "電子誕生日ケーキ（birthday-cake.online）公式ブログへようこそ。ここでは、ブラウザでろうそくを吹き消せる Web アプリの裏側にあるストーリーを記録しています。",
    latestHeading: "記事一覧",
    readMore: "続きを読む",
    noPosts: "まだ記事がありません。",
    backToBlog: "ブログ一覧に戻る",
    homeSectionTitle: "最新のブログ記事",
    homeSectionSubtitle:
      "開発ストーリーやマイク吹き消し検知の技術解説、オンライン誕生日のアイデアを紹介",
    viewAllPosts: "すべての記事を見る",
    ctaTitle: "バーチャル誕生日ケーキを作ってみませんか？",
    ctaDescription:
      "アプリ不要・ブラウザだけで 3D ケーキや数字ろうそく、お祝いメッセージをカスタマイズして、リンクひとつで友達に贈れます。",
    ctaPrimary: "ケーキをカスタマイズ",
    ctaSecondary: "使い方を見る",
  },
  fr: {
    seoTitleSuffix: "Blog, coulisses & astuces d'anniversaire en ligne",
    seoDescription:
      "Découvrez les coulisses de birthday-cake.online, nos avancées techniques sur la détection du souffle au micro et nos idées pour fêter un anniversaire virtuel inoubliable.",
    seoKeywords:
      "blog gâteau anniversaire en ligne, souffler bougies micro, détection du souffle audio, anniversaire virtuel à distance",
    introParagraph1:
      "Bienvenue sur le blog officiel de Gâteau d'Anniversaire Électronique (birthday-cake.online). Ici, nous racontons les histoires qui se cachent derrière cette application web de bougies virtuelles.",
    latestHeading: "Tous les articles",
    readMore: "Lire la suite",
    noPosts: "Aucun article pour le moment.",
    backToBlog: "Retour au blog",
    homeSectionTitle: "Derniers articles du blog",
    homeSectionSubtitle:
      "Histoires du projet, technologie de détection du souffle et conseils pour fêter un anniversaire en ligne",
    viewAllPosts: "Voir tous les articles",
    ctaTitle: "Prêt à souffler vos bougies en ligne ?",
    ctaDescription:
      "Personnalisez votre gâteau 3D, choisissez vos bougies et partagez un lien magique avec vos proches sans rien installer.",
    ctaPrimary: "Personnaliser le gâteau",
    ctaSecondary: "Lire le guide",
  },
  ar: {
    seoTitleSuffix: "المدونة والقصص والمقالات التقنية",
    seoDescription:
      "اقرأ قصص تطوير تطبيق كعكة عيد الميلاد الإلكترونية (birthday-cake.online)، وأسرار تحسين خوارزمية اكتشاف النفخ عبر الميكروفون، وأفكار الاحتفال بأعياد الميلاد عن بُعد.",
    seoKeywords:
      "مدونة كعكة عيد الميلاد الإلكترونية,إطفاء الشموع عبر الإنترنت,خوارزمية اكتشاف النفخ,احتفال عيد ميلاد افتراضي",
    introParagraph1:
      "مرحباً بك في المدونة الرسمية لتطبيق كعكة عيد الميلاد الإلكترونية (birthday-cake.online). هنا نروي القصص الكامنة وراء تطبيق الويب الافتراضي لإطفاء الشموع في المتصفح.",
    latestHeading: "جميع المقالات",
    readMore: "اقرأ المزيد",
    noPosts: "لا توجد مقالات بعد.",
    backToBlog: "العودة إلى المدونة",
    homeSectionTitle: "أحدث مقالات المدونة",
    homeSectionSubtitle:
      "اكتشف قصص التطوير وأسرار اكتشاف النفخ عبر الميكروفون ونصائح الاحتفال أونلاين",
    viewAllPosts: "عرض جميع المقالات",
    ctaTitle: "هل أنت مستعد لإشعال شموعك الافتراضية؟",
    ctaDescription:
      "خصّص كعكة عيد ميلاد ثلاثية الأبعاد واكتب رسالتك وشارك الرابط مع أصدقائك فوراً دون تحميل أي تطبيق.",
    ctaPrimary: "تخصيص الكعكة الآن",
    ctaSecondary: "تصفح دليل الاستخدام",
  },
  ko: {
    seoTitleSuffix: "블로그 · 개발 이야기 및 활용 팁",
    seoDescription:
      "전자 생일 케이크(birthday-cake.online)의 탄생 비화, 마이크 바람 불기 감지 알고리즘 개선기, 그리고 온라인 생일 축하 아이디어를 만나보세요.",
    seoKeywords:
      "온라인 생일 케이크 블로그, 촛불 불기 웹앱, 마이크 불기 감지 알고리즘, 비대면 생일 서프라이즈",
    introParagraph1:
      "전자 생일 케이크(birthday-cake.online) 공식 블로그에 오신 것을 환영합니다. 이곳에서는 브라우저에서 촛불을 불어 끄는 이 웹 앱 뒤에 담긴 이야기를 기록합니다.",
    latestHeading: "전체 글",
    readMore: "자세히 보기",
    noPosts: "아직 작성된 글이 없습니다.",
    backToBlog: "블로그 목록으로",
    homeSectionTitle: "최신 블로그 글",
    homeSectionSubtitle:
      "온라인 생일 케이크 개발 이야기, 마이크 바람 감지 기술과 축하 아이디어를 확인하세요",
    viewAllPosts: "모든 글 보기",
    ctaTitle: "지금 바로 가상 생일 촛불을 켜볼까요?",
    ctaDescription:
      "앱 설치 없이 3D 생일 케이크와 숫자 초, 축하 메시지를 꾸며 링크 하나로 소중한 사람에게 선물해 보세요.",
    ctaPrimary: "케이크 꾸미기",
    ctaSecondary: "사용 가이드 보기",
  },
  es: {
    seoTitleSuffix: "Blog, historias y consejos de cumpleaños online",
    seoDescription:
      "Descubre las historias detrás de birthday-cake.online, mejoras técnicas en la detección de soplido con micrófono y consejos para celebraciones de cumpleaños virtuales.",
    seoKeywords:
      "blog pastel cumpleaños online, soplar velas con micrófono, detección de soplido audio, sorpresa de cumpleaños virtual",
    introParagraph1:
      "Bienvenido al blog oficial de Pastel de Cumpleaños Electrónico (birthday-cake.online). Aquí compartimos las historias detrás de esta aplicación web para soplar velas en el navegador.",
    latestHeading: "Todos los artículos",
    readMore: "Leer más",
    noPosts: "Todavía no hay publicaciones.",
    backToBlog: "Volver al blog",
    homeSectionTitle: "Últimos artículos del blog",
    homeSectionSubtitle:
      "Historias de desarrollo, detección de soplido por micrófono e ideas para cumpleaños virtuales",
    viewAllPosts: "Ver todos los artículos",
    ctaTitle: "¿Listo para encender tus velas virtuales?",
    ctaDescription:
      "Personaliza tu pastel 3D, elige velas clásicas o de números y comparte tu enlace de cumpleaños al instante sin descargar nada.",
    ctaPrimary: "Personalizar pastel",
    ctaSecondary: "Ver guía de uso",
  },
  pt: {
    seoTitleSuffix: "Blog, histórias e dicas de aniversário online",
    seoDescription:
      "Confira os bastidores do birthday-cake.online, artigos técnicos sobre detecção de sopro no microfone e ideias criativas para comemorar aniversários virtuais.",
    seoKeywords:
      "blog bolo de aniversário online, soprar velas microfone, detecção de sopro áudio, surpresa de aniversário virtual",
    introParagraph1:
      "Bem-vindo ao blog oficial do Bolo de Aniversário Eletrônico (birthday-cake.online). Aqui registramos as histórias por trás deste web app de soprar velas virtuais no navegador.",
    latestHeading: "Todos os artigos",
    readMore: "Ler mais",
    noPosts: "Ainda não há artigos.",
    backToBlog: "Voltar ao blog",
    homeSectionTitle: "Últimos artigos do blog",
    homeSectionSubtitle:
      "Histórias de bastidores, tecnologia de detecção de sopro e ideias para aniversários online",
    viewAllPosts: "Ver todos os artigos",
    ctaTitle: "Pronto para acender suas velas virtuais?",
    ctaDescription:
      "Personalize um bolo 3D, escolha velas clássicas ou de números e envie o link de comemoração em segundos, direto pelo navegador.",
    ctaPrimary: "Personalizar bolo",
    ctaSecondary: "Ver guia de uso",
  },
  de: {
    seoTitleSuffix: "Blog, Hintergründe & Tipps für Online-Geburtstage",
    seoDescription:
      "Lies Entstehungsgeschichten, Technik-Einblicke zur Mikrofon-Pusterkennung und kreative Tipps für virtuelle Geburtstagsfeiern rund um birthday-cake.online.",
    seoKeywords:
      "Online Geburtstagstorte Blog, Kerzen auspusten Mikrofon, Pusterkennung Algorithmus, virtueller Geburtstag",
    introParagraph1:
      "Willkommen im offiziellen Blog von Elektronische Geburtstagstorte (birthday-cake.online). Hier erzählen wir die Geschichten hinter dieser virtuellen Kerzen-Web-App für den Browser.",
    latestHeading: "Alle Artikel",
    readMore: "Weiterlesen",
    noPosts: "Noch keine Beiträge vorhanden.",
    backToBlog: "Zurück zum Blog",
    homeSectionTitle: "Aktuelles aus dem Blog",
    homeSectionSubtitle:
      "Hintergrundgeschichten, Tipps zur Pusterkennung und Ideen für virtuelle Geburtstagsfeiern",
    viewAllPosts: "Alle Artikel ansehen",
    ctaTitle: "Bereit für deine virtuelle Geburtstagstorte?",
    ctaDescription:
      "Gestalte deine 3D-Torte, wähle Zahlen- oder klassische Kerzen und teile deinen persönlichen Link sofort im Browser – ganz ohne Download.",
    ctaPrimary: "Torte gestalten",
    ctaSecondary: "Anleitung lesen",
  },
  it: {
    seoTitleSuffix: "Blog, storie e consigli per compleanni online",
    seoDescription:
      "Scopri le storie dietro birthday-cake.online, gli approfondimenti tecnici sulla rilevazione del soffio via microfono e i consigli per feste di compleanno virtuali.",
    seoKeywords:
      "blog torta di compleanno online, soffiare candeline microfono, rilevazione soffio audio, compleanno virtuale",
    introParagraph1:
      "Benvenuto nel blog ufficiale di Torta di Compleanno Elettronica (birthday-cake.online). Qui raccontiamo le storie dietro questa web app per soffiare candeline virtuali nel browser.",
    latestHeading: "Tutti gli articoli",
    readMore: "Leggi tutto",
    noPosts: "Nessun articolo al momento.",
    backToBlog: "Torna al blog",
    homeSectionTitle: "Ultimi articoli del blog",
    homeSectionSubtitle:
      "Storie di sviluppo, tecnologia di rilevazione del soffio e consigli per compleanni online",
    viewAllPosts: "Vedi tutti gli articoli",
    ctaTitle: "Pronto ad accendere le tue candeline virtuali?",
    ctaDescription:
      "Personalizza la tua torta 3D, scegli candeline classiche o a numero e condividi il link con chi ami direttamente dal browser.",
    ctaPrimary: "Personalizza la torta",
    ctaSecondary: "Leggi la guida",
  },
  ru: {
    seoTitleSuffix: "Блог, истории разработки и советы",
    seoDescription:
      "Читайте истории создания birthday-cake.online, разборы алгоритма распознавания дуновения через микрофон и идеи для виртуальных поздравлений с днём рождения.",
    seoKeywords:
      "блог онлайн торт на день рождения, задуть свечи через микрофон, распознавание дуновения, виртуальный день рождения",
    introParagraph1:
      "Добро пожаловать в официальный блог «Электронного торта на день рождения» (birthday-cake.online). Здесь мы делимся историями, стоящими за этим веб-приложением для задувания свечей в браузере.",
    latestHeading: "Все статьи",
    readMore: "Читать далее",
    noPosts: "Пока нет публикаций.",
    backToBlog: "Назад в блог",
    homeSectionTitle: "Новое в блоге",
    homeSectionSubtitle:
      "Истории разработки, технологии распознавания дуновения и идеи для онлайн-поздравлений",
    viewAllPosts: "Все статьи блога",
    ctaTitle: "Готовы зажечь виртуальные свечи?",
    ctaDescription:
      "Настройте 3D-торт, выберите свечи и пожелание и отправьте ссылку близким за минуту — без установки приложений.",
    ctaPrimary: "Настроить торт",
    ctaSecondary: "Открыть руководство",
  },
  vi: {
    seoTitleSuffix: "Blog, câu chuyện sản phẩm & mẹo kỹ thuật",
    seoDescription:
      "Khám phá câu chuyện phát triển birthday-cake.online, kỹ thuật nhận diện tiếng thổi qua micro lọc tạp âm và các gợi ý tổ chức sinh nhật trực tuyến ý nghĩa.",
    seoKeywords:
      "blog bánh sinh nhật online, thổi nến qua micro, thuật toán nhận diện tiếng thổi, sinh nhật trực tuyến từ xa",
    introParagraph1:
      "Chào mừng bạn đến với blog chính thức của Bánh Sinh Nhật Điện Tử (birthday-cake.online). Tại đây chúng tôi ghi lại những câu chuyện đằng sau ứng dụng web thổi nến ảo trên trình duyệt này.",
    latestHeading: "Tất cả bài viết",
    readMore: "Đọc tiếp",
    noPosts: "Chưa có bài viết nào.",
    backToBlog: "Quay lại danh sách bài viết",
    homeSectionTitle: "Bài viết mới nhất",
    homeSectionSubtitle:
      "Khám phá câu chuyện phát triển, công nghệ nhận diện tiếng thổi và mẹo chúc mừng sinh nhật online",
    viewAllPosts: "Xem tất cả bài viết",
    ctaTitle: "Sẵn sàng thắp nến sinh nhật trực tuyến chưa?",
    ctaDescription:
      "Tùy chỉnh bánh sinh nhật 3D, chọn nến số theo tuổi, viết lời chúc và gửi ngay đường link bất ngờ mà không cần cài ứng dụng.",
    ctaPrimary: "Tùy chỉnh bánh ngay",
    ctaSecondary: "Xem hướng dẫn",
  },
  hi: {
    seoTitleSuffix: "ब्लॉग, कहानियां और तकनीकी लेख",
    seoDescription:
      "इलेक्ट्रॉनिक बर्थडे केक (birthday-cake.online) के पीछे की कहानियां, माइक्रोफोन फूंक पहचान तकनीक और ऑनलाइन जन्मदिन मनाने के रचनात्मक टिप्स पढ़ें।",
    seoKeywords:
      "ऑनलाइन बर्थडे केक ब्लॉग, माइक से मोमबत्ती बुझाना, ब्लो डिटेक्शन एल्गोरिदम, वर्चुअल जन्मदिन सरप्राइज",
    introParagraph1:
      "इलेक्ट्रॉनिक बर्थडे केक (birthday-cake.online) के आधिकारिक ब्लॉग में आपका स्वागत है। यहाँ हम इस ब्राउज़र-आधारित वर्चुअल मोमबत्ती बुझाने वाले वेब ऐप के पीछे की कहानियां साझा करते हैं।",
    latestHeading: "सभी लेख",
    readMore: "और पढ़ें",
    noPosts: "अभी कोई लेख नहीं है।",
    backToBlog: "ब्लॉग सूची पर लौटें",
    homeSectionTitle: "नवीनतम ब्लॉग लेख",
    homeSectionSubtitle:
      "प्रोडक्ट की कहानियां, माइक्रोफोन फूंक पहचान तकनीक और वर्चुअल जन्मदिन के आइडियाज पढ़ें",
    viewAllPosts: "सभी लेख देखें",
    ctaTitle: "क्या आप वर्चुअल जन्मदिन मोमबत्तियां जलाने के लिए तैयार हैं?",
    ctaDescription:
      "बिना कोई ऐप डाउनलोड किए, एक मिनट में 3D केक सजाएं, उम्र वाली मोमबत्तियां चुनें और दोस्तों के साथ लिंक शेयर करें।",
    ctaPrimary: "अपना केक सजाएं",
    ctaSecondary: "उपयोग गाइड पढ़ें",
  },
  id: {
    seoTitleSuffix: "Blog, Cerita Produk & Catatan Teknis",
    seoDescription:
      "Baca cerita di balik birthday-cake.online, pembahasan teknis deteksi tiupan mikrofon yang akurat, dan tips merayakan ulang tahun virtual yang berkesan.",
    seoKeywords:
      "blog kue ulang tahun online, tiup lilin lewat mikrofon, algoritma deteksi tiupan, kejutan ulang tahun virtual",
    introParagraph1:
      "Selamat datang di blog resmi Kue Ulang Tahun Elektronik (birthday-cake.online). Di sini kami membagikan kisah di balik aplikasi web tiup lilin virtual berbasis browser ini.",
    latestHeading: "Semua Artikel",
    readMore: "Baca selengkapnya",
    noPosts: "Belum ada artikel.",
    backToBlog: "Kembali ke Blog",
    homeSectionTitle: "Artikel Blog Terbaru",
    homeSectionSubtitle:
      "Jelajahi cerita produk, teknologi deteksi tiupan mikrofon, dan ide ulang tahun virtual",
    viewAllPosts: "Lihat Semua Artikel",
    ctaTitle: "Siap Menyalakan Lilin Ulang Tahun Virtual Anda?",
    ctaDescription:
      "Kustomisasi kue 3D, pilih lilin angka atau klasik, tulis ucapan hangat, dan bagikan tautannya dalam hitungan detik tanpa unduh aplikasi.",
    ctaPrimary: "Atur Kue Sekarang",
    ctaSecondary: "Lihat Panduan",
  },
  th: {
    seoTitleSuffix: "บล็อก เรื่องราวเบื้องหลัง และเทคนิคการใช้งาน",
    seoDescription:
      "อ่านเรื่องราวเบื้องหลัง birthday-cake.online เทคนิคการพัฒนาอัลกอริทึมตรวจจับเสียงเป่าผ่านไมโครโฟน และไอเดียฉลองวันเกิดออนไลน์สุดประทับใจ",
    seoKeywords:
      "บล็อกเป่าเทียนวันเกิดออนไลน์, เค้กวันเกิดเสมือนจริง, ตรวจจับเสียงเป่าผ่านไมค์, เซอร์ไพรส์วันเกิดออนไลน์",
    introParagraph1:
      "ยินดีต้อนรับสู่บล็อกอย่างเป็นทางการของเค้กวันเกิดอิเล็กทรอนิกส์ (birthday-cake.online) ที่นี่เราบอกเล่าเรื่องราวเบื้องหลังเว็บแอปเป่าเทียนเสมือนจริงบนเบราว์เซอร์นี้",
    latestHeading: "บทความทั้งหมด",
    readMore: "อ่านเพิ่มเติม",
    noPosts: "ยังไม่มีบทความ",
    backToBlog: "กลับไปหน้ารวมบล็อก",
    homeSectionTitle: "บทความบล็อกล่าสุด",
    homeSectionSubtitle:
      "สำรวจเรื่องราวการพัฒนา เทคโนโลยีตรวจจับเสียงเป่าผ่านไมโครโฟน และไอเดียฉลองวันเกิดออนไลน์",
    viewAllPosts: "ดูบทความทั้งหมด",
    ctaTitle: "พร้อมจุดเทียนบนเค้กวันเกิดเสมือนจริงแล้วหรือยัง?",
    ctaDescription:
      "ตกแต่งเค้ก 3D เลือกเทียนตัวเลข เขียนคำอวยพร แล้วแชร์ลิงก์ให้เพื่อนได้ทันทีโดยไม่ต้องติดตั้งแอป",
    ctaPrimary: "ตกแต่งเค้กเลย",
    ctaSecondary: "อ่านคู่มือการใช้งาน",
  },
  ms: {
    seoTitleSuffix: "Blog, Kisah Produk & Nota Teknikal",
    seoDescription:
      "Baca kisah di sebalik birthday-cake.online, perkongsian teknikal pengesanan tiupan mikrofon yang tepat dan tip sambutan hari jadi maya.",
    seoKeywords:
      "blog kek hari jadi online, tiup lilin guna mikrofon, algoritma pengesanan tiupan, kejutan hari jadi maya",
    introParagraph1:
      "Selamat datang ke blog rasmi Kek Hari Jadi Elektronik (birthday-cake.online). Di sini kami berkongsi kisah di sebalik aplikasi web tiup lilin maya berasaskan pelayar ini.",
    latestHeading: "Semua Artikel",
    readMore: "Baca selanjutnya",
    noPosts: "Belum ada artikel.",
    backToBlog: "Kembali ke Blog",
    homeSectionTitle: "Artikel Blog Terkini",
    homeSectionSubtitle:
      "Terokai kisah pembangunan, teknologi pengesanan tiupan mikrofon dan idea hari jadi maya",
    viewAllPosts: "Lihat Semua Artikel",
    ctaTitle: "Sedia Menyalakan Lilin Hari Jadi Maya Anda?",
    ctaDescription:
      "Hias kek 3D, pilih lilin nombor atau klasik, tulis ucapan istimewa dan kongsi pautan dalam beberapa saat tanpa muat turun aplikasi.",
    ctaPrimary: "Hias Kek Sekarang",
    ctaSecondary: "Baca Panduan",
  },
  tr: {
    seoTitleSuffix: "Blog, Geliştirme Hikayeleri ve Teknik Notlar",
    seoDescription:
      "birthday-cake.online'ın perde arkasını, mikrofonla üfleme algılama algoritması iyileştirmelerini ve online doğum günü kutlama fikirlerini keşfedin.",
    seoKeywords:
      "online doğum günü pastası blog, mikrofonla mum üfleme, üfleme algılama algoritması, sanal doğum günü sürprizi",
    introParagraph1:
      "Elektronik Doğum Günü Pastası (birthday-cake.online) resmi bloguna hoş geldiniz. Burada tarayıcı tabanlı bu sanal mum üfleme web uygulamasının arkasındaki hikayeleri paylaşıyoruz.",
    latestHeading: "Tüm Yazılar",
    readMore: "Devamını oku",
    noPosts: "Henüz yazı yok.",
    backToBlog: "Bloga dön",
    homeSectionTitle: "Blogdan Son Yazılar",
    homeSectionSubtitle:
      "Geliştirme hikayelerini, mikrofon üfleme algılama teknolojisini ve online doğum günü fikirlerini keşfedin",
    viewAllPosts: "Tüm Yazıları Gör",
    ctaTitle: "Sanal Doğum Günü Mumlarını Yakmaya Hazır mısın?",
    ctaDescription:
      "Uygulama indirmeden 3D pastanı tasarla, rakam veya klasik mum seç, mesajını yaz ve tek bağlantıyla sevdiklerine gönder.",
    ctaPrimary: "Pastanı Tasarla",
    ctaSecondary: "Kılavuzu Oku",
  },
  ur: {
    seoTitleSuffix: "بلاگ، کہانیاں اور تکنیکی نوٹس",
    seoDescription:
      "الیکٹرانک سالگرہ کیک (birthday-cake.online) کے پسِ پردہ کہانیاں، مائیکروفون پھونک شناخت الگورتھم کی بہتری اور آن لائن سالگرہ منانے کے مشورے پڑھیں۔",
    seoKeywords:
      "آن لائن سالگرہ کیک بلاگ, مائیکروفون سے موم بتی بجھانا, پھونک شناخت الگورتھم, ورچوئل سالگرہ سرپرائز",
    introParagraph1:
      "الیکٹرانک سالگرہ کیک (birthday-cake.online) کے آفیشل بلاگ میں خوش آمدید۔ یہاں ہم اس براؤزر پر مبنی ورچوئل موم بتی بجھانے والی ویب ایپ کے پیچھے کی کہانیاں بیان کرتے ہیں۔",
    latestHeading: "تمام مضامین",
    readMore: "مزید پڑھیں",
    noPosts: "ابھی کوئی مضمون موجود نہیں۔",
    backToBlog: "بلاگ فہرست پر واپس",
    homeSectionTitle: "بلاگ کے تازہ ترین مضامین",
    homeSectionSubtitle:
      "پروڈکٹ کی کہانیاں، مائیکروفون پھونک شناخت ٹیکنالوجی اور آن لائن سالگرہ کے مشورے پڑھیں",
    viewAllPosts: "تمام مضامین دیکھیں",
    ctaTitle: "کیا آپ ورچوئل سالگرہ کی موم بتیاں جلانے کے لیے تیار ہیں؟",
    ctaDescription:
      "بغیر کسی ایپ ڈاؤن لوڈ کے اپنا 3D کیک سجائیں، ہندسوں والی موم بتیاں منتخب کریں اور ایک لنک کے ذریعے دوستوں کو بھیجیں۔",
    ctaPrimary: "اپنا کیک سجائیں",
    ctaSecondary: "استعمال کی رہنمائی دیکھیں",
  },
};

export function getBlogCopy(lang: Language): BlogCopy {
  return BLOG_COPY[lang] || BLOG_COPY.en;
}
