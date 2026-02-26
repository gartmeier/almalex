import nanoid as _nanoid
from sqlalchemy.orm import DeclarativeBase


def nanoid() -> str:
    return _nanoid.generate(alphabet="0123456789abcdefghijklmnopqrstuvwxyz", size=12)


class Base(DeclarativeBase):
    pass
