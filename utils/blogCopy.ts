import { Language } from "@/types";

export interface BlogTopicHighlight {
  title: string;
  description: string;
}

export interface BlogCopy {
  seoTitleSuffix: string;
  seoDescription: string;
  seoKeywords: string;
  introSubtitle: string;
  introParagraph1: string;
  introParagraph2: string;
  topics: BlogTopicHighlight[];
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
    introSubtitle: "产品故事 · 音频技术 · 远程庆生灵感",
    introParagraph1:
      "欢迎来到电子生日蛋糕（birthday-cake.online）官方博客。在这里，我们记录这款浏览器端虚拟吹蜡烛 Web App 的诞生初衷、持续迭代的幕后故事，以及我们在 Web Audio 麦克风吹气识别、环境降噪与 3D 交互氛围打磨上的实战经验。",
    introParagraph2:
      "无论你是想了解如何在线上为异地好友策划一场充满仪式感的虚拟吹蜡烛惊喜，还是对前端实时声学检测与交互设计感兴趣，都能在这里找到实用的指南与深度分享。",
    topics: [
      {
        title: "产品诞生与迭代",
        description: "从忘买蜡烛的真实故事出发，记录每一次功能打磨与体验升级。",
      },
      {
        title: "吹气识别与声学优化",
        description: "深入分享麦克风吹气算法、环境降噪校准与跨设备兼容实战。",
      },
      {
        title: "线上庆生与玩法指南",
        description: "解锁定制蛋糕、数字蜡烛、祝福链接分享等安全环保的庆生方式。",
      },
    ],
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
    introSubtitle: "Product Stories · Audio Engineering · Celebration Ideas",
    introParagraph1:
      "Welcome to the official Electronic Birthday Cake (birthday-cake.online) blog. Here we share the origin story behind our browser-based virtual candle-blowing web app, product updates, and real-world engineering insights on Web Audio microphone blow detection and noise filtering.",
    introParagraph2:
      "Whether you are planning a remote birthday surprise for friends across the globe, troubleshooting microphone sensitivity in noisy places, or curious about how interactive 3D birthday celebrations are built, our articles have you covered.",
    topics: [
      {
        title: "Origin & Product Updates",
        description:
          "How forgetting birthday candles inspired a web app used around the world.",
      },
      {
        title: "Blow Detection & Audio Tech",
        description:
          "Deep dives into real blow audio analysis, calibration, and noise filtering.",
      },
      {
        title: "Virtual Celebration Tips",
        description:
          "Creative, eco-friendly ways to customize cakes and share birthday wishes online.",
      },
    ],
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
    introSubtitle: "產品故事 · 音訊技術 · 遠端慶生靈感",
    introParagraph1:
      "歡迎來到電子生日蛋糕（birthday-cake.online）官方部落格。我們在這裡記錄這款瀏覽器端虛擬吹蠟燭 Web App 的誕生初衷、版本迭代故事，以及 Web Audio 麥克風吹氣識別與環境降噪的實戰經驗。",
    introParagraph2:
      "無論你想為遠方親友策劃一場溫馨的線上吹蠟燭驚喜，還是對前端即時聲學偵測與互動設計感興趣，都能在這裡找到實用的教學與分享。",
    topics: [
      {
        title: "產品誕生與迭代",
        description: "從忘記買蠟燭的真實經歷出發，記錄每次功能與體驗升級。",
      },
      {
        title: "吹氣偵測與聲學優化",
        description: "分享麥克風吹氣演算法、降噪校準與跨裝置相容經驗。",
      },
      {
        title: "線上慶生靈感指南",
        description: "探索自訂蛋糕、數字蠟燭與遠端分享連結等安全環保的慶生方式。",
      },
    ],
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
    introSubtitle: "開発ストーリー · 音声認識技術 · オンラインお祝いアイデア",
    introParagraph1:
      "電子誕生日ケーキ（birthday-cake.online）公式ブログへようこそ。ブラウザだけでろうそくを吹き消せる Web アプリの誕生秘話から、マイクによる吹き消し検知アルゴリズムやノイズ対策の技術解説、最新アップデート情報まで発信しています。",
    introParagraph2:
      "遠く離れた大切な人へオンラインで誕生日サプライズを贈るコツや、騒がしい環境でも快適に使うためのヒントをぜひご覧ください。",
    topics: [
      {
        title: "開発の原点と進化",
        description: "ろうそくを買い忘れた実体験から始まったアプリ改善の記録。",
      },
      {
        title: "吹き消し検知と音響技術",
        description: "実際の音声サンプル解析やキャリブレーション、ノイズ対策の裏側。",
      },
      {
        title: "オンラインお祝いガイド",
        description: "安全でエコなバーチャルケーキのカスタマイズと共有のコツ。",
      },
    ],
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
    introSubtitle: "Coulisses · Ingénierie Audio · Idées de Fête",
    introParagraph1:
      "Bienvenue sur le blog officiel de Gâteau d'Anniversaire Électronique (birthday-cake.online). Nous y partageons l'histoire du projet, nos dernières nouveautés et nos retours techniques sur la détection du souffle au microphone et le filtrage du bruit ambiant.",
    introParagraph2:
      "Que vous souhaitiez préparer une surprise d'anniversaire à distance ou comprendre comment nos bougies virtuelles réagissent à votre souffle en temps réel, explorez nos articles ci-dessous.",
    topics: [
      {
        title: "Histoire & Nouveautés",
        description: "Comment un oubli de bougies a donné naissance à cette web app.",
      },
      {
        title: "Audio & Détection du Souffle",
        description: "Analyse d'échantillons réels, calibrage et filtrage du bruit.",
      },
      {
        title: "Idées de Célébration",
        description: "Astuces pour créer et partager un gâteau virtuel sûr et écologique.",
      },
    ],
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
    introSubtitle: "قصص المنتج · تقنيات الصوت · أفكار الاحتفال",
    introParagraph1:
      "مرحباً بك في المدونة الرسمية لتطبيق كعكة عيد الميلاد الإلكترونية (birthday-cake.online). نشارك هنا قصة إنشاء التطبيق وتحديثاته المستمرة وتجاربنا العملية في تطوير خوارزمية اكتشاف النفخ وتقليل الضوضاء عبر الميكروفون.",
    introParagraph2:
      "سواء كنت تخطط لمفاجأة عيد ميلاد عن بُعد لأحبائك أو تهتم بكيفية عمل المؤثرات التفاعلية والصوتية في المتصفح، ستجد هنا مقالات مفيدة وملهمة.",
    topics: [
      {
        title: "قصة البداية والتطوير",
        description: "كيف ألهمنا نسيان الشموع لبناء تطبيق ويب يجمع الأصدقاء حول العالم.",
      },
      {
        title: "تقنيات الصوت والنفخ",
        description: "تحليل عينات النفخ الحقيقية ومعايرة الميكروفون وعزل الضوضاء.",
      },
      {
        title: "أفكار احتفال افتراضية",
        description: "طرق مبتكرة وآمنة لتخصيص الكعكة ومشاركة التهاني عبر رابط واحد.",
      },
    ],
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
    introSubtitle: "제품 스토리 · 오디오 기술 · 온라인 생일 팁",
    introParagraph1:
      "전자 생일 케이크(birthday-cake.online) 공식 블로그에 오신 것을 환영합니다. 브라우저에서 바로 촛불을 불어 끌 수 있는 웹 앱을 만들게 된 계기부터, 실제 바람 샘플을 활용한 마이크 인식 알고리즘 개선과 업데이트 소식을 전해드립니다.",
    introParagraph2:
      "멀리 떨어진 친구에게 특별한 온라인 생일 서프라이즈를 준비하거나, 시끄러운 환경에서도 안정적으로 촛불을 끄는 노하우가 궁금하다면 아래 글을 확인해 보세요.",
    topics: [
      {
        title: "탄생 비화와 업데이트",
        description: "생일 초를 깜빡한 경험에서 시작된 서비스 개선 기록.",
      },
      {
        title: "바람 감지 및 오디오 기술",
        description: "실제 입김 샘플 분석, 캘리브레이션, 주변 소음 필터링 노하우.",
      },
      {
        title: "온라인 생일 축하 가이드",
        description: "안전하고 친환경적인 가상 케이크 꾸미기와 링크 공유 팁.",
      },
    ],
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
    introSubtitle: "Historias del producto · Tecnología de audio · Ideas de celebración",
    introParagraph1:
      "Bienvenido al blog oficial de Pastel de Cumpleaños Electrónico (birthday-cake.online). Aquí compartimos el origen del proyecto, las mejoras continuas y detalles técnicos sobre cómo detectamos el soplido real por micrófono filtrando el ruido ambiental.",
    introParagraph2:
      "Tanto si quieres organizar una sorpresa de cumpleaños a distancia como si te apasiona la tecnología web interactiva, encontrarás artículos prácticos e inspiradores.",
    topics: [
      {
        title: "Origen y evolución",
        description: "Cómo olvidar unas velas inspiró una web app usada en todo el mundo.",
      },
      {
        title: "Audio y detección de soplido",
        description: "Análisis de muestras reales, calibración y filtrado de ruido.",
      },
      {
        title: "Guías de celebración online",
        description: "Ideas seguras y ecológicas para personalizar y compartir tu pastel.",
      },
    ],
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
    introSubtitle: "Bastidores · Engenharia de Áudio · Ideias de Festa",
    introParagraph1:
      "Bem-vindo ao blog oficial do Bolo de Aniversário Eletrônico (birthday-cake.online). Aqui contamos a história do projeto, novidades de versão e detalhes técnicos sobre a detecção de sopro pelo microfone e filtragem de ruído ambiente.",
    introParagraph2:
      "Seja para preparar uma surpresa de aniversário à distância ou entender como a detecção de áudio funciona no navegador, explore nossos conteúdos abaixo.",
    topics: [
      {
        title: "Origem e evolução",
        description: "Como esquecer as velas inspirou um web app usado no mundo todo.",
      },
      {
        title: "Áudio e detecção de sopro",
        description: "Amostras reais, calibração de microfone e redução de ruído.",
      },
      {
        title: "Dicas de celebração online",
        description: "Formas criativas e ecológicas de personalizar e compartilhar bolos.",
      },
    ],
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
    introSubtitle: "Produktgeschichten · Audiotechnik · Feier-Ideen",
    introParagraph1:
      "Willkommen im offiziellen Blog von Elektronische Geburtstagstorte (birthday-cake.online). Hier teilen wir die Geschichte hinter unserer Browser-App, Produkt-Updates und technische Einblicke in die Pusterkennung per Mikrofon und Rauschunterdrückung.",
    introParagraph2:
      "Egal, ob du eine Geburtstagsüberraschung aus der Ferne planst oder erfahren möchtest, wie präzise Audio-Erkennung im Browser funktioniert – hier findest du spannende Artikel.",
    topics: [
      {
        title: "Entstehung & Updates",
        description: "Wie vergessene Kerzen eine weltweite Web-App inspiriert haben.",
      },
      {
        title: "Pusterkennung & Audio",
        description: "Echte Audio-Samples, Kalibrierung und Filterung von Umgebungslärm.",
      },
      {
        title: "Tipps für Online-Feiern",
        description: "Sichere, nachhaltige Ideen zum Gestalten und Teilen deiner Torte.",
      },
    ],
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
    introSubtitle: "Storie del progetto · Tecnologia Audio · Idee per festeggiare",
    introParagraph1:
      "Benvenuto nel blog ufficiale di Torta di Compleanno Elettronica (birthday-cake.online). Condividiamo qui la nascita del progetto, gli aggiornamenti e i retroscena tecnici su come rileviamo il soffio dal microfono filtrando i rumori ambientali.",
    introParagraph2:
      "Che tu stia preparando una sorpresa di compleanno a distanza o voglia scoprire come funziona l'audio interattivo nel browser, troverai articoli utili e pratici.",
    topics: [
      {
        title: "Origini e novità",
        description: "Come aver dimenticato le candeline ha dato vita a questa web app.",
      },
      {
        title: "Audio e rilevazione del soffio",
        description: "Campioni reali, calibrazione e filtraggio dei rumori di fondo.",
      },
      {
        title: "Idee per feste virtuali",
        description: "Modi creativi e sostenibili per personalizzare e condividere auguri.",
      },
    ],
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
    introSubtitle: "Истории проекта · Аудиотехнологии · Идеи поздравлений",
    introParagraph1:
      "Добро пожаловать в официальный блог «Электронного торта на день рождения» (birthday-cake.online). Здесь мы делимся историей появления приложения, обновлениями и техническим опытом распознавания дуновения через микрофон и фильтрации шума.",
    introParagraph2:
      "Планируете поздравить близких на расстоянии или интересуетесь обработкой звука в браузере? Читайте наши статьи и полезные руководства.",
    topics: [
      {
        title: "История и обновления",
        description: "Как забытые свечи вдохновили на создание веб-приложения.",
      },
      {
        title: "Распознавание дуновения",
        description: "Анализ реальных сэмплов, калибровка и защита от фонового шума.",
      },
      {
        title: "Идеи для онлайн-праздника",
        description: "Безопасные и удобные способы оформить и отправить торт по ссылке.",
      },
    ],
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
    introSubtitle: "Câu chuyện sản phẩm · Kỹ thuật âm thanh · Gợi ý chúc mừng",
    introParagraph1:
      "Chào mừng bạn đến với blog chính thức của Bánh Sinh Nhật Điện Tử (birthday-cake.online). Tại đây chúng tôi chia sẻ hành trình xây dựng ứng dụng thổi nến trên trình duyệt, các bản cập nhật mới và kinh nghiệm xử lý nhận diện tiếng thổi qua micro, lọc ồn môi trường.",
    introParagraph2:
      "Dù bạn đang muốn tạo bất ngờ sinh nhật từ xa cho người thân hay tò mò về cách ứng dụng xử lý âm thanh theo thời gian thực, các bài viết dưới đây sẽ mang lại nhiều thông tin hữu ích.",
    topics: [
      {
        title: "Khởi nguồn & Cập nhật",
        description: "Từ sự cố quên mua nến đến ứng dụng web được yêu thích khắp nơi.",
      },
      {
        title: "Nhận diện tiếng thổi & Âm thanh",
        description: "Phân tích mẫu âm thanh thật, hiệu chuẩn micro và lọc tạp âm.",
      },
      {
        title: "Mẹo tổ chức sinh nhật online",
        description: "Cách tùy chỉnh bánh 3D, nến số và gửi lời chúc an toàn, tiện lợi.",
      },
    ],
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
    introSubtitle: "प्रोडक्ट कहानियां · ऑडियो तकनीक · जश्न के आइडियाज",
    introParagraph1:
      "इलेक्ट्रॉनिक बर्थडे केक (birthday-cake.online) के आधिकारिक ब्लॉग में आपका स्वागत है। यहाँ हम इस ब्राउज़र-आधारित वर्चुअल मोमबत्ती बुझाने वाले वेब ऐप की कहानी, नए अपडेट्स और माइक्रोफोन फूंक पहचान व शोर फ़िल्टरिंग के तकनीकी अनुभव साझा करते हैं।",
    introParagraph2:
      "चाहे आप दूर बैठे दोस्तों के लिए ऑनलाइन जन्मदिन सरप्राइज प्लान कर रहे हों या रियल-टाइम ऑडियो डिटेक्शन के बारे में जानना चाहते हों, हमारे लेख आपके लिए उपयोगी होंगे।",
    topics: [
      {
        title: "उत्पत्ति और अपडेट्स",
        description: "मोमबत्ती भूलने के एक सच्चे किस्से से शुरू हुए इस वेब ऐप का सफर।",
      },
      {
        title: "फूंक पहचान और ऑडियो तकनीक",
        description: "असली ऑडियो सैंपल विश्लेषण, कैलिब्रेशन और शोर फ़िल्टरिंग की जानकारी।",
      },
      {
        title: "ऑनलाइन जश्न गाइड",
        description: "सुरक्षित और इको-फ्रेंडली तरीके से वर्चुअल केक सजाने व शेयर करने के टिप्स।",
      },
    ],
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
    introSubtitle: "Cerita Produk · Teknik Audio · Ide Perayaan",
    introParagraph1:
      "Selamat datang di blog resmi Kue Ulang Tahun Elektronik (birthday-cake.online). Kami membagikan kisah lahirnya aplikasi web tiup lilin virtual ini, pembaruan fitur, serta pengalaman teknis dalam menyempurnakan deteksi tiupan mikrofon dan penyaringan kebisingan.",
    introParagraph2:
      "Baik Anda sedang menyiapkan kejutan ulang tahun jarak jauh maupun tertarik dengan pengolahan audio interaktif di browser, temukan panduan dan artikel menarik di sini.",
    topics: [
      {
        title: "Asal Usul & Pembaruan",
        description: "Bagaimana momen lupa membeli lilin menginspirasi aplikasi web ini.",
      },
      {
        title: "Deteksi Tiupan & Audio",
        description: "Analisis sampel tiupan nyata, kalibrasi mikrofon, dan filter kebisingan.",
      },
      {
        title: "Tips Perayaan Virtual",
        description: "Cara kreatif dan ramah lingkungan untuk menghias serta berbagi kue online.",
      },
    ],
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
    introSubtitle: "เรื่องราวเบื้องหลัง · เทคโนโลยีเสียง · ไอเดียฉลองวันเกิด",
    introParagraph1:
      "ยินดีต้อนรับสู่บล็อกอย่างเป็นทางการของเค้กวันเกิดอิเล็กทรอนิกส์ (birthday-cake.online) ที่นี่เรารวบรวมเรื่องราวการพัฒนาเว็บแอปเป่าเทียนผ่านเบราว์เซอร์ การอัปเดตล่าสุด และเบื้องหลังการปรับปรุงระบบตรวจจับเสียงเป่าลมและกรองเสียงรบกวน",
    introParagraph2:
      "ไม่ว่าคุณจะกำลังวางแผนเซอร์ไพรส์วันเกิดให้คนไกล หรือสนใจเบื้องหลังการประมวลผลเสียงบนเว็บ สามารถอ่านบทความทั้งหมดได้ที่นี่",
    topics: [
      {
        title: "จุดเริ่มต้นและอัปเดต",
        description: "จากวันที่ลืมซื้อเทียนวันเกิด สู่เว็บแอปที่ช่วยให้หลายคนเป่าเทียนได้ทุกที่",
      },
      {
        title: "ระบบตรวจจับเสียงเป่า",
        description: "เจาะลึกการวิเคราะห์เสียงเป่าจริง การปรับเทียบไมค์ และการตัดเสียงรบกวน",
      },
      {
        title: "ไอเดียฉลองวันเกิดออนไลน์",
        description: "วิธีตกแต่งเค้ก 3D และแชร์ลิงก์อวยพรอย่างปลอดภัยและรักษ์โลก",
      },
    ],
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
    introSubtitle: "Kisah Produk · Kejuruteraan Audio · Idea Sambutan",
    introParagraph1:
      "Selamat datang ke blog rasmi Kek Hari Jadi Elektronik (birthday-cake.online). Kami berkongsi kisah penciptaan aplikasi web tiup lilin maya ini, kemas kini produk serta pengalaman teknikal dalam menambah baik pengesanan tiupan mikrofon dan penapisan bunyi bising.",
    introParagraph2:
      "Sama ada anda merancang kejutan hari jadi jarak jauh atau berminat dengan teknologi audio interaktif dalam pelayar, terokai artikel kami di bawah.",
    topics: [
      {
        title: "Asal Usul & Kemas Kini",
        description: "Bagaimana insiden terlupa membeli lilin melahirkan aplikasi web ini.",
      },
      {
        title: "Pengesanan Tiupan & Audio",
        description: "Analisis sampel tiupan sebenar, penentukuran mikrofon dan penapis bunyi.",
      },
      {
        title: "Panduan Sambutan Maya",
        description: "Cara kreatif dan mesra alam menghias serta berkongsi kek dalam talian.",
      },
    ],
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
    introSubtitle: "Ürün Hikayeleri · Ses Teknolojisi · Kutlama Fikirleri",
    introParagraph1:
      "Elektronik Doğum Günü Pastası (birthday-cake.online) resmi bloguna hoş geldiniz. Burada tarayıcı tabanlı sanal mum üfleme uygulamamızın doğuş hikayesini, yeni güncellemeleri ve mikrofonla üfleme algılama ile gürültü filtreleme konusundaki mühendislik deneyimlerimizi paylaşıyoruz.",
    introParagraph2:
      "İster uzaktaki sevdiklerinize unutulmaz bir online doğum günü sürprizi hazırlayın ister tarayıcıda gerçek zamanlı ses işlemeyi merak edin, tüm yazılarımızı aşağıda bulabilirsiniz.",
    topics: [
      {
        title: "Hikaye ve Güncellemeler",
        description: "Unutulan doğum günü mumlarından doğan web uygulamasının gelişim yolculuğu.",
      },
      {
        title: "Üfleme Algılama ve Ses",
        description: "Gerçek üfleme örnekleri analizi, kalibrasyon ve arka plan gürültüsü filtresi.",
      },
      {
        title: "Online Kutlama İpuçları",
        description: "Güvenli ve çevre dostu sanal pasta tasarlama ve paylaşma önerileri.",
      },
    ],
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
    introSubtitle: "پروڈکٹ کہانیاں · آڈیو ٹیکنالوجی · جشن کے آئیڈیاز",
    introParagraph1:
      "الیکٹرانک سالگرہ کیک (birthday-cake.online) کے آفیشل بلاگ میں خوش آمدید۔ یہاں ہم اپنی براؤزر پر مبنی ورچوئل موم بتی بجھانے والی ویب ایپ کی ابتدا، نئی اپ ڈیٹس اور مائیکروفون پھونک شناخت و شور فلٹرنگ کے عملی تجربات شیئر کرتے ہیں۔",
    introParagraph2:
      "چاہے آپ دور بیٹھے پیاروں کے لیے آن لائن سالگرہ سرپرائز تیار کر رہے ہوں یا ریئل ٹائم آڈیو ٹیکنالوجی میں دلچسپی رکھتے ہوں، ہمارے مضامین آپ کے لیے مفید ثابت ہوں گے۔",
    topics: [
      {
        title: "آغاز اور اپ ڈیٹس",
        description: "موم بتیاں خریدنا بھول جانے کے واقعے سے شروع ہونے والی ویب ایپ کا سفر۔",
      },
      {
        title: "پھونک شناخت اور آڈیو ٹیکنالوجی",
        description: "حقیقی پھونک کے نمونوں کا تجزیہ، کیلیبریشن اور پس منظر کا شور فلٹر کرنا۔",
      },
      {
        title: "آن لائن جشن کے مشورے",
        description: "محفوظ اور ماحول دوست انداز میں ورچوئل کیک سجانے اور شیئر کرنے کے طریقے۔",
      },
    ],
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
