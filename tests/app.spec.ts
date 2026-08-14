import { expect, test, type Page } from '@playwright/test';

/**
 * smart picker (js/ui/smartPicker.js) 付きの select を、実際の UI 操作で選ぶ。
 * 元の <select> は `.sr-picker-source { display: none }` で隠れており
 * Playwright の selectOption が使えないため、検索ボックス経由で選択する。
 */
async function pickOption(page: Page, selectSelector: string, value: string) {
  const select = page.locator(selectSelector);
  const label = ((await select.locator(`option[value="${value}"]`).first().textContent()) || '').trim();
  const picker = page.locator(`${selectSelector} + .sr-picker`);
  await picker.locator('.sr-picker-button').click();
  await picker.locator('.sr-picker-search').fill(label);
  await picker.locator('.sr-picker-option').first().click();
  await expect(select).toHaveValue(value);
  return label;
}

/** smart picker 付き select の n 番目の option の value を読む (表示は不要)。 */
async function optionValueAt(page: Page, selectSelector: string, index: number) {
  const value = await page.locator(`${selectSelector} option`).nth(index).getAttribute('value');
  expect(value).toBeTruthy();
  return value as string;
}

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

test('Aha speed calculator ranks four characters and applies each coefficient', async ({ page }) => {
  await page.locator('.sub-tab-btn[data-sub-target="sub-speed-aha"]').click();
  await expect(page.locator('#sub-speed-aha')).toHaveClass(/active/);

  const speeds = ['100', '200', '150', '120'];
  for (let index = 0; index < speeds.length; index++) {
    await page.locator(`#aha-character-speed-${index + 1}`).fill(speeds[index]);
  }

  await expect(page.locator('#aha-speed-result')).toHaveText('143.500');
  await expect(page.locator('#aha-av-result')).toHaveText('69.69');
  await expect(page.locator('#aha-ranking-tbody tr')).toHaveCount(4);
  await expect(page.locator('#aha-ranking-tbody tr').first()).toContainText('愉悦キャラ 2');
  await expect(page.locator('#aha-ranking-tbody tr').first()).toContainText('×0.2');
});

