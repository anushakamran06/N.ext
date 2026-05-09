// Content script for nus-csm.symplicity.com (TalentConnect)
(async () => {
  const Storage = globalThis.NExtStorage;
  const SOURCE = 'TalentConnect';

  const prefs = await Storage.getPrefs();
  if (prefs && !prefs.sources?.talentconnect) return;

  const items = [];

  // Internship / job listings table rows
  document.querySelectorAll('.sym_listing_row, tr.listingRow, .job-listing').forEach(el => {
    const titleEl = el.querySelector('td.jobTitle a, .position-title a, a.listing-name');
    const companyEl = el.querySelector('td.employer, .company-name, .employer-name');
    const deadlineEl = el.querySelector('td.deadline, .app-deadline, time[data-deadline]');
    const eligEl = el.querySelector('.eligibility, .eligible-for');

    if (!titleEl) return;

    const title = titleEl.textContent.trim();
    const company = companyEl?.textContent.trim() || '';
    const deadline = deadlineEl?.textContent.trim() || null;
    const eligibility = eligEl?.textContent.trim() || null;

    items.push({
      title: company ? `${title} — ${company}` : title,
      date: deadline || new Date().toISOString(),
      deadline,
      eligibility,
      url: titleEl.href || null,
    });
  });

  if (items.length > 0) {
    chrome.runtime.sendMessage({ type: 'NEW_ITEMS', items, source: SOURCE });
  }
})();
