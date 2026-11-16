(() => {
  'use strict';

  const root = document.getElementById('app');
  const phone = document.getElementById('phone');
  const toastElement = document.getElementById('toast');
  const config = window.INVESTVERSE_CONFIG || {};
  const photos = [
    { file: 'father-and-fahad.webp', title: 'أبو فهد وفهد من ورا', subtitle: 'هذي نفس صورة خلفية الجوال' },
    { file: 'coffee.webp', title: 'قهوة الصبح', subtitle: 'في السيارة، وقبل الزحمة' },
    { file: 'desert-camp.webp', title: 'جلسة بر', subtitle: 'نار ودلّة، وأبو سعد يسولف' },
    { file: 'kabsa.webp', title: 'كبسة يوم الجمعة', subtitle: 'جمعة العائلة' },
    { file: 'sleeping-fahad.webp', title: 'فهد نايم', subtitle: 'في المرتبة الخلفية بعد المدرسة' },
    { file: 'riyadh-traffic.webp', title: 'زحمة الطريق', subtitle: 'الطريق للبيت' },
    { file: 'fahad-number-eight.webp', title: 'تيشيرت فهد', subtitle: 'فهد لابس تيشيرت الكورة… رقم ٨ ⭐', clue: '8' },
    { file: 'investverse-gate.webp', title: 'بوابة INVESTVERSE', subtitle: 'من بعيد… وتاريخها قريب' },
  ];

  const chats = [
    { id: 'group', name: '🚀 توصيات مضمونة', preview: 'أبو فهد غادر المجموعة', time: 'أمس', avatar: '🚀', unread: 0, color: '#e4eee6', type: '256 عضو' },
    { id: 'wife', name: 'أم فهد ❤️', preview: 'الله يكتب اللي فيه ❤️', time: '٩:٣٠', avatar: 'أ', unread: 1, color: '#fbe9e8', type: 'آخر ظهور اليوم ٩:٣٠' },
    { id: 'friend', name: 'أبو سعد', preview: 'لقيت طريقة، بقولك عنها بعدين', time: '٨:١٥', avatar: 'س', unread: 0, color: '#e7eadf', type: 'متصل الآن' },
    { id: 'hr', name: 'نورة | الموارد البشرية', preview: 'شاكر لكم، بس حاليًا مو مهتم 🙏', time: 'الأحد', avatar: 'ن', unread: 0, color: '#e5e9fa', type: 'حساب أعمال' },
    { id: 'aunt', name: 'خالتي موضي 🌸', preview: '🌹 صورة: صباح الخير', time: '٦:٠٢', avatar: '🌸', unread: 3, color: '#fdebf5', type: 'آخر ظهور اليوم ٦:٠٢' },
    { id: 'scam', name: '+٤٤٧٩…', preview: 'تم حظر هذا الرقم 🚫', time: 'السبت', avatar: '؟', unread: 0, color: '#f7e0e0', type: 'رقم غير محفوظ' },
    { id: 'old', name: 'بو عبدالله', preview: 'وصلت، الله يرزقك ✔', time: '٢٠٢٤', avatar: 'ع', unread: 0, color: '#eae6dc', type: 'آخر ظهور ٢٠٢٤' },
  ];

  const messages = {
    group: [
      { who: 'them', author: '+٩٦٦٥٥…', text: 'يا جماعة السهم بيطير بكرة 🚀🚀 !!' },
      { who: 'them', author: '+٩٦٦٥٠…', text: 'اللي ما يدخل اليوم بيندم طول عمره' },
      { who: 'them', author: '+٩٦٦٥٣…', text: 'مضمون ١٠٠٪ يا جماعة 🔥' },
      { who: 'me', text: 'وش نشاط الشركة؟' },
      { who: 'them', author: '+٩٦٦٥٥…', text: 'مو وقت أسئلة، ادخل وبس 😂' },
      { who: 'system', text: 'أبو فهد غادر المجموعة' },
    ],
    wife: [
      { who: 'them', text: 'السلام عليكم وينك؟ جوالك ما يرد 😅' },
      { who: 'them', text: 'أختي تقول الذهب غالي هالأيام، نبيع اللي في الدرج؟' },
      { who: 'me', text: 'لا تبيعينه يا أم فهد 😄' },
      { who: 'me', text: 'ذهب الزينة نشتريه للبس، لكن فيه مصنعية وتخسرين فيها لو بعتيه.' },
      { who: 'me', text: 'إذا نبي نستثمر في الذهب نشتري سبائك، وهذا اللي سويته الأسبوع الماضي 👌' },
      { who: 'them', text: 'ما شاء الله، صاير خبير 😂' },
      { who: 'them', text: 'طيب وموضوع السهم اللي يتكلمون عنه في القروب؟' },
      { who: 'me', text: 'قررت قراري… أعلمك لما أرجع 🤝' },
      { who: 'them', text: 'الله يكتب اللي فيه ❤️' },
    ],
    friend: [
      { who: 'them', text: 'الشقة بالدور ٤ ⭐ والإطلالة حلوة' },
      { who: 'them', text: 'هاه وش صار على الشقة؟' },
      { who: 'me', text: 'كل شوي صاحبها يتصل علي 😂' },
      { who: 'me', text: 'قل له الله يرزقه بغيري 😄' },
      { who: 'them', text: 'ليه يا رجال؟ الموقع ممتاز' },
      { who: 'me', text: 'أبي دخل إيجار بدون ما يتصل علي مستأجر الساعة ٢ الفجر يقول المكيف خربان 😂' },
      { who: 'them', text: 'وش بتسوي أجل 😂😂😂' },
      { who: 'me', text: 'لقيت طريقة، بقولك عنها بعدين' },
    ],
    hr: [
      { who: 'them', text: 'السلام عليكم أستاذ أبو فهد، معك نورة من الموارد البشرية في [اسم الشركة]' },
      { who: 'them', text: 'عندنا منصب مدير تنفيذي، وخبرتك تناسبه تمامًا 👔 والعرض مغري جدًا' },
      { who: 'me', text: 'وعليكم السلام، تشرفت بالعرض وشاكر لكم 🙏' },
      { who: 'me', text: 'بس حاليًا مو مهتم، الله يوفقكم' },
      { who: 'them', text: 'ولا يهمك، الله يوفقك 😮' },
    ],
    aunt: [
      { who: 'them', text: 'صورة: ورد وفنجال قهوة 🌹☕', photo: 'coffee.webp' },
      { who: 'them', text: 'صباح الخير 🌹' },
      { who: 'them', text: 'صورة: شروق شمس 🌸', photo: 'father-and-fahad.webp' },
      { who: 'them', text: 'صباح الورد والياسمين 🌸' },
      { who: 'me', text: 'صباح النور يا خالتي ❤️' },
      { who: 'them', text: '🎤 رسالة صوتية (٢:١٤)', audio: true },
      { who: 'them', text: 'صباح الخير 🌹' },
    ],
    scam: [
      { who: 'them', text: 'مرحبا عزيزي 🌹 لديك فرصة استثمار بأرباح ٣٠٪ مضمونة' },
      { who: 'them', text: 'ارسل رمز التحقق الذي وصلك' },
      { who: 'me', text: '😂😂😂' },
      { who: 'system', text: 'تم حظر هذا الرقم 🚫' },
    ],
    old: [
      { who: 'date', text: '١٢ مارس ٢٠٢٤' },
      { who: 'me', text: 'هلا بو عبدالله، شلونك؟' },
      { who: 'me', text: 'محرج منك… بس تقدر تسلفني ٣,٠٠٠ لين ينزل الراتب؟ 😅' },
      { who: 'them', text: 'أبشر ولا يهمك، الحين أحولها' },
      { who: 'me', text: 'الله لا يخليني منك 🤝' },
      { who: 'date', text: '٢٧ مارس ٢٠٢٤' },
      { who: 'me', text: 'رجعتها لك، ما قصرت يا بو عبدالله 🙏' },
      { who: 'them', text: 'وصلت، الله يرزقك ✔' },
    ],
  };

  const notes = [
    { id: 'groceries', title: 'مقاضي 🛒', preview: 'حليب، خبز، بيض', lines: [{ text: 'حليب' }, { text: 'خبز' }, { text: 'بيض' }] },
    { id: 'todo', title: 'أشياء لازم أسويها', preview: 'أجدد الاستمارة، أرد على أبو سعد…', lines: [{ text: 'أجدد الاستمارة' }, { text: 'أرد على أبو سعد' }, { text: 'أدخل السهم', done: true }, { text: 'أعلّم فهد 🤝' }] },
    { id: 'dates', title: 'مواعيد 📅', preview: 'الخميس: عشا عند أهل أم فهد…', lines: [{ text: 'الخميس: عشا عند أهل أم فهد الساعة ٩ ⭐', clue: '9' }, { text: 'السبت: غسيل السيارة' }, { text: '📌 INVESTVERSE' }] },
    { id: 'opportunities', title: 'أشياء أبو سعد جابها «فرصة»', preview: 'الشقة، الأرض، البرجر…', lines: [{ text: 'الشقة' }, { text: 'الأرض اللي ورا المحطة' }, { text: 'مطعم البرجر' }, { text: 'مغسلة السيارات' }] },
  ];

  const icons = {
    chat: '<path d="M8 8h8M8 12h5M20 11c0 5-4 9-9 9-1.2 0-2.4-.2-3.5-.7L3 21l1.7-4.5A9 9 0 1 1 20 11Z"/>',
    bank: '<path d="M3 9 12 3l9 6H3Zm2 0v10m4-10v10m6-10v10m4-10v10M3 21h18M2 9h20"/>',
    alarm: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M4.5 3 2 6m15.5-3L22 6"/>',
    notes: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    photos: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="16.5" cy="8" r="1.4"/><path d="m4 18 5-6 3 3 2-2 6 6"/>',
    music: '<path d="M10 19V6l10-2v13M10 8l10-2"/><circle cx="7" cy="19" r="3"/><circle cx="17" cy="17" r="3"/>',
    arrow: '<path d="m15 18-6-6 6-6"/>',
    house: '<path d="m3 10 9-7 9 7v10H3V10Zm6 10v-7h6v7"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    backspace: '<path d="M9 4H21v16H9L2 12 9 4Zm3 5 6 6m0-6-6 6"/>',
    location: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6m10-6v6M3 10h18"/>',
    check: '<path d="m4 12 5 5L20 6"/>',
    refresh: '<path d="M3 11a9 9 0 0 1 15.4-6.4L21 7M21 13a9 9 0 0 1-15.4 6.4L3 17"/><path d="M21 3v4h-4M3 21v-4h4"/>',
    spark: '<path d="m12 2 1.8 7.2L21 11l-7.2 1.8L12 20l-1.8-7.2L3 11l7.2-1.8L12 2ZM19 18l.6 1.4L21 20l-1.4.6L19 22l-.6-1.4L17 20l1.4-.6L19 18Z"/>',
    banknote: '<rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="12" cy="12" r="3"/>',
    share: '<path d="M12 16V3m-5 5 5-5 5 5M5 13v7h14v-7"/>',
    close: '<path d="M5 5 19 19M19 5 5 19"/>',
  };

  const appIcons = [
    { id: 'whatsapp', title: 'واتساب', icon: 'chat', color: '#28c978' },
    { id: 'bank', title: 'بنك إثمار', icon: 'bank', color: '#c99739' },
    { id: 'alarm', title: 'المنبّه', icon: 'alarm', color: '#f8a43d' },
    { id: 'notes', title: 'الملاحظات', icon: 'notes', color: '#f8c34a' },
    { id: 'photos', title: 'الصور', icon: 'photos', color: '#4288ec' },
    { id: 'music', title: 'الأغاني', icon: 'music', color: '#f04d76' },
    { id: 'vault', title: 'INVESTVERSE', icon: 'brand', color: '#205D3B', locked: true },
  ];

  let route = 'lock';
  let stack = [];
  let activeChat = 'group';
  let activeNote = 'dates';
  let activePhoto = 0;
  let code = '';
  let fails = 0;
  let alarmOn = true;
  let discovered = new Set();
  let unlocked = false;
  let toastTimer;
  let errorTimer;
  let swipeStart = null;

  function svg(name, size = 20) {
    return `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icons[name] || ''}</svg>`;
  }
  function photo(name) { return `assets/photos/${name}`; }
  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }
  function notify(text) {
    clearTimeout(toastTimer);
    toastElement.textContent = text;
    toastElement.hidden = false;
    toastElement.classList.remove('toast-exit');
    toastTimer = setTimeout(() => { toastElement.classList.add('toast-exit'); setTimeout(() => toastElement.hidden = true, 190); }, 2700);
  }
  function unlock() {
    if (route !== 'lock') return;
    unlocked = true;
    route = 'home'; stack = [];
    render();
  }
  function navigate(next, opts = {}) {
    if (next !== 'lock' && !unlocked) return;
    if (next === route && !opts.force) return;
    if (opts.chat) activeChat = opts.chat;
    if (opts.note) activeNote = opts.note;
    if (Number.isInteger(opts.photo)) activePhoto = opts.photo;
    if (!opts.replace) stack.push(route);
    route = next;
    render();
  }
  function goBack() {
    if (route === 'lock') return;
    if (route === 'home') { notify('اختر أحد تطبيقات أبو فهد لاكتشاف القصة'); return; }
    route = stack.pop() || 'home';
    render();
  }
  function goHome() {
    if (!unlocked) { unlock(); return; }
    route = 'home'; stack = [];
    render();
  }
  function iconTile(app) {
    const symbol = app.icon === 'brand'
      ? '<img src="assets/investverse-icon.png" alt="" draggable="false"/>'
      : svg(app.icon, 31);
    return `<button class="app-tile" type="button" data-action="open-app" data-app="${app.id}" aria-label="${esc(app.title)}${app.locked ? '، مقفول' : ''}"><span class="app-glyph glyph-${app.id}" style="--app-color:${app.color}">${symbol}${app.locked ? `<span class="lock-mini">${svg('lock', 12)}</span>` : ''}</span><span class="app-name" dir="auto">${esc(app.title)}</span></button>`;
  }
  function header(title, subtitle = '', skin = 'green') {
    return `<header class="app-header ${skin}"><button class="nav-back icon-btn" type="button" data-action="back" aria-label="رجوع">${svg('chevron', 22)}</button><div class="app-header-copy"><strong>${title}</strong>${subtitle ? `<small>${subtitle}</small>` : ''}</div><button class="nav-home icon-btn" type="button" data-action="home" aria-label="العودة للشاشة الرئيسية">${svg('house', 21)}</button></header>`;
  }
  function renderLock() {
    return `<section class="lock-screen wallpaper-zone" aria-label="شاشة القفل">
      <div class="wallpaper-image" aria-hidden="true"></div><div class="wallpaper-shade" aria-hidden="true"></div>
      <div class="lock-top"><span class="lock-weekday">الإثنين</span><h1 class="lock-clock" dir="ltr">9:41</h1><span class="lock-padlock">${svg('lock', 17)}</span></div>
      <div class="lock-message"><span class="tiny-mark">INVESTVERSE</span><strong>هذا الجوال مفقود</strong><span>إذا لقيته، تواصل مع أبو فهد.</span></div>
      <div class="notification-stack">
        <div class="notif-card"><div class="notif-icon n-chat">${svg('chat', 19)}</div><div class="notif-copy"><b>قروب التوصيات المضمونة 🚀</b><span>يا جماعة السهم بيطير بكرة !! 🚀</span></div><time>الآن</time></div>
        <div class="notif-card"><div class="notif-icon n-wife">❤️</div><div class="notif-copy"><b>أم فهد</b><span>الله يكتب اللي فيه ❤️</span></div><time>٩:٣٠</time></div>
        <div class="notif-card"><div class="notif-icon n-bank">${svg('bank', 18)}</div><div class="notif-copy"><b>بنك إثمار</b><span>تم إيداع توزيعات أرباح</span></div><time>٩:١٥</time></div>
      </div>
      <div class="unlock-area"><button class="swipe-control" type="button" data-action="unlock" aria-label="اسحب أو اضغط للفتح"><span class="swipe-arrow">⌃</span><strong>اسحب للفتح</strong><small>أو اضغط هنا</small></button><div class="swipe-track"></div></div>
    </section>`;
  }
  function renderHome() {
    return `<section class="home-screen wallpaper-zone">
      <div class="wallpaper-image" aria-hidden="true"></div><div class="home-shade" aria-hidden="true"></div>
      <header class="home-heading"><span class="home-date">الإثنين · ٩:٤١ ص</span><h1>جوال أبو فهد</h1><p>كل تطبيق يخفي جزءًا من الحكاية</p></header>
      <div class="home-apps">${appIcons.map(iconTile).join('')}</div>
      <div class="home-dock"><span>${svg('lock', 15)} تطبيق واحد مقفول</span><span class="dock-dot"></span><span>ابحث عن ⭐</span></div>
      <p class="home-footer">INVESTVERSE <span>·</span> عالم الاستثمار</p>
    </section>`;
  }
  function renderWhatsapp() {
    return `<section class="app-page whatsapp-page">${header('الدردشات','واتساب')}<div class="search-mock" aria-hidden="true">⌕ <span>بحث</span></div><div class="chat-list">${chats.map(c => `<button type="button" data-action="open-chat" data-chat="${c.id}" class="chat-preview"><span class="chat-avatar" style="background:${c.color}">${esc(c.avatar)}</span><span class="chat-preview-copy"><strong>${esc(c.name)}</strong><small>${esc(c.preview)}</small></span><span class="chat-meta"><time>${esc(c.time)}</time>${c.unread ? `<b>${c.unread}</b>` : ''}</span></button>`).join('')}</div><div class="list-end-note">المحادثات شخصية خيالية لأغراض الحملة</div></section>`;
  }
  function renderChat() {
    const chat = chats.find(c => c.id === activeChat) || chats[0];
    return `<section class="app-page conversation-page">${header(`<span class="chat-avatar header-avatar" style="background:${chat.color}">${esc(chat.avatar)}</span><span>${esc(chat.name)}</span>`,esc(chat.type))}<div class="chat-background"><div class="chat-day">${chat.id === 'old' ? 'محادثات قديمة' : 'أمس'}</div><div class="bubble-column">${messages[chat.id].map((m,i) => {
      if (m.who === 'date' || m.who === 'system') return `<div class="chat-day">${esc(m.text)}</div>`;
      return `<div class="bubble-row ${m.who}"><div class="message-bubble">${m.author ? `<span class="bubble-author">${esc(m.author)}</span>` : ''}${m.photo ? `<img loading="lazy" class="inline-chat-photo" src="${photo(m.photo)}" alt="صورة من المحادثة"/>` : ''}<span>${esc(m.text).replace(/⭐/g, `<button type="button" class="star-inline" data-action="found-clue" data-clue="4" aria-label="اكتشفت نجمة رقم أربعة">⭐</button>`)}</span><small class="bubble-time">${m.who === 'me' ? '✓✓' : ''} ٨:١٥</small></div></div>`;
    }).join('')}</div></div><div class="chat-compose"><span>＋</span><span class="compose-placeholder">رسالة</span><span>🎙</span></div></section>`;
  }
  function renderBank() {
    const transactions = [
      { text: 'توزيع أرباح أسهم', amount: '+١٢,٤٠٠', pos: true },
      { text: 'دخل إيجار، صندوق ريت', amount: '+٨,٧٥٠', pos: true },
      { text: 'عائد صندوق استثماري', amount: '+١٥,٢٠٠', pos: true },
      { text: 'شراء سبائك ذهب', amount: '−٤٥,٠٠٠', pos: false },
      { text: 'تحويل لـ «أم فهد»', amount: '−٥٠,٠٠٠', pos: false },
    ];
    return `<section class="app-page bank-page">${header('بنك إثمار','بنك افتراضي للعرض')}<div class="bank-scroll"><p class="hello">مرحبًا، أبو فهد 👋</p><div class="balance-card"><div class="balance-text"><span>الرصيد المتاح</span><strong dir="ltr">2,847,500 <small>ريال</small></strong></div><span class="balance-tag">مصدر الثروة؟<br/><b>تلقاه في INVESTVERSE</b></span><div class="balance-glow"></div></div><div class="bank-section-heading"><h2>آخر العمليات</h2><span>الحساب الرئيسي</span></div><div class="transactions">${transactions.map(t=>`<div class="transaction"><span class="transaction-icon ${t.pos?'pos':'neg'}">${t.pos?'+':'−'}</span><div class="transaction-info"><strong>${esc(t.text)}</strong><small>عملية مكتملة</small></div><b class="amount ${t.pos?'pos':'neg'}" dir="ltr">${esc(t.amount)} <span>ريال</span></b></div>`).join('')}</div><p class="sim-disclaimer">بنك إثمار اسم خيالي، والأرقام مجرد جزء من القصة وليست أرصدة حقيقية أو نصيحة استثمارية.</p></div></section>`;
  }
  function renderAlarm() {
    return `<section class="app-page alarm-page">${header('المنبّه','منبّه واحد فقط','dark')}<div class="alarm-content"><div class="alarm-caption">المنبّهات</div><div class="alarm-card"><div class="alarm-detail"><span>⭐ لا تنسى!</span><strong dir="ltr">٢:٠٠</strong><small>كل يوم</small></div><button data-action="toggle-alarm" class="toggle-switch ${alarmOn?'on':''}" aria-label="${alarmOn?'تعطيل':'تفعيل'} المنبه" role="switch" aria-checked="${alarmOn}"><span></span></button></div><div class="alarm-none">ما فيه منبّهات ثانية</div><div class="alarm-footnote">موعد مهم… بس وش بيصير؟</div></div></section>`;
  }
  function renderNotes() {
    return `<section class="app-page notes-page">${header('الملاحظات','٤ ملاحظات')}<div class="notes-grid">${notes.map(n=>`<button class="note-card" type="button" data-action="open-note" data-note="${n.id}"><strong>${esc(n.title)}</strong><p>${esc(n.preview)}</p><span>أبو فهد</span></button>`).join('')}</div></section>`;
  }
  function renderNote() {
    const n=notes.find(n=>n.id===activeNote)||notes[0];
    return `<section class="app-page notes-page">${header('الملاحظات','تم الحفظ')}<article class="single-note"><div class="note-stamp">الإثنين، ٩:٤١ ص</div><h2>${esc(n.title)}</h2><ul class="note-lines">${n.lines.map(line=>`<li class="${line.done?'note-done':''}"><span>${esc(line.text).replace(/⭐/g, line.clue?`<button data-action="found-clue" data-clue="${line.clue}" type="button" class="star-inline" aria-label="اكتشفت نجمة رقم تسعة">⭐</button>`:'⭐')}</span></li>`).join('')}</ul></article></section>`;
  }
  function renderPhotos() {
    const order=[1,4,2,3,5,0,6,7];
    return `<section class="app-page photos-page">${header('الصور','الألبوم الأخير')}<div class="gallery-intro"><h2>ألبوم أبو فهد</h2><p>تفاصيل عادية… بس بعض الصور فيها أسرار.</p></div><div class="photo-grid">${order.map(i=>`<button type="button" class="gallery-tile ${i===7?'gallery-investverse':''}" data-action="open-photo" data-photo="${i}" aria-label="افتح ${esc(photos[i].title)}"><img loading="lazy" src="${photo(photos[i].file)}" alt="${esc(photos[i].title)}"/><span>${esc(photos[i].title)}</span>${i===6?'<b class="photo-star">⭐</b>':''}</button>`).join('')}</div></section>`;
  }
  function renderPhoto() {
    const p=photos[activePhoto];
    return `<section class="photo-viewer">${header('الصور',`${activePhoto+1} / ٨`,'dark')}<div class="full-photo"><img src="${photo(p.file)}" alt="${esc(p.title)}"/></div><div class="photo-caption"><h2>${esc(p.title)}</h2><p>${esc(p.subtitle)}</p>${p.clue?`<button class="found-photo" type="button" data-action="found-clue" data-clue="8">⭐ رقم فهد: ٨</button>`:''}</div><div class="viewer-controls"><button type="button" data-action="prev-photo" aria-label="الصورة السابقة">${svg('chevron',24)}</button><span>اسحب أو استخدم الأسهم للتنقل</span><button type="button" data-action="next-photo" aria-label="الصورة التالية">${svg('arrow',24)}</button></div></section>`;
  }
  function renderMusic() {
    return `<section class="app-page music-page">${header('الأغاني','مكتبتي','rose')}<div class="empty-music">${svg('music',54)}<h2>ما فيه أغاني حاليًا</h2><p>المكتبة فاضية… أبو فهد للحين ما أضاف شيء.</p></div></section>`;
  }
  function digitBox(i) { return `<span class="digit-cell ${i<code.length?'filled':''}" aria-hidden="true">${code[i]??'ـ'}</span>`; }
  function renderVault() {
    return `<section class="vault-page app-page">${header('INVESTVERSE','التطبيق المقفول','dark')}<div class="vault-content"><div class="vault-logo"><img src="assets/investverse-icon.png" alt="شعار INVESTVERSE"/></div><span class="vault-lock">${svg('lock', 16)} التطبيق مقفول</span><h1>أدخل الرمز</h1><p class="vault-subtitle">٤ أرقام مبخّاة بين تطبيقات الجوال</p><div class="digits" data-action="focus-code" role="group" aria-label="خانات الرمز المكون من أربعة أرقام">${[0,1,2,3].map(digitBox).join('')}</div><label class="sr-only" for="hidden-code">أدخل الرمز من أربعة أرقام</label><input id="hidden-code" class="hidden-code" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="4" value="${esc(code)}" pattern="[0-9]*" /><div class="keypad">${['1','2','3','4','5','6','7','8','9','clear','0','back'].map(n=>`<button type="button" data-action="keypad" data-key="${n}" aria-label="${n==='clear'?'مسح الرمز':n==='back'?'حذف آخر رقم':n}">${n==='back'?svg('backspace',23):n==='clear'?'مسح':n}</button>`).join('')}</div><div class="pass-hint">⭐ دوّر على رمزي متفرّق في جوالي…<small>واتساب ← المنبّه ← الملاحظات ← الصور</small></div><div class="pass-error" id="pass-error" role="alert" aria-live="polite"></div></div></section>`;
  }
  function renderInvite() {
    const date = config.eventDate || '[التاريخ والوقت]';
    const location = config.eventLocation || '[المكان]';
    return `<section class="invite-page"><div class="invite-lights" aria-hidden="true"><span></span><span></span><span></span></div><div class="invite-content"><div class="invite-checked">${svg('check',18)} فتحت جوال أبو فهد 🔓</div><img class="invite-logo" src="assets/investverse-logo.png" alt="شعار INVESTVERSE"/><div class="invite-rule"></div><h1>سرّ صفقة أبو فهد<br/>الرابحة…</h1><h2>ينكشف في <span>INVESTVERSE</span></h2><p class="invite-desc">اكتشفت الرموز… لكن سر الصفقة ما ينكشف إلا في المعرض!</p><div class="event-meta"><div>${svg('calendar',16)} <span>${esc(date)}</span></div><div>${svg('location',16)} <span>${esc(location)}</span></div></div>${config.eventNotes?`<p class="event-notes">${esc(config.eventNotes)}</p>`:''}<div class="invite-actions"><button class="register-button" type="button" data-action="register">سجّل حضورك ${svg('arrow',19)}</button><button class="map-button" type="button" data-action="map">${svg('location',18)} الخريطة</button></div><p class="invite-slogan">إثمار .. سهمك الرابح</p><div class="closing-disclaimer">الشخصية والأرقام خيالية لأغراض توعوية، وليست توصية استثمارية.</div><button class="restart-button" type="button" data-action="restart">${svg('refresh',14)} أعد التجربة</button></div></section>`;
  }
  const renderers = { lock:renderLock, home:renderHome, whatsapp:renderWhatsapp, chat:renderChat, bank:renderBank, alarm:renderAlarm, notes:renderNotes, note:renderNote, photos:renderPhotos, photo:renderPhoto, music:renderMusic, vault:renderVault, invite:renderInvite };
  function render() {
    phone.dataset.theme = ['lock','home','vault','invite','photo','alarm'].includes(route) ? 'dark' : 'light';
    phone.dataset.route = route;
    root.className = `screen screen-${route}`;
    root.innerHTML = (renderers[route] || renderHome)();
    root.scrollTop=0;
    const chatEl=root.querySelector('.chat-background');if(chatEl) chatEl.scrollTop=chatEl.scrollHeight;
  }
  function handleCode(value) {
    code = String(value).replace(/[^0-9]/g,'').slice(0,4);
    root.querySelectorAll('.digit-cell').forEach((el,i)=>{el.textContent=code[i] ?? 'ـ';el.classList.toggle('filled',i<code.length);});
    const input=document.getElementById('hidden-code');if(input && input.value!==code)input.value=code;
    if(code.length===4) {
      clearTimeout(errorTimer);
      errorTimer=setTimeout(()=>{
        if(route!=='vault') return;
        if(code==='4298') {
          code='';fails=0;
          navigate('invite');
          notify('مبروك! فتحت التطبيق 🔓');
        } else {
          fails++;
          code='';
          const el=root.querySelector('.digits');if(el){el.classList.remove('shake');void el.offsetWidth;el.classList.add('shake');}
          root.querySelectorAll('.digit-cell').forEach(cell=>{cell.textContent='ـ';cell.classList.remove('filled');});
          if(input)input.value='';
          const m = fails>=3?'تأكد إنك شفت كل ⭐':'الرمز غير صحيح، حاول مرة ثانية';
          const error=root.querySelector('#pass-error'); if(error) error.textContent=m;
        }
      },250);
    }
  }
  function foundClue(digit) {
    if(!['4','2','9','8'].includes(String(digit))) return;
    discovered.add(String(digit));
    notify(`⭐ لقيت رقم ${digit}! احفظه إلى أن تفتح INVESTVERSE.`);
  }
  function openOfficialLink(raw, kind) {
    if (typeof raw !== 'string' || !raw.trim()) {
      notify(kind==='map'?'موقع المعرض ورابط الخريطة لم يُحدّدا في ملف الحملة.':'رابط التسجيل لم يُحدّد في ملف الحملة.');return;
    }
    try {const url=new URL(raw);if(url.protocol!=='https:') throw Error('Invalid URL');window.open(url.href,'_blank','noopener,noreferrer');}
    catch {notify('الرابط غير صالح. عدّله في ملف config.js.');}
  }
  root.addEventListener('click', (event) => {
    const button=event.target.closest('[data-action]');
    if(!button) return;
    const action=button.dataset.action;
    switch(action) {
      case 'unlock': unlock();break;
      case 'back':goBack();break;
      case 'home':goHome();break;
      case 'open-app':navigate(button.dataset.app);break;
      case 'open-chat':navigate('chat',{chat:button.dataset.chat});break;
      case 'open-note':navigate('note',{note:button.dataset.note});break;
      case 'open-photo':navigate('photo',{photo:Number(button.dataset.photo)});break;
      case 'next-photo':activePhoto=(activePhoto+1)%photos.length;render();break;
      case 'prev-photo':activePhoto=(activePhoto+photos.length-1)%photos.length;render();break;
      case 'toggle-alarm':alarmOn=!alarmOn;render();break;
      case 'focus-code':document.getElementById('hidden-code')?.focus();break;
      case 'found-clue':foundClue(button.dataset.clue);break;
      case 'keypad':{
        const k=button.dataset.key;
        if(k==='clear') handleCode('');else if(k==='back')handleCode(code.slice(0,-1));else if(code.length<4)handleCode(code+k);
        break;
      }
      case 'register':openOfficialLink(config.registrationUrl,'register');break;
      case 'map':openOfficialLink(config.mapUrl,'map');break;
      case 'restart':unlocked=false;route='lock';stack=[];fails=0;code='';discovered.clear();render();break;
    }
  });
  root.addEventListener('input', event => {if(event.target.id==='hidden-code')handleCode(event.target.value);});
  root.addEventListener('pointerdown',event=>{if(route==='lock')swipeStart={x:event.clientX,y:event.clientY};else if(route==='photo')swipeStart={x:event.clientX,y:event.clientY};});
  root.addEventListener('pointerup',event=>{
    if(!swipeStart)return;
    const dx=event.clientX-swipeStart.x,dy=event.clientY-swipeStart.y;
    if(route==='lock'&&dy< -45)unlock();
    else if(route==='photo'&&Math.abs(dx)>55){activePhoto=(activePhoto+(dx>0?photos.length-1:1))%photos.length;render();}
    swipeStart=null;
  });
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'||event.key==='Backspace'&&route!=='vault'&&event.target.tagName!=='INPUT') {event.preventDefault();goBack();return;}
    if(route==='vault'&&event.target.id!=='hidden-code'){
      if(/^[0-9]$/.test(event.key)){event.preventDefault();handleCode(code+event.key);}
      if(event.key==='Backspace'){event.preventDefault();handleCode(code.slice(0,-1));}
    }
    if(route==='lock'&&(event.key==='Enter'||event.key==='ArrowUp')){event.preventDefault();unlock();}
    if(route==='photo'&&event.key==='ArrowLeft'){event.preventDefault();activePhoto=(activePhoto+1)%photos.length;render();}
    if(route==='photo'&&event.key==='ArrowRight'){event.preventDefault();activePhoto=(activePhoto+photos.length-1)%photos.length;render();}
  });
  window.INVESTVERSE_TEST = Object.freeze({
    getState: () => ({route,code,fails,unlocked,found:[...discovered],alarmOn}),
    getPhotos: () => photos.map(p=>({title:p.title,clue:p.clue||null})),
    getChatCount: () => chats.length,
    getNoteCount: () => notes.length,
  });
  render();
})();
