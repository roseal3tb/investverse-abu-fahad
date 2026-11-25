#!/usr/bin/env python3
"""Deterministic static checks + optional real Chromium interaction tests.

The browser tests use an in-memory version because network and file:// access are
sometimes restricted in secure CI. Actual production files remain unchanged.
"""
import os
import unittest
from browser_fixture import ROOT, inline_site

APPS = ['whatsapp', 'bank', 'alarm', 'notes', 'photos', 'music', 'vault']


class StaticChecks(unittest.TestCase):
    def test_assets_and_sources_exist(self):
        for path in ('index.html', 'styles.css', 'script.js', 'config.js', 'vercel.json',
                     'assets/investverse-logo.png', 'assets/investverse-logo-dark.png',
                     'assets/investverse-icon.png', 'assets/investverse-poster.jpg', 'assets/ethmar/ethmar-logo.webp', 'assets/wallpaper.webp'):
            self.assertTrue((ROOT / path).is_file(), f'Asset missing: {path}')
        self.assertEqual(len(list((ROOT / 'assets/photos').glob('*.webp'))), 8)
        for x in (ROOT / 'assets/photos').glob('*.webp'):
            self.assertGreater(x.stat().st_size, 2000)

    def test_identity_palette_and_story_code(self):
        css = (ROOT / 'styles.css').read_text(encoding='utf8').upper()
        js = (ROOT / 'script.js').read_text(encoding='utf8')
        for x in ('#205D3B', '#306E45', '#6CB579', '#4B4A4A', '#E8E8E8'):
            self.assertIn(x, css)
        self.assertIn("code==='4298'", js)
        self.assertIn('2,847,500', js)
        self.assertIn('الشخصية والأرقام خيالية لأغراض توعوية', js)
        self.assertIn("['1','2','3'", js)
        self.assertNotIn('⭐', js)

    def test_unverified_details_are_blank(self):
        cfg = (ROOT / 'config.js').read_text(encoding='utf8')
        for field in ['eventDate', 'eventLocation', 'registrationUrl', 'mapUrl']:
            self.assertIn(field + ": ''", cfg)


class ChromiumCase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        try:
            from playwright.sync_api import sync_playwright
        except ImportError:
            raise unittest.SkipTest('Install the optional Python playwright package to run interaction tests.')
        cls.p = sync_playwright().start()
        executable = os.getenv('CHROMIUM_PATH', '/usr/bin/chromium')
        try:
            cls.browser = cls.p.chromium.launch(headless=True, executable_path=executable, args=['--no-sandbox'])
        except Exception as exc:
            cls.p.stop()
            raise unittest.SkipTest(f'Chromium unavailable: {exc}')
        cls.html = inline_site()

    @classmethod
    def tearDownClass(cls):
        if hasattr(cls, 'browser'): cls.browser.close()
        if hasattr(cls, 'p'): cls.p.stop()

    def state(self, page, key):
        return page.evaluate(f'INVESTVERSE_TEST.getState().{key}')


