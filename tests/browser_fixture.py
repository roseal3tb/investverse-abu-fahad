"""Generate a self-contained HTML fixture for browser tests in network-restricted CI."""
from pathlib import Path
import base64
import mimetypes
import re

ROOT = Path(__file__).resolve().parents[1]


def inline_site():
    html = (ROOT / 'index.html').read_text(encoding='utf-8')
    css = (ROOT / 'styles.css').read_text(encoding='utf-8')
    script = (ROOT / 'script.js').read_text(encoding='utf-8')
    config = (ROOT / 'config.js').read_text(encoding='utf-8')
    urls={}
    for f in (ROOT/'assets').rglob('*'):
        if not f.is_file(): continue
        kind=mimetypes.guess_type(str(f))[0] or 'application/octet-stream'
        urls[f.relative_to(ROOT).as_posix()]='data:'+kind+';base64,'+base64.b64encode(f.read_bytes()).decode('ascii')
    for path, data in urls.items():
        css = css.replace(f"'{path}'", f"'{data}'")
        html = html.replace('"'+path+'"', '"'+data+'"')
        if path.startswith('assets/photos/'):
            pass
        else:
            script = script.replace(path, data)
    images={f.name:urls['assets/photos/'+f.name] for f in (ROOT/'assets/photos').glob('*')}
    script = script.replace("function photo(name) { return `assets/photos/${name}`; }", "const PREVIEW_IMAGES = " + repr(images) + "; function photo(name) { return PREVIEW_IMAGES[name] || ''; }")
    html = re.sub(r'<link rel="preconnect"[^>]+>','',html)
    html = re.sub(r'<link href="https://fonts.googleapis.com[^>]+>','',html)
    html = html.replace('<link rel="stylesheet" href="styles.css" />', '<style>'+css+'</style>')
    html = html.replace('<script src="config.js" defer></script>', '')
    html = html.replace('<script src="script.js" defer></script>', '')
    html = html.replace('</body>', '<script>'+config+'</script><script>'+script+'</script></body>')
    return html
