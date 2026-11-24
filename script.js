(() => {
  'use strict';

  /* ------------------------------------------------------------------ *
   * عناصر الجوال
   * ------------------------------------------------------------------ */
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const phone = $('#phone');
  const device = $('#device');
  const lockEl = $('#lock');
  const homeEl = $('#home');
  const win = $('#appwin');
  const toastElement = $('#toast');
  const coachEl = $('#coach');
  const homeBar = $('#home-bar');
  const statusTime = $('#status-time');
  const batteryEl = $('#battery');
  const alertEl = $('#alert');
  const config = window.INVESTVERSE_CONFIG || {};
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------ *
   * الوقت والتاريخ: الجوال يعرض الوقت الحقيقي مثل أي آيفون
   * ------------------------------------------------------------------ */
  const NOW = new Date();
  const DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  const ar = value => String(value).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
  const minutesAgo = m => new Date(NOW.getTime() - m * 60000);
  const daysAgo = (d, h = 12, m = 0) => { const x = new Date(NOW); x.setDate(x.getDate() - d); x.setHours(h, m, 0, 0); return x; };
  const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  function clock(date, period = true) {
    const h = date.getHours();
    const text = ar(`${h % 12 || 12}:${String(date.getMinutes()).padStart(2, '0')}`);
    return period ? `${text} ${h < 12 ? 'ص' : 'م'}` : text;
  }
  const dayMonth = date => `${ar(date.getDate())} ${MONTHS[date.getMonth()]}`;
  const fullDate = date => `${DAYS[date.getDay()]}، ${dayMonth(date)}`;
  function relativeDay(date) {
    if (sameDay(date, NOW)) return 'اليوم';
    if (sameDay(date, daysAgo(1))) return 'أمس';
    if (NOW - date < 6 * 864e5) return DAYS[date.getDay()];
    return dayMonth(date);
  }
  /* آخر جمعة مرّ عليها ستة أيام على الأقل، عشان «كبسة يوم الجمعة» تطلع جمعة فعلًا */
  function lastFriday() {
    for (let d = 6; d < 13; d++) { const x = daysAgo(d, 14, 5); if (x.getDay() === 5) return x; }
    return daysAgo(7, 14, 5);
  }

  /* ------------------------------------------------------------------ *
   * بيانات القصة
   * ------------------------------------------------------------------ */
  const photos = [
    { file: 'father-and-fahad.webp', title: 'أبو فهد وفهد من ورا', subtitle: 'عند البحر وقت الغروب', date: daysAgo(4, 17, 48) },
    { file: 'coffee.webp', title: 'قهوة الصبح', subtitle: 'في السيارة، وقبل الزحمة', date: daysAgo(20, 6, 52) },
    { file: 'desert-camp.webp', title: 'جلسة بر', subtitle: 'نار ودلّة، وأبو سعد يسولف', date: daysAgo(14, 18, 20) },
    { file: 'kabsa.webp', title: 'كبسة يوم الجمعة', subtitle: 'جمعة العائلة', date: lastFriday() },
    { file: 'sleeping-fahad.webp', title: 'فهد نايم', subtitle: 'في المرتبة الخلفية بعد المدرسة', date: daysAgo(17, 13, 36) },
    { file: 'riyadh-traffic.webp', title: 'زحمة الطريق', subtitle: 'الطريق للبيت', date: daysAgo(5, 16, 12) },
    { file: 'fahad-number-eight.webp', title: 'تيشيرت فهد', subtitle: 'فهد لابس تيشيرت الكورة… رقم ٨', date: daysAgo(2, 16, 40) },
    { file: 'investverse-gate.webp', title: 'بوابة INVESTVERSE', subtitle: 'من بعيد… وتاريخها قريب', date: daysAgo(1, 20, 5) },
  ];
  /* ترتيب العرض في المكتبة: الأقدم أولًا مثل تطبيق الصور */
  const photoOrder = photos.map((_, i) => i).sort((a, b) => photos[a].date - photos[b].date);

  const chats = [
    { id: 'wife', name: 'أم فهد ❤️', preview: 'الله يكتب اللي فيه ❤️', avatar: 'أ', unread: 1, color: '#f4b8b0', ago: 11, gap: 2, seen: true },
    { id: 'friend', name: 'أبو سعد', preview: 'لقيت طريقة، بقولك عنها بعدين', avatar: 'س', unread: 0, color: '#b9c6a2', ago: 86, gap: 1, type: 'متصل الآن', mine: true },
    { id: 'aunt', name: 'خالتي موضي 🌸', preview: 'صباح الخير 🌹', avatar: '🌸', unread: 3, color: '#f6cfe3', ago: 219, gap: 1, seen: true },
    { id: 'group', name: '🚀 توصيات مضمونة', preview: 'أبو فهد غادر المجموعة', avatar: '🚀', unread: 0, color: '#cfe3d4', day: 'أمس', start: '21:08', type: 'أبو خالد، أبو ريان، +٩٦٦٥٠… و٢٥٣ آخرين' },
    { id: 'hr', name: 'نورة | الموارد البشرية', preview: 'شاكر لكم، بس حاليًا مو مهتم 🙏', avatar: 'ن', unread: 0, color: '#c5cdf2', day: 'الأحد', start: '10:32', type: 'حساب أعمال', mine: true },
    { id: 'scam', name: '+٤٤٧٩…', preview: 'تم حظر هذا الرقم 🚫', avatar: '؟', unread: 0, color: '#e6c1c1', day: 'السبت', start: '15:47', type: 'رقم غير محفوظ' },
    { id: 'old', name: 'بو عبدالله', preview: 'وصلت، الله يرزقك ✔', avatar: 'ع', unread: 0, color: '#d9d0bb', day: '٢٠٢٤', start: '19:20', type: 'آخر ظهور ٢٠٢٤' },
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
      { who: 'them', text: 'الشقة بالدور ٤ والإطلالة حلوة' },
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
      { who: 'them', text: 'ورد وفنجال قهوة 🌹☕', photo: 'coffee.webp' },
      { who: 'them', text: 'صباح الخير 🌹' },
      { who: 'them', text: 'شروق شمس 🌸', photo: 'father-and-fahad.webp' },
      { who: 'them', text: 'صباح الورد والياسمين 🌸' },
      { who: 'me', text: 'صباح النور يا خالتي ❤️' },
      { who: 'them', text: 'رسالة صوتية', audio: '٢:١٤' },
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
    { id: 'groceries', title: 'مقاضي 🛒', preview: 'حليب، خبز، بيض', date: minutesAgo(134), lines: [{ text: 'حليب' }, { text: 'خبز' }, { text: 'بيض' }] },
    { id: 'todo', title: 'أشياء لازم أسويها', preview: 'أجدد الاستمارة، أرد على أبو سعد…', date: daysAgo(1, 22, 17), checklist: true, lines: [{ text: 'أجدد الاستمارة' }, { text: 'أرد على أبو سعد' }, { text: 'أدخل السهم', done: true }, { text: 'أعلّم فهد 🤝' }] },
    { id: 'dates', title: 'مواعيد 📅', preview: 'الخميس: عشا عند أهل أم فهد…', date: daysAgo(3, 8, 3), lines: [{ text: 'الخميس: عشا عند أهل أم فهد الساعة ٩' }, { text: 'السبت: غسيل السيارة' }, { text: '📌 INVESTVERSE' }] },
    { id: 'accounts', title: 'حساباتي 🔑', preview: 'الإيميل، الباسوورد، باسوورد البرنامج', date: daysAgo(4, 21, 26), fields: [
      { label: 'الإيميل', value: 'abufahad@gmail.com' },
      { label: 'الباسوورد', value: 'abufahad12345' },
      { label: 'باسوورد البرنامج', value: '4298' },
    ] },
    { id: 'rules', title: 'قواعدي قبل أي استثمار', preview: 'ما أدخل شي ما أفهم نشاطه…', date: daysAgo(5, 21, 30), lines: [{ text: 'ما أدخل شي ما أفهم نشاطه' }, { text: 'اللي يقول «مضمون» أبعد عنه' }, { text: 'ما أستعجل، الفرصة الصح تنتظر' }, { text: 'ما أحط فلوسي كلها في مكان واحد' }, { text: 'أسأل أهل الخبرة قبل لا أدفع' }] },
    { id: 'gift', title: 'هدية أم فهد 🎁', preview: 'ذكرى زواجنا قريبة…', date: daysAgo(11, 12, 48), lines: [{ text: 'ذكرى زواجنا قريبة' }, { text: 'طقم ذهب؟ ولا سبيكة وتختار هي 😄' }, { text: 'أسأل أختها وش تبي بدون ما تدري' }] },
    { id: 'opportunities', title: 'أشياء أبو سعد جابها «فرصة»', preview: 'الشقة، الأرض، البرجر…', date: daysAgo(23, 23, 41), lines: [{ text: 'الشقة' }, { text: 'الأرض اللي ورا المحطة' }, { text: 'مطعم البرجر' }, { text: 'مغسلة السيارات' }] },
  ];

  const transactions = [
    { text: 'توزيع أرباح أسهم', amount: '+12,400', pos: true, date: minutesAgo(26) },
    { text: 'دخل إيجار، صندوق ريت', amount: '+8,750', pos: true, date: daysAgo(1, 10, 2) },
    { text: 'عائد صندوق استثماري', amount: '+15,200', pos: true, date: daysAgo(3, 9, 30) },
    { text: 'شراء سبائك ذهب', amount: '−45,000', pos: false, date: daysAgo(6, 13, 44) },
    { text: 'تحويل لـ «أم فهد»', amount: '−50,000', pos: false, date: daysAgo(9, 20, 15) },
  ];

  /* ------------------------------------------------------------------ *
   * الأيقونات: خطوط بسيطة مرسومة خصيصًا للمشروع
   * ------------------------------------------------------------------ */
  const icons = {
    chevron: '<path d="m9 5 7 7-7 7"/>',
    chevronSmall: '<path d="m14 7-5 5 5 5"/>',
    lock: '<rect x="5" y="10.500" width="14" height="10" rx="2.500"/><path d="M8 10.500V7.500a4 4 0 0 1 8 0v3"/>',
    search: '<circle cx="11" cy="11" r="6.500"/><path d="m16 16 4.500 4.500"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    camera: '<path d="M4 8.500h3l1.500-2.500h7L17 8.500h3a1 1 0 0 1 1 1V18a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.500a1 1 0 0 1 1-1Z"/><circle cx="12" cy="13.500" r="3.500"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.500 11.500a6.500 6.500 0 0 0 13 0M12 18v3"/>',
    phone: '<path d="M6.500 3.500h3l1.500 4.500-2 1.500a11 11 0 0 0 5.500 5.500l1.500-2 4.500 1.500v3a2 2 0 0 1-2 2A15.500 15.500 0 0 1 4.500 5.500a2 2 0 0 1 2-2Z"/>',
    video: '<rect x="2.500" y="6.500" width="13" height="11" rx="2.500"/><path d="m15.500 10.500 6-3v9l-6-3"/>',
    compose: '<path d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5"/><path d="m18 3.500 2.500 2.500L12 14.500l-3 .500.500-3L18 3.500Z"/>',
    share: '<path d="M12 15V3.500m-4 4 4-4 4 4M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1"/>',
    heart: '<path d="M12 20.500S3.500 15.500 3.500 9.300A4.600 4.600 0 0 1 12 6.800a4.600 4.600 0 0 1 8.500 2.500c0 6.200-8.500 11.200-8.500 11.200Z"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.500v.100"/>',
    trash: '<path d="M4 6.500h16M9.500 6.500V4h5v2.500M6 6.500 7 20h10l1-13.500M10 10.500v6M14 10.500v6"/>',
    more: '<circle cx="12" cy="12" r="9"/><path d="M8 12h.100M12 12h.100M16 12h.100"/>',
    backspace: '<path d="M9 5h11a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H9l-6.500-7L9 5Zm3 4 6 6m0-6-6 6"/>',
    location: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.500"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6m10-6v6M3 10h18"/>',
    check: '<path d="m4.500 12.500 5 5L20 6.500"/>',
    refresh: '<path d="M20 12a8 8 0 1 1-2.500-5.800M20 4v5h-5"/>',
    eye: '<path d="M2 12s3.600-6.500 10-6.500S22 12 22 12s-3.600 6.500-10 6.500S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff: '<path d="M4 4l16 16M9.900 5.800A10.800 10.800 0 0 1 12 5.500c6.400 0 10 6.500 10 6.500a17 17 0 0 1-3.300 4M6.200 7.300A16.500 16.500 0 0 0 2 12s3.600 6.500 10 6.500c1.300 0 2.500-.300 3.600-.700"/>',
    arrowDown: '<path d="M12 5v14m-6-6 6 6 6-6"/>',
    arrowUp: '<path d="M12 19V5m-6 6 6-6 6 6"/>',
    transfer: '<path d="M4 8.500h15m-4-4 4 4-4 4M20 15.500H5m4 4-4-4 4-4"/>',
    bill: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Zm3 5h6M9 12h6"/>',
    card: '<rect x="2.500" y="5" width="19" height="14" rx="2.500"/><path d="M2.500 10h19M6.500 15h4"/>',
    grid: '<rect x="4" y="4" width="6.500" height="6.500" rx="1.500"/><rect x="13.500" y="4" width="6.500" height="6.500" rx="1.500"/><rect x="4" y="13.500" width="6.500" height="6.500" rx="1.500"/><rect x="13.500" y="13.500" width="6.500" height="6.500" rx="1.500"/>',
    house: '<path d="m3.500 10.500 8.500-7 8.500 7V20a1 1 0 0 1-1 1h-5v-6h-5v6h-5a1 1 0 0 1-1-1v-9.500Z"/>',
    chat: '<path d="M20.500 11.500a8.500 8.500 0 0 1-12.300 7.600L3.500 20.500l1.400-4.500a8.500 8.500 0 1 1 15.600-4.500Z"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2.500v3M12 18.500v3M2.500 12h3M18.500 12h3M5.300 5.300l2.100 2.100M16.600 16.600l2.100 2.100M5.300 18.700l2.100-2.100M16.600 7.400l2.100-2.100"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.500 3 14.500 0 18M12 3c-3 3.500-3 14.500 0 18"/>',
    alarm: '<circle cx="12" cy="13" r="7.500"/><path d="M12 9v4l2.500 2M5 3.500 2.500 6M19 3.500 21.500 6"/>',
    stopwatch: '<circle cx="12" cy="13.500" r="7.500"/><path d="M12 13.500V9.500M10 2.500h4M12 2.500V6"/>',
    timer: '<circle cx="12" cy="12" r="9"/><path d="M12 12 8.500 8.500M12 3v2.500"/>',
    photoLib: '<rect x="3" y="5" width="18" height="14" rx="2.500"/><path d="m3.500 16 5-5 4 4 2.500-2.500 5.500 5.500"/><circle cx="16" cy="9.500" r="1.300"/>',
    albums: '<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M6 5h12M8 2.500h8"/>',
    note: '<path d="M10 18.500V6l10-2v12.500"/><circle cx="7" cy="18.500" r="3"/><circle cx="17" cy="16.500" r="3"/>',
    radio: '<circle cx="12" cy="12" r="2"/><path d="M7.800 16.200a6 6 0 0 1 0-8.400m8.400 0a6 6 0 0 1 0 8.400M5 19a9.900 9.900 0 0 1 0-14m14 0a9.900 9.900 0 0 1 0 14"/>',
    library: '<path d="M5 4v16M9.500 4v16M14 5l4.500 15"/>',
    torch: '<path d="M8 3h8v3.500l-2 3V20a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V9.500l-2-3V3Zm0 3.500h8M12 12.500v2"/>',
    play: '<path d="M8 5.500v13l11-6.500-11-6.500Z" fill="currentColor"/>',
  };
  function svg(name, size = 22, extra = '') {
    return `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ${extra}>${(icons[name] || '').replace(/(\d)00\b/g, '$1')}</svg>`;
  }
  function photo(name) { return `assets/photos/${name}`; }
  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  }
  /* رسومات أيقونات التطبيقات على الشاشة الرئيسية */
  const appArt = {
    whatsapp: '<svg viewBox="0 0 60 60" aria-hidden="true"><path fill="#fff" d="M30 13c-9.900 0-18 7.300-18 16.300 0 3.500 1.200 6.700 3.300 9.400L13 47l8.900-2.700c2.400 1 5.200 1.600 8.100 1.600 9.900 0 18-7.300 18-16.300S39.900 13 30 13Z"/><circle cx="22.500" cy="29.500" r="2.300" fill="#1fae4f"/><circle cx="30" cy="29.500" r="2.300" fill="#1fae4f"/><circle cx="37.500" cy="29.500" r="2.300" fill="#1fae4f"/></svg>',
    bank: '<svg viewBox="0 0 60 60" aria-hidden="true"><g fill="none" stroke="#e7c36a" stroke-width="2.800" stroke-linecap="round" stroke-linejoin="round"><path d="M14 25 30 14l16 11H14Z" fill="#e7c36a" fill-opacity=".18"/><path d="M19 30v11M26.500 30v11M33.500 30v11M41 30v11M14 45.500h32"/></g></svg>',
    alarm: '<svg viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="30" r="22" fill="#fff"/><g stroke="#1c1c1e" stroke-width="1.600" stroke-linecap="round"><path d="M30 11v3.500M30 45.500V49M11 30h3.500M45.500 30H49M20.500 13.500l1.700 3M37.800 43.500l1.700 3M13.500 20.500l3 1.700M43.500 37.800l3 1.700M13.500 39.500l3-1.700M43.500 22.200l3-1.700M20.500 46.500l1.700-3M37.800 16.500l1.700-3"/></g><g class="clock-hands"><line class="hand-h" x1="30" y1="30" x2="30" y2="18.500" stroke="#1c1c1e" stroke-width="2.800" stroke-linecap="round"/><line class="hand-m" x1="30" y1="30" x2="30" y2="13" stroke="#1c1c1e" stroke-width="2" stroke-linecap="round"/><line class="hand-s" x1="30" y1="34" x2="30" y2="11.500" stroke="#ff9f0a" stroke-width="1" stroke-linecap="round"/></g><circle cx="30" cy="30" r="1.800" fill="#ff9f0a"/></svg>',
    notes: '<svg viewBox="0 0 60 60" aria-hidden="true"><rect width="60" height="17" fill="#ffd426"/><path d="M0 17h60" stroke="#c9a000" stroke-opacity=".5" stroke-width=".800"/><g fill="#c7c7cc"><circle cx="8" cy="8.500" r="1.200" fill="#b98f00"/><circle cx="13" cy="8.500" r="1.200" fill="#b98f00"/><circle cx="18" cy="8.500" r="1.200" fill="#b98f00"/><rect x="9" y="26" width="42" height="1.600" rx=".800"/><rect x="9" y="35" width="42" height="1.600" rx=".800"/><rect x="9" y="44" width="30" height="1.600" rx=".800"/></g></svg>',
    photos: '<svg viewBox="0 0 60 60" aria-hidden="true"><circle cx="41" cy="20" r="6.500" fill="#ffb629"/><path d="M0 46 17 27l13 14 8-8 22 21v6H0V46Z" fill="#34c0a5"/><path d="M0 50 17 31l14 16-5 13H0V50Z" fill="#2a8fd8"/></svg>',
    music: '<svg viewBox="0 0 60 60" aria-hidden="true"><path fill="#fff" d="M40.500 14.500 24 18a2 2 0 0 0-1.600 2v17.800a6.200 6.200 0 1 0 3 5.300V25.800l13.600-2.900v11.900a6.200 6.200 0 1 0 3 5.300V16.500a2 2 0 0 0-1.500-2Z"/></svg>',
  };
  Object.keys(appArt).forEach(k => { appArt[k] = appArt[k].replace(/(\d)00\b/g, '$1'); });

  const appIcons = [
    { id: 'bank', title: 'بنك إثمار', where: 'grid' },
    { id: 'alarm', title: 'المنبّه', where: 'grid' },
    { id: 'vault', title: 'INVESTVERSE', where: 'grid', locked: true },
    { id: 'whatsapp', title: 'واتساب', where: 'dock', badge: 4 },
    { id: 'photos', title: 'الصور', where: 'dock' },
    { id: 'notes', title: 'الملاحظات', where: 'dock' },
    { id: 'music', title: 'الأغاني', where: 'dock' },
  ];
  const appRoutes = { whatsapp: 'whatsapp', bank: 'bank', alarm: 'alarm', notes: 'notes', photos: 'photos', music: 'music', vault: 'vault' };
  const parentRoute = { chat: 'whatsapp', note: 'notes', photo: 'photos' };
  const lightBarRoutes = ['lock', 'home', 'alarm', 'photo', 'vault'];

  /* ------------------------------------------------------------------ *
   * الحالة
   * ------------------------------------------------------------------ */
  let route = 'lock';
  let stack = [];
  let currentApp = null;
  let activeChat = 'group';
  let activeNote = 'dates';
  let activePhoto = 0;
  let code = '';
  let fails = 0;
  let alarmOn = true;
  let balanceHidden = false;
  let hintOpen = false;
  let vaultOpen = false;
  let unlocked = false;
  let coachShown = false;
  let toastTimer;
  let errorTimer;
  let winAnim = null;
  let lockAnim = null;
  let suppressClick = false;
  let battery = 25;
  let lowPower = false;
  let batteryTimer;
  const scrollMemory = {};

  /* ------------------------------------------------------------------ *
   * أدوات مساعدة
   * ------------------------------------------------------------------ */
  function scaleFactor() {
    const rect = phone.getBoundingClientRect();
    return rect.width / phone.offsetWidth || 1;
  }
  function fitDevice() {
    if (window.innerWidth <= 520) { device.style.removeProperty('--k'); return; }
    const k = Math.min(1, (window.innerHeight - 36) / 876, (window.innerWidth - 24) / 417);
    device.style.setProperty('--k', k.toFixed(4));
  }
  function buzz(pattern = 8) { try { navigator.vibrate?.(pattern); } catch { /* غير مدعوم */ } }
  function setChrome() {
    phone.dataset.route = route;
    phone.dataset.bar = lightBarRoutes.includes(route) ? 'light' : 'dark';
  }
  function tick() {
    const now = new Date();
    statusTime.textContent = clock(now, false);
    const lockClock = $('.lock-clock', lockEl);
    if (lockClock) lockClock.textContent = clock(now, false);
    const lockDate = $('.lock-date', lockEl);
    if (lockDate) lockDate.textContent = fullDate(now);
    const s = now.getSeconds(), m = now.getMinutes() + s / 60, h = (now.getHours() % 12) + m / 60;
    phone.style.setProperty('--hand-h', `${h * 30}deg`);
    phone.style.setProperty('--hand-m', `${m * 6}deg`);
    phone.style.setProperty('--hand-s', `${s * 6}deg`);
  }
  function notify(text, title = 'INVESTVERSE') {
    clearTimeout(toastTimer);
    toastElement.innerHTML = `<img src="assets/investverse-icon.png" alt="" /><div><b>${esc(title)}</b><span>${esc(text)}</span></div>`;
    toastElement.hidden = false;
    toastElement.classList.remove('banner-exit');
    void toastElement.offsetWidth;
    toastElement.classList.add('banner-in');
    toastTimer = setTimeout(() => {
      toastElement.classList.add('banner-exit');
      setTimeout(() => { toastElement.hidden = true; toastElement.classList.remove('banner-in', 'banner-exit'); }, 260);
    }, 3200);
  }
  function showCoach() {
    if (coachShown) return;
    coachShown = true;
    coachEl.hidden = false;
    setTimeout(hideCoach, 5200);
  }
  function hideCoach() { coachEl.hidden = true; }

  /* ------------------------------------------------------------------ *
   * البطارية: تبدأ ٢٥٪ وتنزل ١٪ كل ٣٠ ثانية، وتنبّه عند ٢٠٪ و١٠٪
   * ------------------------------------------------------------------ */
  const BATTERY_START = 25;
  const BATTERY_FLOOR = 10;
  const BATTERY_STEP_MS = 30000;
  const BATTERY_ALERTS = [20, 10];
  function paintBattery() {
    batteryEl.querySelectorAll('.bat-num').forEach(el => { el.textContent = ar(battery); });
    batteryEl.style.setProperty('--bat', `${battery}%`);
    batteryEl.dataset.state = lowPower ? 'saver' : battery <= 20 ? 'low' : 'normal';
    batteryEl.setAttribute('aria-label', `البطارية ${ar(battery)}٪`);
  }
  function showBatteryAlert() {
    $('#alert-text', alertEl).textContent = `باقي ${ar(battery)}٪ من شحن البطارية.`;
    alertEl.hidden = false;
    alertEl.classList.remove('alert-in');
    void alertEl.offsetWidth;
    alertEl.classList.add('alert-in');
    buzz([20, 60, 20]);
    $('.alert-default', alertEl).focus({ preventScroll: true });
  }
  function closeBatteryAlert() { alertEl.hidden = true; }
  function setBattery(level) {
    battery = Math.max(BATTERY_FLOOR, Math.min(100, Math.round(level)));
    paintBattery();
    if (BATTERY_ALERTS.includes(battery)) showBatteryAlert();
    if (battery <= BATTERY_FLOOR) clearInterval(batteryTimer);
  }
  function startBattery() {
    clearInterval(batteryTimer);
    battery = BATTERY_START; lowPower = false;
    closeBatteryAlert();
    paintBattery();
    batteryTimer = setInterval(() => setBattery(battery - 1), BATTERY_STEP_MS);
  }

  /* ------------------------------------------------------------------ *
   * شاشة القفل
   * ------------------------------------------------------------------ */
  function miniIcon(id) {
    if (id === 'vault') return '<span class="mini-icon icon-vault"><img src="assets/investverse-icon.png" alt="" /></span>';
    return `<span class="mini-icon icon-${id}">${appArt[id]}</span>`;
  }
  function renderLock() {
    const wifeTime = `منذ ${ar(11)} د`;
    const bankTime = `منذ ${ar(26)} د`;
    lockEl.innerHTML = `
      <div class="lock-top">
        <span class="lock-padlock">${svg('lock', 20)}</span>
        <span class="lock-date">${fullDate(new Date())}</span>
        <h1 class="lock-clock">${clock(new Date(), false)}</h1>
      </div>
      <div class="lock-message"><strong>هذا الجوال مفقود</strong><span>إذا لقيته، تواصل مع أبو فهد.</span></div>
      <div class="notification-stack">
        <button type="button" class="notif-card" data-action="notif" data-open="whatsapp" data-open-chat="wife">${miniIcon('whatsapp')}<span class="notif-copy"><b>أم فهد ❤️</b><span>الله يكتب اللي فيه ❤️</span></span><time>${wifeTime}</time></button>
        <button type="button" class="notif-card" data-action="notif" data-open="bank">${miniIcon('bank')}<span class="notif-copy"><b>بنك إثمار</b><span>تم إيداع توزيعات أرباح</span></span><time>${bankTime}</time></button>
        <button type="button" class="notif-card" data-action="notif" data-open="whatsapp" data-open-chat="group">${miniIcon('whatsapp')}<span class="notif-copy"><b>🚀 توصيات مضمونة</b><span>يا جماعة السهم بيطير بكرة !! 🚀</span></span><time>أمس</time></button>
      </div>
      <div class="lock-bottom">
        <button type="button" class="lock-round" data-action="torch" aria-label="الكشّاف" aria-pressed="false">${svg('torch', 24)}</button>
        <button type="button" class="swipe-hint" data-action="unlock">اسحب للأعلى للفتح</button>
        <span class="lock-round" aria-hidden="true">${svg('camera', 24)}</span>
      </div>`;
  }
  function unlock(after) {
    if (unlocked) return;
    unlocked = true;
    route = 'home'; stack = []; currentApp = null;
    setChrome();
    homeEl.inert = false;
    homeEl.classList.remove('home-waiting');
    lockAnim?.cancel();
    const done = () => { lockEl.hidden = true; lockEl.style.transform = ''; if (typeof after === 'function') after(); };
    if (reducedMotion) { done(); return; }
    homeEl.animate([{ transform: 'scale(1.35)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: 520, easing: 'cubic-bezier(.2,.9,.25,1)' });
    lockAnim = lockEl.animate([{ transform: 'translateY(-105%)', opacity: .6 }], { duration: 380, easing: 'cubic-bezier(.4,0,.2,1)' });
    lockEl.style.pointerEvents = 'none';
    lockAnim.onfinish = () => { lockEl.style.pointerEvents = ''; done(); };
  }
  function relock() {
    unlocked = false; vaultOpen = false; route = 'lock'; stack = []; currentApp = null;
    fails = 0; code = ''; hintOpen = false; alarmOn = true; balanceHidden = false;
    winAnim?.cancel(); lockAnim?.cancel();
    win.hidden = true; win.innerHTML = ''; win.removeAttribute('style');
    homeEl.classList.remove('home-behind');
    homeEl.classList.add('home-waiting');
    homeEl.inert = true;
    renderLock(); renderHome();
    startBattery();
    lockEl.hidden = false; lockEl.style.pointerEvents = '';
    setChrome();
    if (!reducedMotion) lockEl.animate([{ transform: 'translateY(-100%)' }, { transform: 'translateY(0)' }], { duration: 420, easing: 'cubic-bezier(.2,.9,.25,1)' });
  }

  /* ------------------------------------------------------------------ *
   * الشاشة الرئيسية
   * ------------------------------------------------------------------ */
  function iconTile(app, withLabel) {
    const locked = app.locked && !vaultOpen;
    const art = app.id === 'vault' ? '<img src="assets/investverse-icon.png" alt="" draggable="false"/>' : appArt[app.id];
    return `<button class="app-tile" type="button" data-action="open-app" data-app="${app.id}" aria-label="${esc(app.title)}${locked ? '، مقفول' : ''}">
      <span class="app-glyph icon-${app.id}">${art}${app.badge ? `<span class="app-badge">${ar(app.badge)}</span>` : ''}${locked ? `<span class="lock-mini">${svg('lock', 11, 'stroke-width="2.4"')}</span>` : ''}</span>
      ${withLabel ? `<span class="app-name" dir="auto">${esc(app.title)}</span>` : ''}</button>`;
  }
  function renderHome() {
    const today = new Date();
    homeEl.innerHTML = `
      <div class="widgets">
        <div class="widget-slot"><div class="widget widget-calendar"><span class="cal-day">${DAYS[today.getDay()]}</span><span class="cal-num">${ar(today.getDate())}</span><span class="cal-note">لا توجد أحداث أخرى اليوم</span></div><span class="widget-name">التقويم</span></div>
        <div class="widget-slot"><button type="button" class="widget widget-photo" data-action="open-widget" data-target="photos" aria-label="ودجت الصور: جلسة بر"><img src="${photo('desert-camp.webp')}" alt="" draggable="false"/><span class="widget-photo-text"><b>جلسة بر</b><small>${dayMonth(photos[2].date)}</small></span></button><span class="widget-name">الصور</span></div>
      </div>
      <div class="home-apps">${appIcons.filter(a => a.where === 'grid').map(a => iconTile(a, true)).join('')}</div>
      <div class="home-spacer"></div>
      <div class="home-search" aria-hidden="true">${svg('search', 13, 'stroke-width="2.4"')}<span>بحث</span></div>
      <div class="home-dock">${appIcons.filter(a => a.where === 'dock').map(a => iconTile(a, false)).join('')}</div>`;
  }

  /* ------------------------------------------------------------------ *
   * قوالب مشتركة داخل التطبيقات
   * ------------------------------------------------------------------ */
  function backButton(label = '') {
    return `<button class="nav-back" type="button" data-action="back" aria-label="رجوع${label ? ` إلى ${esc(label)}` : ''}">${svg('chevron', 24, 'stroke-width="2.4"')}${label ? `<span>${esc(label)}</span>` : ''}</button>`;
  }
  function tabbar(items) {
    return `<nav class="tabbar" aria-hidden="true">${items.map(([icon, label, active]) => `<span class="tab ${active ? 'tab-active' : ''}">${svg(icon, 25)}<small>${label}</small></span>`).join('')}</nav>`;
  }

  /* ---------------------------- واتساب ---------------------------- */
  function chatStamp(chat) {
    if (chat.ago == null) return chat.day;
    const d = minutesAgo(chat.ago);
    return sameDay(d, NOW) ? clock(d) : 'أمس';
  }
  function chatStatus(chat) {
    if (chat.type) return chat.type;
    const d = minutesAgo(chat.ago);
    return `آخر ظهور ${sameDay(d, NOW) ? 'اليوم' : 'أمس'} ${clock(d)}`;
  }
  function messageTimes(chat) {
    const list = messages[chat.id];
    if (chat.ago != null) {
      const end = NOW.getTime() - chat.ago * 60000;
      return list.map((_, i) => clock(new Date(end - (list.length - 1 - i) * chat.gap * 60000)));
    }
    const [h, m] = chat.start.split(':').map(Number);
    return list.map((_, i) => clock(new Date(2026, 0, 1, h, m + i * 2)));
  }
  function avatar(chat, cls = '') {
    return `<span class="chat-avatar ${cls}" style="background:${chat.color}">${esc(chat.avatar)}</span>`;
  }
  function renderWhatsapp() {
    return `<header class="nav"><div class="nav-row"><span class="nav-text">تعديل</span><span class="nav-title">الدردشات</span><span class="nav-actions">${svg('camera', 23)}${svg('compose', 22)}</span></div></header>
      <div class="scroll">
        <h1 class="large-title">الدردشات</h1>
        <div class="search-field" aria-hidden="true">${svg('search', 16, 'stroke-width="2.2"')}<span>بحث</span></div>
        <div class="chat-list">${chats.map(c => `<button type="button" data-action="open-chat" data-chat="${c.id}" class="chat-preview">${avatar(c)}<span class="chat-preview-copy"><span class="chat-line"><strong>${esc(c.name)}</strong><time class="${c.unread ? 'is-unread' : ''}">${chatStamp(c)}</time></span><span class="chat-line"><small>${c.mine ? '<i class="ticks">✓✓</i> ' : ''}${esc(c.preview)}</small>${c.unread ? `<b class="unread">${ar(c.unread)}</b>` : ''}</span></span></button>`).join('')}</div>
        <p class="list-end-note">المحادثات شخصية خيالية لأغراض الحملة</p>
      </div>
      ${tabbar([['chat', 'الدردشات', true], ['phone', 'الاتصالات'], ['gear', 'الإعدادات']])}`;
  }
  function renderChat() {
    const chat = chats.find(c => c.id === activeChat) || chats[0];
    const times = messageTimes(chat);
    const firstDay = chat.id === 'old' ? '' : `<div class="chat-day">${chat.ago != null ? (sameDay(minutesAgo(chat.ago), NOW) ? 'اليوم' : 'أمس') : esc(chat.day)}</div>`;
    const body = messages[chat.id].map((m, i) => {
      if (m.who === 'date') return `<div class="chat-day">${esc(m.text)}</div>`;
      if (m.who === 'system') return `<div class="chat-day chat-system">${esc(m.text)}</div>`;
      const prev = messages[chat.id][i - 1];
      const tail = !prev || prev.who !== m.who ? 'has-tail' : '';
      let inner;
      if (m.audio) {
        inner = `<span class="voice"><span class="voice-play">${svg('play', 20)}</span><span class="voice-wave">${Array.from({ length: 26 }, (_, n) => `<i style="height:${5 + Math.round(Math.abs(Math.sin(n * 1.7) * 13))}px"></i>`).join('')}</span><span class="voice-len">${m.audio}</span></span>`;
      } else {
        inner = `${m.photo ? `<img loading="lazy" class="inline-chat-photo" src="${photo(m.photo)}" alt="صورة من المحادثة"/>` : ''}<span class="bubble-text">${esc(m.text)}</span>`;
      }
      return `<div class="bubble-row ${m.who} ${tail}"><div class="message-bubble">${m.author ? `<span class="bubble-author">${esc(m.author)}</span>` : ''}${inner}<small class="bubble-time">${times[i]}${m.who === 'me' ? ' <i class="ticks">✓✓</i>' : ''}</small></div></div>`;
    }).join('');
    return `<header class="nav chat-nav"><div class="nav-row">${backButton()}<div class="chat-head">${avatar(chat, 'header-avatar')}<span class="chat-head-copy"><strong>${esc(chat.name)}</strong><small>${esc(chatStatus(chat))}</small></span></div><span class="nav-actions">${svg('video', 24)}${svg('phone', 21)}</span></div></header>
      <div class="scroll chat-background">${firstDay}<div class="bubble-column">${body}</div></div>
      <div class="chat-compose" aria-hidden="true">${svg('plus', 26)}<span class="compose-field"></span>${svg('camera', 24)}${svg('mic', 23)}</div>`;
  }

  /* ---------------------------- بنك إثمار ---------------------------- */
  function renderBank() {
    const when = t => `${relativeDay(t.date)}، ${clock(t.date)}`;
    return `<header class="nav"><div class="nav-row"><span class="bank-user"><span class="bank-avatar">أ</span><span><small>مرحبًا</small><strong class="hello">أبو فهد 👋</strong></span></span><span class="nav-title">بنك إثمار</span><span class="nav-actions">${svg('search', 22)}</span></div></header>
      <div class="scroll bank-scroll">
        <div class="balance-card">
          <div class="balance-top"><span>الحساب الجاري •••• ٧٧١٠</span><button type="button" class="balance-eye" data-action="toggle-balance" aria-label="${balanceHidden ? 'إظهار الرصيد' : 'إخفاء الرصيد'}">${svg(balanceHidden ? 'eyeOff' : 'eye', 20)}</button></div>
          <span class="balance-label">الرصيد المتاح</span>
          <strong class="balance-amount" dir="ltr">${balanceHidden ? '•••••••' : '2,847,500'} <small>ر.س</small></strong>
          <span class="balance-foot">بنك إثمار <i>بنك افتراضي للعرض</i></span>
        </div>
        <div class="quick-actions" aria-hidden="true">
          <span><i>${svg('transfer', 22)}</i>تحويل</span><span><i>${svg('bill', 22)}</i>سداد</span><span><i>${svg('card', 22)}</i>البطاقات</span><span><i>${svg('grid', 22)}</i>المزيد</span>
        </div>
        <div class="balance-tag"><span>مصدر الثروة؟</span><b>تلقاه في INVESTVERSE</b></div>
        <div class="bank-section-heading"><h2>آخر العمليات</h2><span>عرض الكل</span></div>
        <div class="transactions">${transactions.map(t => `<div class="transaction"><span class="transaction-icon ${t.pos ? 'pos' : 'neg'}">${svg(t.pos ? 'arrowDown' : 'arrowUp', 18, 'stroke-width="2.2"')}</span><div class="transaction-info"><strong>${esc(t.text)}</strong><small>${when(t)}</small></div><b class="amount ${t.pos ? 'pos' : 'neg'}" dir="ltr">${esc(t.amount)}</b></div>`).join('')}</div>
        <p class="sim-disclaimer">بنك إثمار اسم خيالي، والأرقام مجرد جزء من القصة وليست أرصدة حقيقية أو نصيحة استثمارية.</p>
      </div>
      ${tabbar([['house', 'الرئيسية', true], ['card', 'الحسابات'], ['transfer', 'التحويلات'], ['more', 'المزيد']])}`;
  }

  /* ---------------------------- المنبّه ---------------------------- */
  function renderAlarm() {
    return `<header class="nav"><div class="nav-row"><span class="nav-text">تعديل</span><span class="nav-title">المنبّهات</span><span class="nav-actions">${svg('plus', 26)}</span></div></header>
      <div class="scroll alarm-content">
        <h1 class="large-title">المنبّهات</h1>
        <div class="alarm-caption">أخرى</div>
        <div class="alarm-card ${alarmOn ? '' : 'alarm-off'}">
          <div class="alarm-detail"><strong>${ar('2:00')}<small>ص</small></strong><span>لا تنسى!، كل يوم</span></div>
          <button type="button" data-action="toggle-alarm" class="toggle-switch ${alarmOn ? 'on' : ''}" aria-label="منبّه الساعة ٢:٠٠" role="switch" aria-checked="${alarmOn}"><span></span></button>
        </div>
        <div class="alarm-none">ما فيه منبّهات ثانية</div>
      </div>
      ${tabbar([['globe', 'ساعة العالم'], ['alarm', 'المنبّهات', true], ['stopwatch', 'ساعة الإيقاف'], ['timer', 'المؤقتات']])}`;
  }

  /* ---------------------------- الملاحظات ---------------------------- */
  function noteStamp(date) {
    if (sameDay(date, NOW)) return clock(date);
    if (sameDay(date, daysAgo(1))) return 'أمس';
    if (NOW - date < 6 * 864e5) return DAYS[date.getDay()];
    return ar(`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`);
  }
  function renderNotes() {
    return `<header class="nav"><div class="nav-row"><span class="nav-text"></span><span class="nav-title">الملاحظات</span><span class="nav-actions">${svg('more', 23)}</span></div></header>
      <div class="scroll">
        <h1 class="large-title">الملاحظات</h1>
        <div class="search-field" aria-hidden="true">${svg('search', 16, 'stroke-width="2.2"')}<span>بحث</span></div>
        ${[['مثبّتة', notes.filter(n => n.pinned)], ['', notes.filter(n => !n.pinned)]].filter(([, group]) => group.length).map(([label, group]) => `${label ? `<h2 class="notes-section">${label}</h2>` : ''}<div class="notes-grid">${group.map(n => `<button class="note-card" type="button" data-action="open-note" data-note="${n.id}"><strong>${esc(n.title)}</strong><span class="note-meta"><time>${noteStamp(n.date)}</time><span>${esc(n.preview)}</span></span></button>`).join('')}</div>`).join('')}
      </div>
      <div class="notes-toolbar"><span aria-hidden="true"></span><span>${ar(notes.length)} ملاحظات</span><span aria-hidden="true">${svg('compose', 23)}</span></div>`;
  }
  function renderNote() {
    const n = notes.find(x => x.id === activeNote) || notes[0];
    const stamp = `${dayMonth(n.date)} ${ar(n.date.getFullYear())} في ${clock(n.date)}`;
    return `<header class="nav"><div class="nav-row">${backButton('الملاحظات')}<span class="nav-actions">${svg('share', 22)}${svg('more', 23)}</span></div></header>
      <article class="scroll single-note">
        <div class="note-stamp">${stamp}</div>
        <h2>${esc(n.title)}</h2>
        ${n.fields
          ? `<dl class="note-fields">${n.fields.map(f => `<div><dt>${esc(f.label)}:</dt><dd dir="ltr">${esc(f.value)}</dd></div>`).join('')}</dl>`
          : `<ul class="note-lines ${n.checklist ? 'note-checklist' : ''}">${n.lines.map(line => `<li class="${line.done ? 'note-done' : ''}">${n.checklist ? `<span class="check-circle">${line.done ? svg('check', 13, 'stroke-width="3"') : ''}</span>` : ''}<span>${esc(line.text)}</span></li>`).join('')}</ul>`}
      </article>
      <div class="notes-toolbar note-tools" aria-hidden="true">${svg('check', 22)}${svg('camera', 23)}${svg('compose', 23)}</div>`;
  }

  /* ---------------------------- الصور ---------------------------- */
  function renderPhotos() {
    const first = photos[photoOrder[0]].date, last = photos[photoOrder[photoOrder.length - 1]].date;
    const range = first.getMonth() === last.getMonth() ? `${ar(first.getDate())} – ${dayMonth(last)}` : `${dayMonth(first)} – ${dayMonth(last)}`;
    return `<header class="nav"><div class="nav-row"><span class="nav-text"></span><span class="nav-title">المكتبة</span><span class="nav-actions"><span class="nav-pill">تحديد</span></span></div></header>
      <div class="scroll">
        <div class="gallery-intro"><h1 class="large-title">المكتبة</h1><p>${range}</p></div>
        <div class="photo-grid">${photoOrder.map(i => `<button type="button" class="gallery-tile" data-action="open-photo" data-photo="${i}" aria-label="افتح ${esc(photos[i].title)}"><img loading="lazy" src="${photo(photos[i].file)}" alt="${esc(photos[i].title)}" draggable="false"/></button>`).join('')}</div>
        <p class="gallery-count">${ar(photos.length)} صور</p>
      </div>
      ${tabbar([['photoLib', 'المكتبة', true], ['heart', 'لك'], ['albums', 'الألبومات'], ['search', 'بحث']])}`;
  }
  function photoCaption(p) {
    return `<h2>${esc(p.title)}</h2><p>${esc(p.subtitle)}</p>`;
  }
  function renderPhoto() {
    const p = photos[activePhoto];
    return `<header class="nav"><div class="nav-row">${backButton()}<div class="pv-title"><strong id="pv-day">${relativeDay(p.date)}</strong><small id="pv-time">${clock(p.date)}</small></div><span class="nav-actions">${svg('more', 23)}</span></div></header>
      <div class="pv-track" id="pv-track" tabindex="0" aria-label="الصور، اسحب للتنقل">${photoOrder.map(i => `<figure class="pv-slide"><img src="${photo(photos[i].file)}" alt="${esc(photos[i].title)}" draggable="false"/></figure>`).join('')}</div>
      <div class="photo-caption" id="pv-caption">${photoCaption(p)}</div>
      <div class="pv-strip" id="pv-strip">${photoOrder.map((i, pos) => `<button type="button" data-action="jump-photo" data-jump="${pos}" aria-label="${esc(photos[i].title)}" class="${i === activePhoto ? 'is-current' : ''}"><img src="${photo(photos[i].file)}" alt="" draggable="false"/></button>`).join('')}</div>
      <div class="pv-tools" aria-hidden="true">${svg('share', 23)}${svg('heart', 23)}${svg('info', 23)}${svg('trash', 23)}</div>`;
  }
  function photoTrackGo(pos, smooth) {
    const track = $('#pv-track', win);
    if (!track) return;
    track.scrollTo({ left: -pos * track.clientWidth, behavior: smooth && !reducedMotion ? 'smooth' : 'auto' });
  }
  function photoTrackSync() {
    const track = $('#pv-track', win);
    if (!track || !track.clientWidth) return;
    const pos = Math.max(0, Math.min(photoOrder.length - 1, Math.round(Math.abs(track.scrollLeft) / track.clientWidth)));
    const index = photoOrder[pos];
    if (index === activePhoto) return;
    activePhoto = index;
    const p = photos[index];
    $('#pv-caption', win).innerHTML = photoCaption(p);
    $('#pv-day', win).textContent = relativeDay(p.date);
    $('#pv-time', win).textContent = clock(p.date);
    win.querySelectorAll('#pv-strip button').forEach((b, n) => b.classList.toggle('is-current', n === pos));
  }
  function stepPhoto(delta) {
    const pos = photoOrder.indexOf(activePhoto);
    const next = Math.max(0, Math.min(photoOrder.length - 1, pos + delta));
    photoTrackGo(next, true);
  }

  /* ---------------------------- الأغاني ---------------------------- */
  function renderMusic() {
    return `<header class="nav"><div class="nav-row"><span class="nav-text"></span><span class="nav-title">المكتبة</span><span class="nav-actions">${svg('more', 23)}</span></div></header>
      <div class="scroll music-scroll">
        <h1 class="large-title">المكتبة</h1>
        <div class="empty-music">${svg('note', 58, 'stroke-width="1.3"')}<h2>ما فيه أغاني حاليًا</h2><p>المكتبة فاضية… أبو فهد للحين ما أضاف شيء.</p></div>
      </div>
      ${tabbar([['house', 'الرئيسية'], ['radio', 'الراديو'], ['library', 'المكتبة', true], ['search', 'بحث']])}`;
  }

  /* ---------------------------- INVESTVERSE المقفول ---------------------------- */
  const keys = ['1','2','3','4','5','6','7','8','9','','0','back'];
  function dots() { return [0, 1, 2, 3].map(i => `<span class="digit-cell ${i < code.length ? 'filled' : ''}"></span>`).join(''); }
  function renderVault() {
    return `<div class="vault-backdrop" aria-hidden="true"></div>
      <div class="vault-content">
        <div class="vault-logo"><img src="assets/investverse-icon.png" alt="شعار INVESTVERSE"/></div>
        <span class="vault-lock">${svg('lock', 14, 'stroke-width="2.2"')} INVESTVERSE مقفول</span>
        <h1>أدخل رمز الدخول</h1>
        <p class="vault-subtitle">الرمز ٤ أرقام، وأبو فهد كاتبه في مكان ما داخل الجوال</p>
        <div class="digits" role="img" aria-label="خانات الرمز المكون من أربعة أرقام">${dots()}</div>
        <div class="pass-error" id="pass-error" role="alert" aria-live="polite"></div>
        <div class="keypad">${keys.map(n => n === '' ? '<span class="key-gap"></span>' : `<button type="button" data-action="keypad" data-key="${n}" class="${n === 'back' ? 'key-back' : ''}" aria-label="${n === 'back' ? 'حذف آخر رقم' : n}">${n === 'back' ? svg('backspace', 26) : n}</button>`).join('')}</div>
        <button type="button" class="vault-forgot" data-action="toggle-hint" aria-expanded="${hintOpen}">نسيت الرمز؟</button>
        <div class="pass-hint" ${hintOpen ? '' : 'hidden'}><b>أبو فهد ما يحفظ الأرقام</b><span>دايم يكتب كلمات السر في الملاحظات. ارجع للشاشة الرئيسية ودوّر هناك.</span></div>
      </div>`;
  }
  /* بعد إدخال الرمز الصحيح: يفتح التطبيق على بوستر المعرض */
  function renderInvite() {
    const hasRegister = typeof config.registrationUrl === 'string' && config.registrationUrl.trim();
    const hasMap = typeof config.mapUrl === 'string' && config.mapUrl.trim();
    return `<div class="scroll invite-content">
        <img class="invite-poster" src="assets/investverse-poster.webp" alt="بوستر معرض INVESTVERSE: إثمار سهمك الرابح، مع محاور المعرض وموعده ومكانه" draggable="false"/>
        <div class="invite-foot">
          ${config.eventNotes ? `<p class="event-notes">${esc(config.eventNotes)}</p>` : ''}
          ${hasRegister || hasMap ? `<div class="invite-actions">${hasRegister ? '<button class="register-button" type="button" data-action="register">سجّل حضورك</button>' : ''}${hasMap ? `<button class="map-button" type="button" data-action="map">${svg('location', 18)} الخريطة</button>` : ''}</div>` : ''}
          <div class="closing-disclaimer">الشخصية والأرقام خيالية لأغراض توعوية، وليست توصية استثمارية.</div>
          <button class="restart-button" type="button" data-action="restart">${svg('refresh', 15)} أعد التجربة</button>
        </div>
      </div>`;
  }

  const renderers = { whatsapp: renderWhatsapp, chat: renderChat, bank: renderBank, alarm: renderAlarm, notes: renderNotes, note: renderNote, photos: renderPhotos, photo: renderPhoto, music: renderMusic, vault: renderVault, invite: renderInvite };

  /* ------------------------------------------------------------------ *
   * التنقل والحركة
   * ------------------------------------------------------------------ */
  function rememberScroll() {
    const sc = win.querySelector('.page:not(.leaving) .scroll');
    if (sc) scrollMemory[route] = sc.scrollTop;
  }
  /* يركّب صفحة جديدة داخل نافذة التطبيق: push تدخل من اليسار، pop ترجع */
  function mount(direction = 'none') {
    win.querySelectorAll('.page.leaving').forEach(el => el.remove());
    const old = win.querySelector('.page');
    const page = document.createElement('section');
    page.className = `page page-${route}`;
    page.innerHTML = renderers[route]();
    if (direction === 'pop' && old) win.insertBefore(page, old); else win.appendChild(page);
    win.dataset.route = route;
    setChrome();

    const sc = page.querySelector('.scroll');
    if (route === 'chat' && sc) sc.scrollTop = sc.scrollHeight;
    else if (sc && direction === 'pop' && scrollMemory[route]) sc.scrollTop = scrollMemory[route];
    if (sc) page.classList.toggle('scrolled', sc.scrollTop > 34);
    if (route === 'photo') photoTrackGo(photoOrder.indexOf(activePhoto), false);

    if (!old) return;
    if (direction === 'none' || reducedMotion) { old.remove(); return; }
    old.classList.add('leaving');
    old.inert = true;
    const opts = { duration: 380, easing: 'cubic-bezier(.32,.72,0,1)' };
    let leave;
    if (direction === 'push') {
      page.animate([{ transform: 'translateX(-100%)' }, { transform: 'translateX(0)' }], opts);
      leave = old.animate([{ transform: 'translateX(0)', filter: 'brightness(1)' }, { transform: 'translateX(28%)', filter: 'brightness(.86)' }], opts);
    } else if (direction === 'pop') {
      page.animate([{ transform: 'translateX(28%)', filter: 'brightness(.86)' }, { transform: 'translateX(0)', filter: 'brightness(1)' }], opts);
      leave = old.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-100%)' }], opts);
    } else {
      page.animate([{ opacity: 0, transform: 'scale(1.04)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 420, easing: 'ease-out' });
      leave = old.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: 'ease-in' });
    }
    leave.onfinish = () => old.remove();
  }
  function originPoint(el) {
    const rect = (el && el.isConnected ? el : phone).getBoundingClientRect();
    const base = phone.getBoundingClientRect();
    const k = scaleFactor();
    return [(rect.left + rect.width / 2 - base.left) / k, (rect.top + rect.height / 2 - base.top) / k];
  }
  function openApp(id, origin) {
    if (!unlocked || !appRoutes[id]) return;
    winAnim?.cancel();
    currentApp = id;
    route = id === 'vault' && vaultOpen ? 'invite' : appRoutes[id];
    stack = [];
    code = ''; hintOpen = false;
    win.innerHTML = '';
    win.removeAttribute('style');
    win.hidden = false;
    win.dataset.app = id;
    mount('none');
    homeEl.classList.add('home-behind');
    homeEl.inert = true;
    showCoach();
    if (reducedMotion) return;
    const [x, y] = originPoint(origin || homeEl.querySelector(`[data-app="${id}"]`));
    win.style.transformOrigin = `${x}px ${y}px`;
    winAnim = win.animate([
      { transform: 'scale(.16)', opacity: 0, borderRadius: '90px' },
      { opacity: 1, offset: .3 },
      { transform: 'scale(1)', opacity: 1, borderRadius: '0px' },
    ], { duration: 460, easing: 'cubic-bezier(.2,.85,.2,1)' });
  }
  function goHome() {
    if (!unlocked) { unlock(); return; }
    hideCoach();
    if (route === 'home') return;
    rememberScroll();
    const id = currentApp;
    route = 'home'; stack = []; currentApp = null;
    setChrome();
    homeEl.classList.remove('home-behind');
    homeEl.inert = false;
    winAnim?.cancel();
    const finish = () => { if (route !== 'home') return; win.hidden = true; win.innerHTML = ''; win.removeAttribute('style'); };
    if (reducedMotion) { finish(); return; }
    const [x, y] = originPoint(homeEl.querySelector(`[data-app="${id}"]`));
    win.style.transformOrigin = `${x}px ${y}px`;
    win.style.pointerEvents = 'none';
    winAnim = win.animate([{ transform: 'translateY(0) scale(.14)', opacity: 0, borderRadius: '90px' }], { duration: 380, easing: 'cubic-bezier(.3,.7,.2,1)', fill: 'forwards' });
    winAnim.onfinish = () => { winAnim.cancel(); finish(); };
  }
  function navigate(next, opts = {}) {
    if (!unlocked) return;
    if (route === 'home') { openApp(next, opts.origin); return; }
    if (next === route && !opts.force) return;
    if (opts.chat) activeChat = opts.chat;
    if (opts.note) activeNote = opts.note;
    if (Number.isInteger(opts.photo)) activePhoto = opts.photo;
    rememberScroll();
    if (!opts.replace) stack.push(route);
    route = next;
    mount(opts.replace ? 'fade' : 'push');
  }
  function goBack() {
    if (route === 'lock' || route === 'home') return;
    if (!parentRoute[route]) { goHome(); return; }
    route = stack.pop() || parentRoute[route];
    mount('pop');
  }

  /* ------------------------------------------------------------------ *
   * رمز الدخول
   * ------------------------------------------------------------------ */
  function paintDigits() {
    win.querySelectorAll('.digit-cell').forEach((el, i) => el.classList.toggle('filled', i < code.length));
  }
  function handleCode(value) {
    if (route !== 'vault') return;
    code = String(value).replace(/[^0-9]/g, '').slice(0, 4);
    paintDigits();
    if (code.length === 4) {
      clearTimeout(errorTimer);
      errorTimer = setTimeout(() => {
        if (route !== 'vault') return;
        if (code==='4298') {
          code = ''; fails = 0; vaultOpen = true;
          renderHomeBadges();
          navigate('invite', { replace: true });
          notify('مبروك! فتحت التطبيق 🔓');
          buzz([12, 40, 12]);
        } else {
          fails++;
          code = '';
          buzz([30, 40, 30]);
          const el = $('.digits', win);
          if (el) { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }
          paintDigits();
          const m = fails >= 3 ? 'شفت ملاحظة «حساباتي» في الملاحظات؟' : 'الرمز غير صحيح، حاول مرة ثانية';
          const error = $('#pass-error', win); if (error) error.textContent = m;
        }
      }, 250);
    }
  }
  function renderHomeBadges() {
    homeEl.querySelectorAll('[data-app="vault"] .lock-mini').forEach(el => el.remove());
  }
  function openOfficialLink(raw, kind) {
    if (typeof raw !== 'string' || !raw.trim()) {
      notify(kind === 'map' ? 'موقع المعرض ورابط الخريطة لم يُحدّدا في ملف الحملة.' : 'رابط التسجيل لم يُحدّد في ملف الحملة.');
      return;
    }
    try {
      const url = new URL(raw);
      if (url.protocol !== 'https:') throw Error('Invalid URL');
      window.open(url.href, '_blank', 'noopener,noreferrer');
    } catch { notify('الرابط غير صالح. عدّله في ملف config.js.'); }
  }

  /* ------------------------------------------------------------------ *
   * الأحداث
   * ------------------------------------------------------------------ */
  phone.addEventListener('click', (event) => {
    if (suppressClick) { suppressClick = false; event.preventDefault(); return; }
    const button = event.target.closest('[data-action]');
    if (!button || !phone.contains(button)) return;
    const action = button.dataset.action;
    switch (action) {
      case 'unlock': unlock(); break;
      case 'notif': {
        const app = button.dataset.open, chat = button.dataset.openChat;
        unlock(() => { if (route !== 'home') return; openApp(app); if (chat) navigate('chat', { chat }); });
        break;
      }
      case 'torch': { const on = button.getAttribute('aria-pressed') !== 'true'; button.setAttribute('aria-pressed', on); buzz(6); break; }
      case 'back': goBack(); break;
      case 'home': goHome(); break;
      case 'open-app': openApp(button.dataset.app, button.querySelector('.app-glyph')); break;
      case 'open-widget': openApp(button.dataset.target, button); break;
      case 'open-chat': navigate('chat', { chat: button.dataset.chat }); break;
      case 'open-note': navigate('note', { note: button.dataset.note }); break;
      case 'open-photo': navigate('photo', { photo: Number(button.dataset.photo) }); break;
      case 'jump-photo': photoTrackGo(Number(button.dataset.jump), true); break;
      case 'toggle-alarm': {
        alarmOn = !alarmOn;
        button.classList.toggle('on', alarmOn);
        button.setAttribute('aria-checked', alarmOn);
        button.closest('.alarm-card')?.classList.toggle('alarm-off', !alarmOn);
        buzz(6);
        break;
      }
      case 'toggle-balance': balanceHidden = !balanceHidden; { const sc = $('.bank-scroll', win), top = sc?.scrollTop || 0; mount('none'); const nsc = $('.bank-scroll', win); if (nsc) nsc.scrollTop = top; } break;
      case 'toggle-hint': {
        hintOpen = !hintOpen;
        const panel = $('.pass-hint', win);
        if (panel) panel.hidden = !hintOpen;
        button.setAttribute('aria-expanded', hintOpen);
        break;
      }
      case 'keypad': {
        const k = button.dataset.key;
        buzz(6);
        if (k === 'back') handleCode(code.slice(0, -1)); else if (code.length < 4) handleCode(code + k);
        break;
      }
      case 'register': openOfficialLink(config.registrationUrl, 'register'); break;
      case 'map': openOfficialLink(config.mapUrl, 'map'); break;
      case 'restart': relock(); break;
      case 'alert-close': closeBatteryAlert(); break;
      case 'battery-saver': lowPower = true; paintBattery(); closeBatteryAlert(); break;
    }
  });

  /* العنوان الكبير يتحول لعنوان صغير في الشريط عند التمرير، ومتابعة سحب الصور */
  win.addEventListener('scroll', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.id === 'pv-track') { photoTrackSync(); return; }
    if (target.classList.contains('scroll')) target.closest('.page')?.classList.toggle('scrolled', target.scrollTop > 34);
  }, true);

  /* سحب شاشة القفل للأعلى بالإصبع أو الماوس */
  let lockDrag = null;
  lockEl.addEventListener('pointerdown', (event) => {
    if (unlocked) return;
    lockDrag = { y: event.clientY, dy: 0, k: scaleFactor(), moved: false };
  });
  window.addEventListener('pointermove', (event) => {
    if (lockDrag) {
      lockDrag.dy = Math.min(0, (event.clientY - lockDrag.y) / lockDrag.k);
      if (lockDrag.dy < -6) { lockDrag.moved = true; lockEl.style.transform = `translateY(${lockDrag.dy}px)`; }
    }
    if (barDrag) {
      barDrag.dy = Math.min(0, (event.clientY - barDrag.y) / barDrag.k);
      if (barDrag.dy < -4 && route !== 'home' && unlocked) {
        barDrag.moved = true;
        const progress = Math.min(1, -barDrag.dy / 420);
        win.style.transformOrigin = '50% 100%';
        win.style.borderRadius = '38px';
        win.style.transform = `translateY(${barDrag.dy * .55}px) scale(${1 - progress * .5})`;
      }
    }
  });
  function endDrags() {
    if (lockDrag) {
      const d = lockDrag; lockDrag = null;
      if (d.moved) {
        suppressClick = true; setTimeout(() => { suppressClick = false; }, 60);
        if (d.dy < -110) unlock();
        else { lockEl.style.transition = 'transform .32s cubic-bezier(.2,.9,.25,1)'; lockEl.style.transform = ''; setTimeout(() => { lockEl.style.transition = ''; }, 340); }
      }
    }
    if (barDrag) {
      const d = barDrag; barDrag = null;
      if (d.moved) {
        suppressClick = true; setTimeout(() => { suppressClick = false; }, 60);
        if (d.dy < -60) goHome();
        else { win.style.transition = 'transform .3s cubic-bezier(.2,.9,.25,1), border-radius .3s'; win.style.transform = ''; win.style.borderRadius = ''; setTimeout(() => { win.style.transition = ''; }, 320); }
      }
    }
  }
  window.addEventListener('pointerup', endDrags);
  window.addEventListener('pointercancel', endDrags);

  /* سحب شريط الرئيسية للأعلى يصغّر التطبيق ويرجع للشاشة الرئيسية */
  let barDrag = null;
  homeBar.addEventListener('pointerdown', (event) => {
    barDrag = { y: event.clientY, dy: 0, k: scaleFactor(), moved: false };
  });

  document.addEventListener('keydown', (event) => {
    if (!alertEl.hidden) { if (event.key === 'Escape') { event.preventDefault(); closeBatteryAlert(); } return; }
    if (event.key === 'Escape' || (event.key === 'Backspace' && route !== 'vault')) { event.preventDefault(); goBack(); return; }
    if (route === 'vault') {
      if (/^[0-9]$/.test(event.key)) { event.preventDefault(); if (code.length < 4) handleCode(code + event.key); }
      if (event.key === 'Backspace') { event.preventDefault(); handleCode(code.slice(0, -1)); }
    }
    if (route === 'lock' && (event.key === 'Enter' || event.key === 'ArrowUp') && !event.target.closest?.('button')) { event.preventDefault(); unlock(); }
    if (route === 'photo' && event.key === 'ArrowLeft') { event.preventDefault(); stepPhoto(1); }
    if (route === 'photo' && event.key === 'ArrowRight') { event.preventDefault(); stepPhoto(-1); }
  });
  window.addEventListener('resize', fitDevice);

  window.INVESTVERSE_TEST = Object.freeze({
    getState: () => ({ route, code, fails, unlocked, vaultOpen, alarmOn, battery, lowPower, batteryAlert: !alertEl.hidden }),
    setBattery,
    getPhotos: () => photos.map(p => ({ title: p.title })),
    getChatCount: () => chats.length,
    getNoteCount: () => notes.length,
  });

  /* ------------------------------------------------------------------ *
   * التشغيل
   * ------------------------------------------------------------------ */
  fitDevice();
  renderLock();
  renderHome();
  homeEl.classList.add('home-waiting');
  setChrome();
  tick();
  startBattery();
  setInterval(tick, 1000);
})();