class InteractiveBrowserChecks(ChromiumCase):

    def page(self, width=390, height=844, mobile=True):
        page = self.browser.new_page(viewport={'width': width, 'height': height}, device_scale_factor=1, is_mobile=mobile, has_touch=mobile)
        page.set_content(self.html, wait_until='domcontentloaded', timeout=15000)
        page.wait_for_timeout(450)
        return page

    def state(self, page, key):
        return page.evaluate(f'INVESTVERSE_TEST.getState().{key}')

    def test_story_e2e(self):
        page = self.page()
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        home = lambda: page.locator('[data-action=home]').click()
        try:
            self.assertEqual(self.state(page, 'route'), 'lock')
            self.assertEqual(page.locator('.notif-card').count(), 3)
            self.assertTrue(page.get_by_text('هذا الجوال مفقود').is_visible())
            self.assertEqual(page.locator('.sb-carrier').count(), 0)
            page.locator('[data-action=unlock]').click()
            self.assertEqual(self.state(page, 'route'), 'home')
            self.assertEqual(page.locator('.app-tile').count(), 14)
            # Seven story chats.
            page.locator('[data-app=whatsapp]').click()
            self.assertEqual(page.locator('.chat-preview[data-chat]').count(), 7)
            self.assertEqual(page.locator('.community-preview').count(), 1)
            for chat_id in ['group', 'wife', 'friend', 'hr', 'aunt', 'scam', 'old']:
                self.assertEqual(page.locator(f'[data-chat="{chat_id}"]').count(), 1)
            page.locator('[data-chat=friend]').click()
            self.assertTrue(page.get_by_text('الشقة بالدور ٤').count())
            page.locator('[data-action=back]').click()
            self.assertEqual(self.state(page, 'route'), 'whatsapp')
            home()
            # Five bank transactions and a clearly imaginary balance.
            page.locator('[data-app=bank]').click()
            self.assertEqual(page.locator('.transaction').count(), 5)
            self.assertTrue(page.get_by_text('2,847,500').count())
            self.assertTrue(page.get_by_text('مصدر الثروة؟').count())
            home()
            # One alarm, and toggling it must work.
            page.locator('[data-app=alarm]').click()
            self.assertEqual(page.locator('.alarm-card').count(), 1)
            initial = self.state(page, 'alarmOn')
            page.locator('[data-action=toggle-alarm]').click()
            self.assertNotEqual(self.state(page, 'alarmOn'), initial)
            home()
            # The accounts note carries the email, the password and the app passcode.
            page.locator('[data-app=notes]').click()
            self.assertEqual(page.locator('.note-card').count(), page.evaluate('INVESTVERSE_TEST.getNoteCount()'))
            page.locator('[data-note=accounts]').click()
            note = page.locator('.single-note').inner_text()
            for expected in ('abufahad@gmail.com', 'abufahad12345', '4298'):
                self.assertIn(expected, note)
            home()
            # Eight gallery pictures.
            page.locator('[data-app=photos]').click()
            self.assertEqual(page.locator('.gallery-tile').count(), 8)
            page.locator('[data-photo="6"]').click()
            self.assertEqual(self.state(page, 'route'), 'photo')
            home()
            # Music library intentionally empty per PDF.
            page.locator('[data-app=music]').click()
            self.assertTrue(page.get_by_text('ما فيه أغاني حاليًا').is_visible())
            home()
            # Wrong PIN three times => hint; correct 4298 => the exhibition poster.
            page.locator('[data-app=vault]').click()
            self.assertEqual(page.locator('.keypad button').count(), 11)
            for attempt in range(3):
                for digit in '1234': page.locator(f'[data-key="{digit}"]').click()
                page.wait_for_timeout(370)
            self.assertIn('الملاحظات', page.locator('#pass-error').inner_text())
            self.assertEqual(self.state(page, 'fails'), 3)
            for digit in '4298': page.locator(f'[data-key="{digit}"]').click()
            page.wait_for_timeout(450)
            self.assertEqual(self.state(page, 'route'), 'invite')
            self.assertEqual(page.locator('.invite-poster').count(), 1)
            self.assertTrue(page.get_by_text('الشخصية والأرقام خيالية').count())
            page.locator('[data-action=restart]').click()
            self.assertEqual(self.state(page, 'route'), 'lock')
            self.assertFalse(errors, f'JS errors: {errors}')
        finally:
            page.close()

    def test_home_pages_and_system_apps(self):
        page = self.page()
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        home = lambda: page.locator('[data-action=home]').click()
        try:
            page.locator('[data-action=unlock]').click()
            # Two home pages: system apps first, then WhatsApp, Gmail, the locked app and Music.
            self.assertEqual(page.locator('.home-page').count(), 2)
            first = page.locator('.home-page').nth(0)
            second = page.locator('.home-page').nth(1)
            for app in ('calendar', 'alarm', 'notes', 'appstore', 'settings'):
                self.assertEqual(first.locator(f'[data-app={app}]').count(), 1, app)
            for app in ('whatsapp', 'gmail', 'vault', 'music', 'bank'):
                self.assertEqual(second.locator(f'[data-app={app}]').count(), 1, app)
            for app in ('phone', 'safari', 'camera', 'photos'):
                self.assertEqual(page.locator(f'.home-dock [data-app={app}]').count(), 1, app)
            # Phone: recents with the family, and the missed-calls filter.
            page.locator('[data-app=phone]').click()
            calls = page.locator('#call-list').inner_text()
            for name in ('أم فهد', 'الوالدة', 'الوالد', 'أبو سعد', 'خالتي موضي'):
                self.assertIn(name, calls)
            total = page.locator('.call-row').count()
            page.locator('[data-filter=missed]').click()
            self.assertLess(page.locator('.call-row').count(), total)
            home()
            # Settings shows the iCloud account and the live battery level.
            page.locator('[data-app=settings]').click()
            settings = page.locator('.set-scroll').inner_text()
            self.assertIn('abufahad@gmail.com', settings)
            self.assertIn('٢٥٪', settings)
            home()
            # Calendar renders this month and the next with today highlighted.
            page.locator('[data-app=calendar]').click()
            self.assertEqual(page.locator('.cal-month').count(), 2)
            self.assertEqual(page.locator('.cal-cell.is-today').count(), 1)
            home()
            page.locator('[data-app=appstore]').click()
            self.assertGreaterEqual(page.locator('.store-list .store-app-row').count(), 5)
            home()
            page.locator('[data-app=safari]').click()
            self.assertTrue(page.get_by_text('قائمة القراءة').count())
            home()
            page.locator('[data-app=camera]').click()
            page.locator('[data-action=shutter]').click()
            home()
            # Gmail: stock, dividend and ad emails; opening one shows its body.
            page.locator('[data-app=gmail]').click()
            self.assertGreaterEqual(page.locator('button.mail-row').count(), 8)
            page.locator('[data-mail=dividend]').click()
            self.assertEqual(self.state(page, 'route'), 'mailmsg')
            self.assertIn('12,400', page.locator('.mail-open').inner_text())
            page.locator('[data-action=back]').click()
            self.assertEqual(self.state(page, 'route'), 'gmail')
            # Opening an email marks it read: no blue dot, and the counters drop.
            self.assertEqual(page.locator('[data-mail=dividend] .mail-dot').count(), 0)
            self.assertEqual(page.locator('.mail-dot').count(), 2)
            home()
            page.locator('[data-app=whatsapp]').click()
            page.locator('[data-chat=wife]').click()
            self.assertTrue(page.get_by_text('الله يكتب اللي فيه الخير').count())
            self.assertFalse(errors, f'JS errors: {errors}')
        finally:
            page.close()

    def test_battery_drain_and_alerts(self):
        page = self.page()
        try:
            self.assertEqual(self.state(page, 'battery'), 25)
            self.assertFalse(self.state(page, 'batteryAlert'))
            page.evaluate('INVESTVERSE_TEST.setBattery(21)')
            self.assertFalse(self.state(page, 'batteryAlert'))
            page.evaluate('INVESTVERSE_TEST.setBattery(20)')
            self.assertTrue(self.state(page, 'batteryAlert'))
            self.assertIn('٢٠٪', page.locator('#alert-text').inner_text())
            page.locator('[data-action=alert-close]').click()
            self.assertFalse(self.state(page, 'batteryAlert'))
            page.evaluate('INVESTVERSE_TEST.setBattery(10)')
            self.assertIn('١٠٪', page.locator('#alert-text').inner_text())
            page.locator('[data-action=battery-saver]').click()
            self.assertTrue(self.state(page, 'lowPower'))
            self.assertEqual(page.locator('#battery').get_attribute('data-state'), 'saver')
        finally:
            page.close()

    def test_keyboard_touch_and_responsive(self):
        # Physical keyboard PIN support and desktop centered phone shell.
        page = self.page(width=1440, height=900, mobile=False)
        try:
            page.locator('[data-action=unlock]').click()
            bbox = page.locator('.phone').bounding_box()
            self.assertLessEqual(bbox['width'], 440)
            self.assertAlmostEqual(bbox['x'] + bbox['width'] / 2, 720, delta=12)
            self.assertGreaterEqual(bbox['y'], 0)
            self.assertLessEqual(bbox['y'] + bbox['height'], 900)
            page.locator('[data-app=vault]').click()
            page.keyboard.type('4298')
            page.wait_for_timeout(350)
            self.assertEqual(self.state(page, 'route'), 'invite')
        finally:
            page.close()
        # On short mobile screens, ensure no content escapes the phone viewport.
        page = self.page(width=320, height=640, mobile=True)
        try:
            self.assertEqual(page.locator('.phone').bounding_box()['width'], 320)
            page.locator('[data-action=unlock]').click()
            self.assertEqual(page.locator('.app-tile').count(), 14)
            page.locator('[data-app=vault]').click()
            self.assertEqual(page.locator('.keypad button').count(), 11)
            box = page.locator('.keypad').bounding_box()
            self.assertGreaterEqual(box['x'], 0)
            self.assertLessEqual(box['x'] + box['width'], 320)
        finally:
            page.close()



