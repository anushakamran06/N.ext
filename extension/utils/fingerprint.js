// djb2 hash — fast, collision-resistant enough for dedup
function hashString(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
  }
  return (hash >>> 0).toString(36);
}

function fingerprint(title, source, date) {
  const normalised = [title, source, date]
    .map(s => (s || '').trim().toLowerCase())
    .join('|');
  return hashString(normalised);
}

// Exported for both content scripts (classic) and service worker (module)
if (typeof module !== 'undefined') {
  module.exports = { fingerprint, hashString };
} else {
  globalThis.NExtFingerprint = { fingerprint, hashString };
}