test('main tabs switch to their own panels', async ({ page }) => {
  await page.locator('.tab-btn[data-target="tab-combat"]').click();
  await expect(page.locator('#tab-combat')).toHaveClass(/active/);
  await expect(page.locator('#tab-speed')).not.toHaveClass(/active/);

  await page.locator('.tab-btn[data-target="tab-diminishing"]').click();
  await expect(page.locator('#tab-diminishing')).toHaveClass(/active/);
  await expect(page.locator('#tab-combat')).not.toHaveClass(/active/);

  await page.locator('.tab-btn[data-target="tab-relics"]').click();
  await expect(page.locator('#tab-relics')).toHaveClass(/active/);
  await expect(page.locator('#relic-create-form')).toBeVisible();
  await expect(page.locator('#tab-diminishing')).not.toHaveClass(/active/);

  await page.locator('.tab-btn[data-target="tab-ai"]').click();
  await expect(page.locator('#tab-ai')).toHaveClass(/active/);
  await expect(page.locator('#tab-relics')).not.toHaveClass(/active/);
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

test('build tab recalculates every light cone at every superimpose level', async ({ page }) => {
  // 光円錐・重畳の直接編集はキャラビルドタブに一本化されている
  // (限界効用逓減タブはキャラ・星魂の切替と保存ビルドの読込だけを行う)。
  await page.locator('.tab-btn[data-target="tab-build"]').click();
  await expect(page.locator('#tab-build')).toHaveClass(/active/);
  await expect(page.locator('#cb-stats .cb-stat-hero .cb-hero-box').filter({ hasText: 'HP' })).toHaveCount(1);
  await expect(page.locator('#cb-stats .cb-stat-grid .cb-stat-k').filter({ hasText: 'HP' })).toHaveCount(0);
  await expect(page.locator('#cb-sets')).toHaveCSS('display', 'grid');

  const failures = await page.evaluate(() => {
    const registry = window.SRSIM?.Registry;
    const charSelect = document.querySelector<HTMLSelectElement>('#cb-char');
    const lightconeSelect = document.querySelector<HTMLSelectElement>('#cb-lc');
    const superimposeSelect = document.querySelector<HTMLSelectElement>('#cb-lc-si');
    const stats = document.querySelector<HTMLElement>('#cb-stats');
    const out: string[] = [];

    if (!registry || !charSelect || !lightconeSelect || !superimposeSelect || !stats) {
      return ['キャラビルドタブの検査に必要な要素が見つからない'];
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

        const statsText = stats.textContent || '';
        if (statsText.includes('計算できませんでした') || statsText.includes('undefined') || statsText.includes('NaN')) {
          out.push(`${lightcone.id} S${superimpose}: 最終ステータス表示が異常`);
        }
      }
    }

    return out;
  });

  expect(failures).toEqual([]);
});

test('signature light cone auto-equips for build tab characters and diminishing party members', async ({ page }) => {
  // メインの光円錐編集はキャラビルドタブ側で行う。
  await page.locator('.tab-btn[data-target="tab-build"]').click();
  await page.locator('#cb-char').evaluate((select: HTMLSelectElement) => {
    select.value = 'archer';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await expect(page.locator('#cb-lc')).toHaveValue('The Hell Where Ideals Burn');
  await expect(page.locator('#cb-lc-si')).toHaveValue('1');

  // 限界効用逓減タブのパーティ枠(キャラのみモード)は変わらずモチーフ光円錐S1を自動装備する。
  await page.locator('.tab-btn[data-target="tab-diminishing"]').click();
  await page.locator('.dim-party-char').first().evaluate((select: HTMLSelectElement) => {
    select.value = 'sparkle';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });
  const firstPartySlot = page.locator('.dim-party-slot').first();
  const characterPicker = firstPartySlot.locator('.dim-party-simplemode-config .sr-picker');
  await expect(characterPicker).toHaveCSS('grid-column-start', '2');
  await expect(characterPicker.locator('.sr-picker-button')).toBeVisible();
  const pickerBounds = await characterPicker.evaluate(el => {
    const rect = el.getBoundingClientRect();
    const slotRect = el.closest('.dim-party-slot')?.getBoundingClientRect();
    return { right: rect.right, slotRight: slotRect?.right ?? 0, width: rect.width };
  });
  expect(pickerBounds.width).toBeGreaterThan(0);
  expect(pickerBounds.right).toBeLessThanOrEqual(pickerBounds.slotRight + 1);
  await expect(firstPartySlot).toContainText('モチーフ: 人生は遊び S1');
  await expect(firstPartySlot).toContainText('光円錐: 人生は遊び S1');
});

test('diminishing comparison tables stay inside the result panel after snapshot', async ({ page }) => {
  await page.locator('.tab-btn[data-target="tab-build"]').click();
  await page.locator('#cb-name').fill('レイアウト確認');
  await page.locator('#cb-send-dim').click();
  await page.locator('#dim-snapshot-btn').click();

  await expect(page.locator('#dim-result .dim-result-table').first()).toBeVisible();
  const overflow = await page.locator('#dim-result').evaluate(el => ({
    clientWidth: el.clientWidth,
    scrollWidth: el.scrollWidth,
    tableLayout: getComputedStyle(el.querySelector('.dim-result-table') as Element).tableLayout,
  }));
  expect(overflow.tableLayout).toBe('fixed');
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
});

test('diminishing AI assistant shows comparison, applies a proposal, and undoes it', async ({ page }) => {
  let receivedMessage = '';
  let receivedScope = '';
  let receivedTarget = '';
  let receivedState: Record<string, unknown> = {};
  await page.route('**/api/ai/connect', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ ok: true, provider: { type: 'codex', model: '' }, models: [], toolTest: true }),
  }));
  await page.route('**/api/ai/chat', route => {
    const request = route.request().postDataJSON();
    receivedMessage = request.message;
    receivedScope = request.scope;
    receivedTarget = request.state.simulationTarget;
    receivedState = request.state;
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
      ok: true,
      sessionId: 'e2e-session',
      providerSessionId: 'provider-session',
      finalText: '## 結論\n\n**速度134**の比較を完了しました。',
      executions: [
        {
          name: 'run_diminishing_comparison',
          output: {
            ok: true,
            jobSummary: {
              objective: '速度比較', caseCount: 1,
              fixedConditions: ['character', 'equipment', 'party', 'enemy'],
              metrics: ['finalStats', 'damage', 'differencePercent'],
              cases: [{ label: '速度134', changes: { stats: { spd: 134 } } }],
            },
            result: {
              cases: [{
                label: '速度134', changes: { stats: { spd: 134 } },
                calculation: {
                  target: { characterName: 'アーチャー', eidolon: 1, lightconeName: '或る嘘の終幕', superimpose: 1 },
                  party: [{ characterName: '花火', eidolon: 0, lightconeName: '未装備', ornamentName: 'ルサカ', activeEffects: [{ name: '夢を泳ぐ魚' }] }],
                  options: { enemyLevel: 80, enemyBaseRes: 0, critMode: 'expected', breakState: 'normal' },
                },
                finalStats: { derived: { hp: 3000, atk: 2500, def: 900, spd: 134, critRate: 0.7, critDmg: 1.4, dmgOwnElement: 0.8 } },
                attacks: [{ skillKey: 'skill', name: '偽・螺旋剣', kind: '戦闘スキル', target: '単体', level: 10, scalingStat: 'atk', multiplier: 3.6, damage: 12000, totalDamage: null }],
                damage: { basic: 1.2, skill: 2.4, ult: 3.6 }, differencePercent: { base: 5.5 },
              }],
            },
          },
        },
        {
          name: 'propose_diminishing_changes',
          output: { ok: true, proposal: { label: '速度134', summary: '速度134を反映', changes: { stats: { spd: 134 } } } },
        },
      ],
      }),
    });
  });

  await page.locator('.tab-btn[data-target="tab-ai"]').click();
  await page.evaluate(() => {
    const sessionModule = window.SRSIM?.DiminishingSession as {
      diminishingSession: {
        mutate(mutator: (state: { party: Array<{ activeEffectIds: Set<string> }> }) => void): void;
      };
    };
    sessionModule.diminishingSession.mutate(state => {
      for (const slot of state.party) slot.activeEffectIds.clear();
    });
  });
  await expect(page.locator('#dim-ai-assistant-mount .dim-ai-workspace')).toBeVisible();
  await expect(page.locator('#dim-ai-roster-target')).toBeVisible();
  await expect(page.locator('#dim-ai-roster-target')).toContainText('指定しない');
  await expect(page.locator('.dim-ai-roster select')).toHaveCount(4);
  await expect(page.locator('#dim-ai-open-assumptions')).toBeVisible();
  await expect(page.locator('#dim-ai-assumptions-panel')).toBeHidden();
  await page.locator('#dim-ai-open-assumptions').click();
  await expect(page.locator('#dim-ai-objective')).toBeVisible();
  await expect(page.locator('#dim-ai-battle-condition')).toHaveCount(0);
  await expect(page.locator('#dim-ai-effect-uptime-list')).toContainText('保存ビルドを選ぶと');
  await expect(page.locator('#dim-ai-action-order-goal')).toBeVisible();
  await page.locator('#dim-ai-close-assumptions').click();
  await expect(page.locator('#dim-ai-assumptions-panel')).toBeHidden();
  await expect(page.locator('#dim-ai-cli-panel')).toBeVisible();
  await expect(page.locator('#dim-ai-api-panel')).toBeHidden();
  await expect(page.locator('#dim-ai-topic-list')).toHaveCount(0);
  await page.locator('#dim-ai-mode-api').click();
  await expect(page.locator('#dim-ai-cli-panel')).toBeHidden();
  await expect(page.locator('#dim-ai-api-panel')).toBeVisible();
  await page.locator('#dim-ai-mode-cli').click();
  await expect(page.locator('#dim-ai-cli-panel')).toBeVisible();
  await expect(page.locator('#dim-ai-api-panel')).toBeHidden();
  await page.locator('#dim-ai-cli-connect').click();
  await expect(page.locator('#dim-ai-status')).toContainText('接続済み');
  await page.locator('#dim-ai-open-log').click();
  await expect(page.locator('#dim-ai-log-dialog')).toBeVisible();
  await expect(page.locator('#dim-ai-log-output')).toContainText('接続試験の応答を受信しました。');
  await page.locator('#dim-ai-log-close').click();
  await page.locator('#dim-ai-input').fill('速度134で比較して');
  await page.locator('#dim-ai-send').click();
  await expect.poll(() => receivedMessage).toBe('速度134で比較して');
  expect(receivedScope).toBe('workspace');
  expect(receivedTarget).toBe('diminishing');
  expect(receivedState).not.toHaveProperty('diminishing');
  await expect(page.locator('.dim-ai-condition-summary')).toContainText('比較ケース: 1件');
  await expect(page.locator('.dim-ai-comparison')).toContainText('速度134');
  await expect(page.locator('.dim-ai-comparison')).toContainText('フルバフ後ステータス');
  await expect(page.locator('.dim-ai-comparison')).toContainText('偽・螺旋剣');
  await expect(page.locator('.dim-ai-markdown h2')).toHaveText('結論');
  await expect(page.locator('.dim-ai-markdown strong')).toHaveText('速度134');
  await page.locator('#dim-ai-open-log').click();
  await expect(page.locator('#dim-ai-log-output')).toContainText('run_diminishing_comparison: completed');
  await page.locator('#dim-ai-log-close').click();
  await page.locator('.dim-ai-apply').click();
  await expect(page.locator('#dim-ai-undo')).toBeEnabled();
  await page.locator('#dim-ai-undo').click();
  await expect(page.locator('#dim-ai-undo')).toBeDisabled();
});

