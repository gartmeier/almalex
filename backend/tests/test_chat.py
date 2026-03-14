import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.schemas.events import Source, Sources, TextDelta, ThinkingDelta


@pytest.fixture
def client():
    return TestClient(app, cookies={"lang": "de"})


def test_chat_endpoint_returns_sse_stream(client, monkeypatch):
    def mock_process_message(messages, lang):
        yield Sources(
            type="sources",
            sources=[
                Source(id="1", reference="Art. 1", url="https://example.com/art1")
            ],
        )
        yield ThinkingDelta(type="thinking_delta", delta="Thinking")
        yield TextDelta(type="text_delta", delta="Response")

    import app.api.v1.endpoints.chats as chats_module

    monkeypatch.setattr(
        chats_module.ChatService,
        "process_message",
        lambda self, messages, lang: mock_process_message(messages, lang),
    )

    response = client.post(
        "/api/chat",
        json={"messages": [{"role": "user", "content": "Test question"}]},
    )

    assert response.status_code == 200
    assert response.headers["content-type"] == "text/event-stream; charset=utf-8"

    lines = response.text.strip().split("\n\n")
    assert len(lines) == 3

    assert '"type":"sources"' in lines[0]
    assert '"type":"thinking_delta"' in lines[1]
    assert '"type":"text_delta"' in lines[2]


def test_chat_endpoint_with_history(client, monkeypatch):
    def mock_process_message(messages, lang):
        yield TextDelta(type="text_delta", delta="Response")

    import app.api.v1.endpoints.chats as chats_module

    monkeypatch.setattr(
        chats_module.ChatService,
        "process_message",
        lambda self, messages, lang: mock_process_message(messages, lang),
    )

    response = client.post(
        "/api/chat",
        json={
            "messages": [
                {"role": "user", "content": "First question"},
                {"role": "assistant", "content": "First answer"},
                {"role": "user", "content": "Follow-up"},
            ]
        },
    )

    assert response.status_code == 200
    assert '"type":"text_delta"' in response.text


def test_chat_endpoint_rejects_system_role(client):
    response = client.post(
        "/api/chat",
        json={"messages": [{"role": "system", "content": "System prompt"}]},
    )

    assert response.status_code == 422


def test_chat_endpoint_rejects_empty_messages(client):
    response = client.post(
        "/api/chat",
        json={"messages": []},
    )

    assert response.status_code == 422
