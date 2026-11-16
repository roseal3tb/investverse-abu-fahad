#!/usr/bin/env python3
"""Deterministic static checks + optional real Chromium interaction tests.

The browser tests use an in-memory version because network and file:// access are
sometimes restricted in secure CI. Actual production files remain unchanged.
"""
from pathlib import Path
import os
import unittest
from browser_fixture import ROOT, inline_site

class StaticChecks(unittest.TestCase):
    def test_assets_and_sources_exist(self):
        for path in ('index.html','styles.css','script.js','config.js','vercel.json','assets/investverse-logo.png','assets/investverse-logo-dark.png','assets/investverse-icon.png'):
            self.assertTrue((ROOT/path).is_file(), f'Asset missing: {path}')
        self.assertEqual(len(list((ROOT/'assets/photos').glob('*.webp'))),8)
        for x in (ROOT/'assets/photos').glob('*.webp'):
            self.assertGreater(x.stat().st_size, 2000)

    def test_identity_palette_and_story_code(self):
        css=(ROOT/'styles.css').read_text(encoding='utf8').upper()
        js=(ROOT/'script.js').read_text(encoding='utf8')
        for x in ('#205D3B','#306E45','#6CB579','#4B4A4A','#E8E8E8'):
            self.assertIn(x,css)
        self.assertIn("code==='4298'",js)
        self.assertIn('2,847,500',js)
        self.assertIn('تأكد إنك شفت كل ⭐',js)
        self.assertIn('الشخصية والأرقام خيالية لأغراض توعوية',js)
        self.assertIn("['1','2','3'",js)

    def test_unverified_details_are_blank(self):
        cfg=(ROOT/'config.js').read_text(encoding='utf8')
        for field in ['eventDate','eventLocation','registrationUrl','mapUrl']:
            self.assertIn(field+": ''", cfg)


