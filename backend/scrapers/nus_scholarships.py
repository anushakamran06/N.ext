import hashlib
import httpx
from bs4 import BeautifulSoup

URL = 'https://scholarships.nus.edu.sg'
SOURCE = 'NUS Scholarships'


def _fingerprint(title: str) -> str:
    return hashlib.sha256(f'{title.lower().strip()}|scholarships'.encode()).hexdigest()[:16]


async def fetch_scholarship_items() -> list[dict]:
    async with httpx.AsyncClient(follow_redirects=True, timeout=20) as client:
        try:
            r = await client.get(URL)
            r.raise_for_status()
        except Exception as e:
            print(f'[nus_scholarships] fetch failed: {e}')
            return []

    soup = BeautifulSoup(r.text, 'lxml')
    items = []

    for el in soup.select('a[href*="scholarship"], .scholarship-item, .listing-title'):
        title = el.get_text(strip=True)
        if len(title) < 8:
            continue
        href = el.get('href', '')
        url = href if href.startswith('http') else f'{URL}{href}'
        items.append({
            'fingerprint': _fingerprint(title),
            'source': SOURCE,
            'title': title,
            'url': url,
            'deadline': None,
            'template_tags': 'scholarship',
        })

    return items
