from apscheduler.schedulers.asyncio import AsyncIOScheduler
from sqlalchemy import select
from database import AsyncSessionLocal
from models import FeedItem
from scrapers.reddit import fetch_reddit_items
from scrapers.nus_scholarships import fetch_scholarship_items
from scrapers.nus_news import fetch_news_items
from scrapers.devpost import fetch_devpost_items

scheduler = AsyncIOScheduler()


async def _upsert_items(items: list[dict]):
    if not items:
        return
    async with AsyncSessionLocal() as db:
        for item in items:
            existing = await db.scalar(
                select(FeedItem).where(FeedItem.fingerprint == item['fingerprint'])
            )
            if existing:
                continue
            db.add(FeedItem(**item))
        await db.commit()


async def job_reddit():
    print('[cron] running reddit scrape')
    items = await fetch_reddit_items()
    await _upsert_items(items)
    print(f'[cron] reddit: {len(items)} items processed')


async def job_scholarships():
    print('[cron] running NUS scholarships scrape')
    items = await fetch_scholarship_items()
    await _upsert_items(items)
    print(f'[cron] scholarships: {len(items)} items processed')


async def job_news():
    print('[cron] running NUS news scrape')
    items = await fetch_news_items()
    await _upsert_items(items)
    print(f'[cron] news: {len(items)} items processed')


async def job_devpost():
    print('[cron] running Devpost scrape')
    items = await fetch_devpost_items()
    await _upsert_items(items)
    print(f'[cron] devpost: {len(items)} items processed')


def start_scheduler():
    scheduler.add_job(job_reddit, 'interval', hours=6, id='reddit', replace_existing=True)
    scheduler.add_job(job_scholarships, 'interval', hours=12, id='scholarships', replace_existing=True)
    scheduler.add_job(job_news, 'interval', hours=6, id='news', replace_existing=True)
    scheduler.add_job(job_devpost, 'interval', hours=12, id='devpost', replace_existing=True)
    scheduler.start()
