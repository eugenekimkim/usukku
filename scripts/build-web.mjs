// 저장소 루트의 웹 파일을 www/로 복사해요 (Capacitor webDir).
// about/(디자인 갤러리)는 앱에 넣지 않아요.
import { cpSync, rmSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'www');
rmSync(out, { recursive: true, force: true });
mkdirSync(out);
for (const f of ['index.html', 'css', 'js', 'fonts', 'legal']) cpSync(join(root, f), join(out, f), { recursive: true });
// 앱에서만 Capacitor 런타임(registerPlugin)을 불러요. 저장소의 index.html은 브라우저용 그대로.
mkdirSync(join(out, 'js', 'vendor'), { recursive: true });
cpSync(join(root, 'node_modules', '@capacitor', 'core', 'dist', 'capacitor.js'), join(out, 'js', 'vendor', 'capacitor.js'));
const html = readFileSync(join(out, 'index.html'), 'utf8');
const tag = '<script src="js/health.js"></script>';
if (!html.includes(tag)) throw new Error('index.html에 js/health.js가 없어요');
writeFileSync(join(out, 'index.html'), html.replace(tag, '<script src="js/vendor/capacitor.js"></script>\n  ' + tag));
console.log('www/ 준비 완료: index.html, css/, js/, fonts/, legal/, js/vendor/capacitor.js');