test('AI assistant selects data for one simulator and has no prompt templates', async ({ page }) => {
  await page.locator('.tab-btn[data-target="tab-ai"]').click();
  await expect(page.locator('#dim-ai-assistant-mount .dim-ai-workspace')).toBeVisible();
  await expect(page.locator('.dim-ai-header-target-selector button')).toHaveCount(2);
  await expect(page.locator('#dim-ai-target-diminishing')).toHaveAttribute('aria-checked', 'true');
  await expect(page.locator('#dim-ai-target-action-order')).toHaveAttribute('aria-checked', 'false');
  await expect(page.locator('.dim-ai-source-card')).toHaveCount(0);
  await expect(page.locator('.dim-ai-context-heading')).toHaveCount(0);
  await expect(page.locator('.dim-ai-roster select')).toHaveCount(4);
  await expect(page.locator('#dim-ai-action-json-section')).toBeHidden();
  await expect(page.locator('#dim-ai-examples')).toHaveCount(0);
  await expect(page.locator('.dim-ai-example')).toHaveCount(0);
  await page.locator('#dim-ai-target-action-order').click();
  await expect(page.locator('#dim-ai-target-action-order')).toHaveAttribute('aria-checked', 'true');
  await expect(page.locator('#dim-ai-action-json-section')).toBeVisible();
  await expect(page.locator('#dim-ai-action-json')).toContainText('現在の行動順パネル');
  await expect(page.locator('#dim-ai-build-selection-title')).toHaveText('行動順に参照するビルド（最大4人）');
  await expect(page.locator('#dim-ai-welcome-title')).toHaveText('行動順を比較します');
  await expect(page.locator('#dim-ai-input')).toHaveAttribute('placeholder', /行動順/);
  await expect(page.locator('[id^="ao-ai-"]')).toHaveCount(0);
});

