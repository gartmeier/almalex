from typing import Generic, TypeVar

from sqlalchemy.orm import Session

from app.db.session import Base

ModelT = TypeVar("ModelT", bound=Base)


class BaseRepository(Generic[ModelT]):
    def __init__(self, model: type[ModelT], db: Session):
        self.model = model
        self.db = db

    def get(self, id) -> ModelT | None:
        return self.db.get(self.model, id)

    def create(self, obj: ModelT) -> ModelT:
        self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj
