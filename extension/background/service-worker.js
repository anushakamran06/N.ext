import { fingerprint } from '../utils/fingerprint.js';
import Storage from '../utils/storage.js';

const BACKEND_URL = 'https://next-backend.fly.dev';
const ALARM_POLL = 'next_poll_backend';
const MAX_PER_SOURCE_PER_DAY = 5;

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({ url: chrome.runtime.getURL('../popup/onboarding.html') });
  }
  chrome.alarms.create(ALARM_POLL, { periodInMinutes: 360 }); // 6 hours
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === ALARM_POLL) {
    await pollBackend();
  }
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'NEW_ITEMS') {
    handleNewItems(msg.items, msg.source).then(() => sendResponse({ ok: true }));
    return true;
  }
  if (msg.type === 'DISMISS') {
    Storage.dismissFeedItem(msg.fp).then(() => sendResponse({ ok: true }));
    return true;
  }
  if (msg.type === 'SUPPRESS') {
    Storage.addSuppressKeywords(msg.keywords).then(() => sendResponse({ ok: true }));
    return true;
  }
});

async function handleNewItems(items, source) {
  for (const item of items) {
    const fp = fingerprint(item.title, source, item.date || '');
    if (await Storage.isSeen(fp)) continue;
    if (await Storage.shouldSuppress(item.title)) continue;

    const count = await Storage.getDailyCount(source);
    if (count >= MAX_PER_SOURCE_PER_DAY) continue;

    await Storage.markSeen(fp);
    await Storage.incrementDailyCount(source);

    const feedItem = {
      fp,
      source,
      title: item.title,
      deadline: item.deadline || null,
      url: item.url || null,
      timestamp: Date.now(),
      dismissed: false,
    };
    await Storage.addFeedItem(feedItem);

    const notifTitle = `[${source}] ${item.title}`;
    const notifMessage = item.deadline ? `Deadline: ${item.deadline}` : 'New opportunity';
    chrome.notifications.create(fp, {
      type: 'basic',
      iconUrl: '../icons/icon48.png',
      title: notifTitle,
      message: notifMessage,
    });
  }
}

async function pollBackend() {
  const prefs = await Storage.getPrefs();
  const template = prefs?.template || 'internship';

  try {
    const res = await fetch(`${BACKEND_URL}/feed?template=${template}`);
    if (!res.ok) return;
    const data = await res.json();
    if (Array.isArray(data.items)) {
      await handleNewItems(data.items, data.source || 'NUS Feed');
    }
  } catch (e) {
    console.error('[N.ext] Backend poll failed:', e);
  }
}