test('AI connection modes keep CLI and API settings separate', async ({ page }) => {
  const providers: Array<Record<string, string>> = [];
  await page.route('**/api/ai/connect', route => {
    const provider = route.request().postDataJSON().provider as Record<string, string>;
    providers.push(provider);
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true, provider, models: [], toolTest: true }),
    });
  });

  await page.locator('.tab-btn[data-target="tab-ai"]').click();
  await expect(page.locator('#dim-ai-input')).toBeEnabled();
  await page.locator('#dim-ai-input').fill('connection-independent draft');
  await expect(page.locator('#dim-ai-send')).toBeDisabled();
  await page.locator('#dim-ai-mode-api').click();
  await page.locator('#dim-ai-api-key').fill('test-key');
  await page.locator('#dim-ai-api-model').fill('tool-model');
  await page.locator('#dim-ai-api-connect').click();
  await expect.poll(() => providers.length).toBe(1);
  expect(providers[0]).toEqual({
    type: 'openai', endpoint: 'https://api.openai.com/v1', apiKey: 'test-key', model: 'tool-model',
  });

  await page.locator('#dim-ai-mode-cli').click();
  await expect(page.locator('#dim-ai-cli-preset')).toHaveValue('fast');
  await page.locator('#dim-ai-cli-preset').selectOption('custom');
  await page.locator('#dim-ai-cli-model').fill('codex-model');
  await page.locator('#dim-ai-cli-reasoning').selectOption('low');
  await page.locator('#dim-ai-cli-connect').click();
  await expect.poll(() => providers.length).toBe(2);
  expect(providers[1]).toEqual({
    type: 'codex', model: 'codex-model', reasoningEffort: 'low', verbosity: 'low',
  });
  await expect(page.locator('#dim-ai-cli-auto-connect')).toBeChecked();

  await page.reload();
  expect(providers).toHaveLength(2);
  await page.locator('.tab-btn[data-target="tab-ai"]').click();
  await expect(page.locator('#dim-ai-cli-preset')).toHaveValue('custom');
  await expect(page.locator('#dim-ai-cli-model')).toHaveValue('codex-model');
  await expect(page.locator('#dim-ai-cli-reasoning')).toHaveValue('low');
  await expect(page.locator('#dim-ai-status')).toContainText('接続復元');
  expect(providers).toHaveLength(2);
  await expect(page.locator('#dim-ai-send')).toBeEnabled();

  await page.locator('#dim-ai-cli-preset').selectOption('standard');
  await expect(page.locator('#dim-ai-cli-model')).toHaveValue('gpt-5.6-terra');
  await expect(page.locator('#dim-ai-cli-reasoning')).toHaveValue('medium');
  await page.locator('#dim-ai-cli-preset').selectOption('custom');
  await expect(page.locator('#dim-ai-cli-model')).toHaveValue('codex-model');
  await expect(page.locator('#dim-ai-cli-reasoning')).toHaveValue('low');

  await page.locator('#dim-ai-cli-type-claude').click();
  await expect(page.locator('#dim-ai-cli-preset')).toHaveValue('fast');
  await expect(page.locator('#dim-ai-cli-model')).toHaveValue('claude-haiku-4-5-20251001');
  await page.locator('#dim-ai-cli-preset').selectOption('custom');
  await page.locator('#dim-ai-cli-model').fill('claude-custom-model');
  await page.locator('#dim-ai-cli-reasoning').selectOption('high');
  await page.locator('#dim-ai-cli-type-codex').click();
  await expect(page.locator('#dim-ai-cli-preset')).toHaveValue('custom');
  await expect(page.locator('#dim-ai-cli-model')).toHaveValue('codex-model');
  await expect(page.locator('#dim-ai-cli-reasoning')).toHaveValue('low');
  await page.locator('#dim-ai-cli-type-claude').click();
  await expect(page.locator('#dim-ai-cli-preset')).toHaveValue('custom');
  await expect(page.locator('#dim-ai-cli-model')).toHaveValue('claude-custom-model');
  await expect(page.locator('#dim-ai-cli-reasoning')).toHaveValue('high');
});