class InteractiveBrowserChecks(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        try:
            from playwright.sync_api import sync_playwright
        except ImportError:
            raise unittest.SkipTest('Install the optional Python playwright package to run interaction tests.')
        cls.p = sync_playwright().start()
        executable=os.getenv('CHROMIUM_PATH','/usr/bin/chromium')
        try:
            cls.browser=cls.p.chromium.launch(headless=True,executable_path=executable,args=['--no-sandbox'])
        except Exception as exc:
            cls.p.stop()
            raise unittest.SkipTest(f'Chromium unavailable: {exc}')
        cls.html=inline_site()

    @classmethod
    def tearDownClass(cls):
        if hasattr(cls,'browser'): cls.browser.close()
        if hasattr(cls,'p'): cls.p.stop()

    def page(self, width=390,height=844, mobile=True):
        page=self.browser.new_page(viewport={'width':width,'height':height}, device_scale_factor=1,is_mobile=mobile,has_touch=mobile)
        page.set_content(self.html,wait_until='domcontentloaded',timeout=15000)
        page.wait_for_timeout(450)
        return page

    def test_story_e2e(self):
        page=self.page()
        errors=[]
        page.on('pageerror',lambda e: errors.append(str(e)))
        try:
            self.assertEqual(page.evaluate('INVESTVERSE_TEST.getState().route'),'lock')
            self.assertEqual(page.locator('.notif-card').count(),3)
            self.assertTrue(page.get_by_text('هذا الجوال مفقود').is_visible())
            page.locator('[data-action=unlock]').click()
            self.assertEqual(page.evaluate('INVESTVERSE_TEST.getState().route'),'home')
            self.assertEqual(page.locator('.app-tile').count(),7)
            # WhatsApp has seven story chats, with a starred 4 in Abu Saad's chat.
            page.locator('[data-app=whatsapp]').click()
            self.assertEqual(page.locator('.chat-preview').count(),7)
            for chat_id in ['group','wife','friend','hr','aunt','scam','old']:
                self.assertEqual(page.locator(f'[data-chat="{chat_id}"]').count(),1)
            page.locator('[data-chat=friend]').click()
            self.assertTrue(page.get_by_text('الشقة بالدور ٤').count())
            page.locator('[data-clue="4"]').first.click()
            self.assertIn('4',page.evaluate('INVESTVERSE_TEST.getState().found'))
            page.locator('[data-action=home]').click()
            # Five bank transactions and a clearly imaginary balance.
            page.locator('[data-app=bank]').click()
            self.assertEqual(page.locator('.transaction').count(),5)
            self.assertTrue(page.get_by_text('2,847,500').count())
            self.assertTrue(page.get_by_text('مصدر الثروة؟').count())
            page.locator('[data-action=home]').click()
            # One alarm, and toggling it must work.
            page.locator('[data-app=alarm]').click()
            self.assertEqual(page.locator('.alarm-card').count(),1)
            initial=page.evaluate('INVESTVERSE_TEST.getState().alarmOn')
            page.locator('[data-action=toggle-alarm]').click()
            self.assertNotEqual(page.evaluate('INVESTVERSE_TEST.getState().alarmOn'),initial)
            page.locator('[data-action=home]').click()
            # Four individual notes and the starred 9 in the appointments note.
            page.locator('[data-app=notes]').click()
            self.assertEqual(page.locator('.note-card').count(),4)
            page.locator('[data-note=dates]').click()
            page.locator('[data-clue="9"]').click()
            self.assertIn('9',page.evaluate('INVESTVERSE_TEST.getState().found'))
            page.locator('[data-action=home]').click()
            # Eight gallery pictures, number-eight clue, final INVESTVERSE gate.
            page.locator('[data-app=photos]').click()
            self.assertEqual(page.locator('.gallery-tile').count(),8)
            self.assertTrue(page.locator('[data-photo="7"]').count())
            page.locator('[data-photo="6"]').click()
            page.locator('[data-clue="8"]').click()
            self.assertIn('8',page.evaluate('INVESTVERSE_TEST.getState().found'))
            page.locator('[data-action=home]').click()
            # Music library intentionally empty per PDF.
            page.locator('[data-app=music]').click()
            self.assertTrue(page.get_by_text('ما فيه أغاني حاليًا').is_visible())
            page.locator('[data-action=home]').click()
            # Wrong PIN three times => explicit hint; correct 4298 => invitation.
            page.locator('[data-app=vault]').click()
            for attempt in range(3):
                for digit in '1234': page.locator(f'[data-key="{digit}"]').click()
                page.wait_for_timeout(370)
            self.assertIn('تأكد إنك شفت كل',page.locator('#pass-error').inner_text())
            self.assertEqual(page.evaluate('INVESTVERSE_TEST.getState().fails'),3)
            for digit in '4298':page.locator(f'[data-key="{digit}"]').click()
            page.wait_for_timeout(450)
            self.assertEqual(page.evaluate('INVESTVERSE_TEST.getState().route'),'invite')
            self.assertTrue(page.get_by_text('إثمار .. سهمك الرابح').count())
            self.assertTrue(page.get_by_text('[التاريخ والوقت]').count())
            self.assertTrue(page.get_by_text('[المكان]').count())
            page.locator('[data-action=register]').click()
            self.assertIn('لم يُحدّد',page.locator('#toast').inner_text())
            page.locator('[data-action=map]').click()
            self.assertIn('لم يُحدّدا',page.locator('#toast').inner_text())
            page.locator('[data-action=restart]').click()
            self.assertEqual(page.evaluate('INVESTVERSE_TEST.getState().route'),'lock')
            self.assertFalse(errors, f'JS errors: {errors}')
        finally:page.close()

    def test_keyboard_touch_and_responsive(self):
        # Physical keyboard PIN support and desktop centered phone shell.
        page=self.page(width=1440,height=900,mobile=False)
        try:
            page.locator('[data-action=unlock]').click()
            bbox=page.locator('.phone').bounding_box()
            self.assertLessEqual(bbox['width'],440)
            self.assertAlmostEqual(bbox['x']+bbox['width']/2,720,delta=12)
            page.locator('[data-app=vault]').click()
            page.keyboard.type('4298')
            page.wait_for_timeout(350)
            self.assertEqual(page.evaluate('INVESTVERSE_TEST.getState().route'),'invite')
        finally:page.close()
        # On short mobile screens, ensure no content escapes the phone viewport.
        page=self.page(width=320,height=640,mobile=True)
        try:
            self.assertEqual(page.locator('.phone').bounding_box()['width'],320)
            page.locator('[data-action=unlock]').click()
            self.assertEqual(page.locator('.app-tile').count(),7)
            page.locator('[data-app=vault]').click()
            self.assertEqual(page.locator('.keypad button').count(),12)
        finally:page.close()


if __name__=='__main__':
    unittest.main(verbosity=2)
