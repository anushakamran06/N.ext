import hashlib
import httpx

SUBREDDIT = 'nus'
KEYWORDS = {'internship', 'scholarship', 'application', 'deadline', 'bursary', 'sep', 'exchange', 'hackathon'}
REDDIT_URL = f'https://www.reddit.com/r/{SUBREDDIT}/new.json?limit=50'
HEADERS = {'User-Agent': 'N.ext/1.0 (NUS opportunity aggregator)'}

TEMPLATE_MAP = {
    'internship': {'internship', 'application', 'deadline', 'hackathon'},
    'scholarship': {'scholarship', 'bursary', 'sep', 'exchange'},
    'freshman': {'application', 'deadline'},
}


def _fingerprint(title: str, source: str) -> str:
    raw = f'{title.lower().strip()}|{source}'
    return hashlib.sha256(raw.encode()).hexdigest()[:16]


def _template_tags(title: str) -> str:
    lower = title.lower()
    tags = []
    for tmpl, words in TEMPLATE_MAP.items():
        if any(w in lower for w in words):
            tags.append(tmpl)
    return ','.join(tags) if tags else 'all'


async def fetch_reddit_items() -> list[dict]:
    async with httpx.AsyncClient(headers=HEADERS, follow_redirects=True, timeout=15) as client:
        try:
            r = await client.get(REDDIT_URL)
            r.raise_for_status()
            data = r.json()
        except Exception as e:
            print(f'[reddit] fetch failed: {e}')
            return []

    items = []
    for post in data.get('data', {}).get('children', []):
        p = post.get('data', {})
        title: str = p.get('title', '')
        if not any(kw in title.lower() for kw in KEYWORDS):
            continue
        items.append({
            'fingerprint': _fingerprint(title, 'reddit_nus'),
            'source': 'Reddit r/NUS',
            'title': title,
            'url': f"https://reddit.com{p.get('permalink', '')}",
            'deadline': None,
            'template_tags': _template_tags(title),
        })
    return items