test('action-order AI shows every completed calculation when the final answer times out', async ({ page }) => {
  let receivedTarget = '';
  await page.route('**/api/ai/connect', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ ok: true, provider: { type: 'codex', model: '' }, models: [], toolTest: true }),
  }));
  await page.route('**/api/ai/chat', route => {
    receivedTarget = route.request().postDataJSON().state.simulationTarget;
    return route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      ok: true,
      sessionId: 'action-order-session',
      providerSessionId: 'action-order-provider-session',
      finalText: '',
      partial: { reason: 'timeout_after_tool_success' },
      executions: [
        {
          name: 'run_action_order_simulation',
          output: { ok: true, panels: [{ name: '速度134', baseSpeed: 134, preSpeed: 134, threshold: 150, turnsWithinThreshold: 2, finalCumulativeAV: 149.25, turns: [] }] },
        },
        {
          name: 'run_action_order_simulation',
          output: { ok: true, panels: [{ name: '速度160', baseSpeed: 160, preSpeed: 160, threshold: 150, turnsWithinThreshold: 2, finalCumulativeAV: 125, turns: [] }] },
        },
      ],
    }),
    });
  });

  await page.locator('.tab-btn[data-target="tab-ai"]').click();
  await page.locator('#dim-ai-target-action-order').click();
  await page.locator('#dim-ai-cli-connect').click();
  await expect(page.locator('#dim-ai-send')).toBeEnabled();
  await page.locator('#dim-ai-input').fill('速度134と160を比較');
  await page.locator('#dim-ai-send').click();
  await expect.poll(() => receivedTarget).toBe('actionOrder');

  const feed = page.locator('#dim-ai-feed');
  await expect(feed).toContainText('速度134');
  await expect(feed).toContainText('速度160');
  await expect(feed).toContainText('AIの文章回答はタイムアウトしましたが、上の計算結果は取得できています。');
});

test('action-order AI sends a selected saved JSON as its calculation state', async ({ page }) => {
  let receivedState: { simulationTarget?: string; actionOrder?: { panels?: Array<{ name?: string }> } } | null = null;
  await page.route('**/api/local-save/action-order/entry/saved-action', route => route.fulfill({ json: {
    ok: true,
    exists: true,
    entry: { id: 'saved-action', name: '保存速度160' },
    state: { schemaVersion: 1, mode: 'all', panels: [{ name: '保存速度160', baseSpeed: 100, preSpeed: 160, threshold: 150, turns: [] }] },
  } }));
  await page.route('**/api/local-save/action-order', route => route.fulfill({ json: {
    ok: true,
    activeId: 'saved-action',
    entries: [{ id: 'saved-action', name: '保存速度160' }],
  } }));
  await page.route('**/api/ai/connect', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ ok: true, provider: { type: 'codex', model: '' }, models: [], toolTest: true }),
  }));
  await page.route('**/api/ai/chat', route => {
    receivedState = route.request().postDataJSON().state;
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true, sessionId: 'saved-json', finalText: '保存JSONを使いました。', executions: [] }),
    });
  });

  await page.locator('.tab-btn[data-target="tab-ai"]').click();
  await page.locator('#dim-ai-target-action-order').click();
  await page.locator('#dim-ai-action-json').selectOption('saved-action');
  await expect(page.locator('#dim-ai-action-json-status')).toContainText('保存速度160');
  await page.locator('#dim-ai-cli-connect').click();
  await page.locator('#dim-ai-input').fill('保存JSONで確認');
  await page.locator('#dim-ai-send').click();

  await expect.poll(() => receivedState?.actionOrder?.panels?.[0]?.name).toBe('保存速度160');
  expect(receivedState?.simulationTarget).toBe('actionOrder');
});

test('AI workspace fits the viewport without page scrolling', async ({ page }) => {
  await page.locator('.tab-btn[data-target="tab-ai"]').click();
  await expect(page.locator('#dim-ai-assistant-mount .dim-ai-workspace')).toBeVisible();

  const layout = await page.evaluate(() => {
    const workspace = document.querySelector<HTMLElement>('#dim-ai-assistant-mount .dim-ai-workspace');
    const sidebar = document.querySelector<HTMLElement>('.dim-ai-sidebar');
    const context = document.querySelector<HTMLElement>('.dim-ai-context');
    const chat = document.querySelector<HTMLElement>('.dim-ai-chat-panel');
    const feed = document.querySelector<HTMLElement>('#dim-ai-feed');
    const form = document.querySelector<HTMLElement>('#dim-ai-form');
    const workspaceRect = workspace?.getBoundingClientRect();
    const formRect = form?.getBoundingClientRect();

    return {
      viewportHeight: window.innerHeight,
      documentHeight: document.documentElement.scrollHeight,
      pageScrollY: window.scrollY,
      bodyOverflow: getComputedStyle(document.body).overflow,
      feedOverflowY: feed ? getComputedStyle(feed).overflowY : '',
      workspaceBottom: workspaceRect?.bottom ?? Number.POSITIVE_INFINITY,
      formBottom: formRect?.bottom ?? Number.POSITIVE_INFINITY,
      contextIsInSidebar: Boolean(sidebar && context && sidebar.contains(context)),
      sidebarWidth: sidebar?.getBoundingClientRect().width ?? 0,
      chatWidth: chat?.getBoundingClientRect().width ?? 0,
      feedHeight: feed?.getBoundingClientRect().height ?? 0,
    };
  });

  expect(layout.bodyOverflow).toBe('hidden');
  expect(layout.feedOverflowY).toBe('auto');
  expect(layout.pageScrollY).toBe(0);
  expect(layout.documentHeight).toBeLessThanOrEqual(layout.viewportHeight);
  expect(layout.workspaceBottom).toBeLessThanOrEqual(layout.viewportHeight + 1);
  expect(layout.formBottom).toBeLessThanOrEqual(layout.viewportHeight + 1);
  expect(layout.contextIsInSidebar).toBe(true);
  expect(layout.chatWidth).toBeGreaterThan(layout.sidebarWidth * 2);
  expect(layout.feedHeight).toBeGreaterThan(250);
});

