// Content script for canvas.nus.edu.sg
(async () => {
  const { fingerprint } = globalThis.NExtFingerprint;
  const Storage = globalThis.NExtStorage;
  const SOURCE = 'Canvas';

  const prefs = await Storage.getPrefs();
  if (prefs && !prefs.sources?.canvas) return;

  const items = [];

  // ── Announcements ──────────────────────────────────────────────
  document.querySelectorAll('.ic-announcement-row, [data-testid="announcement"]').forEach(el => {
    const titleEl = el.querySelector('a[class*="title"], .ic-announcement-row__content a');
    const dateEl = el.querySelector('time, .announcement-created-at');
    if (!titleEl) return;
    items.push({
      title: titleEl.textContent.trim(),
      date: dateEl?.getAttribute('datetime') || dateEl?.textContent.trim() || '',
      url: titleEl.href || null,
    });
  });

  // ── Upcoming deadlines / assignments ──────────────────────────
  document.querySelectorAll('.assignment, [data-testid="planner-item"]').forEach(el => {
    const titleEl = el.querySelector('a.ig-title, .PlannerItem-styles__title a, h3 a');
    const dateEl = el.querySelector('time, .assignment-date-due');
    if (!titleEl) return;
    items.push({
      title: `[Due] ${titleEl.textContent.trim()}`,
      date: dateEl?.getAttribute('datetime') || dateEl?.textContent.trim() || '',
      deadline: dateEl?.textContent.trim() || null,
      url: titleEl.href || null,
    });
  });

  // ── Unread notifications badge ─────────────────────────────────
  document.querySelectorAll('#global_nav_notifications_link .count-badge').forEach(el => {
    const count = parseInt(el.textContent.trim(), 10);
    if (count > 0) {
      items.push({
        title: `You have ${count} unread notification${count > 1 ? 's' : ''} on Canvas`,
        date: new Date().toISOString(),
      });
    }
  });

  if (items.length > 0) {
    chrome.runtime.sendMessage({ type: 'NEW_ITEMS', items, source: SOURCE });
  }
})();
