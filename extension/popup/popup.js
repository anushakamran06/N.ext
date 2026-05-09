const STORAGE_FEED_KEY = 'next_feed_items';

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function extractKeywords(title) {
  const stopwords = new Set(['the', 'a', 'an', 'and', 'or', 'for', 'to', 'of', 'in', 'on', 'at', 'is', 'are', 'you', 'your', 'have', 'new']);
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopwords.has(w))
    .slice(0, 5);
}

function renderCard(item) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.fp = item.fp;

  const titleContent = item.url
    ? `<a href="${item.url}" target="_blank" rel="noopener">${item.title}</a>`
    : item.title;

  card.innerHTML = `
    <div class="card-top">
      <span class="source-tag">${item.source}</span>
      <span class="card-title">${titleContent}</span>
      <button class="dismiss-btn" title="Dismiss">×</button>
    </div>
    <div class="card-meta">
      <span class="card-time">${timeAgo(item.timestamp)}</span>
      ${item.deadline ? `<span class="card-deadline">⏰ ${item.deadline}</span>` : ''}
      <button class="suppress-btn">Don't show like this</button>
    </div>
  `;

  card.querySelector('.dismiss-btn').addEventListener('click', async () => {
    await chrome.runtime.sendMessage({ type: 'DISMISS', fp: item.fp });
    card.remove();
    checkEmpty();
  });

  card.querySelector('.suppress-btn').addEventListener('click', async () => {
    const keywords = extractKeywords(item.title);
    await chrome.runtime.sendMessage({ type: 'SUPPRESS', keywords });
    await chrome.runtime.sendMessage({ type: 'DISMISS', fp: item.fp });
    card.remove();
    checkEmpty();
  });

  return card;
}

function checkEmpty() {
  const feed = document.getElementById('feed');
  const cards = feed.querySelectorAll('.card');
  document.getElementById('emptyState').style.display = cards.length === 0 ? 'flex' : 'none';
}

async function loadFeed() {
  const r = await chrome.storage.local.get(STORAGE_FEED_KEY);
  const items = (r[STORAGE_FEED_KEY] || []).filter(i => !i.dismissed);
  const feed = document.getElementById('feed');

  if (items.length === 0) {
    document.getElementById('emptyState').style.display = 'flex';
    return;
  }

  document.getElementById('emptyState').style.display = 'none';
  items.forEach(item => feed.appendChild(renderCard(item)));
}

document.getElementById('clearAllBtn').addEventListener('click', async () => {
  const r = await chrome.storage.local.get(STORAGE_FEED_KEY);
  const items = (r[STORAGE_FEED_KEY] || []).map(i => ({ ...i, dismissed: true }));
  await chrome.storage.local.set({ [STORAGE_FEED_KEY]: items });
  document.getElementById('feed').querySelectorAll('.card').forEach(c => c.remove());
  document.getElementById('emptyState').style.display = 'flex';
});

document.getElementById('settingsBtn').addEventListener('click', () => {
  chrome.runtime.openOptionsPage?.() || chrome.tabs.create({ url: 'onboarding.html' });
});

document.getElementById('settingsPageBtn').addEventListener('click', () => {
  chrome.tabs.create({ url: chrome.runtime.getURL('popup/onboarding.html') });
});

loadFeed();