test('local JSON save panels are available per tab', async ({ page }) => {
  await page.locator('.sub-tab-btn[data-sub-target="sub-speed-advanced"]').click();
  await expect(page.locator('#sub-speed-advanced .local-save-panel')).toBeVisible();
  await expect(page.locator('#adv-ai-open')).toHaveCount(0);
  await expect(page.locator('#adv-ai-settings')).toHaveCount(0);

  await page.locator('.tab-btn[data-target="tab-combat"]').click();
  await expect(page.locator('#tab-combat .local-save-panel')).toBeVisible();

  await page.locator('.tab-btn[data-target="tab-diminishing"]').click();
  await expect(page.locator('#tab-diminishing .local-save-panel')).toBeVisible();
  await expect(page.locator('#tab-diminishing .dim-ai-workspace')).toHaveCount(0);

  await page.locator('.tab-btn[data-target="tab-ai"]').click();
  await expect(page.locator('#dim-ai-assistant-mount .dim-ai-workspace')).toBeVisible();
});

test('relic inventory creates, searches, and imports individually selected public-profile relics', async ({ page }) => {
  await page.locator('.tab-btn[data-target="tab-relics"]').click();
  await pickOption(page, '#relic-create-slot', 'rope');
  await pickOption(page, '#relic-create-main', 'energy_regen');
  await page.locator('#relic-create-label').fill('テストEP縄');
  const firstSub = page.locator('.relic-sub-input').first();
  await firstSub.locator('select').selectOption('critRate');
  await firstSub.locator('input').fill('12');
  await page.locator('#relic-create-form button[type="submit"]').click();
  await expect(page.locator('#relic-results')).toContainText('テストEP縄');

  await pickOption(page, '#relic-create-slot', 'rope');
  const setName = await page.locator('#relic-create-set option').first().textContent();
  await page.route('**/api/mihomo/**', route => route.fulfill({ json: {
    characters: [{ id: 'archer', name: 'アーチャー', relics: [{
      id: 'rope-1', type: 6, name: '公開EP縄', set_name: setName || '', level: 15,
      main_affix: { field: 'energy_regen', value: 0.1944 },
      sub_affix: [{ field: 'crit_rate', value: 0.12 }],
    }] }],
  } }));
  await page.locator('#relic-api-uid').fill('800000000');
  await page.locator('#relic-api-fetch').click();
  await expect(page.locator('#relic-import-preview')).toContainText('公開EP縄');
  await expect(page.locator('.relic-import-choice')).toHaveCount(1);
});

test('relic inventory edits every manually configurable field in place', async ({ page }) => {
  await page.locator('.tab-btn[data-target="tab-relics"]').click();
  await pickOption(page, '#relic-create-slot', 'rope');
  await pickOption(page, '#relic-create-main', 'energy_regen');
  await page.locator('#relic-create-label').fill('編集前EP縄');
  await page.locator('#relic-create-tags').fill('旧ラベル');
  const createSub = page.locator('.relic-sub-input').first();
  await createSub.locator('select').selectOption('critRate');
  await createSub.locator('input').fill('12');
  await page.locator('#relic-create-form button[type="submit"]').click();

  await page.locator('.relic-edit').click();
  const editor = page.locator('.relic-edit-form');
  await expect(editor).toBeVisible();
  await editor.locator('.relic-edit-kind[value="virtual"]').check();
  await editor.locator('.relic-edit-slot').selectOption('feet');
  await editor.locator('.relic-edit-set').selectOption({ index: 1 });
  await editor.locator('.relic-edit-main').selectOption('atk_percent');
  await editor.locator('.relic-edit-label').fill('編集後の速度靴');
  await editor.locator('.relic-edit-tags').fill('新ラベル,検証用');
  const editSub = editor.locator('.relic-sub-input').first();
  await editSub.locator('.relic-edit-sub-stat').selectOption('critDmg');
  await editSub.locator('.relic-edit-sub-value').fill('24');
  await editor.locator('button[type="submit"]').click();

  await expect(page.locator('#relic-results')).toContainText('編集後の速度靴');
  await expect(page.locator('#relic-results')).toContainText('仮想');
  await expect(page.locator('#relic-results')).toContainText('新ラベル');
  await expect(page.locator('#relic-results')).toContainText('会心ダメ +24.0%');
});

test('relic creator keeps the selected set while switching compatible slots', async ({ page }) => {
  await page.locator('.tab-btn[data-target="tab-relics"]').click();
  const set = page.locator('#relic-create-set');
  const cavernSet = await optionValueAt(page, '#relic-create-set', 1);
  await pickOption(page, '#relic-create-set', cavernSet);
  await pickOption(page, '#relic-create-slot', 'feet');
  await expect(set).toHaveValue(cavernSet);

  await pickOption(page, '#relic-create-slot', 'sphere');
  const planarSet = await optionValueAt(page, '#relic-create-set', 1);
  await pickOption(page, '#relic-create-set', planarSet);
  await pickOption(page, '#relic-create-slot', 'rope');
  await expect(set).toHaveValue(planarSet);
});

