import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE_URL = `file://${path.join(__dirname, 'shopping-list.html')}`;

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    console.log(`  ✅ ${label}`);
    passed++;
  } else {
    console.error(`  ❌ ${label}`);
    failed++;
  }
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

// localStorage 초기화
await page.goto(FILE_URL);
await page.evaluate(() => localStorage.clear());
await page.reload();

// ─── 1. 아이템 추가 ──────────────────────────────────────────
console.log('\n[1] 아이템 추가 테스트');

await page.fill('#itemInput', '사과');
await page.click('button:has-text("추가")');
let items = await page.locator('.item').count();
assert(items === 1, '아이템 1개 추가됨');

await page.fill('#itemInput', '바나나');
await page.keyboard.press('Enter');  // Enter 키로 추가
items = await page.locator('.item').count();
assert(items === 2, 'Enter 키로 아이템 추가됨');

await page.fill('#itemInput', '우유');
await page.click('button:has-text("추가")');
items = await page.locator('.item').count();
assert(items === 3, '총 3개 아이템 추가됨');

// 빈 값 추가 방지
await page.fill('#itemInput', '   ');
await page.click('button:has-text("추가")');
items = await page.locator('.item').count();
assert(items === 3, '빈 값은 추가되지 않음');

// 부제목 카운터 확인
const subtitle = await page.locator('#subtitle').textContent();
assert(subtitle === '3개 항목', `항목 수 표시 정확 (${subtitle})`);

// ─── 2. 체크 기능 ──────────────────────────────────────────
console.log('\n[2] 체크(완료) 기능 테스트');

// 첫 번째 아이템 체크
const firstCheckbox = page.locator('.item input[type="checkbox"]').first();
await firstCheckbox.check();
const isChecked = await firstCheckbox.isChecked();
assert(isChecked, '체크박스 체크됨');

const firstItem = page.locator('.item').first();
const hasCheckedClass = await firstItem.evaluate(el => el.classList.contains('checked'));
assert(hasCheckedClass, '체크된 아이템에 .checked 클래스 적용됨');

// 취소선 확인 (checked 클래스가 붙은 상태)
const textDecoration = await firstItem.locator('.item-text').evaluate(el =>
  getComputedStyle(el).textDecoration
);
assert(textDecoration.includes('line-through'), '완료 아이템에 취소선 표시됨');

// 완료 카운터 확인
const checkedCount = await page.locator('#checkedCount').textContent();
assert(checkedCount === '1 / 3 완료', `완료 카운터 정확 (${checkedCount})`);

// 체크 해제
await firstCheckbox.uncheck();
const isUnchecked = !(await firstCheckbox.isChecked());
assert(isUnchecked, '체크박스 해제됨');

// ─── 3. 아이템 삭제 ──────────────────────────────────────────
console.log('\n[3] 아이템 삭제 테스트');

// 첫 번째 아이템 삭제
const deleteBtns = page.locator('.delete-btn');
await deleteBtns.first().click();
items = await page.locator('.item').count();
assert(items === 2, '개별 삭제: 1개 삭제 후 2개 남음');

// ─── 4. 완료 항목 일괄 삭제 ──────────────────────────────────
console.log('\n[4] 완료 항목 일괄 삭제 테스트');

// 두 항목 모두 체크
const checkboxes = page.locator('.item input[type="checkbox"]');
await checkboxes.nth(0).check();
await checkboxes.nth(1).check();
items = await page.locator('.item').count();
assert(items === 2, '삭제 전 2개 항목 존재');

await page.click('.clear-btn');
items = await page.locator('.item').count();
assert(items === 0, '완료 항목 일괄 삭제 후 0개 남음');

// 빈 상태 메시지 확인
const emptyMsg = await page.locator('.empty').isVisible();
assert(emptyMsg, '빈 상태 메시지 표시됨');

// ─── 5. localStorage 영구 저장 ───────────────────────────────
console.log('\n[5] localStorage 영구 저장 테스트');

await page.fill('#itemInput', '새 아이템');
await page.click('button:has-text("추가")');

await page.reload();  // 페이지 새로고침

items = await page.locator('.item').count();
assert(items === 1, '새로고침 후에도 데이터 유지됨');

const savedText = await page.locator('.item-text').first().textContent();
assert(savedText.trim() === '새 아이템', `저장된 텍스트 정확 (${savedText.trim()})`);

// ─── 결과 요약 ──────────────────────────────────────────────
console.log('\n' + '─'.repeat(40));
console.log(`테스트 결과: 총 ${passed + failed}개 | ✅ 통과 ${passed}개 | ❌ 실패 ${failed}개`);
console.log('─'.repeat(40));

await browser.close();
process.exit(failed > 0 ? 1 : 0);
