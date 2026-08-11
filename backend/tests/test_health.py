import pytest
from fastapi import HTTPException
from sqlalchemy.exc import OperationalError

import app.main as main_module


class Database:
    def __enter__(self):
        return self

    def __exit__(self, *_):
        pass

    def execute(self, _):
        pass


class Redis:
    def ping(self):
        return True


def test_health_checks_dependencies(monkeypatch):
    monkeypatch.setattr(main_module, "SessionLocal", Database)
    monkeypatch.setattr(main_module, "get_redis", Redis)

    assert main_module.health() == {"status": "ok"}


def test_health_returns_503_when_database_is_unavailable(monkeypatch):
    class UnavailableDatabase(Database):
        def execute(self, _):
            raise OperationalError("SELECT 1", {}, Exception())

    monkeypatch.setattr(main_module, "SessionLocal", UnavailableDatabase)

    with pytest.raises(HTTPException) as error:
        main_module.health()

    assert error.value.status_code == 503
