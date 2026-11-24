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
    { id: 'wife', name: 'أم فهد ❤️', preview: 'الله يكتب اللي فيه الخير ❤️', avatar: 'أ', unread: 1, color: '#f4b8b0', ago: 11, gap: 2, seen: true },
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
      { who: 'them', text: 'الله يكتب اللي فيه الخير ❤️' },
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
  Object.assign(icons, {
    airplane: '<path fill="currentColor" stroke="none" d="M10.6 3.6c0-.9.6-1.6 1.4-1.6s1.4.7 1.4 1.6V9l7.6 4.6v1.9l-7.6-2.3v4.6l2.4 1.8v1.6L12 20.3l-3.8.9v-1.6l2.4-1.8v-4.6L3 15.5v-1.9L10.6 9V3.6Z"/>',
    wifi: '<path d="M2.5 9.2a14 14 0 0 1 19 0M5.6 12.6a9.4 9.4 0 0 1 12.8 0M8.8 16a4.8 4.8 0 0 1 6.4 0"/><circle cx="12" cy="19.2" r="1.1" fill="currentColor"/>',
    bluetooth: '<path d="m7 7.5 10 9-5 4.5V3l5 4.5-10 9"/>',
    link: '<path d="M9.5 14.5a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14.5 9.5a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    batteryIco: '<rect x="2.5" y="7.5" width="17" height="9" rx="2.6" fill="currentColor"/><path d="M21.6 10.6v2.8"/>',
    access: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="7.6" r="1.1" fill="currentColor"/><path d="M7.5 10.2h9M12 10.2v4.3M9.5 18l2.5-3.5 2.5 3.5"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5V5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/>',
    bell: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15l1.5-2ZM10 20.6a2 2 0 0 0 4 0"/>',
    speaker: '<path d="M4 9.5v5h3.5l5 4v-13l-5 4H4ZM16 9a4.5 4.5 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>',
    moon: '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z"/>',
    hourglass: '<path d="M7 3h10M7 21h10M8 3v4l4 5-4 5v4M16 3v4l-4 5 4 5v4"/>',
    star: '<path d="m12 3 2.7 5.7 6.3.8-4.6 4.3 1.2 6.2L12 17l-5.6 3 1.2-6.2L3 9.5l6.3-.8L12 3Z"/>',
    person: '<circle cx="12" cy="8.5" r="3.6"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>',
    keypad: '<g fill="currentColor" stroke="none"><circle cx="6" cy="6" r="1.9"/><circle cx="12" cy="6" r="1.9"/><circle cx="18" cy="6" r="1.9"/><circle cx="6" cy="12" r="1.9"/><circle cx="12" cy="12" r="1.9"/><circle cx="18" cy="12" r="1.9"/><circle cx="6" cy="18" r="1.9"/><circle cx="12" cy="18" r="1.9"/><circle cx="18" cy="18" r="1.9"/></g>',
    voicemail: '<circle cx="6.5" cy="12" r="3.8"/><circle cx="17.5" cy="12" r="3.8"/><path d="M6.5 15.8h11"/>',
    clockIco: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5H8.5"/>',
    arrowOut: '<path d="M7 17 17 7M9 7h8v8"/>',
    arrowIn: '<path d="M17 7 7 17M7 9v8h8"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    filter: '<path d="M4 7h16M7 12h10M10 17h4"/>',
    tag: '<path d="M3.5 12.5v-8h8l9 9-8 8-9-9Z"/><circle cx="8" cy="9" r="1.2" fill="currentColor"/>',
    inbox: '<path d="M3.5 13.5 6 5h12l2.5 8.5V19h-17v-5.5Zm0 0H9a3 3 0 0 0 6 0h5.5"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2.6"/><path d="m3.6 7.2 8.4 6.3 8.4-6.3"/>',
    pencil: '<path d="m4 20 1-4.5L16.5 4 20 7.5 8.5 19 4 20Z"/>',
    today: '<rect x="5" y="3" width="14" height="18" rx="3"/><path d="M8.5 8h7M8.5 12h7"/>',
    rocket: '<path d="M12 3c4 2 6 6 5 11l-2.5 2h-5L7 14C6 9 8 5 12 3Zm-2.5 13L8 20.5M14.5 16l1.5 4.5"/><circle cx="12" cy="9.5" r="1.8"/>',
    layers: '<path d="m12 4 9 4.5-9 4.5-9-4.5L12 4Zm-9 8.5 9 4.5 9-4.5M3 16.5 12 21l9-4.5"/>',
    joystick: '<circle cx="12" cy="6" r="2.5"/><path d="M12 8.5v6M4 15l8-3.5 8 3.5-8 4-8-4Z"/>',
    book: '<path d="M4 5.5c3-1.5 5.5-1.5 8 0v14c-2.5-1.5-5-1.5-8 0v-14Zm8 0c2.5-1.5 5-1.5 8 0v14c-3-1.5-5.5-1.5-8 0"/>',
    tabsIco: '<rect x="4" y="8" width="12" height="12" rx="2.6"/><path d="M8 8V6.5A2.5 2.5 0 0 1 10.5 4h7A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H16"/>',
    flip: '<path d="M4 9a8 8 0 0 1 14.5-2.5M20 15a8 8 0 0 1-14.5 2.5M18.5 3v4h-4M5.5 21v-4h4"/>',
    bolt: '<path d="M13 2.5 5 13.5h6l-1 8 8-11h-6l1-8Z"/>',
    archive: '<rect x="3" y="4.5" width="18" height="4.5" rx="1.2"/><path d="M5 9v9.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9M10 13h4"/>',
  });
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
  Object.assign(appArt, {
    camera: '<svg viewBox="0 0 60 60" aria-hidden="true"><path fill="#2b2b2e" d="M14 22.5a4 4 0 0 1 4-4h5l2.2-3.3a2.5 2.5 0 0 1 2-1.2h5.6a2.5 2.5 0 0 1 2 1.200L37 18.5h5a4 4 0 0 1 4 4V41a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4V22.5Z"/><circle cx="30" cy="31.5" r="8.4" fill="#d9d9de"/><circle cx="30" cy="31.5" r="5.6" fill="#2b2b2e"/><circle cx="41" cy="23.5" r="1.5" fill="#ffcc00"/></svg>'.replace('1.200L', '1.2L'),
    settings: '<svg viewBox="0 0 60 60" aria-hidden="true"><g fill="none" stroke="#e9e9ee" stroke-linecap="round"><circle cx="30" cy="30" r="14.5" stroke-width="3.4"/><circle cx="30" cy="30" r="5.2" stroke-width="3"/><path stroke-width="4.4" d="M30 9.5v5M30 45.5v5M9.5 30h5M45.5 30h5M15.5 15.5l3.6 3.6M40.900 40.900l3.6 3.6M15.5 44.500l3.6-3.6M40.900 19.100l3.6-3.6"/></g></svg>'.replace(/\.(\d)00/g, '.$1'),
    appstore: '<svg viewBox="0 0 60 60" aria-hidden="true"><g fill="none" stroke="#fff" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"><path d="M17 24h26l-2 21a3 3 0 0 1-3 2.700H22a3 3 0 0 1-3-2.700L17 24Z"/><path d="M23.5 24v-3.500a6.500 6.500 0 0 1 13 0V24"/><path d="M30 30v9.500m-4.200-4 4.200 4 4.200-4"/></g></svg>'.replace(/\.(\d)00/g, '.$1'),
    phone: '<svg viewBox="0 0 60 60" aria-hidden="true"><g transform="translate(9.6 9.2) scale(1.7)" fill="#fff" stroke="#fff" stroke-width="1.3" stroke-linejoin="round"><path d="M6.5 3.5h3l1.5 4.5-2 1.5a11 11 0 0 0 5.5 5.5l1.5-2 4.5 1.5v3a2 2 0 0 1-2 2A15.5 15.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2Z"/></g></svg>',
    safari: '<svg viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="30" r="20" fill="#1a8cff"/><g fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"><path d="M10.500 30h39M30 10.500c7.500 6.500 7.500 32.500 0 39M30 10.500c-7.500 6.500-7.500 32.500 0 39M13.500 20.500h33M13.500 39.500h33"/></g></svg>'.replace(/\.(\d)00/g, '.$1'),
    gmail: '<svg viewBox="0 0 60 60" aria-hidden="true"><rect x="11" y="17" width="38" height="27" rx="4.500" fill="#fff" stroke="#e5484d" stroke-width="3.6"/><path d="m13.500 21 16.500 12.500L46.500 21" fill="none" stroke="#e5484d" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'.replace(/\.(\d)00/g, '.$1'),
  });
  function iconArt(id) {
    if (id === 'vault') return '<img src="assets/investverse-icon.png" alt="" draggable="false"/>';
    if (id === 'calendar') { const d = new Date(); return `<span class="cal-ico"><i>${DAYS[d.getDay()]}</i><b>${ar(d.getDate())}</b></span>`; }
    return appArt[id] || '';
  }

  /* صفحتان للشاشة الرئيسية + الـDock الثابت */
  const appIcons = [
    { id: 'calendar', title: 'التقويم', where: 'p1' },
    { id: 'alarm', title: 'الساعة', where: 'p1' },
    { id: 'notes', title: 'الملاحظات', where: 'p1' },
    { id: 'appstore', title: 'App Store', where: 'p1' },
    { id: 'settings', title: 'الإعدادات', where: 'p1' },
    { id: 'whatsapp', title: 'واتساب', where: 'p2', badge: 4 },
    { id: 'gmail', title: 'Gmail', where: 'p2', badge: 3 },
    { id: 'vault', title: 'INVESTVERSE', where: 'p2', locked: true },
    { id: 'music', title: 'الأغاني', where: 'p2' },
    { id: 'bank', title: 'بنك إثمار', where: 'p2' },
    { id: 'phone', title: 'الهاتف', where: 'dock', badge: 2 },
    { id: 'safari', title: 'Safari', where: 'dock' },
    { id: 'camera', title: 'الكاميرا', where: 'dock' },
    { id: 'photos', title: 'الصور', where: 'dock' },
  ];
  const appRoutes = { whatsapp: 'whatsapp', bank: 'bank', alarm: 'alarm', notes: 'notes', photos: 'photos', music: 'music', vault: 'vault', calendar: 'calendar', settings: 'settings', appstore: 'appstore', gmail: 'gmail', phone: 'phone', safari: 'safari', camera: 'camera' };
  const parentRoute = { chat: 'whatsapp', note: 'notes', photo: 'photos', mailmsg: 'gmail' };

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
    phone.dataset.bar = route === 'invite' ? 'dark' : 'light';
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
  function notify(text, title = 'INVESTVERSE', app = 'vault') {
    clearTimeout(toastTimer);
    toastElement.innerHTML = `${miniIcon(app)}<div><b>${esc(title)}</b><span>${esc(text)}</span></div>`;
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
    document.querySelectorAll('.js-battery').forEach(el => { el.textContent = `${ar(battery)}٪`; });
    const ring = $('.bat-ring', homeEl);
    if (ring) { ring.style.setProperty('--p', battery); ring.dataset.state = batteryEl.dataset.state; }
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
    return `<span class="mini-icon icon-${id}">${iconArt(id)}</span>`;
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
        <button type="button" class="notif-card" data-action="notif" data-open="whatsapp" data-open-chat="wife">${miniIcon('whatsapp')}<span class="notif-copy"><b>أم فهد ❤️</b><span>الله يكتب اللي فيه الخير ❤️</span></span><time>${wifeTime}</time></button>
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
    callsFilter = 'all'; airplane = false; delete phone.dataset.air;
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
    const art = iconArt(app.id);
    return `<button class="app-tile" type="button" data-action="open-app" data-app="${app.id}" aria-label="${esc(app.title)}${locked ? '، مقفول' : ''}">
      <span class="app-glyph icon-${app.id}">${art}${app.badge ? `<span class="app-badge">${ar(app.badge)}</span>` : ''}${locked ? `<span class="lock-mini">${svg('lock', 11, 'stroke-width="2.4"')}</span>` : ''}</span>
      ${withLabel ? `<span class="app-name" dir="auto">${esc(app.title)}</span>` : ''}</button>`;
  }
  function renderHome() {
    const grid = where => appIcons.filter(a => a.where === where).map(a => iconTile(a, true)).join('');
    homeEl.innerHTML = `
      <div class="home-pager" id="home-pager">
        <section class="home-page" aria-label="الصفحة الأولى">
          <div class="widgets">
            <div class="widget-slot"><div class="widget widget-battery"><span class="bat-ring" style="--p:${battery}" data-state="normal"><span>${svg('batteryIco', 26)}</span></span><b class="js-battery">${ar(battery)}٪</b></div><span class="widget-name">البطاريات</span></div>
            <div class="widget-slot"><button type="button" class="widget widget-photo" data-action="open-widget" data-target="photos" aria-label="ودجت الصور: جلسة بر"><img src="${photo('desert-camp.webp')}" alt="" draggable="false"/><span class="widget-photo-text"><b>جلسة بر</b><small>${dayMonth(photos[2].date)}</small></span></button><span class="widget-name">الصور</span></div>
          </div>
          <div class="home-apps">${grid('p1')}</div>
        </section>
        <section class="home-page" aria-label="الصفحة الثانية">
          <div class="home-apps">${grid('p2')}</div>
        </section>
      </div>
      <button type="button" class="home-dots" data-action="home-dots" aria-label="تبديل صفحة الشاشة الرئيسية"><i class="on"></i><i></i></button>
      <div class="home-dock">${appIcons.filter(a => a.where === 'dock').map(a => iconTile(a, false)).join('')}</div>`;
    paintBattery();
  }
  function homePageIndex() {
    const pager = $('#home-pager', homeEl);
    return pager && pager.clientWidth ? Math.round(Math.abs(pager.scrollLeft) / pager.clientWidth) : 0;
  }
  function goHomePage(index, smooth = true) {
    const pager = $('#home-pager', homeEl);
    if (!pager) return;
    const n = Math.max(0, Math.min(1, index));
    pager.scrollTo({ left: -n * pager.clientWidth, behavior: smooth && !reducedMotion ? 'smooth' : 'auto' });
    paintHomeDots(n);
  }
  function paintHomeDots(n = homePageIndex()) {
    homeEl.querySelectorAll('.home-dots i').forEach((dot, i) => dot.classList.toggle('on', i === n));
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

  /* ---------------------------- الهاتف ---------------------------- */
  let callsFilter = 'all';
  const calls = [
    { name: 'أم فهد ❤️', chat: 'wife', type: 'جوال', dir: 'in', missed: true, count: 3, when: minutesAgo(17) },
    { name: 'الوالدة', avatar: 'و', color: '#e3c7a8', type: 'جوال', dir: 'in', missed: true, when: minutesAgo(48) },
    { name: 'أبو سعد', chat: 'friend', type: 'واتساب صوتي', dir: 'out', when: minutesAgo(95) },
    { name: 'الوالد', avatar: 'و', color: '#b9c4d6', type: 'جوال', dir: 'out', count: 2, when: daysAgo(1, 20, 10) },
    { name: 'خالتي موضي 🌸', chat: 'aunt', type: 'واتساب صوتي', dir: 'in', when: daysAgo(1, 18, 2) },
    { name: 'الوالدة', avatar: 'و', color: '#e3c7a8', type: 'جوال', dir: 'out', when: daysAgo(1, 13, 30) },
    { name: 'نورة | الموارد البشرية', chat: 'hr', type: 'عمل', dir: 'in', when: daysAgo(3, 10, 25) },
    { name: '+٤٤٧٩…', chat: 'scam', type: 'المملكة المتحدة', dir: 'in', missed: true, when: daysAgo(4, 15, 44) },
    { name: 'بو عبدالله', chat: 'old', type: 'جوال', dir: 'out', when: daysAgo(9, 21, 5) },
  ];
  function callRows() {
    return calls.filter(c => callsFilter === 'all' || c.missed).map(c => {
      const who = chats.find(x => x.id === c.chat) || c;
      const stamp = sameDay(c.when, NOW) ? clock(c.when) : relativeDay(c.when);
      return `<div class="call-row"><span class="chat-avatar" style="background:${who.color}">${esc(who.avatar)}</span><span class="call-copy"><strong class="${c.missed ? 'is-missed' : ''}">${esc(c.name)}</strong><small>${svg(c.dir === 'out' ? 'arrowOut' : 'arrowIn', 13, 'stroke-width="2.4"')} ${esc(c.type)}${c.count ? ` (${ar(c.count)})` : ''}</small></span><time>${stamp}</time><span class="call-info" aria-hidden="true">i</span></div>`;
    }).join('');
  }
  function renderPhone() {
    const seg = (id, label) => `<button type="button" data-action="calls-filter" data-filter="${id}" class="${callsFilter === id ? 'on' : ''}" aria-pressed="${callsFilter === id}">${label}</button>`;
    return `<header class="nav"><div class="nav-row glass-row"><span class="glass-pill">تعديل</span><div class="segmented">${seg('all', 'الكل')}${seg('missed', 'الفائتة')}</div><span class="glass-round">${svg('filter', 20, 'stroke-width="2.2"')}</span></div></header>
      <div class="scroll"><h1 class="large-title">الحديثة</h1><div class="call-list" id="call-list">${callRows()}</div></div>
      ${tabbar([['star', 'المفضلة'], ['clockIco', 'الحديثة', true], ['person', 'جهات الاتصال'], ['keypad', 'لوحة المفاتيح'], ['voicemail', 'البريد الصوتي']])}`;
  }

  /* ---------------------------- الإعدادات ---------------------------- */
  let airplane = false;
  const chev = () => `<span class="set-chev">${svg('chevronSmall', 18, 'stroke-width="2.4"')}</span>`;
  function setRow(icon, color, label, value = '', control = '') {
    return `<div class="set-row"><span class="set-ico" style="color:${color}">${svg(icon, 21, 'stroke-width="2"')}</span><span class="set-label">${label}</span>${value ? `<span class="set-value">${value}</span>` : ''}${control || chev()}</div>`;
  }
  function renderSettings() {
    return `<header class="nav"><div class="nav-row"><span class="nav-text"></span><span class="nav-title">الإعدادات</span><span class="nav-text"></span></div></header>
      <div class="scroll set-scroll">
        <h1 class="large-title">الإعدادات</h1>
        <div class="set-group">
          <div class="set-profile"><span class="set-avatar">أ</span><span class="set-profile-copy"><strong>أبو فهد</strong><small>حساب Apple، iCloud+ والمزيد</small></span>${chev()}</div>
          <div class="set-row set-plain"><span class="set-label">iCloud</span><span class="set-value" dir="ltr">abufahad@gmail.com</span>${chev()}</div>
        </div>
        <div class="set-group">
          ${setRow('airplane', '#ff9f0a', 'نمط الطيران', '', `<button type="button" class="toggle-switch ${airplane ? 'on' : ''}" data-action="toggle-airplane" role="switch" aria-checked="${airplane}" aria-label="نمط الطيران"><span></span></button>`)}
          ${setRow('wifi', '#0a84ff', 'Wi-Fi', 'بيت أبو فهد')}
          ${setRow('bluetooth', '#0a84ff', 'Bluetooth', 'مشغّل')}
          ${setRow('radio', '#30d158', 'الشبكة الخلوية')}
          ${setRow('link', '#30d158', 'نقطة الاتصال الشخصية')}
          ${setRow('batteryIco', '#30d158', 'البطارية', `<span class="js-battery">${ar(battery)}٪</span>`)}
        </div>
        <div class="set-group">
          ${setRow('gear', '#aeaeb2', 'عام')}
          ${setRow('access', '#0a84ff', 'تسهيلات الاستخدام')}
          ${setRow('sun', '#0a84ff', 'شاشة العرض والإضاءة')}
          ${setRow('photoLib', '#64d2ff', 'خلفية الشاشة')}
          ${setRow('bell', '#ff453a', 'الإشعارات')}
          ${setRow('speaker', '#ff375f', 'الأصوات والحس اللمسي')}
          ${setRow('moon', '#5e5ce6', 'التركيز')}
          ${setRow('hourglass', '#5e5ce6', 'مدة استخدام الجهاز')}
        </div>
      </div>
      <div class="float-search" aria-hidden="true">${svg('search', 19, 'stroke-width="2.2"')}<span>بحث</span>${svg('mic', 19)}</div>`;
  }

  /* ---------------------------- التقويم ---------------------------- */
  let hijriDayFmt = null, hijriMonthFmt = null;
  try {
    hijriDayFmt = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { day: 'numeric' });
    hijriMonthFmt = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { month: 'long' });
  } catch { /* التقويم الهجري غير مدعوم في هذا المتصفح */ }
  function hijri(date) {
    if (!hijriDayFmt) return { text: '' };
    const day = parseInt(hijriDayFmt.format(date), 10);
    if (!day) return { text: '' };
    return day === 1 ? { text: hijriMonthFmt.format(date), first: true } : { text: ar(day) };
  }
  function calendarEvents() {
    const events = {};
    const add = (date, color, text) => { (events[date.toDateString()] = events[date.toDateString()] || []).push({ color, text }); };
    const next = dow => { const x = new Date(NOW); x.setDate(x.getDate() + ((dow - x.getDay() + 7) % 7)); return x; };
    let expo = new Date(NOW.getFullYear(), 11, 1);
    if (expo < daysAgo(1)) expo = new Date(NOW.getFullYear() + 1, 11, 1);
    add(next(4), '#ff9f0a', 'عشا عند أهل أم فهد، الساعة ٩:٠٠ م');
    add(next(6), '#0a84ff', 'غسيل السيارة');
    add(expo, '#30d158', 'معرض INVESTVERSE، ريفر ووك، ٦:٠٠ – ١٠:٠٠ م');
    add(lastFriday(), '#ff9f0a', 'كبسة الجمعة مع العائلة');
    add(daysAgo(6), '#0a84ff', 'استلام سبائك الذهب');
    add(daysAgo(17), '#0a84ff', 'اجتماع أولياء الأمور في مدرسة فهد');
    return events;
  }
  function monthBlock(year, month, events, current) {
    const first = new Date(year, month, 1);
    const count = new Date(year, month + 1, 0).getDate();
    let cells = '';
    for (let d = 1; d <= count; d++) {
      const date = new Date(year, month, d);
      const list = events[date.toDateString()] || [];
      const hj = hijri(date);
      const cls = `cal-cell ${sameDay(date, NOW) ? 'is-today' : ''} ${date.getDay() >= 5 ? 'is-weekend' : ''}`;
      const inner = `<span class="cal-n"><b>${ar(d)}</b><small class="${hj.first ? 'hj-first' : ''}">${hj.text}</small></span><span class="cal-dots">${list.map(e => `<i style="background:${e.color}"></i>`).join('')}</span>`;
      const pos = d === 1 ? ` style="grid-column:${first.getDay() + 1}"` : '';
      cells += list.length
        ? `<button type="button" class="${cls}"${pos} data-action="cal-day" data-day="${date.toDateString()}" aria-label="${fullDate(date)}: ${esc(list.map(e => e.text).join('، '))}">${inner}</button>`
        : `<span class="${cls}"${pos}>${inner}</span>`;
    }
    return `<section class="cal-month"><h2 class="cal-month-label ${current ? 'is-current' : ''}" style="grid-column:${first.getDay() + 1} / -1">${MONTHS[month]}</h2>${cells}</section>`;
  }
  function renderCalendar() {
    const y = NOW.getFullYear(), m = NOW.getMonth();
    const events = calendarEvents();
    const nextMonth = new Date(y, m + 1, 1);
    return `<header class="nav cal-nav"><div class="nav-row glass-row"><span class="glass-round">${svg('chevron', 22, 'stroke-width="2.4"')}</span><span class="cal-head"><b>${MONTHS[m]}</b> ${ar(y)}</span><span class="glass-round">${svg('menu', 20, 'stroke-width="2.2"')}</span></div><div class="cal-week" aria-hidden="true">${['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'].map((d, i) => `<span class="${i >= 5 ? 'is-weekend' : ''}">${d}</span>`).join('')}</div></header>
      <div class="scroll cal-scroll">${monthBlock(y, m, events, true)}${monthBlock(nextMonth.getFullYear(), nextMonth.getMonth(), events, false)}</div>
      <div class="cal-float" aria-hidden="true"><span class="cal-today"><small>${DAYS[NOW.getDay()]}</small><b>${ar(NOW.getDate())}</b></span><span class="cal-tools">${svg('calendar', 23)}${svg('inbox', 23)}${svg('search', 23)}</span><span class="glass-round glass-big">${svg('plus', 26)}</span></div>`;
  }

  /* ---------------------------- App Store ---------------------------- */
  const storeApps = [
    { name: 'Sahm - لتداول الأسهم', sub: 'Sahm Capital Financial Company', letter: 'S' },
    { name: 'Al Rajhi Tadawul - Mobile', sub: 'Al Rajhi Capital', letter: 'R' },
    { name: 'Saudi Exchange', sub: 'Saudi Stock Exchange (Tadawul)', letter: 'T' },
    { name: 'Argaam ON - أرقام أون', sub: 'أخبار وتقارير سوق تداول الأسهم', letter: 'A' },
    { name: 'TickerChart Live for iPhone', sub: 'المالية', letter: 'T' },
  ];
  function renderAppstore() {
    return `<div class="scroll store-scroll">
        <div class="store-head"><div><small>${fullDate(new Date())}</small><h1>اليوم</h1></div><span class="store-avatar">أ</span></div>
        <article class="store-card store-feature">
          <svg class="store-art" viewBox="0 0 340 250" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="store-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6CB579" stop-opacity=".55"/><stop offset="1" stop-color="#6CB579" stop-opacity="0"/></linearGradient></defs><path d="M0 190 40 168 78 182 120 132 158 150 205 92 246 112 290 52 340 70V250H0Z" fill="url(#store-fill)"/><path d="M0 190 40 168 78 182 120 132 158 150 205 92 246 112 290 52 340 70" fill="none" stroke="#8fe0a0" stroke-width="3.5" stroke-linejoin="round"/><circle cx="290" cy="52" r="7" fill="#fff"/></svg>
          <div class="store-feature-copy"><small>حدث قريب</small><h2>سرّ الصفقة الرابحة ينكشف في المعرض</h2></div>
          <div class="store-app-row">${miniIcon('vault')}<span class="store-app-copy"><strong>INVESTVERSE</strong><small>إثمار .. سهمك الرابح</small></span><button type="button" class="store-get" data-action="store-open">فتح</button></div>
        </article>
        <article class="store-card store-list">
          <h2>تطبيقات الأسهم والاستثمار</h2>
          ${storeApps.map(a => `<div class="store-app-row"><span class="store-tile">${a.letter}</span><span class="store-app-copy"><strong dir="auto">${esc(a.name)}</strong><small dir="auto">${esc(a.sub)}</small></span><button type="button" class="store-get" data-action="get-app" aria-label="الحصول على ${esc(a.name)}">الحصول على</button></div>`).join('')}
        </article>
      </div>
      ${tabbar([['today', 'اليوم', true], ['rocket', 'الألعاب'], ['layers', 'التطبيقات'], ['joystick', 'Arcade'], ['search', 'بحث']])}`;
  }

  /* ---------------------------- Safari ---------------------------- */
  function renderSafari() {
    const favs = [['📈', 'أخبار السوق'], ['🥇', 'أسعار الذهب'], ['🧮', 'حاسبة الأرباح'], ['🏢', 'صناديق الريت'], ['⚽', 'نتائج المباريات'], ['⛅', 'طقس الرياض'], ['🚗', 'تجديد الاستمارة'], ['🍚', 'وصفات كبسة']];
    const reading = [['الفرق بين الاستثمار والمضاربة', 'مقال، ٦ دقائق قراءة'], ['كيف تقرأ القوائم المالية بدون ما تكون محاسب', 'مقال، ٩ دقائق قراءة'], ['١٠ علامات تدل إن «التوصية المضمونة» احتيال', 'مقال، ٤ دقائق قراءة']];
    const searches = ['هل السبائك أفضل من ذهب الزينة', 'وش يعني صندوق ريت', 'توزيعات أرباح الأسهم متى تنزل', 'كيف أعرف إن قروب التوصيات نصّاب', 'معرض INVESTVERSE'];
    return `<div class="scroll safari-scroll">
        <h2 class="saf-h">المفضلة</h2>
        <div class="saf-favs">${favs.map(([emoji, label]) => `<span class="saf-fav"><i>${emoji}</i><small>${label}</small></span>`).join('')}</div>
        <h2 class="saf-h">قائمة القراءة</h2>
        <div class="saf-card">${reading.map(([title, meta]) => `<div class="saf-row"><span class="saf-row-ico">${svg('book', 20)}</span><span><strong>${title}</strong><small>${meta}</small></span></div>`).join('')}</div>
        <h2 class="saf-h">عمليات البحث الأخيرة</h2>
        <div class="saf-card">${searches.map(q => `<div class="saf-row saf-search">${svg('search', 17, 'stroke-width="2.2"')}<span>${q}</span></div>`).join('')}</div>
      </div>
      <div class="saf-bar" aria-hidden="true"><div class="saf-url">${svg('search', 17, 'stroke-width="2.2"')}<span>ابحث أو أدخل اسم موقع</span>${svg('mic', 18)}</div><div class="saf-tools">${svg('chevron', 24)}${svg('chevronSmall', 24)}${svg('share', 23)}${svg('book', 23)}${svg('tabsIco', 23)}</div></div>`;
  }

  /* ---------------------------- الكاميرا ---------------------------- */
  function renderCamera() {
    return `<div class="cam-top" aria-hidden="true"><span class="glass-round">${svg('bolt', 19)}</span><span class="glass-round">${svg('more', 21)}</span></div>
      <div class="cam-view"><img src="${photo('riyadh-traffic.webp')}" alt="معاينة الكاميرا" draggable="false"/><div class="cam-zoom" aria-hidden="true"><span>٫٥</span><span class="on">١×</span><span>٢</span></div><div class="cam-flash" id="cam-flash"></div></div>
      <div class="cam-modes" aria-hidden="true"><span>فيديو</span><span class="on">صورة</span><span>بورتريه</span></div>
      <div class="cam-controls"><button type="button" class="cam-thumb" data-action="cam-thumb" aria-label="فتح الصور"><img src="${photo('investverse-gate.webp')}" alt="" draggable="false"/></button><button type="button" class="cam-shutter" data-action="shutter" aria-label="التقاط صورة"><span></span></button><span class="glass-round glass-big" aria-hidden="true">${svg('flip', 24)}</span></div>`;
  }

  /* ---------------------------- Gmail ---------------------------- */
  let activeMail = 'dividend';
  const mails = [
    { id: 'dividend', from: 'بنك إثمار', avatar: 'ب', color: '#205D3B', subject: 'تم إيداع توزيعات أرباح', snippet: 'تم إيداع مبلغ 12,400 ر.س في حسابك الجاري', date: minutesAgo(26), unread: true,
      body: ['عزيزنا أبو فهد،', 'تم إيداع مبلغ 12,400 ر.س في حسابك الجاري المنتهي بـ ٧٧١٠.', 'البيان: توزيعات أرباح أسهم.', 'هذه رسالة آلية، نرجو عدم الرد عليها.'] },
    { id: 'reit', from: 'صندوق ريت الواحة', avatar: 'ص', color: '#3b6ea8', subject: 'إشعار توزيع نقدي دوري', snippet: 'تم إيداع توزيعات الصندوق: 8,750 ر.س', date: daysAgo(1, 10, 2), unread: true,
      body: ['السادة مالكي الوحدات،', 'نفيدكم بإيداع التوزيع النقدي الدوري لوحداتكم في الصندوق.', 'المبلغ المودع: 8,750 ر.س', 'هذا دخل إيجاري من عقارات الصندوق، يوزَّع على مالكي الوحدات بحسب عدد وحداتهم.'] },
    { id: 'ad-falcon', from: 'توصيات الصقر VIP', avatar: '🚀', color: '#5b3d8a', subject: '🚀 سهم بيطير ٣٠٠٪ هذا الأسبوع!!', snippet: 'آخر فرصة! اشترك بـ٩٩ ريال وتوصياتنا مضمونة ١٠٠٪', date: daysAgo(1, 22, 40), unread: true, ad: true,
      body: ['لا تفوّت الفرصة!!', 'اشترك الآن في قروب VIP بـ٩٩ ريال فقط واحصل على توصيات مضمونة ١٠٠٪.', 'العدد محدود، حوّل الآن وأرسل الإيصال على الخاص.'] },
    { id: 'expo', from: 'INVESTVERSE', avatar: 'I', color: '#205D3B', subject: 'دعوتك لمعرض INVESTVERSE', snippet: 'ننتظرك في المعرض، والتفاصيل داخل التطبيق', date: daysAgo(2, 12, 0), starred: true,
      body: ['أهلًا أبو فهد،', 'تم تأكيد دعوتك لمعرض INVESTVERSE.', 'تفاصيل الموعد والمكان تلقاها داخل تطبيق INVESTVERSE في جوالك.', 'إثمار .. سهمك الرابح'] },
    { id: 'weekly', from: 'نشرة السوق الأسبوعية', avatar: 'ن', color: '#8a5a2b', subject: 'ملخص الأسبوع: المؤشر والقطاعات وأبرز الإعلانات', snippet: 'حركة المؤشر، إعلانات التوزيعات القادمة، وكيف تقرأ القوائم', date: daysAgo(3, 7, 30),
      body: ['أبرز ما في هذا العدد:', '• حركة المؤشر العام خلال الأسبوع', '• إعلانات توزيعات الأرباح القادمة', '• كيف تقرأ القوائم المالية في ٥ دقائق'] },
    { id: 'fund', from: 'صندوق المدى الاستثماري', avatar: 'م', color: '#2f7d6b', subject: 'كشف العائد الشهري', snippet: 'العائد الموزّع لهذا الشهر: 15,200 ر.س', date: daysAgo(3, 9, 30),
      body: ['عميلنا العزيز،', 'مرفق لكم كشف العائد الشهري لاستثماركم في الصندوق.', 'العائد الموزّع لهذا الشهر: 15,200 ر.س', 'الأداء السابق لا يضمن الأداء المستقبلي.'] },
    { id: 'ad-fast', from: 'أرباح سريعة 💰', avatar: '💰', color: '#8a3d3d', subject: 'ضاعف راتبك وأنت في بيتك', snippet: 'بدون خبرة وبدون مخاطرة! سجّل الآن', date: daysAgo(4, 3, 12), ad: true,
      body: ['بدون خبرة، بدون مخاطرة، أرباح يومية!', 'سجّل بياناتك ورقم بطاقتك وابدأ الربح من اليوم.'] },
    { id: 'gold', from: 'سبائك الرياض', avatar: 'س', color: '#a8862b', subject: 'تأكيد طلب: سبائك ذهب', snippet: 'تم تنفيذ طلبك بقيمة 45,000 ر.س', date: daysAgo(6, 13, 44),
      body: ['شكرًا لطلبك يا أبو فهد،', 'تم تنفيذ طلب شراء سبائك ذهب بقيمة 45,000 ر.س.', 'السبائك تُشترى للاستثمار، وما فيها مصنعية مثل ذهب الزينة.'] },
    { id: 'issuer', from: 'إعلانات الشركات المدرجة', avatar: 'إ', color: '#4B4A4A', subject: 'إعلان توزيع أرباح نقدية على المساهمين', snippet: 'شركة الروابي القابضة تعلن تاريخ الأحقية وموعد التوزيع', date: daysAgo(7, 16, 0),
      body: ['تعلن شركة الروابي القابضة عن توزيع أرباح نقدية على المساهمين عن النصف الثاني.', 'الأحقية للمساهمين المالكين للأسهم بنهاية تداول يوم الاستحقاق.', 'يتم الإيداع في الحسابات المرتبطة بالمحافظ الاستثمارية.'] },
  ];
  const mailStamp = date => (sameDay(date, NOW) ? clock(date) : dayMonth(date));
  function renderGmail() {
    const ads = mails.filter(m => m.ad);
    return `<header class="nav mail-nav"><div class="mail-search">${svg('menu', 22, 'stroke-width="2"')}<span>البحث في البريد</span><span class="mail-me">أ</span></div></header>
      <div class="scroll mail-scroll">
        <p class="mail-label">البريد الوارد</p>
        <div class="mail-row mail-bundle"><span class="mail-bundle-ico" style="color:#30d158">${svg('tag', 26)}</span><span class="mail-copy"><strong>كل العروض الترويجية</strong><small>${esc(ads[0].from)}: ${esc(ads[0].subject)}</small></span><span class="mail-chip" style="color:#30d158;background:rgba(48,209,88,.16)">${ar(ads.length)} جديدة</span></div>
        ${mails.map(m => `<button type="button" class="mail-row ${m.unread ? 'is-unread' : ''}" data-action="open-mail" data-mail="${m.id}"><span class="mail-avatar" style="background:${m.color}">${esc(m.avatar)}</span><span class="mail-copy"><span class="mail-top"><strong>${esc(m.from)}</strong><time>${mailStamp(m.date)}</time>${m.unread ? '<i class="mail-dot"></i>' : ''}</span><b>${m.ad ? '<em class="mail-ad">إعلان</em> ' : ''}${esc(m.subject)}</b><small>${esc(m.snippet)}</small></span><span class="mail-star ${m.starred ? 'on' : ''}">${svg('star', 20, m.starred ? 'fill="currentColor"' : '')}</span></button>`).join('')}
      </div>
      <span class="mail-compose" aria-hidden="true">${svg('pencil', 20)} إنشاء</span>
      <div class="mail-bar" aria-hidden="true"><span class="mail-tab on">${svg('mail', 24, 'fill="currentColor" stroke="#16233f"')}<i>${ar(mails.filter(m => m.unread).length)}</i></span><span class="mail-tab">${svg('video', 25)}</span></div>`;
  }
  function renderMailMsg() {
    const m = mails.find(x => x.id === activeMail) || mails[0];
    return `<header class="nav"><div class="nav-row">${backButton()}<span class="nav-actions">${svg('archive', 22)}${svg('trash', 22)}${svg('mail', 22)}</span></div></header>
      <article class="scroll mail-open">
        <h1>${esc(m.subject)} <span class="mail-inbox-chip">البريد الوارد</span></h1>
        <div class="mail-sender"><span class="mail-avatar" style="background:${m.color}">${esc(m.avatar)}</span><span class="mail-copy"><span class="mail-top"><strong>${esc(m.from)}</strong><time>${mailStamp(m.date)}</time></span><small>إلى: أنا ${m.ad ? '· <em class="mail-ad">إعلان</em>' : ''}</small></span></div>
        <div class="mail-body">${m.body.map(line => `<p>${esc(line)}</p>`).join('')}</div>
      </article>`;
  }

  const renderers = { calendar: renderCalendar, settings: renderSettings, appstore: renderAppstore, gmail: renderGmail, mailmsg: renderMailMsg, phone: renderPhone, safari: renderSafari, camera: renderCamera, whatsapp: renderWhatsapp, chat: renderChat, bank: renderBank, alarm: renderAlarm, notes: renderNotes, note: renderNote, photos: renderPhotos, photo: renderPhoto, music: renderMusic, vault: renderVault, invite: renderInvite };

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
    const tile = homeEl.querySelector(`[data-app="${id}"]`);
    const tilePage = tile?.closest('.home-page');
    if (tilePage) goHomePage([...tilePage.parentNode.children].indexOf(tilePage), false);
    const [x, y] = originPoint(origin && origin.isConnected ? origin : tile);
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
    if (opts.mail) activeMail = opts.mail;
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
      case 'open-mail': navigate('mailmsg', { mail: button.dataset.mail }); break;
      case 'home-dots': goHomePage(homePageIndex() ? 0 : 1); break;
      case 'calls-filter': {
        callsFilter = button.dataset.filter;
        win.querySelectorAll('.segmented button').forEach(b => { const on = b.dataset.filter === callsFilter; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
        $('#call-list', win).innerHTML = callRows();
        break;
      }
      case 'toggle-airplane': {
        airplane = !airplane;
        button.classList.toggle('on', airplane);
        button.setAttribute('aria-checked', airplane);
        if (airplane) phone.dataset.air = 'on'; else delete phone.dataset.air;
        buzz(6);
        break;
      }
      case 'cal-day': {
        const date = new Date(button.dataset.day);
        notify((calendarEvents()[button.dataset.day] || []).map(e => e.text).join(' · '), fullDate(date), 'calendar');
        break;
      }
      case 'get-app': {
        if (button.classList.contains('is-done') || button.classList.contains('is-loading')) break;
        button.classList.add('is-loading');
        button.textContent = '';
        setTimeout(() => { if (!button.isConnected) return; button.classList.remove('is-loading'); button.classList.add('is-done'); button.textContent = 'فتح'; }, 1600);
        break;
      }
      case 'store-open': openApp('vault'); break;
      case 'cam-thumb': openApp('photos'); break;
      case 'shutter': {
        const flash = $('#cam-flash', win);
        if (flash) { flash.classList.remove('on'); void flash.offsetWidth; flash.classList.add('on'); }
        buzz(10);
        break;
      }
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

  /* صفحات الشاشة الرئيسية: تحديث النقاط، والسحب بالماوس على الكمبيوتر */
  homeEl.addEventListener('scroll', (event) => { if (event.target.id === 'home-pager') paintHomeDots(); }, true);
  let pagerDrag = null;
  homeEl.addEventListener('pointerdown', (event) => {
    const pager = event.target.closest?.('#home-pager');
    if (!pager || event.pointerType !== 'mouse') return;
    pagerDrag = { x: event.clientX, start: pager.scrollLeft, page: homePageIndex(), k: scaleFactor(), dx: 0, moved: false, pager };
  });

  /* سحب شاشة القفل للأعلى بالإصبع أو الماوس */
  let lockDrag = null;
  lockEl.addEventListener('pointerdown', (event) => {
    if (unlocked) return;
    lockDrag = { y: event.clientY, dy: 0, k: scaleFactor(), moved: false };
  });
  window.addEventListener('pointermove', (event) => {
    if (pagerDrag) {
      pagerDrag.dx = (event.clientX - pagerDrag.x) / pagerDrag.k;
      if (Math.abs(pagerDrag.dx) > 6) {
        pagerDrag.moved = true;
        pagerDrag.pager.style.scrollSnapType = 'none';
        pagerDrag.pager.scrollLeft = pagerDrag.start - pagerDrag.dx;
      }
    }
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
    if (pagerDrag) {
      const d = pagerDrag; pagerDrag = null;
      if (d.moved) {
        suppressClick = true; setTimeout(() => { suppressClick = false; }, 60);
        const target = Math.abs(d.dx) > 50 ? d.page + (d.dx > 0 ? 1 : -1) : d.page;
        goHomePage(target);
        setTimeout(() => { d.pager.style.scrollSnapType = ''; }, 420);
      }
    }
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
    if (route === 'home' && event.key === 'ArrowLeft') { event.preventDefault(); goHomePage(1); }
    if (route === 'home' && event.key === 'ArrowRight') { event.preventDefault(); goHomePage(0); }
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
