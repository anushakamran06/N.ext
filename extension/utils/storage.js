const SEEN_KEY = 'next_seen_fingerprints';
const FEED_KEY = 'next_feed_items';
const PREFS_KEY = 'next_prefs';
const SUPPRESS_KEY = 'next_suppress_keywords';
const COUNTS_KEY = 'next_daily_counts';

const Storage = {
  async getSeenFingerprints() {
    const r = await chrome.storage.local.get(SEEN_KEY);
    return r[SEEN_KEY] || {};
  },

  async markSeen(fp) {
    const seen = await this.getSeenFingerprints();
    seen[fp] = Date.now();
    // Prune fingerprints older than 30 days
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    for (const k in seen) {
      if (seen[k] < cutoff) delete seen[k];
    }
    await chrome.storage.local.set({ [SEEN_KEY]: seen });
  },

  async isSeen(fp) {
    const seen = await this.getSeenFingerprints();
    return !!seen[fp];
  },

  async getFeedItems() {
    const r = await chrome.storage.local.get(FEED_KEY);
    return r[FEED_KEY] || [];
  },

  async addFeedItem(item) {
    const items = await this.getFeedItems();
    items.unshift(item);
    // Keep at most 100 items
    const trimmed = items.slice(0, 100);
    await chrome.storage.local.set({ [FEED_KEY]: trimmed });
  },

  async dismissFeedItem(fp) {
    const items = await this.getFeedItems();
    const updated = items.map(i => i.fp === fp ? { ...i, dismissed: true } : i);
    await chrome.storage.local.set({ [FEED_KEY]: updated });
  },

  async getPrefs() {
    const r = await chrome.storage.local.get(PREFS_KEY);
    return r[PREFS_KEY] || null;
  },

  async setPrefs(prefs) {
    await chrome.storage.local.set({ [PREFS_KEY]: prefs });
  },

  async getSuppressKeywords() {
    const r = await chrome.storage.local.get(SUPPRESS_KEY);
    return r[SUPPRESS_KEY] || [];
  },

  async addSuppressKeywords(keywords) {
    const existing = await this.getSuppressKeywords();
    const merged = [...new Set([...existing, ...keywords])];
    await chrome.storage.local.set({ [SUPPRESS_KEY]: merged });
  },

  async shouldSuppress(title) {
    const keywords = await this.getSuppressKeywords();
    if (!keywords.length) return false;
    const lower = title.toLowerCase();
    const matches = keywords.filter(kw => lower.includes(kw.toLowerCase()));
    return matches.length >= 2;
  },

  async getDailyCounts() {
    const r = await chrome.storage.local.get(COUNTS_KEY);
    const data = r[COUNTS_KEY] || {};
    const today = new Date().toDateString();
    if (data.date !== today) return { date: today, counts: {} };
    return data;
  },

  async incrementDailyCount(source) {
    const data = await this.getDailyCounts();
    data.counts[source] = (data.counts[source] || 0) + 1;
    await chrome.storage.local.set({ [COUNTS_KEY]: data });
    return data.counts[source];
  },

  async getDailyCount(source) {
    const data = await this.getDailyCounts();
    return data.counts[source] || 0;
  },
};

if (typeof module !== 'undefined') {
  module.exports = Storage;
} else {
  globalThis.NExtStorage = Storage;
}
