import { Language } from './types';

export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ_TITLE: Record<Language, string> = {
  en: "Frequently Asked Questions",
  zh: "常见问题",
  "zh-Hant": "常見問題",
  ja: "よくある質問",
  fr: "Foire aux questions",
  ar: "الأسئلة الشائعة",
  ko: "자주 묻는 질문",
  es: "Preguntas frecuentes",
  pt: "Perguntas frequentes",
  de: "Häufig gestellte Fragen",
  it: "Domande frequenti",
  ru: "Часто задаваемые вопросы",
  vi: "Câu hỏi thường gặp",
};

export const FAQS: Record<Language, FaqItem[]> = {
  zh: [
    {
      q: "这款在线吹蜡烛工具可以用来做什么？适用哪些场景？",
      a: "本工具是一款浏览器端虚拟生日吹蜡烛互动程序，无需下载安装，打开网页即可使用。主要适配两大使用场景：一是现场线下使用，在手机、电脑端配置好蛋糕场景后，直接让寿星对着设备麦克风吹蜡烛，替代实体蜡烛，安全又有趣；二是远程线上使用，自定义布置好专属生日蛋糕后，生成分享链接发给好友，好友打开链接即可直接体验吹蜡烛互动，实现异地送生日惊喜。",
    },
    {
      q: "对比实体生日蜡烛，电子虚拟蜡烛有什么优势？",
      a: "相比实体蜡烛，本电子蜡烛工具优势十分明显：一是安全无隐患，无明火、无烫伤、火灾风险，老人小孩使用都很安全；二是绿色环保，无蜡烛燃烧废气、无蜡油污染，零耗材零浪费；三是便捷百搭，不受场地、道具限制，随时随地可用，还支持远程互动；四是趣味新颖，自带烟花灯光特效，氛围感更强，同时避免生日打闹抹蛋糕的尴尬场景。",
    },
    {
      q: "如何将布置好的专属蛋糕场景分享给好友？",
      a: "完成所有蛋糕场景配置后，点击界面右下角的分享图标，即可一键复制专属场景链接。该链接会保留你所有的自定义配置，包括蛋糕样式、蜡烛、祝福语、灵敏度参数等，好友打开链接无需二次配置，直接进入专属生日场景，可直接吹蜡烛互动。",
    },
    {
      q: "蜡烛总是不小心自动吹灭，怎么避免误触？",
      a: "可以使用场景的锁定功能。开启锁定后，麦克风收音、吹气进度条全部失效，无论外界杂音、轻微气流都不会触发蜡烛熄灭，完全避免误操作；准备好正式吹蜡烛时，解锁即可恢复正常吹气识别。锁定状态会展示专属锁形图标，状态清晰可见。",
    },
    {
      q: "麦克风灵敏度是什么意思？需要调整吗？",
      a: "麦克风灵敏度是适配不同设备的吹气识别参数。由于手机、电脑的麦克风硬件差异，不同设备的收音效果不同：灵敏度过高会导致轻微杂音就误吹灭蜡烛，灵敏度过低会导致正常吹气无法识别、蜡烛吹不灭。建议使用前根据设备微调灵敏度，适配最佳吹气效果。",
    },
  ],
  en: [
    {
      q: "What can this online candle-blowing tool be used for? What scenarios does it suit?",
      a: "This tool is a browser-based virtual birthday candle-blowing interactive program—no download or installation needed, just open the webpage. It suits two main scenarios: first, on-site offline use—configure the cake scene on a phone or computer, then let the birthday person blow out the candles toward the device's microphone, replacing real candles, safe and fun; second, remote online use—customize an exclusive birthday cake, generate a share link to send to friends, who open the link to directly experience the candle-blowing interaction, delivering a birthday surprise across distances.",
    },
    {
      q: "Compared to real birthday candles, what advantages do electronic virtual candles have?",
      a: "Compared to real candles, this electronic candle tool has clear advantages: first, safety—no open flame, no burn or fire risk, safe for the elderly and children; second, eco-friendly—no burning exhaust, no wax pollution, zero consumables and zero waste; third, convenient—no venue or prop limits, usable anytime and anywhere, with remote interaction support; fourth, novel and fun—with built-in fireworks and lighting effects for a stronger atmosphere, while avoiding awkward cake-smashing scenes.",
    },
    {
      q: "How do I share the customized cake scene with friends?",
      a: "After completing all cake scene configuration, click the share icon at the bottom-right of the interface to copy your exclusive scene link with one click. The link preserves all your custom settings, including cake style, candles, message, sensitivity and more. Friends open the link without re-configuring and go straight into the exclusive birthday scene to blow out candles.",
    },
    {
      q: "The candles keep going out accidentally—how can I avoid false triggers?",
      a: "Use the scene's lock feature. When locked, microphone pickup and the blow progress bar are disabled—no external noise or slight airflow will trigger the candles to go out, completely avoiding misoperation. When ready to formally blow, unlock to restore normal blow detection. The locked state shows a dedicated lock icon for clear visibility.",
    },
    {
      q: "What does microphone sensitivity mean? Do I need to adjust it?",
      a: "Microphone sensitivity is the blow-detection parameter that adapts to different devices. Due to hardware differences between phone and computer microphones, pickup varies: too-high sensitivity causes slight noise to falsely extinguish candles; too-low sensitivity prevents normal blowing from being detected. We recommend fine-tuning the sensitivity for your device before use for the best blow-detection effect.",
    },
  ],
  "zh-Hant": [
    {
      q: "這款線上吹蠟燭工具可以用來做什麼？適用哪些場景？",
      a: "本工具是一款瀏覽器端虛擬生日吹蠟燭互動程式，無需下載安裝，開啟網頁即可使用。主要適配兩大使用場景：一是現場線下使用，在手機、電腦端配置好蛋糕場景後，直接讓壽星對著裝置麥克風吹蠟燭，替代實體蠟燭，安全又有趣；二是遠端線上使用，自訂布置好專屬生日蛋糕後，產生分享連結發給好友，好友開啟連結即可直接體驗吹蠟燭互動，實現異地送生日驚喜。",
    },
    {
      q: "對比實體生日蠟燭，電子虛擬蠟燭有什麼優勢？",
      a: "相比實體蠟燭，本電子蠟燭工具優勢十分明顯：一是安全無隱患，無明火、無燙傷、火災風險，老人小孩使用都很安全；二是綠色環保，無蠟燭燃燒廢氣、無蠟油污染，零耗材零浪費；三是便捷百搭，不受場地、道具限制，隨時隨地可用，還支援遠端互動；四是趣味新穎，自帶煙花燈光特效，氛圍感更強，同時避免生日打鬧抹蛋糕的尷尬場景。",
    },
    {
      q: "如何將布置好的專屬蛋糕場景分享給好友？",
      a: "完成所有蛋糕場景配置後，點擊介面右下角的分享圖示，即可一鍵複製專屬場景連結。該連結會保留你所有的自訂配置，包括蛋糕樣式、蠟燭、祝福語、靈敏度參數等，好友開啟連結無需二次配置，直接進入專屬生日場景，可直接吹蠟燭互動。",
    },
    {
      q: "蠟燭總是不小心自動吹滅，怎麼避免誤觸？",
      a: "可以使用場景的鎖定功能。開啟鎖定後，麥克風收音、吹氣進度條全部失效，無論外界雜音、輕微氣流都不會觸發蠟燭熄滅，完全避免誤操作；準備好正式吹蠟燭時，解鎖即可恢復正常吹氣識別。鎖定狀態會展示專屬鎖形圖示，狀態清晰可見。",
    },
    {
      q: "麥克風靈敏度是什麼意思？需要調整嗎？",
      a: "麥克風靈敏度是適配不同裝置的吹氣識別參數。由於手機、電腦的麥克風硬體差異，不同裝置的收音效果不同：靈敏度過高會導致輕微雜音就誤吹滅蠟燭，靈敏度過低會導致正常吹氣無法識別、蠟燭吹不滅。建議使用前根據裝置微調靈敏度，適配最佳吹氣效果。",
    },
  ],
  ja: [
    {
      q: "このオンラインロウソク吹き消しツールは何に使えますか？どんな場面に適していますか？",
      a: "本ツールはブラウザ上で動くバーチャル誕生日ロウソク吹き消しインタラクティブプログラムです。ダウンロード・インストール不要で、ページを開くだけで使えます。主に2つの利用シーンに適しています：1つ目は現場でのオフライン利用——スマートフォンやPCでケーキシーンを設定し、端末のマイクに向かってロウソクを吹き消してもらう、実物のロウソクの代わりになり安全で楽しい。2つ目は遠隔オンライン利用——オリジナルの誕生日ケーキをカスタマイズし、共有リンクを友人に送ると、友人はリンクを開くだけで吹き消し体験ができ、離れた場所から誕生日のサプライズを届けられます。",
    },
    {
      q: "実物の誕生日ロウソクと比べて、電子バーチャルロウソクの利点は？",
      a: "実物と比べ本ツールの利点は明確です：1に安全——火を使わず、火傷や火災のリスクがなく、お年寄りや子供も安全。2に環境に優しい——燃焼ガスやロウの汚れがなく、消耗品も無駄もゼロ。3に便利——場所や道具を問わずいつでも使え、遠隔インタラクションも対応。4に新鮮で楽しい——花火やライト演出を内蔵し雰囲気感も強く、ケーキを塗り合う恥ずかしい場面も回避できます。",
    },
    {
      q: "カスタマイズしたケーキシーンを友人に共有するには？",
      a: "すべてのケーキシーン設定を完了した後、画面右下の共有アイコンをクリックすると、専用シーンのリンクがワンクリックでコピーされます。リンクにはケーキのスタイル、ロウソク、メッセージ、感度パラメータなどすべてのカスタム設定が保持され、友人はリンクを開くと再設定なしで専用の誕生日シーンに入り、すぐにロウソク吹き消しを体験できます。",
    },
    {
      q: "ロウソクが誤って自動的に消えてしまいます。誤作動を防ぐには？",
      a: "シーンのロック機能を使ってください。ロックをオンにすると、マイクの音声取得と吹き消し進行バーが無効になり、外部の雑音やわずかな気流でもロウソクが消えることはなく、誤作動を完全に防げます。正式に吹き消す準備ができたらロックを解除すれば通常の検出に戻ります。ロック中は専用の鍵アイコンが表示され、状態が一目で分かります。",
    },
    {
      q: "マイク感度とは何ですか？調整が必要ですか？",
      a: "マイク感度は、異なる端末に合わせた吹き検出のパラメータです。スマートフォンやPCのマイクハードウェアの違いにより、収音効果は端末ごとに異なります。感度が高すぎるとわずかな雑音で誤って消え、低すぎると正常な吹きかけが検出されず消えません。使用前に端末に合わせて感度を微調整し、最適な吹き検出効果を得ることをお勧めします。",
    },
  ],
  fr: [
    {
      q: "À quoi sert cet outil en ligne de soufflage de bougies ? Quels scénarios convient-il ?",
      a: "Cet outil est un programme interactif de soufflage de bougies d'anniversaire virtuel fonctionnant dans le navigateur, sans téléchargement ni installation — il suffit d'ouvrir la page. Il convient à deux scénarios principaux : premièrement, une utilisation sur place hors ligne — configurez la scène de gâteau sur un téléphone ou un ordinateur, puis laissez la personne fêtant son anniversaire souffler les bougies vers le micro de l'appareil, en remplaçant les bougies réelles, de façon sûre et amusante ; deuxièmement, une utilisation en ligne à distance — personnalisez un gâteau d'anniversaire exclusif, générez un lien de partage à envoyer à vos amis, qui ouvrent le lien pour vivre directement l'interaction de soufflage, offrant une surprise d'anniversaire à distance.",
    },
    {
      q: "Par rapport aux bougies d'anniversaire réelles, quels sont les avantages des bougies virtuelles électroniques ?",
      a: "Comparées aux bougies réelles, les avantages de cet outil électronique sont évidents : 1) sécurité — pas de flamme nue, pas de risque de brûlure ni d'incendie, sûr pour les personnes âgées et les enfants ; 2) écologique — pas d'émissions de combustion, pas de pollution de cire, zéro consommable et zéro déchet ; 3) pratique — sans contrainte de lieu ni d'accessoires, utilisable partout et à tout moment, avec interaction à distance ; 4) novateur et amusant — effets intégrés de feux d'artifice et de lumières pour une ambiance renforcée, tout en évitant les situations gênantes de gâteau jeté.",
    },
    {
      q: "Comment partager la scène de gâteau personnalisée avec des amis ?",
      a: "Après avoir terminé toute la configuration de la scène, cliquez sur l'icône de partage en bas à droite de l'interface pour copier en un clic le lien exclusif de votre scène. Ce lien conserve tous vos paramètres personnalisés, notamment le style de gâteau, les bougies, le message, la sensibilité, etc. Vos amis ouvrent le lien sans reconfiguration et entrent directement dans la scène d'anniversaire exclusive pour souffler les bougies.",
    },
    {
      q: "Les bougies s'éteignent accidentellement toutes seules — comment éviter les déclenchements intempestifs ?",
      a: "Utilisez la fonction de verrouillage de la scène. Une fois verrouillé, la captation du microphone et la barre de progression du souffle sont désactivées — aucun bruit extérieur ni léger courant d'air n'éteindra les bougies, éliminant toute erreur de manipulation. Quand vous êtes prêt à souffler officiellement, déverrouillez pour rétablir la détection normale. L'état verrouillé affiche une icône de cadenas dédiée pour une visibilité claire.",
    },
    {
      q: "Que signifie la sensibilité du microphone ? Faut-il l'ajuster ?",
      a: "La sensibilité du microphone est le paramètre de détection du souffle qui s'adapte aux différents appareils. En raison des différences matérielles entre les micros de téléphone et d'ordinateur, la captation varie : une sensibilité trop élevée fait que de légers bruits éteignent les bougies par erreur ; trop basse, et un souffle normal n'est pas détecté. Nous recommandons d'affiner la sensibilité selon votre appareil avant utilisation pour obtenir le meilleur effet.",
    },
  ],
  ar: [
    {
      q: "لماذا يُستخدم أداة نفخ الشموع عبر الإنترنت هذه؟ وما السيناريوهات المناسبة لها؟",
      a: "هذه الأداة هي برنامج تفاعلي افتراضي لنفخ شموع عيد الميلاد يعمل في المتصفح، دون الحاجة لتنزيل أو تثبيت—ما عليك سوى فتح الصفحة. تناسب سيناريوهين رئيسيين: الأول، الاستخدام الحضوري غير المتصل—جهّز مشهد الكعكة على الهاتف أو الكمبيوتر، ثم دع صاحب العيد ينفخ الشموع تجاه ميكروفون الجهاز كبديل للشموع الحقيقية، بأمان ومتعة. الثاني، الاستخدام عن بُعد عبر الإنترنت—خصّص كعكة عيد ميلاد حصرية، وأنشئ رابط مشاركة أرسله لأصدقائك، يفتحونه ليتجربوا نفخ الشموع مباشرة، لتقديم مفاجأة عيد ميلاد عن بُعد.",
    },
    {
      q: "مقارنة بشموع عيد الميلاد الحقيقية، ما مزايا الشموع الإلكترونية الافتراضية؟",
      a: "مقارنة بالشموع الحقيقية، مزايا هذه الأداة واضحة: أولاً الأمان—لا لهب مكشوف ولا خطر حروق أو حريق، آمنة لكبار السن والأطفال. ثانياً صديقة للبيئة—لا انبعاثات احتراق ولا تلوث بالشمع، صفر مستهلكات وصفر هدر. ثالثاً العملية—بلا قيود على المكان أو الأدوات، قابلة للاستخدام في أي وقت وأي مكان مع دعم التفاعل عن بُعد. رابعاً مبتكرة وممتعة—تأتي بمؤثرات ألعاب نارية وإضاءة مدمجة لأجواء أقوى، وتتجنب المواقف المحرجة لتلطيخ الكعكة.",
    },
    {
      q: "كيف أشارك مشهد الكعكة المخصص مع الأصدقاء؟",
      a: "بعد إكمال جميع إعدادات المشهد، انقر على أيقونة المشاركة في الزاوية اليمنى السفلية للواجهة لنسخ رابط المشهد الحصري بنقرة واحدة. يحفظ الرابط جميع إعداداتك المخصصة بما في ذلك نمط الكعكة والشموع والرسالة ومعلمة الحساسية وغيرها. يفتح الأصدقاء الرابط دون إعادة إعداد ويدخلون مباشرة إلى مشهد عيد الميلاد الحصري وينفخون الشموع.",
    },
    {
      q: "تنطفئ الشموع بالخطأ تلقائياً، كيف أتجنب التشغيل الخاطئ؟",
      a: "استخدم ميزة القفل في المشهد. عند التفعيل، يتعطل التقاط الميكروفون وشريط تقدم النفخ—فلن يؤدي أي ضجيج خارجي أو تيار هواء خفيف إلى إطفاء الشموع، مما يمنع الأخطاء تماماً. عندما تكون جاهزاً للنفخ رسمياً، ألغِ القفل لاستعادة الكشف الطبيعي. تُعرض أيقونة قفل مخصصة في حالة القفل لرؤية واضحة.",
    },
    {
      q: "ماذا تعني حساسية الميكروفون؟ هل أحتاج لتعديلها؟",
      a: "حساسية الميكروفون هي معلمة كشف النفخ التي تتكيف مع الأجهزة المختلفة. نظراً لاختلاف ميكروفونات الهواتف والكمبيوترات، تختلف جودة الالتقاط: الحساسية العالية جداً تجعل الضجيج الخفيف يطفئ الشموع بالخطأ، والحساسية المنخفضة جداً تمنع كشف النفخ الطبيعي. ننصح بضبط الحساسية بدقة لجهازك قبل الاستخدام للحصول على أفضل تأثير.",
    },
  ],
  ko: [
    {
      q: "이 온라인 촛불 끄기 도구는 무엇에 사용하나요? 어떤 상황에 적합한가요?",
      a: "이 도구는 브라우저에서 작동하는 가상 생일 촛불 끄기 인터랙티브 프로그램으로, 다운로드나 설치 없이 페이지를 열면 바로 사용할 수 있습니다. 주로 두 가지 상황에 적합합니다: 첫째, 현장 오프라인 사용—스마트폰이나 PC에서 케이크 장면을 설정한 뒤, 기기 마이크를 향해 촛불을 끄게 하여 실물 촛불을 대신하고 안전하고 재미있습니다. 둘째, 원격 온라인 사용—전용 생일 케이크를 커스텀하고 공유 링크를 친구에게 보내면, 친구가 링크를 열어 바로 촛불 끄기 인터랙션을 체험할 수 있어 원격 생일 서프라이즈를 선사합니다.",
    },
    {
      q: "실물 생일 촛불과 비교해 전자 가상 촛불의 장점은?",
      a: "실물 촛불과 비교해 이 전자 도구의 장점은 뚜렷합니다: 첫째 안전—불꽃이 없고 화상이나 화재 위험이 없어 노인과 아이도 안전합니다. 둘째 친환경—연소 가스나 촛농 오염이 없고 소모품과 낭비가 0입니다. 셋째 편리—장소나 소품 제약 없이 언제 어디서나 사용 가능하고 원격 인터랙션도 지원합니다. 넷째 참신하고 재미있어—불꽃놀이와 조명 효과가 내장되어 분위기가 더 강하고, 케이크를 바르며 장난치는 민망한 상황도 피할 수 있습니다.",
    },
    {
      q: "커스텀한 케이크 장면을 친구에게 공유하려면?",
      a: "모든 케이크 장면 설정을 완료한 후, 화면 우측 하단의 공유 아이콘을 클릭하면 전용 장면 링크가 원클릭으로 복사됩니다. 이 링크는 케이크 스타일, 촛불, 메시지, 감도 매개변수 등 모든 커스텀 설정을 보존하며, 친구가 링크를 열면 재설정 없이 전용 생일 장면으로 바로 진입해 촛불 끄기 인터랙션을 할 수 있습니다.",
    },
    {
      q: "촛불이 자꾸 실수로 자동으로 꺼져요. 오작동을 피하려면?",
      a: "장면의 잠금 기능을 사용하세요. 잠금을 켜면 마이크 수음과 불기 진행 바가 모두 비활성화되어 외부 소음이나 가벼운 기류로 인해 촛불이 꺼지지 않아 오작동을 완전히 방지합니다. 본격적으로 촛불을 끌 준비가 되면 잠금을 해제해 정상 감지로 돌아가면 됩니다. 잠금 상태에는 전용 자물쇠 아이콘이 표시되어 상태가 명확히 보입니다.",
    },
    {
      q: "마이크 감도는 무슨 뜻인가요? 조정해야 하나요?",
      a: "마이크 감도는 다양한 기기에 맞추는 불기 감지 매개변수입니다. 스마트폰과 PC 마이크 하드웨어 차이로 인해 기기마다 수음 효과가 다릅니다. 감도가 너무 높으면 가벼운 소음에도 촛불이 오껴지고, 너무 낮으면 정상적인 불기가 감지되지 않아 촛불이 꺼지지 않습니다. 사용 전 기기에 맞게 감도를 미세 조정해 최적의 불기 감지 효과를 얻는 것을 권장합니다.",
    },
  ],
  es: [
    {
      q: "¿Para qué sirve esta herramienta en línea de soplar velas? ¿Qué escenarios admite?",
      a: "Esta herramienta es un programa interactivo virtual de soplar velas de cumpleaños que funciona en el navegador, sin descarga ni instalación: basta con abrir la página. Se adapta a dos escenarios principales: primero, uso presencial sin conexión—configura la escena del pastel en un teléfono o computadora y deja que el cumpleañero sople las velas hacia el micrófono del dispositivo, sustituyendo las velas reales, de forma segura y divertida; segundo, uso remoto en línea—personaliza un pastel de cumpleaños exclusivo, genera un enlace de compartir y envíaselo a tus amigos, que abren el enlace para experimentar directamente la interacción de soplar, logrando una sorpresa de cumpleaños a distancia.",
    },
    {
      q: "Comparadas con las velas reales, ¿qué ventajas tienen las velas virtuales electrónicas?",
      a: "Comparadas con las velas reales, las ventajas de esta herramienta electrónica son claras: 1) seguridad—sin llama abierta, sin riesgo de quemaduras ni incendios, segura para mayores y niños; 2) ecológica—sin gases de combustión ni contaminación de cera, cero consumibles y cero desperdicio; 3) práctica—sin límites de lugar ni accesorios, utilizable en cualquier momento y lugar, con soporte de interacción remota; 4) novedosa y divertida—con efectos integrados de fuegos artificiales e iluminación para mayor atmósfera, evitando situaciones incómodas de manchar el pastel.",
    },
    {
      q: "¿Cómo comparto la escena de pastel personalizada con mis amigos?",
      a: "Tras completar toda la configuración de la escena, haz clic en el icono de compartir en la esquina inferior derecha de la interfaz para copiar con un clic el enlace exclusivo de tu escena. El enlace conserva todos tus ajustes personalizados, incluidos el estilo del pastel, las velas, el mensaje, la sensibilidad, etc. Tus amigos abren el enlace sin volver a configurar y entran directamente a la escena exclusiva para soplar las velas.",
    },
    {
      q: "Las velas se apagan solas por accidente, ¿cómo evitar activaciones falsas?",
      a: "Usa la función de bloqueo de la escena. Al activar el bloqueo, la captación del micrófono y la barra de progreso de soplado se desactivan—ningún ruido externo o leve corriente de aire apagará las velas, evitando por completo errores. Cuando estés listo para soplar oficialmente, desbloquea para restaurar la detección normal. El estado bloqueado muestra un icono de candado dedicado para una visibilidad clara.",
    },
    {
      q: "¿Qué significa la sensibilidad del micrófono? ¿Necesito ajustarla?",
      a: "La sensibilidad del micrófono es el parámetro de detección de soplado que se adapta a distintos dispositivos. Debido a las diferencias de hardware entre los micrófonos de teléfonos y computadoras, la captación varía: una sensibilidad demasiado alta hace que un leve ruido apague las velas por error; demasiado baja y un soplado normal no se detecta. Recomendamos ajustar la sensibilidad según tu dispositivo antes de usar para obtener el mejor efecto.",
    },
  ],
  pt: [
    {
      q: "Para que serve esta ferramenta online de soprar velas? Quais cenários comporta?",
      a: "Esta ferramenta é um programa interativo virtual de soprar velas de aniversário que roda no navegador, sem download ou instalação—basta abrir a página. Comporta dois cenários principais: primeiro, uso local offline—configure a cena do bolo no celular ou computador e deixe o aniversariante soprar as velas em direção ao microfone do aparelho, substituindo velas reais, com segurança e diversão; segundo, uso remoto online—personalize um bolo de aniversário exclusivo, gere um link de compartilhamento e envie aos amigos, que abrem o link para experimentar diretamente a interação de soprar, realizando uma surpresa de aniversário à distância.",
    },
    {
      q: "Em comparação com velas reais, quais as vantagens das velas virtuais eletrônicas?",
      a: "Comparadas às velas reais, as vantagens desta ferramenta eletrônica são claras: 1) segurança—sem chama aberta, sem risco de queimaduras ou incêndio, segura para idosos e crianças; 2) ecológica—sem gases de combustão ou poluição de cera, zero consumíveis e zero desperdício; 3) prática—sem limites de local ou adereços, utilizável a qualquer hora e lugar, com suporte a interação remota; 4) novidade e diversão—com efeitos integrados de fogos de artifício e iluminação para atmosfera mais forte, evitando situações constrangedoras de sujar o bolo.",
    },
    {
      q: "Como compartilho a cena de bolo personalizada com amigos?",
      a: "Após concluir toda a configuração da cena, clique no ícone de compartilhar no canto inferior direito da interface para copiar com um clique o link exclusivo da sua cena. O link preserva todas as suas configurações personalizadas, incluindo estilo do bolo, velas, mensagem, sensibilidade, etc. Seus amigos abrem o link sem reconfigurar e entram direto na cena exclusiva para soprar as velas.",
    },
    {
      q: "As velas se apagam sozinhas por acidente, como evitar disparos falsos?",
      a: "Use a função de bloqueio da cena. Ao ativar o bloqueio, a captação do microfone e a barra de progresso de sopro são desativadas—nenhum ruído externo ou leve corrente de ar apagará as velas, evitando totalmente erros. Quando estiver pronto para soprar oficialmente, desbloqueie para restaurar a detecção normal. O estado bloqueado mostra um ícone de cadeado dedicado para visibilidade clara.",
    },
    {
      q: "O que significa sensibilidade do microfone? Preciso ajustá-la?",
      a: "A sensibilidade do microfone é o parâmetro de detecção de sopro que se adapta a diferentes dispositivos. Devido a diferenças de hardware entre microfones de celular e computador, a captação varia: sensibilidade muito alta faz com que um leve ruído apague as velas por engano; muito baixa e um sopro normal não é detectado. Recomendamos ajustar a sensibilidade ao seu dispositivo antes do uso para obter o melhor efeito.",
    },
  ],
  de: [
    {
      q: "Wozu dient dieses Online-Tool zum Ausblasen von Kerzen? Für welche Szenarien eignet es sich?",
      a: "Dieses Tool ist ein browserbasiertes virtuelles interaktives Programm zum Ausblasen von Geburtstagskerzen—ohne Download oder Installation, einfach die Seite öffnen. Es eignet sich für zwei Hauptszenarien: Erstens, lokaler Offline-Einsatz—konfigurieren Sie die Kuchenszene auf Telefon oder Computer und lassen Sie das Geburtstagskind in Richtung des Gerätemikrofons blasen, als Ersatz für echte Kerzen, sicher und unterhaltsam; zweitens, Remote-Online-Einsatz—passen Sie einen exklusiven Geburtstagskuchen an, erzeugen Sie einen Freigabelink und senden Sie ihn an Freunde, die den Link öffnen, um die Ausblasen-Interaktion direkt zu erleben, und so eine Geburtstagsüberraschung aus der Ferne zu schenken.",
    },
    {
      q: "Welche Vorteile haben elektronische virtuelle Kerzen gegenüber echten Kerzen?",
      a: "Gegenüber echten Kerzen sind die Vorteile dieses elektronischen Tools offensichtlich: 1) Sicherheit—keine offene Flamme, kein Verbrennungs- oder Brandrisiko, sicher für Senioren und Kinder; 2) umweltfreundlich—keine Verbrennungsgase, keine Wachverschmutzung, null Verbrauchsmaterial und null Abfall; 3) bequem—ohne Orts- oder Requisiteneinschränkungen, jederzeit und überall nutzbar, mit Remote-Interaktion; 4) neuartig und unterhaltsam—mit integrierten Feuerwerk- und Lichteffekten für stärkere Atmosphäre, während peinliche Kuchenbeschmierung-Szenen vermieden werden.",
    },
    {
      q: "Wie teile ich die angepasste Kuchenszene mit Freunden?",
      a: "Klicken Sie nach Abschluss aller Szeneneinstellungen unten rechts in der Oberfläche auf das Teilen-Symbol, um den exklusiven Szenenlink mit einem Klick zu kopieren. Der Link bewahrt alle Ihre Anpassungen, einschließlich Kuchenstil, Kerzen, Nachricht, Empfindlichkeit usw. Freunde öffnen den Link ohne erneute Konfiguration und gelangen direkt in die exklusive Geburtstagsszene, um die Kerzen auszublasen.",
    },
    {
      q: "Die Kerzen gehen versehentlich von selbst aus—wie vermeide ich Fehlauslösungen?",
      a: "Nutzen Sie die Sperrfunktion der Szene. Wenn gesperrt, werden die Mikrofonaufnahme und der Ausblas-Fortschrittsbalken deaktiviert—kein Außengeräusch oder leichter Luftzug löst das Erlöschen der Kerzen aus, was Fehlbedienungen vollständig vermeidet. Wenn Sie bereit sind, offiziell zu blasen, entsperren Sie, um die normale Erkennung wiederherzustellen. Der Sperrzustand zeigt ein eigenes Schloss-Symbol für klare Sichtbarkeit.",
    },
    {
      q: "Was bedeutet die Mikrofonempfindlichkeit? Muss ich sie anpassen?",
      a: "Die Mikrofonempfindlichkeit ist der Blas-Erkennungsparameter, der an verschiedene Geräte angepasst wird. Aufgrund von Hardwareunterschieden zwischen Handy- und Computer-Mikrofonen variiert die Aufnahme: Eine zu hohe Empfindlichkeit führt dazu, dass leise Geräusche die Kerzen fälschlich löschen; eine zu niedrige verhindert, dass normales Blasen erkannt wird. Wir empfehlen, die Empfindlichkeit vor der Nutzung an Ihr Gerät fein einzustellen, um den besten Effekt zu erzielen.",
    },
  ],
  it: [
    {
      q: "A cosa serve questo strumento online per soffiare candele? Per quali scenari è adatto?",
      a: "Questo strumento è un programma interattivo virtuale per soffiare candeline di compleanno che funziona nel browser, senza download o installazione—basta aprire la pagina. È adatto a due scenari principali: primo, uso locale offline—configura la scena della torta su telefono o computer e lascia che il festeggiato soffii le candeline verso il microfono del dispositivo, sostituendo le candele reali, in modo sicuro e divertente; secondo, uso remoto online—personalizza una torta di compleanno esclusiva, genera un link di condivisione e invialo agli amici, che aprono il link per vivere direttamente l'interazione di soffio, recapitando una sorpresa di compleanno a distanza.",
    },
    {
      q: "Rispetto alle candele reali, quali vantaggi hanno le candele virtuali elettroniche?",
      a: "Rispetto alle candele reali, i vantaggi di questo strumento elettronico sono evidenti: 1) sicurezza—nessuna fiamma viva, nessun rischio di ustioni o incendi, sicuro per anziani e bambini; 2) ecologico—nessun gas di combustione, nessun inquinamento di cera, zero consumabili e zero spreco; 3) pratico—senza limiti di luogo o accessori, utilizzabile ovunque e in qualsiasi momento, con supporto all'interazione remota; 4) novità e divertimento—con effetti integrati di fuochi d'artificio e luci per un'atmosfera più forte, evitando situazioni imbarazzanti di torte spalmate.",
    },
    {
      q: "Come condivido la scena della torta personalizzata con gli amici?",
      a: "Dopo aver completato tutta la configurazione della scena, clicca sull'icona di condivisione in basso a destra dell'interfaccia per copiare con un clic il link esclusivo della tua scena. Il link conserva tutte le impostazioni personalizzate, inclusi stile della torta, candele, messaggio, sensibilità, ecc. Gli amici aprono il link senza riconfigurare ed entrano direttamente nella scena esclusiva per soffiare le candeline.",
    },
    {
      q: "Le candeline si spengono da sole per sbaglio, come evitare falsi trigger?",
      a: "Usa la funzione di blocco della scena. Quando è bloccata, la captazione del microfono e la barra di avanzamento del soffio sono disattivate—nessun rumore esterno o leggera corrente d'aria spegnerà le candeline, evitando del tutto errori. Quando sei pronto a soffiare ufficialmente, sblocca per ripristinare il rilevamento normale. Lo stato bloccato mostra un'icona dedicata a lucchetto per una visibilità chiara.",
    },
    {
      q: "Cosa significa la sensibilità del microfono? Devo regolarla?",
      a: "La sensibilità del microfono è il parametro di rilevamento del soffio che si adatta a diversi dispositivi. A causa delle differenze hardware tra microfoni di telefono e computer, la captazione varia: una sensibilità troppo alta fa sì che un leggero rumore spenga le candeline per errore; troppo bassa e un soffio normale non viene rilevato. Consigliamo di affinare la sensibilità in base al dispositivo prima dell'uso per ottenere il miglior effetto.",
    },
  ],
  ru: [
    {
      q: "Для чего нужен этот онлайн-инструмент задувания свечей? Для каких сценариев подходит?",
      a: "Этот инструмент — виртуальная интерактивная программа задувания свечей на день рождения, работающая в браузере, без скачивания и установки — достаточно открыть страницу. Подходит для двух основных сценариев: во-первых, использование на месте офлайн — настройте сцену с тортом на телефоне или компьютере, затем пусть именинник задует свечи в микрофон устройства, заменяя настоящие свечи, безопасно и увлекательно; во-вторых, удалённое онлайн-использование — настройте эксклюзивный торт, сгенерируйте ссылку и отправьте друзьям, которые откроют её и сразу смогут задуть свечи, подарив сюрприз на расстоянии.",
    },
    {
      q: "По сравнению с настоящими свечами, в чём преимущества электронных виртуальных свечей?",
      a: "По сравнению с настоящими свечами преимущества этого электронного инструмента очевидны: 1) безопасность — нет открытого пламени, нет риска ожогов и пожара, безопасно для пожилых и детей; 2) экологичность — нет выхлопных газов от горения, нет загрязнения воском, ноль расходников и ноль отходов; 3) удобство — без ограничений по месту и реквизиту, доступно где угодно и когда угодно, с поддержкой удалённого взаимодействия; 4) новизна и увлекательность — встроенные эффекты фейерверка и подсветки создают сильную атмосферу, избегая неловких ситуаций с размазыванием торта.",
    },
    {
      q: "Как поделиться настроенной сценой с тортом с друзьями?",
      a: "После завершения всех настроек сцены нажмите значок «Поделиться» в правом нижнем углу интерфейса, чтобы одним нажатием скопировать эксклюзивную ссылку на сцену. Ссылка сохраняет все ваши настройки, включая стиль торта, свечи, поздравление, чувствительность и т. д. Друзья открывают ссылку без повторной настройки и сразу попадают в эксклюзивную сцену, где могут задуть свечи.",
    },
    {
      q: "Свечи случайно гаснут сами, как избежать ложных срабатываний?",
      a: "Используйте функцию блокировки сцены. При включённой блокировке запись микрофона и индикатор прогресса задувания отключаются — никакой внешний шум или лёгкий поток воздуха не погасит свечи, полностью исключая ошибочные действия. Когда будете готовы официально задуть свечи, разблокируйте, чтобы восстановить нормальное распознавание. В заблокированном состоянии отображается специальный значок замка для наглядности.",
    },
    {
      q: "Что означает чувствительность микрофона? Нужно ли её настраивать?",
      a: "Чувствительность микрофона — это параметр распознавания задувания, адаптируемый под разные устройства. Из-за разницы аппаратных средств микрофонов телефонов и компьютеров качество приёма звука различается: слишком высокая чувствительность приводит к ложному задуванию от лёгкого шума; слишком низкая — нормальное задувание не распознаётся. Перед использованием рекомендуем тонко настроить чувствительность под ваше устройство для наилучшего эффекта.",
    },
  ],
  vi: [
    {
      q: "Công cụ thổi nến trực tuyến này dùng để làm gì? Phù hợp với những tình huống nào?",
      a: "Đây là chương trình tương tác ảo thổi nến sinh nhật chạy trên trình duyệt, không cần tải hay cài đặt—chỉ cần mở trang. Phù hợp với hai tình huống chính: một, sử dụng ngoại tuyến tại chỗ—cài đặt cảnh bánh trên điện thoại hoặc máy tính, rồi để người sinh nhật thổi nến hướng về mic thiết bị, thay thế nến thật, an toàn và thú vị; hai, sử dụng trực tuyến từ xa—tùy chỉnh bánh sinh nhật độc quyền, tạo liên kết chia sẻ gửi bạn bè, họ mở liên kết để trải nghiệm ngay tương tác thổi nến, gửi bất ngờ sinh nhật từ xa.",
    },
    {
      q: "So với nến sinh nhật thật, nến ảo điện tử có lợi ích gì?",
      a: "So với nến thật, lợi ích của công cụ điện tử này rõ ràng: 1 an toàn—không lửa trần, không nguy cơ bỏng hay cháy, an toàn cho người già và trẻ em; 2 thân thiện môi trường—không khí thải cháy, không ô nhiễm sáp, không tiêu hao và không rác thải; 3 tiện lợi—không giới hạn địa điểm hay đạo cụ, dùng mọi lúc mọi nơi, hỗ trợ tương tác từ xa; 4 mới lạ và vui—tích hợp hiệu ứng pháo hoa và ánh sáng tạo không khí mạnh hơn, đồng thời tránh tình huống bôi bánh ngượng ngùng.",
    },
    {
      q: "Làm sao để chia sẻ cảnh bánh đã tùy chỉnh với bạn bè?",
      a: "Sau khi hoàn tất mọi cài đặt cảnh, nhấp vào biểu tượng chia sẻ ở góc dưới bên phải giao diện để sao chép liên kết cảnh độc quyền chỉ với một nhấp. Liên kết giữ nguyên mọi cài đặt tùy chỉnh của bạn bao gồm kiểu bánh, nến, lời chúc, tham số độ nhạy, v.v. Bạn bè mở liên kết không cần cấu hình lại, vào thẳng cảnh sinh nhật độc quyền và có thể thổi nến tương tác.",
    },
    {
      q: "Nến hay tự tắt do nhầm lẫn, làm sao tránh kích hoạt sai?",
      a: "Hãy dùng chức năng khóa của cảnh. Khi bật khóa, thu âm mic và thanh tiến trình thổi đều bị vô hiệu hóa—bất kỳ tiếng ồn ngoài nào hay dòng khí nhẹ cũng không làm tắt nến, tránh hoàn toàn thao tác sai. Khi sẵn sàng thổi chính thức, mở khóa để khôi phục nhận diện bình thường. Trạng thái khóa hiển thị biểu tượng ổ khóa riêng để dễ nhận biết.",
    },
    {
      q: "Độ nhạy mic nghĩa là gì? Có cần điều chỉnh không?",
      a: "Độ nhạy mic là tham số nhận diện thổi phù hợp với từng thiết bị. Do khác biệt phần cứng mic giữa điện thoại và máy tính, chất lượng thu âm khác nhau: độ nhạy quá cao khiến tiếng ồn nhẹ làm tắt nến nhầm; quá thấp thì thổi bình thường không được nhận diện. Khuyến nghị tinh chỉnh độ nhạy theo thiết bị trước khi dùng để có hiệu quả tốt nhất.",
    },
  ],
};

export const FULLSCREEN_LABELS: Record<Language, { enter: string; exit: string }> = {
  en: { enter: "Enter Fullscreen", exit: "Exit Fullscreen" },
  zh: { enter: "进入全屏", exit: "退出全屏" },
  "zh-Hant": { enter: "進入全螢幕", exit: "退出全螢幕" },
  ja: { enter: "フルスクリーン", exit: "フルスクリーン解除" },
  fr: { enter: "Plein écran", exit: "Quitter plein écran" },
  ar: { enter: "ملء الشاشة", exit: "إنهاء ملء الشاشة" },
  ko: { enter: "전체 화면", exit: "전체 화면 종료" },
  es: { enter: "Pantalla completa", exit: "Salir de pantalla completa" },
  pt: { enter: "Tela cheia", exit: "Sair da tela cheia" },
  de: { enter: "Vollbild", exit: "Vollbild beenden" },
  it: { enter: "Schermo intero", exit: "Esci schermo intero" },
  ru: { enter: "Полный экран", exit: "Выйти из полноэкранного режима" },
  vi: { enter: "Toàn màn hình", exit: "Thoát toàn màn hình" },
};
