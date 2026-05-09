import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, DeclarativeBase

DATABASE_URL = os.getenv(
    'DATABASE_URL',
    'sqlite+aiosqlite:///./next.db'
).replace('postgres://', 'postgresql+asyncpg://')

engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session


async def init_db():
    from models import FeedItem  # noqa: F401 — ensures table is registered
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