ETHMAR_NAMES = [
    'رائد المطيري | رئيس مبادرة إثمار', 'غادة العتيبي | نائبة رئيس مبادرة إثمار', 'روز العتيبي | نائبة اللجنة التقنية',
    'غلا العتيبي | قائدة لجنة الموارد البشرية', 'مجد العتيبي | نائبة لجنة الموارد البشرية', 'نوف بن حثلين | قائدة اللجنة الإعلامية',
    'أسيل الصعب | نائبة اللجنة الإعلامية', 'سلطان المتعب | قائد لجنة المحتوى المالي', 'الوليد الرشيد | قائد لجنة العلاقات العامة',
    'العنود القحطاني | قائدة لجنة إدارة المشاريع',
]
QUIZ_TEXT = 'تبي تعرف أي نوع مستثمر أنت؟ هالاختبار بيقول لك 👇'
QUIZ_URL = 'https://inverstverse.vercel.app/'


class CommunityChecks(ChromiumCase):
    """WhatsApp Community: history, 5-second announcement, notification taps and the live group sequence.
    The page clock is installed and paused, so every delay is advanced explicitly."""

    def page(self, width=390, height=844, mobile=True):
        import datetime as dt
        page = self.browser.new_page(viewport={'width': width, 'height': height}, device_scale_factor=1, is_mobile=mobile, has_touch=mobile)
        self.errors = []
        page.on('pageerror', lambda e: self.errors.append(str(e)))
        start = dt.datetime(2026, 11, 25, 21, 0, 0)
        page.clock.install(time=start)
        page.set_content(self.html, wait_until='domcontentloaded', timeout=15000)
        now = page.evaluate('Date.now()')
        page.clock.pause_at(dt.datetime.fromtimestamp(now / 1000 + 0.05))
        page.wait_for_timeout(300)
        return page

    def run_until_announcement(self, page, slack=0):
        left = self.com(page, 'msUntilNext')
        page.clock.run_for(max(0, int(left) + slack))

    def com(self, page, key):
        return page.evaluate(f'INVESTVERSE_TEST.getCommunity().{key}')

    def at(self, page, sel):
        return page.locator('#appwin .page:not(.leaving) ' + sel).first

    def settle(self, page, ms=450):
        page.wait_for_timeout(ms)

    def open_whatsapp(self, page):
        page.locator('[data-action=unlock]').click(); self.settle(page, 700)
        page.locator('.app-tile[data-app=whatsapp]').click(); self.settle(page, 600)

    def test_history_structure_and_navigation(self):
        page = self.page()
        try:
            self.open_whatsapp(page)
            row = page.locator('.community-preview')
            self.assertIn('مبادرة إثمار 💸💚', row.inner_text())
            row.click(); self.settle(page)
            self.assertEqual(self.state(page, 'route'), 'community')
            groups = page.locator('.cg-row')
            self.assertEqual(groups.count(), 2)
            self.assertIn('Announcements', groups.nth(0).inner_text())
            self.assertIn('مثمرينا 💸💚', groups.nth(1).inner_text())
            # Announcements: three historical messages, the quiz is not there yet.
            self.at(page, '[data-group=ann]').click(); self.settle(page)
            ann = self.at(page, '.cm-column').inner_text()
            self.assertIn('8:00 🔥🔥🔥', ann)
            self.assertIn('8:30 🔥🔥🔥', ann)
            self.assertIn('جاهزين تدخلون عالم الاستثمار من منظور مختلف؟', ann)
            self.assertNotIn(QUIZ_TEXT, ann)
            self.assertEqual(page.locator('#appwin .page:not(.leaving) .cm-row').count(), 3)
            # Raed, Ghada and Rose show their WhatsApp photos; everyone else keeps the default avatar.
            rows = page.locator('#appwin .page:not(.leaving) .cm-row')
            for i in range(3):
                self.assertEqual(rows.nth(i).locator('.cm-avatar img').count(), 1)
            self.assertIn('only community admins can send them', self.at(page, '.cm-readonly').inner_text())
            poster = self.at(page, '.cm-image img')
            poster.scroll_into_view_if_needed(); page.wait_for_function('document.querySelector("#appwin .page:not(.leaving) .cm-image img").complete')
            size = poster.evaluate('i => [i.naturalWidth, i.naturalHeight, i.getBoundingClientRect().width, i.getBoundingClientRect().height]')
            self.assertEqual(size[:2], [904, 1600])
            self.assertAlmostEqual(size[3] / size[2], 1600 / 904, delta=0.01)
            # Tapping the poster opens it full screen, and back returns to Announcements.
            poster.click(); self.settle(page)
            self.assertEqual(self.state(page, 'route'), 'cmedia')
            self.assertTrue(self.at(page, '.cmv-stage img').is_visible())
            self.at(page, '[data-action=back]').click(); self.settle(page)
            self.assertEqual(self.state(page, 'route'), 'cchat')
            self.at(page, '[data-action=back]').click(); self.settle(page)
            self.assertEqual(self.state(page, 'route'), 'community')
            # مثمرينا: full display names, grouped runs, no notification from history.
            self.at(page, '[data-group=mth]').click(); self.settle(page)
            mth = self.at(page, '.cm-column').inner_text()
            for name in ETHMAR_NAMES:
                self.assertIn(name, mth if name.split(' |')[0] not in ('رائد المطيري', 'غادة العتيبي') else ann)
            self.assertEqual(self.com(page, 'mathmerina'), page.locator('#appwin .page:not(.leaving) .cm-row').count())
            photos = page.locator('#appwin .page:not(.leaving) .cm-avatar img').count()
            self.assertEqual(photos, 1)  # روز فقط في مثمرينا، والباقي الأفاتار الافتراضي
            firsts = page.locator('#appwin .page:not(.leaving) .cm-row.is-first').count()
            self.assertLess(firsts, self.com(page, 'mathmerina'))
            self.assertTrue(page.locator('#toast').is_hidden())
            # Back to the Community, then back to the main WhatsApp list.
            self.at(page, '[data-action=back]').click(); self.settle(page)
            self.at(page, '[data-action=back]').click(); self.settle(page)
            self.assertEqual(self.state(page, 'route'), 'whatsapp')
            self.assertFalse(self.errors, self.errors)
        finally:
            page.close()

    def test_ten_second_announcement_and_live_sequence(self):
        page = self.page()
        try:
            # Nothing is scheduled while the phone is still locked.
            self.assertFalse(self.com(page, 'armed'))
            page.clock.run_for(60000)
            self.assertFalse(self.com(page, 'delivered'))
            page.locator('[data-action=unlock]').click(); self.settle(page, 700)
            self.assertEqual(self.com(page, 'announceDelay'), 5000)
            self.run_until_announcement(page, -150)
            self.assertFalse(self.com(page, 'delivered'))
            self.assertTrue(page.locator('#toast').is_hidden())
            self.assertEqual(self.com(page, 'announcements'), 3)
            page.clock.run_for(300)
            self.assertTrue(self.com(page, 'delivered'))
            self.assertEqual(self.com(page, 'announcements'), 4)
            self.assertEqual(self.com(page, 'annUnread'), 1)
            self.assertEqual(self.com(page, 'whatsappBadge'), 5)
            banner = page.locator('#toast')
            self.assertTrue(banner.is_visible())
            text = banner.inner_text()
            for part in ('مبادرة إثمار 💸💚', 'روز العتيبي | نائبة اللجنة التقنية', QUIZ_TEXT):
                self.assertIn(part, text)
            self.assertEqual(page.locator('[data-app=whatsapp] .app-badge').inner_text(), '٥')
            # The group sequence must not start until the notification is tapped.
            self.assertFalse(self.com(page, 'tapped'))
            page.clock.run_for(4000)
            self.assertEqual(self.com(page, 'mathmerina'), 28)
            banner.locator('[data-action=banner-tap]').click(); self.settle(page, 600)
            self.assertEqual(self.state(page, 'route'), 'community')
            self.assertTrue(self.com(page, 'tapped'))
            self.assertEqual(self.com(page, 'liveStep'), 0)
            # First live message arrives as a banner while the user is on the Community overview.
            page.clock.run_for(2700); self.settle(page, 200)
            self.assertEqual(self.com(page, 'liveStep'), 1)
            self.assertEqual(self.com(page, 'mthUnread'), 1)
            self.assertIn('مجد العتيبي | نائبة لجنة الموارد البشرية', page.locator('#toast').inner_text())
            # Tapping a group notification opens مثمرينا directly.
            page.locator('#toast [data-action=banner-tap]').click(); self.settle(page, 600)
            self.assertEqual(self.state(page, 'route'), 'cchat')
            self.assertEqual(self.com(page, 'activeGroup'), 'mth')
            self.assertEqual(self.com(page, 'mthUnread'), 0)
            # While viewing the group, messages append without banners.
            for _ in range(14):
                page.clock.run_for(2500); self.settle(page, 120)
                self.assertTrue(page.locator('#toast').is_hidden() or 'مثمرينا' not in page.locator('#toast').inner_text())
            self.assertEqual(self.com(page, 'liveStep'), 10)
            self.assertEqual(self.com(page, 'mathmerina'), 38)
            self.assertFalse(self.com(page, 'timerPending'))
            col = self.at(page, '.cm-column').inner_text()
            self.assertIn('شاركونااااا', col)
            self.assertEqual(col.count('نزلللل'), 1)
            sc = self.at(page, '.cm-scroll')
            self.assertLess(sc.evaluate('s => s.scrollHeight - s.scrollTop - s.clientHeight'), 4)
            # Reopening WhatsApp and the Community does not duplicate anything.
            page.locator('[data-action=home]').click(); self.settle(page, 600)
            page.locator('.app-tile[data-app=whatsapp]').click(); self.settle(page, 600)
            page.locator('.community-preview').click(); self.settle(page)
            self.at(page, '[data-group=ann]').click(); self.settle(page)
            ann = self.at(page, '.cm-column').inner_text()
            self.assertEqual(ann.count(QUIZ_TEXT), 1)
            link = self.at(page, '.cm-text a.cm-link')
            self.assertEqual(link.get_attribute('href'), QUIZ_URL)
            self.assertEqual(link.get_attribute('target'), '_blank')
            self.assertEqual(link.inner_text(), QUIZ_URL)
            self.assertEqual(self.com(page, 'annUnread'), 0)
            page.clock.run_for(60000)
            self.assertEqual(self.com(page, 'mathmerina'), 38)
            self.assertEqual(self.com(page, 'announcements'), 4)
            self.assertFalse(self.errors, self.errors)
        finally:
            page.close()

    def test_link_opens_without_leaving_the_phone(self):
        page = self.page()
        try:
            self.open_whatsapp(page)
            self.run_until_announcement(page, 200)
            self.assertTrue(self.com(page, 'delivered'))
            page.locator('.community-preview').click(); self.settle(page)
            self.at(page, '[data-group=ann]').click(); self.settle(page)
            requested = []
            page.context.on('request', lambda r: requested.append(r.url))
            with page.context.expect_page(timeout=5000) as info:
                self.at(page, '.cm-text a.cm-link').click()
            popup = info.value
            popup.wait_for_timeout(800)
            # الرابط يفتح في تبويب جديد بنفس العنوان بالضبط، والجوال يبقى على حاله
            self.assertIn(QUIZ_URL, requested)
            self.assertIsNot(popup, page)
            popup.close()
            self.assertEqual(self.state(page, 'route'), 'cchat')
        finally:
            page.close()

    def test_delivery_while_locked_and_restart(self):
        page = self.page()
        try:
            # Locked phone: the announcement waits; the 5 seconds start when the phone is unlocked.
            page.clock.run_for(30000); self.settle(page, 200)
            self.assertFalse(self.com(page, 'delivered'))
            self.assertEqual(page.locator('#lock .notif-ethmar').count(), 0)
            page.locator('[data-action=unlock]').click(); self.settle(page, 700)
            self.run_until_announcement(page, 200); self.settle(page, 300)
            page.locator('#toast [data-action=banner-tap]').click(); self.settle(page, 900)
            self.assertEqual(self.state(page, 'route'), 'community')
            self.assertTrue(self.com(page, 'tapped'))
            page.clock.run_for(8000)
            self.assertGreaterEqual(self.com(page, 'liveStep'), 2)
            # Restart follows the existing reset: everything returns to the start; the timer re-arms on the next unlock.
            page.clock.run_for(45000); self.settle(page, 400)  # التسلسل يخلص وآخر إشعار يختفي
            self.assertEqual(self.com(page, 'liveStep'), 10)
            self.assertTrue(page.locator('#toast').is_hidden())
            page.locator('[data-action=home]').click(); self.settle(page, 600)
            page.locator('.app-tile[data-app=vault]').click(); self.settle(page, 600)
            page.keyboard.type('4298'); page.clock.run_for(400); self.settle(page, 500)
            self.assertTrue(page.locator('.invite-poster').is_visible())
            page.locator('[data-action=restart]').click(); self.settle(page, 600)
            self.assertFalse(self.com(page, 'delivered'))
            self.assertFalse(self.com(page, 'tapped'))
            self.assertEqual(self.com(page, 'mathmerina'), 28)
            self.assertEqual(self.com(page, 'announcements'), 3)
            self.assertFalse(self.com(page, 'armed'))
            self.assertFalse(self.com(page, 'timerPending'))
            self.assertFalse(self.errors, self.errors)
        finally:
            page.close()


if __name__ == '__main__':
    unittest.main(verbosity=2)