test('relic creator keeps substat input until the explicit reset button is used', async ({ page }) => {
  await page.locator('.tab-btn[data-target="tab-relics"]').click();
  const firstSub = page.locator('.relic-sub-input').first();
  await firstSub.locator('select').selectOption('critRate');
  await firstSub.locator('input').fill('12');

  const cavernSet = await optionValueAt(page, '#relic-create-set', 1);
  await pickOption(page, '#relic-create-set', cavernSet);
  await pickOption(page, '#relic-create-slot', 'feet');
  await expect(firstSub.locator('input')).toHaveValue('12');

  await page.locator('#relic-create-form button[type="submit"]').click();
  await expect(firstSub.locator('input')).toHaveValue('12');
  await page.locator('#relic-create-reset').click();
  await expect(firstSub.locator('input')).toHaveValue('');
  await expect(firstSub.locator('select')).toHaveValue('');
});

test('relic creator converts hit counts and keeps the mode when editing', async ({ page }) => {
  await page.locator('.tab-btn[data-target="tab-relics"]').click();
  await pickOption(page, '#relic-create-slot', 'rope');
  await pickOption(page, '#relic-create-main', 'energy_regen');
  await expect(page.locator('#relic-create-form .relic-roll-tier-field')).toBeHidden();
  await page.locator('#relic-create-sub-mode').selectOption('roll');
  await expect(page.locator('#relic-create-form .relic-roll-tier-field')).toBeVisible();
  const firstSub = page.locator('.relic-sub-input').first();
  await firstSub.locator('select').selectOption('critRate');
  await firstSub.locator('input').fill('3');
  await page.locator('#relic-create-form button[type="submit"]').click();

  await expect(page.locator('#relic-results')).toContainText('会心率 +9.6%');
  await page.locator('.relic-edit').click();
  const editor = page.locator('.relic-edit-form');
  await expect(editor.locator('[data-relic-sub-mode]')).toHaveValue('roll');
  await expect(editor.locator('.relic-sub-input').first().locator('input')).toHaveValue('3');
});

test('relic import keeps upstream failure details in the visible retrieval log', async ({ page }) => {
  await page.route('**/api/mihomo/**', route => route.fulfill({ status: 500, json: {
    ok: false,
    error: { code: 'MIHOMO_REQUEST_FAILED', message: '公開APIがエラーを返しました（500）。' },
    diagnosticLogs: ['upstream status: 500', 'profile unavailable'],
  } }));
  await page.locator('.tab-btn[data-target="tab-relics"]').click();
  await page.locator('#relic-api-uid').fill('800000000');
  await page.locator('#relic-api-fetch').click();
  await expect(page.locator('#relic-api-status')).toContainText('公開APIがエラーを返しました');
  await expect(page.locator('#relic-api-log-output')).toContainText('profile unavailable');
});

test('relic import logs exactly why an API relic cannot be converted', async ({ page }) => {
  await page.route('**/api/mihomo/**', route => route.fulfill({ json: {
    characters: [{ id: 'archer', name: 'アーチャー', relics: [{
      id: 'unknown-set', type: 6, name: '未登録縄', set_name: '存在しないセット',
      main_affix: { field: 'energy_regen', value: 0.1944 }, sub_affix: [],
    }] }],
  } }));
  await page.locator('.tab-btn[data-target="tab-relics"]').click();
  await page.locator('#relic-api-uid').fill('800000000');
  await page.locator('#relic-api-fetch').click();
  await expect(page.locator('#relic-api-log-output')).toContainText('存在しないセット');
  await expect(page.locator('#relic-import-preview')).toContainText('未登録縄');
});

test('character build tab equips a virtual relic and hands the build to the diminishing tab', async ({ page }) => {
  await page.locator('.tab-btn[data-target="tab-build"]').click();
  await expect(page.locator('#tab-build')).toHaveClass(/active/);
  await expect(page.locator('#cb-slots .cb-slot')).toHaveCount(6);

  // 胴体に仮想遺物を作って装備 → セット・メインステ・サブステが部位カードに乗る
  const bodySlot = page.locator('#cb-slots .cb-slot').nth(2);
  await bodySlot.locator('[data-cb-edit]').click();
  const setId = await optionValueAt(page, '#cb-ed-set', 1);
  const setLabel = ((await page.locator(`#cb-ed-set option[value="${setId}"]`).textContent()) || '').trim();
  await page.locator('#cb-ed-set').selectOption(setId);
  await page.locator('#cb-ed-main').selectOption('crit_dmg');
  const firstSub = page.locator('.cb-editor-subs .cb-sub-row').first();
  await firstSub.locator('select').selectOption('critRate');
  await firstSub.locator('input').fill('9.6');
  await page.locator('#cb-ed-save').click();
  await expect(page.locator('#cb-status')).toContainText('倉庫に保存して装備');
  await expect(bodySlot).toContainText('仮想');
  await expect(bodySlot.locator('.cb-slot-set')).toHaveText(setLabel);
  await expect(bodySlot.locator('.cb-slot-subs')).toContainText('9.6%');
  await expect(page.locator('#cb-sets')).toContainText('1 / 4');

  // 保存 → 限界効用逓減タブへ引き渡し
  await page.locator('#cb-name').fill('E2E ビルド');
  await page.locator('#cb-save').click();
  await expect(page.locator('#cb-status')).toContainText('保存しました');
  await page.locator('#cb-send-dim').click();
  await expect(page.locator('#tab-diminishing')).toHaveClass(/active/);
  await expect(page.locator('#dim-build-name')).toHaveValue('E2E ビルド');
});

