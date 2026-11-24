"use client";

import React, { useEffect, useRef, useState } from "react";
import { isRtlLanguage, Language, Translation } from "@/types";

export interface ShareModalSummary {
  userName?: string;
  giverName?: string;
  customMessage?: string;
  isCustomCake?: boolean;
}

export interface ShareModalProps {
  isOpen: boolean;
  shareUrl: string;
  copyStatus: "idle" | "copied" | "error";
  onCopy: () => Promise<boolean> | void;
  onClose: () => void;
  lang: Language;
  t: Translation;
  summary?: ShareModalSummary;
}

interface ShareDialogCopy {
  title: string;
  copiedBadge: string;
  copiedDesc: string;
  errorBadge: string;
  errorDesc: string;
  readyDesc: string;
  linkLabel: string;
  copyBtn: string;
  copiedBtn: string;
  systemShare: string;
  customCakeHint: string;
  includedHint: string;
  doneBtn: string;
  toLabel: string;
  fromLabel: string;
}

const SHARE_DIALOG_COPY: Record<Language, ShareDialogCopy> = {
  zh: {
    title: "分享专属生日蛋糕",
    copiedBadge: "专属分享链接已复制到剪贴板",
    copiedDesc: "直接粘贴发送给好友，对方打开链接即可看到你精心布置的蛋糕，对着麦克风吹蜡烛许愿！",
    errorBadge: "自动复制未能完成",
    errorDesc: "请点击下方“复制链接”按钮，或点击输入框全选后手动复制发送给好友。",
    readyDesc: "复制下方链接发送给好友，对方打开即可直接进入你的专属庆生场景。",
    linkLabel: "专属分享链接",
    copyBtn: "复制链接",
    copiedBtn: "已复制 ✓",
    systemShare: "系统分享",
    customCakeHint: "当前包含自定义上传图片，链接会较长，属于正常现象。",
    includedHint: "蛋糕款式、蜡烛数量、祝福卡片、场景氛围与音乐均已打包保存在此链接中。",
    doneBtn: "知道了",
    toLabel: "寿星",
    fromLabel: "来自",
  },
  "zh-Hant": {
    title: "分享專屬生日蛋糕",
    copiedBadge: "專屬分享連結已複製到剪貼簿",
    copiedDesc: "直接貼上發送給好友，對方打開連結即可看到你精心布置的蛋糕，對著麥克風吹蠟燭許願！",
    errorBadge: "自動複製未能完成",
    errorDesc: "請點擊下方「複製連結」按鈕，或點擊輸入框全選後手動複製發送給好友。",
    readyDesc: "複製下方連結發送給好友，對方打開即可直接進入你的專屬慶生場景。",
    linkLabel: "專屬分享連結",
    copyBtn: "複製連結",
    copiedBtn: "已複製 ✓",
    systemShare: "系統分享",
    customCakeHint: "目前包含自訂上傳圖片，連結會較長，屬於正常現象。",
    includedHint: "蛋糕款式、蠟燭數量、祝福卡片、場景氛圍與音樂均已打包保存在此連結中。",
    doneBtn: "知道了",
    toLabel: "壽星",
    fromLabel: "來自",
  },
  en: {
    title: "Share Your Birthday Cake",
    copiedBadge: "Share link copied to clipboard",
    copiedDesc: "Paste and send it to your friend — they'll jump straight into your custom cake scene to make a wish and blow out the candles!",
    errorBadge: "Couldn't copy automatically",
    errorDesc: "Tap the Copy Link button below, or select the link manually to share it with your friend.",
    readyDesc: "Copy the link below and send it to your friend so they can open your custom birthday scene right away.",
    linkLabel: "Your Share Link",
    copyBtn: "Copy Link",
    copiedBtn: "Copied ✓",
    systemShare: "Share via…",
    customCakeHint: "Includes your uploaded custom cake photo, so the link is longer than usual.",
    includedHint: "Your cake style, candles, greeting card, atmosphere, and music are all saved in this link.",
    doneBtn: "Got it",
    toLabel: "For",
    fromLabel: "From",
  },
  ja: {
    title: "誕生日ケーキを共有",
    copiedBadge: "共有リンクをコピーしました",
    copiedDesc: "友達に貼り付けて送るだけで、あなたが用意したケーキを開いてそのままろうそくを吹き消せます！",
    errorBadge: "自動コピーできませんでした",
    errorDesc: "下の「リンクをコピー」ボタンを押すか、リンクを手動で選択してコピーしてください。",
    readyDesc: "下のリンクをコピーして友達に送ると、この誕生日シーンをそのまま開けます。",
    linkLabel: "専用共有リンク",
    copyBtn: "リンクをコピー",
    copiedBtn: "コピー済み ✓",
    systemShare: "他のアプリで共有",
    customCakeHint: "カスタム画像が含まれるため、リンクが少し長くなります。",
    includedHint: "ケーキ、ろうそく、メッセージカード、背景テーマ、音楽がすべてこのリンクに含まれます。",
    doneBtn: "OK",
    toLabel: "宛先",
    fromLabel: "贈り主",
  },
  ko: {
    title: "생일 케이크 공유하기",
    copiedBadge: "공유 링크가 클립보드에 복사되었습니다",
    copiedDesc: "친구에게 붙여넣어 보내면 꾸며 둔 케이크와 카드를 바로 열고 촛불을 불어 끌 수 있어요!",
    errorBadge: "자동 복사에 실패했습니다",
    errorDesc: "아래 '링크 복사' 버튼을 누르거나 링크를 직접 선택해 복사해 주세요.",
    readyDesc: "아래 링크를 복사해 친구에게 보내면 바로 생일 장면으로 이동합니다.",
    linkLabel: "전용 공유 링크",
    copyBtn: "링크 복사",
    copiedBtn: "복사됨 ✓",
    systemShare: "공유하기",
    customCakeHint: "업로드한 커스텀 사진이 포함되어 링크가 길어질 수 있습니다.",
    includedHint: "케이크, 촛불, 축하 카드, 분위기, 음악 설정이 모두 링크에 저장됩니다.",
    doneBtn: "확인",
    toLabel: "받는 분",
    fromLabel: "보내는 분",
  },
  fr: {
    title: "Partager votre gâteau d'anniversaire",
    copiedBadge: "Lien de partage copié dans le presse-papiers",
    copiedDesc: "Collez et envoyez ce lien à votre proche : il ouvrira directement votre gâteau personnalisé pour souffler les bougies !",
    errorBadge: "Copie automatique impossible",
    errorDesc: "Cliquez sur « Copier le lien » ci-dessous ou sélectionnez-le manuellement.",
    readyDesc: "Copiez le lien ci-dessous et envoyez-le à vos amis pour ouvrir directement cette scène.",
    linkLabel: "Lien personnalisé",
    copyBtn: "Copier le lien",
    copiedBtn: "Copié ✓",
    systemShare: "Partager via…",
    customCakeHint: "Contient votre photo personnalisée, le lien est donc plus long.",
    includedHint: "Le gâteau, les bougies, la carte, l'ambiance et la musique sont enregistrés dans ce lien.",
    doneBtn: "Compris",
    toLabel: "Pour",
    fromLabel: "De",
  },
  es: {
    title: "Compartir pastel de cumpleaños",
    copiedBadge: "Enlace copiado al portapapeles",
    copiedDesc: "Pégalo y envíalo a tu amigo: abrirá directamente tu pastel personalizado para pedir un deseo y soplar las velas.",
    errorBadge: "No se pudo copiar automáticamente",
    errorDesc: "Pulsa «Copiar enlace» abajo o selecciona el enlace manualmente.",
    readyDesc: "Copia el enlace de abajo y compártelo para abrir directamente esta celebración.",
    linkLabel: "Tu enlace para compartir",
    copyBtn: "Copiar enlace",
    copiedBtn: "Copiado ✓",
    systemShare: "Compartir…",
    customCakeHint: "Incluye tu foto personalizada, por lo que el enlace es más largo.",
    includedHint: "El pastel, las velas, la tarjeta, el ambiente y la música están guardados en este enlace.",
    doneBtn: "Entendido",
    toLabel: "Para",
    fromLabel: "De",
  },
  pt: {
    title: "Compartilhar bolo de aniversário",
    copiedBadge: "Link copiado para a área de transferência",
    copiedDesc: "Cole e envie para seu amigo — ele abrirá direto o bolo personalizado para fazer um pedido e soprar as velas!",
    errorBadge: "Não foi possível copiar automaticamente",
    errorDesc: "Toque em «Copiar link» abaixo ou selecione o link manualmente.",
    readyDesc: "Copie o link abaixo e envie para seu amigo abrir a cena direto.",
    linkLabel: "Seu link de compartilhamento",
    copyBtn: "Copiar link",
    copiedBtn: "Copiado ✓",
    systemShare: "Compartilhar…",
    customCakeHint: "Inclui sua foto personalizada, por isso o link fica mais longo.",
    includedHint: "Bolo, velas, cartão, tema e música já estão salvos neste link.",
    doneBtn: "Entendi",
    toLabel: "Para",
    fromLabel: "De",
  },
  de: {
    title: "Geburtstagstorte teilen",
    copiedBadge: "Link in die Zwischenablage kopiert",
    copiedDesc: "Einfach einfügen und verschicken – deine Freunde öffnen direkt deine gestaltete Torte und können die Kerzen auspusten!",
    errorBadge: "Automatisches Kopieren fehlgeschlagen",
    errorDesc: "Klicke unten auf „Link kopieren“ oder markiere den Link manuell.",
    readyDesc: "Kopiere den Link unten und sende ihn an deine Freunde.",
    linkLabel: "Dein persönlicher Link",
    copyBtn: "Link kopieren",
    copiedBtn: "Kopiert ✓",
    systemShare: "Teilen über…",
    customCakeHint: "Enthält dein eigenes Foto, daher ist der Link etwas länger.",
    includedHint: "Torte, Kerzen, Grußkarte, Atmosphäre und Musik sind komplett im Link gespeichert.",
    doneBtn: "Verstanden",
    toLabel: "Für",
    fromLabel: "Von",
  },
  it: {
    title: "Condividi la torta di compleanno",
    copiedBadge: "Link copiato negli appunti",
    copiedDesc: "Incollalo e invialo al festeggiato: aprirà subito la tua torta personalizzata per spegnere le candeline!",
    errorBadge: "Copia automatica non riuscita",
    errorDesc: "Premi «Copia link» qui sotto o seleziona manualmente l'indirizzo.",
    readyDesc: "Copia il link qui sotto e invialo per aprire subito questa scena.",
    linkLabel: "Link di condivisione",
    copyBtn: "Copia link",
    copiedBtn: "Copiato ✓",
    systemShare: "Condividi…",
    customCakeHint: "Include la tua foto personalizzata, quindi il link è più lungo.",
    includedHint: "Torta, candeline, biglietto, atmosfera e musica sono salvati in questo link.",
    doneBtn: "Capito",
    toLabel: "Per",
    fromLabel: "Da",
  },
  ru: {
    title: "Поделиться тортом",
    copiedBadge: "Ссылка скопирована в буфер обмена",
    copiedDesc: "Просто отправьте её другу — он сразу откроет ваш праздничный торт, загадает желание и задует свечи!",
    errorBadge: "Не удалось скопировать автоматически",
    errorDesc: "Нажмите кнопку «Копировать ссылку» ниже или выделите ссылку вручную.",
    readyDesc: "Скопируйте ссылку ниже и отправьте другу.",
    linkLabel: "Персональная ссылка",
    copyBtn: "Копировать ссылку",
    copiedBtn: "Скопировано ✓",
    systemShare: "Поделиться…",
    customCakeHint: "Ссылка длиннее обычного, так как содержит ваше фото торта.",
    includedHint: "Торт, свечи, открытка, атмосфера и музыка сохранены прямо в этой ссылке.",
    doneBtn: "Понятно",
    toLabel: "Кому",
    fromLabel: "От",
  },
  ar: {
    title: "مشاركة كعكة عيد الميلاد",
    copiedBadge: "تم نسخ رابط المشاركة إلى الحافظة",
    copiedDesc: "الصق الرابط وأرسله إلى صديقك ليفتح الكعكة التي جهزتها مباشرة وينفخ الشموع ويتمنى أمنية!",
    errorBadge: "تعذّر النسخ التلقائي",
    errorDesc: "اضغط على زر «نسخ الرابط» أدناه أو حدّد الرابط يدويًا لنسخه.",
    readyDesc: "انسخ الرابط أدناه وأرسله لصديقك لفتح مشهد عيد الميلاد مباشرة.",
    linkLabel: "رابط المشاركة الخاص بك",
    copyBtn: "نسخ الرابط",
    copiedBtn: "تم النسخ ✓",
    systemShare: "مشاركة عبر…",
    customCakeHint: "يحتوي الرابط على صورتك المخصصة، لذلك قد يبدو أطول من المعتاد.",
    includedHint: "تم حفظ شكل الكعكة والشموع وبطاقة التهنئة والأجواء والموسيقى داخل هذا الرابط.",
    doneBtn: "حسنًا",
    toLabel: "إلى",
    fromLabel: "من",
  },
  vi: {
    title: "Chia sẻ bánh sinh nhật",
    copiedBadge: "Đã sao chép liên kết chia sẻ",
    copiedDesc: "Dán và gửi cho bạn bè — họ sẽ mở ngay chiếc bánh bạn trang trí để ước nguyện và thổi nến!",
    errorBadge: "Không thể tự động sao chép",
    errorDesc: "Hãy bấm nút «Sao chép liên kết» bên dưới hoặc chọn thủ công để sao chép.",
    readyDesc: "Sao chép liên kết bên dưới và gửi cho bạn bè.",
    linkLabel: "Liên kết chia sẻ riêng",
    copyBtn: "Sao chép liên kết",
    copiedBtn: "Đã sao chép ✓",
    systemShare: "Chia sẻ qua…",
    customCakeHint: "Có kèm ảnh bánh tải lên nên liên kết sẽ dài hơn bình thường.",
    includedHint: "Kiểu bánh, số nến, thiệp chúc mừng, không gian và nhạc đều được lưu trong liên kết này.",
    doneBtn: "Đã hiểu",
    toLabel: "Tặng",
    fromLabel: "Từ",
  },
  hi: {
    title: "जन्मदिन का केक शेयर करें",
    copiedBadge: "शेयर लिंक क्लिपबोर्ड पर कॉपी हो गया",
    copiedDesc: "इसे अपने दोस्त को भेजें — वे सीधे आपका सजाया हुआ केक खोलकर विश मांग सकते हैं और मोमबत्तियां बुझा सकते हैं!",
    errorBadge: "ऑटो-कॉपी नहीं हो सका",
    errorDesc: "नीचे 'लिंक कॉपी करें' बटन दबाएं या लिंक को मैन्युअल रूप से कॉपी करें।",
    readyDesc: "नीचे दिया लिंक कॉपी करके अपने दोस्त को भेजें।",
    linkLabel: "आपका शेयर लिंक",
    copyBtn: "लिंक कॉपी करें",
    copiedBtn: "कॉपी हो गया ✓",
    systemShare: "शेयर करें…",
    customCakeHint: "इसमें आपकी अपलोड की गई फोटो शामिल है, इसलिए लिंक थोड़ा लंबा होगा।",
    includedHint: "केक, मोमबत्तियां, ग्रीटिंग कार्ड, थीम और संगीत सब इस लिंक में सेव हैं।",
    doneBtn: "ठीक है",
    toLabel: "के लिए",
    fromLabel: "की ओर से",
  },
  id: {
    title: "Bagikan Kue Ulang Tahun",
    copiedBadge: "Tautan berbagi disalin ke clipboard",
    copiedDesc: "Tempel dan kirim ke temanmu — mereka bisa langsung membuka kue kreasimu dan meniup lilinnya!",
    errorBadge: "Gagal menyalin otomatis",
    errorDesc: "Ketuk tombol «Salin Tautan» di bawah atau pilih tautan secara manual.",
    readyDesc: "Salin tautan di bawah lalu kirim ke temanmu.",
    linkLabel: "Tautan Berbagi Khusus",
    copyBtn: "Salin Tautan",
    copiedBtn: "Disalin ✓",
    systemShare: "Bagikan lewat…",
    customCakeHint: "Menyertakan foto kue kustom sehingga tautan lebih panjang.",
    includedHint: "Gaya kue, lilin, kartu ucapan, suasana, dan musik sudah tersimpan dalam tautan ini.",
    doneBtn: "Mengerti",
    toLabel: "Untuk",
    fromLabel: "Dari",
  },
  th: {
    title: "แชร์เค้กวันเกิดของคุณ",
    copiedBadge: "คัดลอกลิงก์แชร์ไปยังคลิปบอร์ดแล้ว",
    copiedDesc: "วางแล้วส่งให้เพื่อนได้เลย เพื่อนจะเปิดดูเค้กที่คุณจัดไว้และเป่าเทียนอธิษฐานได้ทันที!",
    errorBadge: "ไม่สามารถคัดลอกอัตโนมัติได้",
    errorDesc: "กดปุ่ม «คัดลอกลิงก์» ด้านล่าง หรือแตะที่ช่องลิงก์เพื่อคัดลอกด้วยตนเอง",
    readyDesc: "คัดลอกลิงก์ด้านล่างแล้วส่งให้เพื่อนได้เลย",
    linkLabel: "ลิงก์แชร์เฉพาะของคุณ",
    copyBtn: "คัดลอกลิงก์",
    copiedBtn: "คัดลอกแล้ว ✓",
    systemShare: "แชร์ผ่าน…",
    customCakeHint: "มีรูปเค้กที่อัปโหลดรวมอยู่ด้วย ลิงก์จึงยาวกว่าปกติ",
    includedHint: "รูปแบบเค้ก เทียน การ์ดอวยพร บรรยากาศ และเพลงถูกบันทึกไว้ในลิงก์นี้แล้ว",
    doneBtn: "เข้าใจแล้ว",
    toLabel: "ถึง",
    fromLabel: "จาก",
  },
  ms: {
    title: "Kongsi Kek Hari Jadi",
    copiedBadge: "Pautan kongsi disalin ke papan keratan",
    copiedDesc: "Tampal dan hantar kepada rakan anda — mereka boleh terus membuka kek rekaan anda dan meniup lilin!",
    errorBadge: "Gagal menyalin secara automatik",
    errorDesc: "Tekan butang «Salin Pautan» di bawah atau pilih pautan secara manual.",
    readyDesc: "Salin pautan di bawah dan hantar kepada rakan anda.",
    linkLabel: "Pautan Kongsi Anda",
    copyBtn: "Salin Pautan",
    copiedBtn: "Disalin ✓",
    systemShare: "Kongsi melalui…",
    customCakeHint: "Mengandungi foto kek tersuai anda, jadi pautan lebih panjang.",
    includedHint: "Gaya kek, lilin, kad ucapan, suasana dan muzik semuanya disimpan dalam pautan ini.",
    doneBtn: "Faham",
    toLabel: "Untuk",
    fromLabel: "Daripada",
  },
  tr: {
    title: "Doğum Günü Pastasını Paylaş",
    copiedBadge: "Paylaşım bağlantısı panoya kopyalandı",
    copiedDesc: "Yapıştırıp arkadaşına gönder — hazırladığın pastayı doğrudan açıp dilek tutarak mumları üfleyebilir!",
    errorBadge: "Otomatik kopyalanamadı",
    errorDesc: "Aşağıdaki «Bağlantıyı Kopyala» düğmesine dokunun veya bağlantıyı elle seçin.",
    readyDesc: "Aşağıdaki bağlantıyı kopyalayıp arkadaşınıza gönderin.",
    linkLabel: "Özel Paylaşım Bağlantın",
    copyBtn: "Bağlantıyı Kopyala",
    copiedBtn: "Kopyalandı ✓",
    systemShare: "Paylaş…",
    customCakeHint: "Yüklediğiniz özel fotoğrafı içerdiği için bağlantı daha uzundur.",
    includedHint: "Pasta, mumlar, tebrik kartı, atmosfer ve müzik bu bağlantıda kayıtlıdır.",
    doneBtn: "Tamam",
    toLabel: "Kime",
    fromLabel: "Kimden",
  },
  ur: {
    title: "سالگرہ کا کیک شیئر کریں",
    copiedBadge: "شیئر لنک کلپ بورڈ میں کاپی ہو گیا",
    copiedDesc: "اسے اپنے دوست کو بھیجیں — وہ فوراً آپ کا سجایا ہوا کیک کھول کر دعا مانگ سکتے اور موم بتیاں بجھا سکتے ہیں!",
    errorBadge: "خودکار کاپی ممکن نہیں ہو سکی",
    errorDesc: "نیچے «لنک کاپی کریں» بٹن پر کلک کریں یا لنک کو دستی طور پر کاپی کریں۔",
    readyDesc: "نیچے دیا گیا لنک کاپی کر کے اپنے دوست کو بھیجیں۔",
    linkLabel: "آپ کا شیئر لنک",
    copyBtn: "لنک کاپی کریں",
    copiedBtn: "کاپی ہو گیا ✓",
    systemShare: "شیئر کریں…",
    customCakeHint: "اس میں آپ کی اپ لوڈ کردہ تصویر شامل ہے، اس لیے لنک طویل ہو سکتا ہے۔",
    includedHint: "کیک کا انداز، موم بتیاں، کارڈ، ماحول اور موسیقی سب اس لنک میں محفوظ ہیں۔",
    doneBtn: "سمجھ گیا",
    toLabel: "بنام",
    fromLabel: "منجانب",
  },
};

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  shareUrl,
  copyStatus,
  onCopy,
  onClose,
  lang,
  t,
  summary,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [canNativeShare, setCanNativeShare] = useState(false);

  const copy = SHARE_DIALOG_COPY[lang] || SHARE_DIALOG_COPY.en;
  const isRTL = isRtlLanguage(lang);

  useEffect(() => {
    setCanNativeShare(
      typeof navigator !== "undefined" && typeof navigator.share === "function"
    );
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNativeShare = async () => {
    if (!canNativeShare) return;
    try {
      await navigator.share({
        title: summary?.userName
          ? `${t.celebrate} ${summary.userName}`
          : t.title,
        text: summary?.customMessage || t.subtitle,
        url: shareUrl,
      });
    } catch {
      // 用户取消系统分享时静默忽略
    }
  };

  const hasRecipientInfo = Boolean(
    summary?.userName?.trim() || summary?.giverName?.trim() || summary?.customMessage?.trim()
  );

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      dir={isRTL ? "rtl" : "ltr"}
      onClick={(e) => {
        e.stopPropagation();
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-white/15 p-6 shadow-2xl text-white">
        {/* 顶部标题与关闭按钮 */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-9 h-9 shrink-0 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/25">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
                <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
              </svg>
            </span>
            <h2 id="share-modal-title" className="text-base font-bold text-white truncate">
              {copy.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 shrink-0 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            aria-label={t.closeControls}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* 醒目的复制状态提示横幅 */}
        {copyStatus === "copied" ? (
          <div className="mb-4 rounded-2xl bg-emerald-500/15 border border-emerald-400/35 px-4 py-3 flex items-start gap-3">
            <span className="mt-0.5 w-5 h-5 shrink-0 rounded-full bg-emerald-500/25 text-emerald-300 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <div className="min-w-0">
              <div className="text-xs font-bold text-emerald-200">{copy.copiedBadge}</div>
              <p className="mt-1 text-xs leading-relaxed text-emerald-100/80">
                {copy.copiedDesc}
              </p>
            </div>
          </div>
        ) : copyStatus === "error" ? (
          <div className="mb-4 rounded-2xl bg-amber-500/15 border border-amber-400/35 px-4 py-3 flex items-start gap-3">
            <span className="mt-0.5 w-5 h-5 shrink-0 rounded-full bg-amber-500/25 text-amber-300 flex items-center justify-center text-xs font-black">
              !
            </span>
            <div className="min-w-0">
              <div className="text-xs font-bold text-amber-200">{copy.errorBadge}</div>
              <p className="mt-1 text-xs leading-relaxed text-amber-100/80">
                {copy.errorDesc}
              </p>
            </div>
          </div>
        ) : (
          <p className="mb-4 text-xs leading-relaxed text-slate-300">{copy.readyDesc}</p>
        )}

        {/* 已配置的祝福摘要（有填写时展示，便于发前核对） */}
        {hasRecipientInfo && (
          <div className="mb-4 rounded-2xl bg-white/[0.04] border border-white/10 px-3.5 py-2.5 space-y-1 text-xs">
            {summary?.userName?.trim() && (
              <div className="flex items-center gap-2 text-slate-200">
                <span className="text-slate-400 shrink-0">{copy.toLabel}:</span>
                <span className="font-semibold truncate">{summary.userName.trim()}</span>
              </div>
            )}
            {summary?.customMessage?.trim() && (
              <p className="text-pink-200/90 line-clamp-2 leading-relaxed">
                “{summary.customMessage.trim()}”
              </p>
            )}
            {summary?.giverName?.trim() && (
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-slate-400 shrink-0">{copy.fromLabel}:</span>
                <span className="truncate">{summary.giverName.trim()}</span>
              </div>
            )}
          </div>
        )}

        {/* 链接预览与一键复制 */}
        <div className="space-y-2">
          <label
            htmlFor="share-link-input"
            className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400"
          >
            {copy.linkLabel}
          </label>
          <div className="flex items-center gap-2">
            <input
              id="share-link-input"
              ref={inputRef}
              type="text"
              readOnly
              value={shareUrl}
              onClick={() => inputRef.current?.select()}
              onFocus={() => inputRef.current?.select()}
              className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-xs text-slate-200 font-mono focus:outline-none focus:border-pink-400 select-all"
            />
            <button
              type="button"
              onClick={() => {
                onCopy();
              }}
              className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                copyStatus === "copied"
                  ? "bg-emerald-500/25 border border-emerald-400/50 text-emerald-200 hover:bg-emerald-500/35"
                  : "bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:brightness-110 shadow-lg shadow-pink-500/20"
              }`}
            >
              {copyStatus === "copied" ? copy.copiedBtn : copy.copyBtn}
            </button>
          </div>
        </div>

        {/* 补充说明 */}
        <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
          {copy.includedHint}
        </p>
        {summary?.isCustomCake && (
          <p className="mt-1.5 text-[11px] leading-relaxed text-amber-300/85">
            {copy.customCakeHint}
          </p>
        )}

        {/* 底部操作按钮 */}
        <div className="mt-5 flex items-center gap-2.5">
          {canNativeShare && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="flex-1 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold text-white transition-all active:scale-95"
            >
              {copy.systemShare}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className={`${
              canNativeShare ? "flex-1" : "w-full"
            } py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-100 transition-all active:scale-95`}
          >
            {copy.doneBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
