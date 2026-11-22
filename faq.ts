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
  hi: "अक्सर पूछे जाने वाले प्रश्न",
  id: "Pertanyaan yang Sering Diajukan",
  th: "คำถามที่พบบ่อย",
  ms: "Soalan Lazim",
  tr: "Sıkça Sorulan Sorular",
  ur: "اکثر پوچھے جانے والے سوالات",
};

export const FAQS: Record<Language, FaqItem[]> = {
  zh: [
    {
      q: "这个在线吹蜡烛 APP 怎么用？需要下载吗？",
      a: "不用下载，不用注册，不论是手机、平板或是电脑，打开网页就能用。挑好蛋糕、蜡烛和祝福语后，直接对着麦克风吹气就能吹灭；也可以直接点「分享」发给远方的朋友，对方点开链接就能吹。",
    },
    {
      q: "对比实体生日蜡烛，电子虚拟蜡烛有什么优势？",
      a: "相比实体蜡烛，本电子蜡烛工具优势十分明显：一是安全无隐患，无明火、无烫伤、火灾风险，老人小孩使用都很安全；二是绿色环保，无蜡烛燃烧废气、无蜡油污染，零耗材零浪费；三是便捷百搭，不受场地、道具限制，随时随地可用，还支持远程互动；四是趣味新颖，自带烟花灯光特效，氛围感更强，同时避免生日打闹抹蛋糕的尴尬场景。",
    },
    {
      q: "周围有点吵，还没开始蜡烛就自己灭了？",
      a: "可以先点右侧的「锁定」按钮暂停收音，等寿星准备好许愿时再点解锁。如果在餐厅等嘈杂环境，适当调低灵敏度或做一次环境采样校准，就能避免误灭。",
    },
    {
      q: "怎么把布置好的蛋糕发给朋友？",
      a: "配置好之后点「分享」即可复制专属链接。蛋糕款式、蜡烛数量、名字和祝福语都会带在链接里，朋友打开就能直接进入你准备好的生日场景，不用重新配置。",
    },
    {
      q: "适合什么场景？手机和电脑都支持吗？",
      a: "手机、平板和电脑的现代浏览器都支持。忘买蜡烛、宿舍或餐厅不方便点明火，或者和异地的朋友线上过生日时，都可以随时拿来用。",
    },
  ],
  en: [
    {
      q: "How do I use this online candle-blowing app? Do I need to download anything?",
      a: "No download or sign-up required—just open the page on your phone, tablet, or computer. Pick a cake, candles, and a message, then blow into your microphone to extinguish the flames. You can also tap Share to send a link to a friend far away so they can blow them out right away.",
    },
    {
      q: "What are the advantages of virtual candles compared to real birthday candles?",
      a: "Virtual candles have four clear advantages: 1) Safe—no open flame, burns, or fire risk, making them safe for kids and seniors; 2) Eco-friendly—no smoke, wax mess, or disposable waste; 3) Convenient—works anywhere without extra props and supports remote celebrations; 4) Fun—built-in fireworks and lighting effects elevate the mood without messy cake-smashing accidents.",
    },
    {
      q: "It's noisy around us and the candles went out before we started—what should I do?",
      a: "Tap the Lock button on the right to pause microphone detection until the birthday person is ready to make a wish, then unlock it. In noisy places like restaurants, lowering the sensitivity slightly or running a quick ambient blow calibration will prevent false triggers.",
    },
    {
      q: "How do I send my customized cake to a friend?",
      a: "Once you've arranged the cake, tap Share to copy your unique link. Your cake style, candle count, name, and message are all saved in the link, so your friend jumps straight into the birthday scene without having to set anything up.",
    },
    {
      q: "What occasions is it good for? Does it work on both phones and computers?",
      a: "It works in any modern browser on phones, tablets, and computers. Use it whenever you forgot to buy candles, can't light open flames in a dorm or restaurant, or want to celebrate online with friends far away.",
    },
  ],
  "zh-Hant": [
    {
      q: "這個線上吹蠟燭 APP 怎麼用？需要下載嗎？",
      a: "不用下載，不用註冊，不論是手機、平板或是電腦，打開網頁就能用。挑好蛋糕、蠟燭和祝福語後，直接對著麥克風吹氣就能吹滅；也可以直接點「分享」發給遠方的朋友，對方點開連結就能吹。",
    },
    {
      q: "對比實體生日蠟燭，電子虛擬蠟燭有什麼優勢？",
      a: "相比實體蠟燭，這款電子蠟燭工具優勢十分明顯：一是安全無隱患，無明火、無燙傷或火災風險，老人小孩使用都很安全；二是綠色環保，無蠟燭燃燒廢氣、無蠟油污染，零耗材零浪費；三是便捷百搭，不受場地與道具限制，隨時隨地可用，還支援遠端互動；四是趣味新穎，自帶煙火燈光特效，氛圍感更強，同時避免生日打鬧抹蛋糕的尷尬場景。",
    },
    {
      q: "周圍有點吵，還沒開始蠟燭就自己滅了？",
      a: "可以先點右側的「鎖定」按鈕暫停收音，等壽星準備好許願時再點解鎖。如果在餐廳等嘈雜環境，適當調低靈敏度或做一次環境採樣校準，就能避免誤滅。",
    },
    {
      q: "怎麼把布置好的蛋糕發給朋友？",
      a: "配置好之後點「分享」即可複製專屬連結。蛋糕款式、蠟燭數量、名字和祝福語都會帶在連結裡，朋友打開就能直接進入你準備好的生日場景，不用重新配置。",
    },
    {
      q: "適合什麼場景？手機和電腦都支援嗎？",
      a: "手機、平板和電腦的現代瀏覽器都支援。忘買蠟燭、宿舍或餐廳不方便點明火，或者和異地的朋友線上過生日時，都可以隨時拿來用。",
    },
  ],
  ja: [
    {
      q: "このオンラインろうそく吹き消しアプリはどう使いますか？ダウンロードは必要ですか？",
      a: "ダウンロードも登録も不要で、スマホ・タブレット・PCからページを開くだけで使えます。ケーキやろうそく、メッセージを選んだらマイクに息を吹きかけるだけ。「共有」を押せば遠くの友達にもリンクを送ってそのまま吹き消してもらえます。",
    },
    {
      q: "本物のろうそくと比べて、電子ろうそくにはどんなメリットがありますか？",
      a: "主なメリットは4つあります。1つ目は安全性（火を使わないので火傷や火災の心配がなく子どもや高齢者も安心）、2つ目はエコ（煙もロウ汚れもゴミもゼロ）、3つ目は手軽さ（場所や道具を問わずいつでも使え、リモートお祝いにも対応）、4つ目は演出（花火や光のエフェクトで盛り上がり、ケーキ汚れのハプニングも防げます）。",
    },
    {
      q: "周りが騒がしくて、始める前にろうそくが勝手に消えてしまいます。",
      a: "右側の「ロック」ボタンを押してマイク検知を一時停止し、主役が願い事をして吹く直前に解除してください。レストランなど賑やかな場所では、感度を少し下げるか環境キャリブレーションを行うと誤消灯を防げます。",
    },
    {
      q: "カスタマイズしたケーキを友達に送るにはどうすればいいですか？",
      a: "設定が終わったら「共有」ボタンを押して専用リンクをコピーするだけです。ケーキのデザイン、ろうそくの本数、名前、メッセージがすべてリンクに含まれるため、友達は開くだけですぐにお祝いシーンを楽しめます。",
    },
    {
      q: "どんな場面に向いていますか？スマホでもPCでも使えますか？",
      a: "スマホ・タブレット・PCの最新ブラウザに対応しています。ろうそくを買い忘れたとき、寮やレストランで火気厳禁のとき、離れて暮らす友達とオンラインで誕生日を祝いたいときにぴったりです。",
    },
  ],
  fr: [
    {
      q: "Comment utiliser cette application de bougies en ligne ? Faut-il la télécharger ?",
      a: "Aucun téléchargement ni inscription : ouvrez simplement la page sur téléphone, tablette ou ordinateur. Choisissez le gâteau, les bougies et votre message, puis soufflez dans le micro pour les éteindre. Vous pouvez aussi cliquer sur « Partager » pour envoyer le lien à un proche à distance.",
    },
    {
      q: "Quels sont les avantages des bougies virtuelles par rapport aux vraies bougies ?",
      a: "Quatre atouts majeurs : 1) Sécurité — aucune flamme, aucun risque de brûlure ou d'incendie, idéal pour les enfants et les seniors ; 2) Écologique — ni fumée, ni cire, ni déchet ; 3) Pratique — utilisable partout sans accessoire et compatible à distance ; 4) Festif — feux d'artifice et jeux de lumière intégrés sans salir le gâteau.",
    },
    {
      q: "Il y a du bruit autour et les bougies s'éteignent avant de commencer, que faire ?",
      a: "Cliquez sur le bouton « Verrouiller » à droite pour mettre le micro en pause jusqu'au moment du vœu, puis déverrouillez. Dans un lieu bruyant comme un restaurant, baissez un peu la sensibilité ou lancez un calibrage rapide pour éviter les faux déclenchements.",
    },
    {
      q: "Comment envoyer le gâteau personnalisé à un ami ?",
      a: "Une fois la configuration terminée, cliquez sur « Partager » pour copier votre lien personnalisé. Le style du gâteau, le nombre de bougies, le prénom et le message y sont inclus : votre ami ouvre le lien et accède directement à la scène.",
    },
    {
      q: "Pour quelles occasions l'utiliser ? Est-ce compatible mobile et ordinateur ?",
      a: "Oui, cela fonctionne dans tous les navigateurs modernes sur mobile, tablette et ordinateur. Parfait si vous avez oublié les bougies, si les flammes sont interdites (dortoir, restaurant) ou pour fêter un anniversaire à distance.",
    },
  ],
  ar: [
    {
      q: "كيف أستخدم تطبيق إطفاء الشموع هذا؟ وهل يحتاج إلى تحميل؟",
      a: "لا حاجة للتحميل أو التسجيل؛ فقط افتح الصفحة من الهاتف أو الجهاز اللوحي أو الكمبيوتر. اختر الكعكة والشموع والرسالة ثم انفخ في الميكروفون لإطفائها، أو اضغط «مشاركة» لإرسال الرابط إلى صديق بعيد لينفخها بنفسه.",
    },
    {
      q: "ما مزايا الشموع الإلكترونية مقارنة بالشموع الحقيقية؟",
      a: "أربع مزايا واضحة: 1) الأمان التام بدون لهب أو خطر حريق، وهي آمنة للأطفال وكبار السن؛ 2) صديقة للبيئة بلا دخان أو شمع أو نفايات؛ 3) عملية ومتاحة في أي وقت ومكان وتدعم الاحتفال عن بُعد؛ 4) ممتعة مع مؤثرات الألعاب النارية والأضواء دون فوضى الكعك.",
    },
    {
      q: "المكان صاخب وتنطفئ الشموع وحدها قبل أن نبدأ، ماذا أفعل؟",
      a: "اضغط على زر «قفل» على الجانب لإيقاف الميكروفون مؤقتاً حتى يصبح صاحب عيد الميلاد مستعداً للنفخ، ثم ألغِ القفل. وفي الأماكن الصاخبة مثل المطاعم، خفّض الحساسية قليلاً أو أجرِ معايرة سريعة لتجنب الإطفاء بالخطأ.",
    },
    {
      q: "كيف أرسل الكعكة التي جهزتها إلى صديق؟",
      a: "بعد إنهاء الإعدادات اضغط «مشاركة» لنسخ الرابط الخاص بك. سيحفظ الرابط شكل الكعكة وعدد الشموع والاسم والرسالة، ليفتح صديقك المشهد مباشرة دون إعادة إعداد.",
    },
    {
      q: "ما المناسبات التي يصلح لها؟ وهل يعمل على الهاتف والكمبيوتر؟",
      a: "يدعم جميع المتصفحات الحديثة على الهاتف والتابلت والكمبيوتر. مثالي عند نسيان شراء الشموع، أو في الأماكن التي يُمنع فيها إشعال النار كالسكن والمطاعم، أو للاحتفال عن بُعد مع الأصدقاء.",
    },
  ],
  ko: [
    {
      q: "이 온라인 촛불 불기 앱은 어떻게 쓰나요? 다운로드가 필요한가요?",
      a: "다운로드도 회원가입도 필요 없습니다. 스마트폰, 태블릿, PC 어디서든 웹페이지만 열면 바로 쓸 수 있어요. 케이크와 초, 축하 메시지를 고른 뒤 마이크에 바람을 불면 꺼지며, '공유'를 눌러 멀리 있는 친구에게 링크를 보낼 수도 있습니다.",
    },
    {
      q: "실제 생일 초와 비교해 전자 가상 초는 어떤 장점이 있나요?",
      a: "장점이 뚜렷합니다. 1) 불꽃이 없어 화상이나 화재 위험이 없고 아이와 어르신도 안전합니다. 2) 연기나 촛농, 쓰레기가 없는 친환경 방식입니다. 3) 장소와 준비물 제약 없이 언제 어디서나, 원격으로도 축하할 수 있습니다. 4) 불꽃놀이와 조명 효과가 더해져 분위기가 살아나며 케이크가 망가질 걱정도 없습니다.",
    },
    {
      q: "주변이 좀 시끄러워서 시작도 전에 초가 저절로 꺼져요.",
      a: "오른쪽 '잠금' 버튼을 눌러 마이크 감지를 잠시 멈춰 두었다가, 주인공이 소원을 빌고 불 준비가 되면 잠금을 풀어 주세요. 식당처럼 시끄러운 곳에서는 감도를 조금 낮추거나 환경 캘리브레이션을 한 번 진행하면 오작동을 막을 수 있습니다.",
    },
    {
      q: "꾸며 둔 케이크를 친구에게 어떻게 보내나요?",
      a: "설정을 마친 뒤 '공유' 버튼을 누르면 전용 링크가 복사됩니다. 케이크 스타일, 초 개수, 이름과 메시지가 링크에 모두 담겨 있어 친구가 링크를 열면 다시 설정할 필요 없이 바로 촛불을 불 수 있습니다.",
    },
    {
      q: "어떤 상황에 쓰기 좋나요? 모바일과 PC 모두 지원하나요?",
      a: "스마트폰, 태블릿, PC의 최신 브라우저를 모두 지원합니다. 초를 깜빡하고 못 샀을 때, 기숙사나 식당처럼 불을 켜기 어려운 곳, 또는 멀리 떨어진 친구와 온라인으로 생일을 축하할 때 언제든 활용해 보세요.",
    },
  ],
  es: [
    {
      q: "¿Cómo se usa esta app para soplar velas online? ¿Hay que descargarla?",
      a: "No hace falta descargar ni registrarse: abre la página desde tu móvil, tablet u ordenador y listo. Elige el pastel, las velas y tu mensaje, y sopla hacia el micrófono para apagarlas; también puedes pulsar «Compartir» para enviar el enlace a un amigo a distancia.",
    },
    {
      q: "¿Qué ventajas tienen las velas virtuales frente a las velas reales?",
      a: "Tienen cuatro grandes ventajas: 1) Seguridad: sin llama ni riesgo de quemaduras o incendios, apto para niños y mayores; 2) Ecológicas: sin humo, cera ni residuos; 3) Prácticas: funcionan en cualquier lugar y permiten celebrar a distancia; 4) Divertidas: incluyen fuegos artificiales y luces sin arruinar el pastel.",
    },
    {
      q: "Hay ruido alrededor y las velas se apagan antes de empezar, ¿qué hago?",
      a: "Pulsa el botón «Bloquear» a la derecha para pausar el micrófono hasta que el cumpleañero esté listo para pedir su deseo y luego desbloquéalo. En lugares ruidosos como restaurantes, baja un poco la sensibilidad o haz una calibración rápida para evitar falsos apagados.",
    },
    {
      q: "¿Cómo envío el pastel que preparé a un amigo?",
      a: "Al terminar la configuración, pulsa «Compartir» para copiar tu enlace exclusivo. El estilo del pastel, las velas, el nombre y la dedicatoria viajan dentro del enlace para que tu amigo entre directamente sin configurar nada.",
    },
    {
      q: "¿Para qué ocasiones sirve? ¿Funciona en móvil y ordenador?",
      a: "Funciona en navegadores modernos de móviles, tablets y ordenadores. Es ideal si olvidaste comprar velas, si no se permite fuego en una residencia o restaurante, o para celebrar un cumpleaños a distancia.",
    },
  ],
  pt: [
    {
      q: "Como usar este app de soprar velas online? Precisa baixar?",
      a: "Não precisa baixar nem criar conta: basta abrir a página no celular, tablet ou computador. Escolha o bolo, as velas e a mensagem e sopre no microfone para apagar; você também pode clicar em «Compartilhar» para mandar o link a alguém distante.",
    },
    {
      q: "Quais são as vantagens das velas virtuais em comparação às velas reais?",
      a: "Quatro vantagens claras: 1) Segurança — sem chama nem risco de queimaduras ou incêndio, seguro para crianças e idosos; 2) Ecológico — sem fumaça, cera ou desperdício; 3) Prático — funciona em qualquer lugar e permite comemorar à distância; 4) Divertido — efeitos de fogos e luzes que animam a festa sem bagunça no bolo.",
    },
    {
      q: "O ambiente está barulhento e as velas apagam sozinhas antes da hora?",
      a: "Clique no botão «Bloquear» à direita para pausar o microfone até o aniversariante estar pronto para fazer o pedido e depois desbloqueie. Em locais barulhentos como restaurantes, reduza um pouco a sensibilidade ou faça uma calibração rápida para evitar apagamentos acidentais.",
    },
    {
      q: "Como enviar o bolo personalizado para um amigo?",
      a: "Depois de configurar tudo, clique em «Compartilhar» para copiar o link exclusivo. O estilo do bolo, as velas, o nome e a mensagem vão salvos no link, e seu amigo abre direto na cena pronta.",
    },
    {
      q: "Para quais situações serve? Funciona no celular e no computador?",
      a: "Funciona em navegadores modernos no celular, tablet e computador. Perfeito quando você esqueceu de comprar velas, em lugares onde fogo não é permitido (como restaurantes ou dormitórios) ou em aniversários à distância.",
    },
  ],
  de: [
    {
      q: "Wie funktioniert diese Online-Kerzen-App? Muss man sie herunterladen?",
      a: "Kein Download, keine Anmeldung – einfach die Seite auf Handy, Tablet oder Computer öffnen. Torte, Kerzen und Gruß auswählen und ins Mikrofon pusten; oder auf „Teilen“ klicken und den Link an Freunde in der Ferne schicken.",
    },
    {
      q: "Welche Vorteile haben virtuelle Kerzen gegenüber echten Geburtstagskerzen?",
      a: "Vier klare Vorteile: 1) Sicher – kein offenes Feuer, keine Verbrennungs- oder Brandgefahr für Kinder und Senioren; 2) Umweltfreundlich – kein Rauch, kein Wachs, kein Müll; 3) Praktisch – überall sofort einsatzbereit und ideal für Feiern aus der Ferne; 4) Festlich – mit Feuerwerk- und Lichteffekten ganz ohne Torten-Chaos.",
    },
    {
      q: "Es ist laut und die Kerzen gehen schon vor dem Start von selbst aus?",
      a: "Tippe rechts auf „Sperren“, um das Mikrofon zu pausieren, bis das Geburtstagskind bereit ist, und entsperre es dann wieder. In lauten Umgebungen wie Restaurants hilft es außerdem, die Empfindlichkeit etwas zu senken oder kurz eine Kalibrierung durchzuführen.",
    },
    {
      q: "Wie schicke ich die gestaltete Torte an Freunde?",
      a: "Klicke nach dem Einrichten auf „Teilen“, um deinen persönlichen Link zu kopieren. Tortenstil, Kerzenanzahl, Name und Nachricht sind im Link gespeichert – deine Freunde öffnen ihn und können sofort lospusten.",
    },
    {
      q: "Für welche Situationen eignet es sich? Läuft es auf Handy und PC?",
      a: "Es läuft in allen modernen Browsern auf Smartphone, Tablet und PC. Ideal, wenn Kerzen vergessen wurden, offenes Feuer im Restaurant oder Wohnheim verboten ist oder man online auf Distanz feiert.",
    },
  ],
  it: [
    {
      q: "Come si usa questa app per soffiare le candeline online? Va scaricata?",
      a: "Nessun download né registrazione: apri la pagina da telefono, tablet o computer ed è subito pronta. Scegli torta, candeline e dedica, poi soffia nel microfono per spegnerle; oppure clicca «Condividi» per mandare il link a un amico lontano.",
    },
    {
      q: "Quali sono i vantaggi delle candeline virtuali rispetto a quelle reali?",
      a: "Quattro vantaggi evidenti: 1) Sicurezza: niente fiamma viva né rischio di scottature o incendi, adatta a bambini e anziani; 2) Ecologiche: zero fumo, cera o sprechi; 3) Pratiche: usabili ovunque e anche a distanza; 4) Divertenti: fuochi d'artificio ed effetti luminosi integrati senza rovinare la torta.",
    },
    {
      q: "C'è rumore intorno e le candeline si spengono prima di iniziare?",
      a: "Premi il pulsante «Blocca» a destra per mettere in pausa il microfono finché il festeggiato non è pronto a esprimere il desiderio, poi sbloccalo. In posti rumorosi come i ristoranti, abbassa un po' la sensibilità o esegui una rapida calibrazione per evitare spegnimenti accidentali.",
    },
    {
      q: "Come mando a un amico la torta che ho preparato?",
      a: "Una volta completata la personalizzazione, premi «Condividi» per copiare il link dedicato. Stile della torta, candeline, nome e auguri restano salvati nel link: il tuo amico lo apre ed entra subito nella scena pronta.",
    },
    {
      q: "Per quali occasioni è utile? Funziona su smartphone e computer?",
      a: "Funziona su tutti i browser moderni per telefono, tablet e PC. Perfetta quando hai dimenticato le candeline, nei locali o dormitori dove non si possono accendere fiamme, o per festeggiare a distanza.",
    },
  ],
  ru: [
    {
      q: "Как пользоваться этим приложением? Нужно ли его скачивать?",
      a: "Скачивать и регистрироваться не нужно — просто откройте сайт на телефоне, планшете или компьютере. Выберите торт, свечи и поздравление и подуйте в микрофон, чтобы их задуть; или нажмите «Поделиться» и отправьте ссылку другу на расстоянии.",
    },
    {
      q: "В чём плюсы электронных свечей по сравнению с обычными?",
      a: "Четыре очевидных плюса: 1) Безопасность — никакого открытого огня, ожогов и пожара, подходит детям и пожилым; 2) Экологичность — без дыма, воска и мусора; 3) Удобство — работает где угодно без реквизита и подходит для поздравлений на расстоянии; 4) Атмосфера — встроенные фейерверки и подсветка без риска испачкать торт.",
    },
    {
      q: "Вокруг шумно, и свечи гаснут сами ещё до начала — что делать?",
      a: "Нажмите кнопку «Блокировка» справа, чтобы поставить микрофон на паузу, пока именинник не готов загадать желание, а затем разблокируйте. В шумных местах вроде ресторана также поможет чуть снизить чувствительность или пройти быструю калибровку.",
    },
    {
      q: "Как отправить настроенный торт другу?",
      a: "После настройки нажмите «Поделиться», чтобы скопировать персональную ссылку. В ней сохранятся торт, количество свечей, имя и пожелание — друг откроет ссылку и сразу попадёт в готовую сцену.",
    },
    {
      q: "Для каких случаев подойдёт? Работает и на телефоне, и на компьютере?",
      a: "Работает в любых современных браузерах на смартфонах, планшетах и ПК. Выручит, если забыли купить свечи, в общежитии или ресторане нельзя зажигать огонь, либо вы празднуете онлайн на расстоянии.",
    },
  ],
  vi: [
    {
      q: "Dùng ứng dụng thổi nến online này thế nào? Có cần tải về không?",
      a: "Không cần tải hay đăng ký — chỉ cần mở trang web trên điện thoại, máy tính bảng hoặc máy tính là dùng ngay. Chọn bánh, nến và lời chúc rồi thổi vào micro để tắt nến; hoặc bấm «Chia sẻ» gửi đường link cho bạn bè ở xa tự mở ra thổi.",
    },
    {
      q: "So với nến thật, nến điện tử ảo có ưu điểm gì?",
      a: "Có 4 ưu điểm rõ rệt: 1) An toàn, không lửa trần hay nguy cơ bỏng cháy, yên tâm cho trẻ nhỏ và người lớn tuổi; 2) Thân thiện môi trường, không khói, không sáp nến hay rác thải; 3) Tiện lợi, dùng mọi lúc mọi nơi kể cả mừng sinh nhật từ xa; 4) Vui nhộn với pháo hoa và hiệu ứng ánh sáng mà không lo bôi bánh bừa bộn.",
    },
    {
      q: "Xung quanh hơi ồn, chưa kịp thổi nến đã tự tắt thì sao?",
      a: "Bạn có thể bấm nút «Khóa» ở bên phải để tạm dừng thu âm, khi nào nhân vật chính sẵn sàng ước nguyện hãy mở khóa. Ở nơi ồn như nhà hàng, giảm nhẹ độ nhạy hoặc hiệu chuẩn nhanh theo môi trường sẽ tránh tắt nhầm.",
    },
    {
      q: "Làm sao gửi chiếc bánh đã trang trí cho bạn bè?",
      a: "Sau khi tùy chỉnh xong, bấm «Chia sẻ» để sao chép liên kết riêng. Kiểu bánh, số nến, tên và lời chúc đều nằm sẵn trong link, bạn bè mở ra là vào thẳng khung cảnh sinh nhật mà không cần cài đặt lại.",
    },
    {
      q: "Phù hợp với những dịp nào? Điện thoại và máy tính đều dùng được chứ?",
      a: "Hỗ trợ mọi trình duyệt hiện đại trên điện thoại, máy tính bảng và máy tính. Rất tiện khi quên mua nến, ở ký túc xá hay nhà hàng không tiện đốt lửa, hoặc tổ chức sinh nhật online từ xa.",
    },
  ],
  hi: [
    {
      q: "इस ऑनलाइन मोमबत्ती बुझाने वाले ऐप का उपयोग कैसे करें? क्या इसे डाउनलोड करना होगा?",
      a: "न डाउनलोड की ज़रूरत है न साइन-अप की — बस फोन, टैबलेट या कंप्यूटर पर वेबपेज खोलें। केक, मोमबत्तियां और संदेश चुनें, फिर माइक्रोफोन में फूंक मारकर बुझाएं; या 'शेयर करें' पर क्लिक करके दूर बैठे दोस्त को लिंक भेज दें।",
    },
    {
      q: "असली जन्मदिन की मोमबत्तियों की तुलना में वर्चुअल मोमबत्तियों के क्या फायदे हैं?",
      a: "इसके चार बड़े फायदे हैं: 1) सुरक्षित — कोई खुली आग, जलने या आग लगने का खतरा नहीं, बच्चों और बुजुर्गों के लिए सुरक्षित; 2) पर्यावरण के अनुकूल — न धुआं, न मोम की गंदगी, न कचरा; 3) सुविधाजनक — कहीं भी बिना सामान के इस्तेमाल करें और दूर से भी जश्न मनाएं; 4) मज़ेदार — आतिशबाज़ी और लाइट इफेक्ट्स के साथ माहौल शानदार बनता है और केक खराब होने की झंझट भी नहीं।",
    },
    {
      q: "आसपास शोर है और शुरू करने से पहले ही मोमबत्तियां बुझ गईं, क्या करें?",
      a: "दाईं ओर मौजूद 'लॉक' बटन दबाकर माइक्रोफोन को अस्थायी रूप से रोक दें, और जब विश मांगकर फूंक मारने के लिए तैयार हों तब अनलॉक करें। रेस्तरां जैसी शोर वाली जगहों पर संवेदनशीलता थोड़ी कम करें या एक बार एनवायरनमेंट कैलिब्रेशन कर लें।",
    },
    {
      q: "सजाया हुआ केक दोस्त को कैसे भेजें?",
      a: "सेटिंग पूरी होने के बाद 'शेयर करें' दबाकर अपना खास लिंक कॉपी करें। केक का डिज़ाइन, मोमबत्तियों की संख्या, नाम और शुभकामना संदेश सब लिंक में सुरक्षित रहते हैं — दोस्त खोलते ही सीधे मोमबत्तियां बुझा सकता है।",
    },
    {
      q: "यह किन मौकों के लिए सही है? क्या फोन और कंप्यूटर दोनों पर चलता है?",
      a: "यह फोन, टैबलेट और कंप्यूटर के सभी आधुनिक ब्राउज़र में चलता है। जब मोमबत्ती खरीदना भूल जाएं, हॉस्टल या रेस्तरां में आग जलाना संभव न हो, या दूर बैठे दोस्तों के साथ ऑनलाइन जन्मदिन मनाना हो — तब यह बहुत काम आता है।",
    },
  ],
  id: [
    {
      q: "Bagaimana cara memakai aplikasi tiup lilin online ini? Perlu diunduh?",
      a: "Tidak perlu unduh atau daftar — cukup buka halaman web di ponsel, tablet, atau komputer. Pilih kue, lilin, dan ucapan, lalu tiup ke mikrofon untuk memadamkannya; atau klik «Bagikan» agar teman yang jauh bisa langsung meniup lewat tautan.",
    },
    {
      q: "Apa keunggulan lilin virtual dibandingkan lilin ulang tahun asli?",
      a: "Ada empat keunggulan utama: 1) Aman — tanpa api terbuka atau risiko terbakar, aman untuk anak-anak dan lansia; 2) Ramah lingkungan — tanpa asap, tetesan lilin, maupun sampah; 3) Praktis — bisa dipakai di mana saja tanpa perlengkapan tambahan dan mendukung perayaan jarak jauh; 4) Seru — ada efek kembang api dan cahaya tanpa drama kue berantakan.",
    },
    {
      q: "Suasana agak ramai dan lilin padam sendiri sebelum dimulai?",
      a: "Klik tombol «Kunci» di sisi kanan untuk menjeda mikrofon sampai yang berulang tahun siap meniup, lalu buka kunci kembali. Di tempat ramai seperti restoran, turunkan sedikit sensitivitas atau lakukan kalibrasi sampel lingkungan agar tidak mudah padam sendiri.",
    },
    {
      q: "Bagaimana cara mengirim kue yang sudah diatur ke teman?",
      a: "Setelah selesai mengatur, klik «Bagikan» untuk menyalin tautan khusus. Gaya kue, jumlah lilin, nama, dan ucapan tersimpan di tautan tersebut sehingga teman bisa langsung masuk ke tampilan ulang tahun tanpa mengatur ulang.",
    },
    {
      q: "Cocok untuk momen apa saja? Bisa dipakai di HP dan komputer?",
      a: "Didukung di semua browser modern pada ponsel, tablet, maupun komputer. Cocok saat lupa membeli lilin, di asrama atau restoran yang melarang api terbuka, maupun untuk merayakan ulang tahun online jarak jauh.",
    },
  ],
  th: [
    {
      q: "แอปเป่าเทียนออนไลน์นี้ใช้งานอย่างไร ต้องดาวน์โหลดไหม?",
      a: "ไม่ต้องดาวน์โหลดและไม่ต้องสมัครสมาชิก แค่เปิดหน้าเว็บจากมือถือ แท็บเล็ต หรือคอมพิวเตอร์ก็ใช้ได้ทันที เลือกเค้ก เทียน และคำอวยพร แล้วเป่าใส่ไมโครโฟนเพื่อดับเทียน หรือกด «แชร์» ส่งลิงก์ให้เพื่อนที่อยู่ไกลเป่าได้เลย",
    },
    {
      q: "เทียนวันเกิดอิเล็กทรอนิกส์มีข้อดีกว่าเทียนจริงอย่างไร?",
      a: "มีข้อดี 4 ข้อชัดเจน: 1) ปลอดภัย ไม่มีเปลวไฟจริง ไร้ความเสี่ยงไฟไหม้ เหมาะกับเด็กและผู้สูงอายุ 2) รักษ์โลก ไม่มีควัน ไม่มีน้ำตาเทียนและขยะ 3) สะดวก ใช้ได้ทุกที่ทุกเวลาและร่วมฉลองทางไกลได้ 4) สนุกกว่าด้วยเอฟเฟกต์พลุและแสงไฟ โดยไม่ต้องกังวลเรื่องเค้กเลอะเทอะ",
    },
    {
      q: "รอบข้างเสียงดังแล้วเทียนดับเองก่อนเริ่มเป่า ทำอย่างไรดี?",
      a: "กดปุ่ม «ล็อก» ด้านขวาเพื่อหยุดรับเสียงไมค์ไว้ก่อน แล้วค่อยปลดล็อกเมื่อเจ้าของวันเกิดพร้อมอธิษฐานเป่าเทียน หากอยู่ในที่จอแจอย่างร้านอาหาร ให้ลดความไวไมค์ลงเล็กน้อยหรือปรับเทียบเสียงตามสภาพแวดล้อมสักครั้งเพื่อกันดับเอง",
    },
    {
      q: "จะส่งเค้กที่ตกแต่งไว้ให้เพื่อนได้อย่างไร?",
      a: "เมื่อตั้งค่าเสร็จแล้วกด «แชร์» เพื่อคัดลอกลิงก์ได้เลย รูปแบบเค้ก จำนวนเทียน ชื่อ และคำอวยพรจะติดไปกับลิงก์ เพื่อนเปิดขึ้นมาก็เข้าสู่ฉากวันเกิดและเป่าเทียนได้ทันทีโดยไม่ต้องตั้งค่าใหม่",
    },
    {
      q: "เหมาะกับโอกาสไหนบ้าง ใช้ได้ทั้งมือถือและคอมพิวเตอร์ไหม?",
      a: "รองรับเบราว์เซอร์สมัยใหม่ทั้งบนมือถือ แท็บเล็ต และคอมพิวเตอร์ เหมาะมากเวลาลืมซื้อเทียน อยู่ในหอพักหรือร้านอาหารที่จุดไฟไม่ได้ หรืออยากจัดเซอร์ไพรส์วันเกิดออนไลน์ให้เพื่อนที่อยู่ไกล",
    },
  ],
  ms: [
    {
      q: "Bagaimana cara guna aplikasi tiup lilin dalam talian ini? Perlu muat turun?",
      a: "Tidak perlu muat turun atau daftar — buka sahaja laman web di telefon, tablet atau komputer. Pilih kek, lilin dan ucapan, kemudian tiup ke mikrofon untuk memadamkannya; atau klik «Kongsi» untuk menghantar pautan kepada rakan yang jauh.",
    },
    {
      q: "Apakah kelebihan lilin maya berbanding lilin hari jadi sebenar?",
      a: "Empat kelebihan utama: 1) Selamat — tiada api terbuka atau risiko kebakaran, selamat untuk kanak-kanak dan warga emas; 2) Mesra alam — tiada asap, lelehan lilin atau pembaziran; 3) Mudah — boleh digunakan di mana-mana sahaja dan menyokong sambutan jarak jauh; 4) Menyeronokkan — dilengkapi kesan bunga api dan lampu tanpa mengotorkan kek.",
    },
    {
      q: "Persekitaran agak bising dan lilin padam sendiri sebelum mula?",
      a: "Klik butang «Kunci» di sebelah kanan untuk menjeda mikrofon sehingga tuan punya hari jadi bersedia membuat hajat, kemudian buka semula. Di tempat bising seperti restoran, rendahkan sedikit kepekaan atau lakukan penentukuran sampel persekitaran.",
    },
    {
      q: "Bagaimana hendak menghantar kek yang telah dihias kepada rakan?",
      a: "Selepas selesai tetapan, klik «Kongsi» untuk menyalin pautan khas anda. Gaya kek, bilangan lilin, nama dan ucapan disimpan dalam pautan tersebut supaya rakan terus masuk ke paparan hari jadi tanpa tetapan semula.",
    },
    {
      q: "Sesuai untuk situasi apa? Boleh digunakan di telefon dan komputer?",
      a: "Menyokong semua pelayar moden pada telefon, tablet dan komputer. Sangat berguna apabila terlupa membeli lilin, di asrama atau restoran yang melarang api, mahupun untuk sambutan hari jadi jarak jauh secara dalam talian.",
    },
  ],
  tr: [
    {
      q: "Bu online mum üfleme uygulaması nasıl kullanılır? İndirmek gerekiyor mu?",
      a: "İndirme ya da kayıt yok — telefon, tablet veya bilgisayardan sayfayı açmanız yeterli. Pastayı, mumları ve mesajınızı seçip mikrofona üfleyerek söndürebilir ya da «Paylaş» düğmesiyle uzaktaki arkadaşınıza bağlantı gönderebilirsiniz.",
    },
    {
      q: "Sanal mumların gerçek doğum günü mumlarına göre avantajları nelerdir?",
      a: "Dört belirgin avantajı var: 1) Güvenli — açık alev, yanık veya yangın riski yok, çocuklar ve yaşlılar için güvenli; 2) Çevre dostu — duman, mum damlası ve atık yok; 3) Pratik — ekstra malzeme gerekmeden her yerde ve uzaktan kutlamalarda kullanılabilir; 4) Eğlenceli — havai fişek ve ışık efektleriyle pastayı kirletmeden coşkulu bir atmosfer sunar.",
    },
    {
      q: "Ortam biraz gürültülü ve başlamadan mumlar kendiliğinden sönüyor, ne yapmalıyım?",
      a: "Sağdaki «Kilitle» düğmesine basarak doğum günü sahibi dilek tutmaya hazır olana kadar mikrofonu duraklatın, sonra kilidi açın. Restoran gibi gürültülü yerlerde hassasiyeti biraz düşürmek veya hızlı bir ortam kalibrasyonu yapmak yanlış sönmeleri önler.",
    },
    {
      q: "Hazırladığım pastayı arkadaşıma nasıl gönderebilirim?",
      a: "Ayarları bitirdikten sonra «Paylaş» düğmesine tıklayıp özel bağlantınızı kopyalayın. Pasta stili, mum sayısı, isim ve mesaj bağlantıda saklanır; arkadaşınız açtığında hiçbir ayar yapmadan doğrudan mumları üfleyebilir.",
    },
    {
      q: "Hangi durumlar için uygun? Hem telefonda hem bilgisayarda çalışır mı?",
      a: "Telefon, tablet ve bilgisayardaki tüm modern tarayıcıları destekler. Mum almayı unuttuğunuzda, yurt veya restoran gibi ateş yakılamayan yerlerde ya da uzaktaki sevdiklerinizle online kutlama yaparken her an kullanabilirsiniz.",
    },
  ],
  ur: [
    {
      q: "یہ آن لائن موم بتی بجھانے والی ایپ کیسے استعمال کریں؟ کیا ڈاؤن لوڈ کرنا ضروری ہے؟",
      a: "نہ ڈاؤن لوڈ کی ضرورت ہے نہ رجسٹریشن کی — فون، ٹیبلیٹ یا کمپیوٹر پر بس ویب پیج کھولیں۔ کیک، موم بتیاں اور پیغام منتخب کریں اور مائیکروفون میں پھونک مار کر بجھائیں؛ یا «شیئر کریں» پر کلک کرکے دور بیٹھے دوست کو لنک بھیج دیں۔",
    },
    {
      q: "اصلی موم بتیوں کے مقابلے میں الیکٹرانک ورچوئل موم بتیوں کے کیا فوائد ہیں؟",
      a: "اس کے چار واضح فوائد ہیں: 1) محفوظ — کھلی آگ، جلنے یا آتشزدگی کا کوئی خطرہ نہیں، بچوں اور بزرگوں کے لیے محفوظ؛ 2) ماحول دوست — نہ دھواں، نہ موم کی گندگی اور نہ کچرا؛ 3) آسان — بغیر کسی اضافی سامان کے کہیں بھی اور دور سے بھی استعمال کریں؛ 4) پرلطف — آتش بازی اور روشنی کے اثرات کے ساتھ کیک خراب ہوئے بغیر شاندار ماحول بنتا ہے۔",
    },
    {
      q: "اردگرد شور ہے اور شروع کرنے سے پہلے ہی موم بتیاں بجھ جاتی ہیں؟",
      a: "دائیں جانب موجود «لاک» بٹن دبا کر مائیکروفون کو عارضی طور پر روک دیں، اور جب سالگرہ والا شخص دعا مانگ کر پھونک مارنے کے لیے تیار ہو تو ان لاک کر دیں۔ ریسٹورنٹ جیسی پرشور جگہوں پر حساسیت تھوڑی کم کریں یا ماحولیاتی کیلیبریشن کر لیں۔",
    },
    {
      q: "اپنے سجائے ہوئے کیک کو دوست کو کیسے بھیجوں؟",
      a: "ترتیب مکمل ہونے کے بعد «شیئر کریں» پر کلک کرکے اپنا خصوصی لنک کاپی کریں۔ کیک کا انداز، موم بتیوں کی تعداد، نام اور پیغام سب لنک میں محفوظ رہتے ہیں تاکہ دوست کھولتے ہی بغیر دوبارہ سیٹنگ کیے موم بتیاں بجھا سکے۔",
    },
    {
      q: "یہ کن مواقع کے لیے موزوں ہے؟ کیا فون اور کمپیوٹر دونوں پر چلتا ہے؟",
      a: "یہ فون، ٹیبلیٹ اور کمپیوٹر کے تمام جدید براؤزرز میں چلتا ہے۔ جب موم بتیاں خریدنا بھول جائیں، ہاسٹل یا ریسٹورنٹ میں آگ جلانا ممکن نہ ہو، یا دور بیٹھے دوستوں کے ساتھ آن لائن سالگرہ منانی ہو تو کسی بھی وقت استعمال کر سکتے ہیں۔",
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
  hi: { enter: "फुलस्क्रीन", exit: "फुलस्क्रीन से बाहर निकलें" },
  id: { enter: "Layar Penuh", exit: "Keluar Layar Penuh" },
  th: { enter: "เต็มหน้าจอ", exit: "ออกจากเต็มหน้าจอ" },
  ms: { enter: "Skrin Penuh", exit: "Keluar Skrin Penuh" },
  tr: { enter: "Tam Ekran", exit: "Tam Ekrandan Çık" },
  ur: { enter: "فل اسکرین", exit: "فل اسکرین بند کریں" },
};
