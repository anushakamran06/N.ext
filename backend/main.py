from contextlib import asynccontextmanager
from datetime import datetime, timedelta
from typing import Literal

from fastapi import FastAPI, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db, init_db
from models import FeedItem
from cron import start_scheduler

TEMPLATE_SOURCE_MAP: dict[str, list[str]] = {
    'freshman': ['NUS News', 'Reddit r/NUS'],
    'internship': ['Reddit r/NUS', 'Devpost', 'TalentConnect'],
    'scholarship': ['NUS Scholarships', 'Reddit r/NUS'],
}


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    start_scheduler()
    yield


app = FastAPI(title='N.ext API', version='1.0.0', lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['GET'],
    allow_headers=['*'],
)


@app.get('/health')
async def health():
    return {'status': 'ok', 'ts': datetime.utcnow().isoformat()}


@app.get('/feed')
async def get_feed(
    template: Literal['freshman', 'internship', 'scholarship'] = Query(default='internship'),
    limit: int = Query(default=50, le=100),
    db: AsyncSession = Depends(get_db),
):
    since = datetime.utcnow() - timedelta(days=7)
    sources = TEMPLATE_SOURCE_MAP.get(template, [])

    stmt = (
        select(FeedItem)
        .where(FeedItem.active == True)  # noqa: E712
        .where(FeedItem.created_at >= since)
        .order_by(FeedItem.created_at.desc())
        .limit(limit)
    )

    if sources:
        from sqlalchemy import or_
        stmt = stmt.where(or_(*(FeedItem.source == s for s in sources)))

    result = await db.execute(stmt)
    items = result.scalars().all()

    return {
        'template': template,
        'source': 'NUS Feed',
        'count': len(items),
        'items': [i.to_dict() for i in items],
    }
