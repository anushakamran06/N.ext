from datetime import datetime
from sqlalchemy import String, DateTime, Boolean, Text
from sqlalchemy.orm import Mapped, mapped_column
from database import Base


class FeedItem(Base):
    __tablename__ = 'feed_items'

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    fingerprint: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    source: Mapped[str] = mapped_column(String(64))
    title: Mapped[str] = mapped_column(Text)
    url: Mapped[str | None] = mapped_column(Text, nullable=True)
    deadline: Mapped[str | None] = mapped_column(String(128), nullable=True)
    template_tags: Mapped[str] = mapped_column(String(256), default='')
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    active: Mapped[bool] = mapped_column(Boolean, default=True)

    def to_dict(self):
        return {
            'id': self.id,
            'source': self.source,
            'title': self.title,
            'url': self.url,
            'deadline': self.deadline,
            'created_at': self.created_at.isoformat(),
        }
