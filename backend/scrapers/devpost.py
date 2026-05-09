import hashlib
import httpx
from bs4 import BeautifulSoup

URL = 'https://devpost.com/hackathons?themes[]=Singapore&status[]=open'
SOURCE = 'Devpost'


def _fingerprint(title: str) -> str:
    return hashlib.sha256(f'{title.lower().strip()}|devpost'.encode()).hexdigest()[:16]


async def fetch_devpost_items() -> list[dict]:
    async with httpx.AsyncClient(follow_redirects=True, timeout=20, headers={'User-Agent': 'N.ext/1.0'}) as client:
        try:
            r = await client.get(URL)
            r.raise_for_status()
        except Exception as e:
            print(f'[devpost] fetch failed: {e}')
            return []

    soup = BeautifulSoup(r.text, 'lxml')
    items = []

    for card in soup.select('.hackathon-tile, article.hackathon'):
        title_el = card.select_one('h2, h3, .title')
        deadline_el = card.select_one('.submission-period, time, .deadline')
        link_el = card.select_one('a[href]')

        if not title_el:
            continue

        title = title_el.get_text(strip=True)
        deadline = deadline_el.get_text(strip=True) if deadline_el else None
        url = link_el['href'] if link_el else None
        if url and not url.startswith('http'):
            url = f'https://devpost.com{url}'

        items.append({
            'fingerprint': _fingerprint(title),
            'source': SOURCE,
            'title': title,
            'url': url,
            'deadline': deadline,
            'template_tags': 'internship',
        })

    return items