test('saved build candidates can be registered outside light cones and swapped repeatedly in diminishing', async ({ page }) => {
  await page.locator('.tab-btn[data-target="tab-build"]').click();
  const eidolonChips = page.locator('#cb-eidolon-cands .cand-chip-main');
  await expect(eidolonChips).toHaveCount(0);
  await expect(page.locator('#cb-eidolon')).toBeVisible();
  await page.locator('#cb-eidolon').selectOption('2');
  await page.locator('#cb-eidolon-cand-add').click();
  await page.locator('#cb-trace-cand-add').click();
  await expect(page.locator('#cb-candidates .cand-chip-main')).toHaveCount(2);
  await expect(page.locator('#cb-candidates .cb-candidate-group')).toHaveCount(2);
  const buildEidolonChip = page.locator('#cb-candidates .cand-chip').filter({ hasText: 'E2' });
  await expect(buildEidolonChip.locator('.cand-chip-label')).toHaveText('E2');
  await expect(buildEidolonChip.locator('.cand-chip-delta')).toHaveCount(0);
  await page.locator('#cb-candidates .cand-chip-main').filter({ hasText: 'E2' }).click();
  await expect(page.locator('#cb-status')).toContainText('反映しました');

  await page.locator('#cb-name').fill('E2E 差分候補');
  await page.locator('#cb-save').click();
  await page.locator('#cb-send-dim').click();

  await expect(page.locator('#tab-diminishing')).toHaveClass(/active/);
  await expect(page.locator('#dim-char-panel')).toHaveCount(0);
  await expect(page.locator('#dim-self-buffs-panel')).toHaveCount(0);
  await expect(page.locator('#dim-candidates-panel')).toBeVisible();
  const candidates = page.locator('#dim-candidates .dim-candidate-option');
  await expect(candidates).toHaveCount(2);
  const dimEidolonOption = page.locator('#dim-candidates .dim-candidate-option').filter({ hasText: 'E2' });
  await expect(dimEidolonOption.locator('.dim-candidate-option-label')).toHaveText('E2');
  await expect(dimEidolonOption.locator('.dim-candidate-option-delta')).toHaveText('—');
  const radioOptions = page.locator('#dim-candidates .dim-candidate-option input[type="radio"]');
  await expect(radioOptions).toHaveCount(2);
  await expect(page.locator('#dim-candidates .dim-candidate-options').first()).toHaveCSS('overflow-y', 'auto');

  await candidates.nth(0).click();
  await expect(radioOptions.nth(0)).toBeChecked();
  await expect(page.locator('#dim-candidates .dim-candidate-option.is-current')).toHaveCount(1);
  await candidates.nth(1).click();
  await expect(radioOptions.nth(1)).toBeChecked();
  await expect(page.locator('#dim-candidates .dim-candidate-option.is-current')).toHaveCount(2);
  await page.locator('#dim-candidates [data-dim-candidate-clear-group]').first().click();
  await expect(radioOptions.nth(0)).not.toBeChecked();
  await expect(page.locator('#dim-candidates .dim-candidate-option.is-current')).toHaveCount(1);
  await page.locator('#dim-candidate-reset').click();
  for (let index = 0; index < 2; index++) {
    await expect(radioOptions.nth(index)).not.toBeChecked();
  }
  await expect(page.locator('#dim-candidates .dim-candidate-option.is-current')).toHaveCount(0);
});

test('character build tab substat input mode replaces equipped substats', async ({ page }) => {
  await page.locator('.tab-btn[data-target="tab-build"]').click();
  const bodySlot = page.locator('#cb-slots .cb-slot').nth(2);
  await bodySlot.locator('[data-cb-edit]').click();
  const firstSub = page.locator('.cb-editor-subs .cb-sub-row').first();
  await firstSub.locator('select').selectOption('spdFlat');
  await firstSub.locator('input').fill('10');
  await page.locator('#cb-ed-apply').click();
  const speedBox = page.locator('.cb-hero-box').filter({ hasText: '速度' }).first();
  const withRelicSub = await speedBox.innerText();

  // 手入力モードでは装備サブステが無効化され、速度が下がる
  await page.locator('[data-cb-mode="manual"]').click();
  await expect(page.locator('.cb-slot-subs.is-muted').first()).toBeVisible();
  await expect(speedBox).not.toHaveText(withRelicSub);

  // 手入力した速度は加算される
  await page.locator('#cb-subs-input input[data-cb-sub="spdFlat"]').fill('10');
  await expect(speedBox).toHaveText(withRelicSub);
});
