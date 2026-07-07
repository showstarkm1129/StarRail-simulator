import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  await page.goto('/');
  await expect(page.locator('#tab-speed')).toHaveClass(/active/);

  expect(pageErrors).toEqual([]);
});

test('speed tab recalculates action value and renders the cycle table', async ({ page }) => {
  await expect(page.locator('#base-av')).toHaveText('100.00');
  await expect(page.locator('#cycle-tbody tr')).toHaveCount(6);

  await page.locator('#speed-input').fill('200');

  await expect(page.locator('#base-av')).toHaveText('50.00');
  await expect(page.locator('#cycle-tbody tr').first()).toContainText('3');
});

test('main tabs switch to their own panels', async ({ page }) => {
  await page.locator('.tab-btn[data-target="tab-combat"]').click();
  await expect(page.locator('#tab-combat')).toHaveClass(/active/);
  await expect(page.locator('#tab-speed')).not.toHaveClass(/active/);

  await page.locator('.tab-btn[data-target="tab-diminishing"]').click();
  await expect(page.locator('#tab-diminishing')).toHaveClass(/active/);
  await expect(page.locator('#tab-combat')).not.toHaveClass(/active/);
});

test('build registry is available after module bootstrap', async ({ page }) => {
  await expect
    .poll(() =>
      page.evaluate(() => ({
        hasRegistry: Boolean(window.SRSIM?.Registry),
        characterCount: window.SRSIM?.Registry?.character.list().length ?? 0,
        lightconeCount: window.SRSIM?.Registry?.lightcone.list().length ?? 0,
      })),
    )
    .toMatchObject({
      hasRegistry: true,
      characterCount: expect.any(Number),
      lightconeCount: expect.any(Number),
    });

  const counts = await page.evaluate(() => ({
    characterCount: window.SRSIM?.Registry.character.list().length ?? 0,
    lightconeCount: window.SRSIM?.Registry.lightcone.list().length ?? 0,
  }));

  expect(counts.characterCount).toBeGreaterThan(0);
  expect(counts.lightconeCount).toBeGreaterThan(0);
});

test('diminishing tab recalculates every light cone at every superimpose level', async ({ page }) => {
  await page.locator('.tab-btn[data-target="tab-diminishing"]').click();
  await expect(page.locator('#tab-diminishing')).toHaveClass(/active/);

  const failures = await page.evaluate(() => {
    const registry = window.SRSIM?.Registry;
    const charSelect = document.querySelector<HTMLSelectElement>('#dim-char');
    const lightconeSelect = document.querySelector<HTMLSelectElement>('#dim-lc');
    const superimposeSelect = document.querySelector<HTMLSelectElement>('#dim-lc-si');
    const result = document.querySelector<HTMLElement>('#dim-result');
    const selfBuffs = document.querySelector<HTMLElement>('#dim-self-buffs-content');
    const out: string[] = [];

    if (!registry || !charSelect || !lightconeSelect || !superimposeSelect || !result) {
      return ['限界効用逓減タブの検査に必要な要素が見つからない'];
    }

    charSelect.value = 'testAll';
    charSelect.dispatchEvent(new Event('change', { bubbles: true }));

    const selectableIds = new Set(
      Array.from(lightconeSelect.options)
        .map(option => option.value)
        .filter(Boolean),
    );

    const lightcones = registry.lightcone.list() as Array<{ id: string }>;
    for (const lightcone of lightcones) {
      if (!selectableIds.has(lightcone.id)) {
        out.push(`${lightcone.id}: 光円錐セレクトに表示されない`);
        continue;
      }

      lightconeSelect.value = lightcone.id;
      lightconeSelect.dispatchEvent(new Event('change', { bubbles: true }));

      for (let superimpose = 1; superimpose <= 5; superimpose++) {
        superimposeSelect.value = String(superimpose);
        superimposeSelect.dispatchEvent(new Event('change', { bubbles: true }));

        const resultText = result.textContent || '';
        const selfBuffText = selfBuffs?.textContent || '';
        if (resultText.includes('計算エラー') || resultText.includes('比較エラー')) {
          out.push(`${lightcone.id} S${superimpose}: 結果パネルがエラー表示`);
        }
        if (selfBuffText.includes('undefined') || selfBuffText.includes('NaN')) {
          out.push(`${lightcone.id} S${superimpose}: 自身バフ表示に不正値`);
        }
      }
    }

    return out;
  });

  expect(failures).toEqual([]);
});

test('AI provider settings autofill known chat completion endpoints', async ({ page }) => {
  await page.locator('.sub-tab-btn[data-sub-target="sub-speed-advanced"]').click();
  await page.locator('#adv-ai-settings').click();

  await expect(page.locator('#adv-provider-type')).toHaveValue('openrouter');
  await expect(page.locator('#adv-provider-endpoint')).toHaveValue('https://openrouter.ai/api/v1/chat/completions');
  await expect(page.locator('#adv-provider-endpoint')).toHaveJSProperty('readOnly', true);

  await page.locator('#adv-provider-type').selectOption('groq');
  await expect(page.locator('#adv-provider-endpoint')).toHaveValue('https://api.groq.com/openai/v1/chat/completions');
  await expect(page.locator('#adv-provider-name')).toHaveValue('Groq');

  await page.locator('#adv-provider-type').selectOption('custom');
  await expect(page.locator('#adv-provider-endpoint')).toHaveJSProperty('readOnly', false);
});

test('AI provider settings normalize pasted OpenRouter model URLs', async ({ page }) => {
  await page.locator('.sub-tab-btn[data-sub-target="sub-speed-advanced"]').click();
  await page.locator('#adv-ai-settings').click();

  await page.locator('#adv-provider-model').fill('https://openrouter.ai/google/gemma-4-31b-it:free');
  await page.locator('#adv-provider-api-key').fill('sk-or-test');
  await page.locator('#adv-provider-save').click();

  await expect(page.locator('#adv-provider-model')).toHaveValue('google/gemma-4-31b-it:free');
  await expect(page.locator('#adv-provider-message')).toContainText('モデル名を補正');
});
