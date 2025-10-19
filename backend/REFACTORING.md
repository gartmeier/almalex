# Refactoring Migration Path

## Overview

Incremental refactoring to improve structure without breaking existing functionality. Keep FastAPI's pragmatic CRUD pattern while extracting business logic from routes.

## Current Issues

1. **Streaming logic in route handlers** - Business logic mixed with HTTP layer (70 lines in routes file)
2. **CRUD is a catch-all** - Chat, search, and document operations in one file
3. **Routes directly orchestrate** - RAG pipeline mixed with HTTP concerns
4. **Schemas split inconsistently** - Some inline, some in shared file

## Target Structure

```
app/
├── api/
│   ├── deps.py
│   ├── main.py
│   ├── routes/
│   │   ├── chats.py         # HTTP layer only
│   │   └── documents.py
│   └── schemas/             # NEW: Dedicated schemas package
│       ├── chat.py
│       ├── document.py
│       └── search.py
│
├── services/                # NEW: Business logic layer
│   └── chat_service.py      # RAG orchestration & streaming
│
├── crud/                    # NEW: Split CRUD by domain (keep pattern)
│   ├── chat.py              # Chat/message CRUD
│   ├── document.py          # Document CRUD
│   └── search.py            # Search functions
│
├── ai/                      # Keep separate (infrastructure)
│   ├── prompts/
│   ├── service.py           # Keep as-is (fine for current size)
│   └── formatters.py        # NEW: format_chunks utility
│
├── db/
├── core/
├── utils/
├── redis.py
├── limiter.py
└── main.py
```

## Phase 1: Extract Streaming Logic to Service

**Goal:** Remove business logic from route handlers.

**Files to create:**
- `app/services/__init__.py`
- `app/services/chat_service.py`

**Changes:**

1. Create service module:
```python
# app/services/chat_service.py
from sqlalchemy.orm import Session
from app.core.types import Language
from app.db.models import Chat, ChatMessage
from app import crud
from app.ai.service import generate_query, create_embedding, generate_answer, generate_title

def stream_initial_completion(db: Session, chat_id: str, message_id: str, lang: Language = "de"):
    """Generate initial chat completion with title."""
    # Move from chats.py:101-114
    pass

def stream_subsequent_completion(db: Session, chat_id: str, lang: Language = "de"):
    """Generate completion for follow-up messages."""
    # Move from chats.py:117-123
    pass

def stream_completion(db: Session, chat: Chat, lang: Language = "de"):
    """Core RAG streaming logic."""
    # Move from chats.py:126-164
    pass

def format_event(event_type: str, data: str | dict | list[dict]) -> str:
    """Format SSE event."""
    # Move from chats.py:167-168
    pass
```

2. Update routes to use service:
```python
# app/api/routes/chats.py
from app.services import chat_service

@router.post("/{chat_id}/messages", ...)
async def create_message(chat_id: str, message_in: MessageCreate, db: SessionDep, lang: Language):
    chat = crud.get_chat(db=db, chat_id=chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    crud.create_user_message(db=db, message_content=message_in.content, chat_id=chat_id)

    return StreamingResponse(
        chat_service.stream_subsequent_completion(db, chat.id, lang),
        media_type="text/event-stream",
    )
```

**Benefits:**
- Routes become thin HTTP handlers
- Streaming logic testable in isolation
- Can reuse in CLI or other contexts

---

## Phase 2: Split CRUD by Domain

**Goal:** Organize CRUD functions by domain instead of one monolithic file.

**Files to create:**
- `app/crud/__init__.py`
- `app/crud/chat.py`
- `app/crud/document.py`
- `app/crud/search.py`

**Changes:**

1. Create chat CRUD:
```python
# app/crud/chat.py
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload
from app.db.models import Chat, ChatMessage
from app.utils.helpers import nanoid

def get_chat(db: Session, chat_id: str) -> Chat | None:
    """Get chat by ID with messages."""
    # Move from crud.py:9-12
    pass

def create_chat(db: Session, chat_id: str, message: str) -> tuple[Chat, ChatMessage]:
    """Create new chat with initial message."""
    # Move from crud.py:15-32
    pass

def create_user_message(db: Session, message_content: str, chat_id: str) -> ChatMessage:
    """Create user message in chat."""
    # Move from crud.py:36-51
    pass

def create_assistant_message(db: Session, chat_id: str) -> ChatMessage:
    """Create empty assistant message."""
    # Move from crud.py:54-64
    pass
```

2. Create search CRUD:
```python
# app/crud/search.py
from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload
from app.ai.service import create_embedding
from app.db.models import Document, DocumentChunk

def search(db: Session, query: str, top_k: int = 20):
    """Vector similarity search."""
    # Move from crud.py:67-73
    pass

def search_similar(db: Session, embedding: list[float], top_k: int = 20) -> tuple[list[DocumentChunk], list[Document]]:
    """Vector search with unique documents."""
    # Move from crud.py:76-101
    pass

def hybrid_search(db: Session, query: str, top_k: int = 20, rrf_k: int = 60) -> tuple[list[DocumentChunk], list[Document]]:
    """Hybrid search with RRF fusion."""
    # Move from crud.py:108-205
    pass
```

3. Create document CRUD:
```python
# app/crud/document.py
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.db.models import Document

def get_document(db: Session, document_id: int):
    """Get document by ID."""
    # Move from crud.py:104-105
    pass
```

4. Create package with exports:
```python
# app/crud/__init__.py
from app.crud.chat import (
    get_chat,
    create_chat,
    create_user_message,
    create_assistant_message,
)
from app.crud.document import get_document
from app.crud.search import search, search_similar, hybrid_search

__all__ = [
    "get_chat",
    "create_chat",
    "create_user_message",
    "create_assistant_message",
    "get_document",
    "search",
    "search_similar",
    "hybrid_search",
]
```

5. Update imports (minimal changes needed):
```python
# Existing code still works!
from app import crud
crud.get_chat(db, chat_id)

# Or use direct imports
from app.crud import get_chat, create_chat
```

6. Delete `app/crud.py`

**Benefits:**
- CRUD functions grouped by domain
- Same import pattern (backward compatible)
- Easier to navigate large codebases
- Standard FastAPI pattern (CRUD package vs file)

---

## Phase 3: Extract AI Formatters

**Goal:** Move utility functions out of service layer.

**Files to create:**
- `app/ai/formatters.py`

**Changes:**

1. Extract formatters:
```python
# app/ai/formatters.py
from typing import Sequence
from app.db.models import DocumentChunk

def format_chunks(chunks: Sequence[DocumentChunk]) -> str:
    """Format chunks for prompt context."""
    context = ""
    for chunk in chunks:
        context += f"""\
ID: {chunk.document.id}
Title: {chunk.document.title}
Content: {chunk.text}
---
"""
    return context.strip()
```

2. Update imports in `ai/service.py`:
```python
from app.ai.formatters import format_chunks

# Remove format_chunks function (lines 85-96)
```

3. Update service imports in routes:
```python
# No changes needed - format_chunks is only used internally in generate_answer
```

**Benefits:**
- Utilities separated from services
- `ai/service.py` stays focused on OpenAI calls
- Easy to add more formatters (citations, metadata, etc.)

**Note:** Don't split `ai/service.py` further unless it exceeds ~200 lines. Current size (~97 lines) is fine.

---

## Phase 4: Organize Schemas

**Goal:** Group schemas by domain, remove inline definitions.

**Files to create:**
- `app/api/schemas/__init__.py`
- `app/api/schemas/chat.py`
- `app/api/schemas/document.py`
- `app/api/schemas/search.py`

**Changes:**

1. Split schemas by domain:
```python
# app/api/schemas/search.py
from pydantic import BaseModel

class SearchResult(BaseModel):
    id: int
    title: str
    url: str

# app/api/schemas/chat.py
from typing import Literal
from pydantic import BaseModel, ConfigDict
from app.api.schemas.search import SearchResult

class TextContentBlock(BaseModel):
    type: Literal["text"]
    text: str

class SearchContentBlock(BaseModel):
    type: Literal["search"]
    status: Literal["completed", "in_progress"] = "completed"
    query: str
    results: list[SearchResult]

class MessageCreate(BaseModel):
    content: str

class MessageDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    role: str
    content: str
    content_blocks: list[SearchContentBlock | TextContentBlock]

class ChatCreate(BaseModel):
    id: str
    message: str

class ChatDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    title: str | None
    messages: list[MessageDetail]

# app/api/schemas/document.py
from pydantic import BaseModel, ConfigDict

class DocumentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    url: str | None
```

2. Create package exports:
```python
# app/api/schemas/__init__.py
from app.api.schemas.chat import ChatCreate, ChatDetail, MessageCreate, MessageDetail
from app.api.schemas.document import DocumentRead
from app.api.schemas.search import SearchResult

__all__ = [
    "ChatCreate",
    "ChatDetail",
    "MessageCreate",
    "MessageDetail",
    "DocumentRead",
    "SearchResult",
]
```

3. Update route imports:
```python
# app/api/routes/chats.py
from app.api.schemas import ChatCreate, ChatDetail, MessageCreate

# app/api/routes/documents.py
from app.api.schemas import DocumentRead
```

4. Delete `app/api/schemas.py`

**Benefits:**
- Schemas grouped by feature
- No inline definitions in routes
- Easy to find and modify

---

## Testing Strategy

After each phase:

1. **Run linter:** `ruff check`
2. **Check imports:** Look for circular dependencies
3. **Test endpoints:** Run development server, test all routes
4. **Run tests:** If you have a test suite

## Migration Order

Do phases sequentially. Each phase should:
- Be committable (working state)
- Take 15-30 minutes
- Be independently testable

**Recommended order:** 1 → 2 → 3 → 4

All phases are optional, but Phase 1 has the highest impact.

## FastAPI-Specific Considerations

### What to Keep Simple
- **CRUD pattern** - Don't over-abstract with repositories
- **Flat file structure until ~1500 LOC** - Your 800 lines are fine
- **Direct SQLAlchemy in CRUD** - No need for query builders
- **Dependency injection via `Depends()`** - Already doing this well

### What Aligns with FastAPI Philosophy
✅ **Service layer for complex flows** - RAG orchestration qualifies
✅ **Split CRUD by domain** - Common in larger FastAPI projects
✅ **Schemas as Pydantic models** - You're already doing this
✅ **Keep AI logic separate** - Infrastructure concern

### What to Avoid (Over-engineering)
❌ **Repository classes** - CRUD functions are sufficient
❌ **Deep abstraction layers** - FastAPI favors directness
❌ **Splitting every file** - Only split when navigation becomes hard
❌ **Domain-driven design patterns** - Overkill for this size

## Additional FastAPI Best Practices to Consider

### 1. Response Models in Routes
Your routes look good, but ensure consistency:
```python
# Good - you're doing this
@router.get("/{chat_id}", response_model=ChatDetail)

# Consider adding to create_message (currently response_model=None)
@router.post("/{chat_id}/messages", response_class=StreamingResponse)
```

### 2. Consistent Error Handling
You're using `HTTPException` - good. Consider adding:
```python
# app/api/exceptions.py (optional)
class ChatNotFound(HTTPException):
    def __init__(self, chat_id: str):
        super().__init__(status_code=404, detail=f"Chat {chat_id} not found")
```

### 3. Background Tasks for Cleanup
If you need async work (like title generation), use FastAPI's `BackgroundTasks`:
```python
from fastapi import BackgroundTasks

@router.post("/chats")
async def create_chat(chat_create: ChatCreate, background_tasks: BackgroundTasks):
    # Could move title generation to background
    pass
```

### 4. CORS Middleware (if not already added)
```python
# app/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Files to Keep As-Is

- `app/db/models.py` - Excellent structure
- `app/ai/prompts/` - Good organization
- `app/core/config.py` - Clean settings
- `app/main.py` - Standard FastAPI entry
- `app/redis.py` - Infrastructure, fine
- `app/limiter.py` - Infrastructure, fine
- `app/api/deps.py` - Good use of FastAPI dependencies

## Expected Line Changes

- Phase 1: +50 lines (new service), -70 from routes = **Net -20**
- Phase 2: +30 lines (split CRUD), no deletion = **Net +30**
- Phase 3: +15 lines (formatters), -12 from service = **Net +3**
- Phase 4: +30 lines (split schemas), -51 from schemas.py = **Net -21**

**Net result:** ~800 → ~790 lines, better organized, more maintainable.

## Priority Ranking (FastAPI Perspective)

1. **Phase 1** (High) - Extract streaming = cleaner routes, testable business logic
2. **Phase 2** (Medium) - Split CRUD = better navigation at current size
3. **Phase 4** (Low) - Split schemas = minor improvement, do when schemas grow
4. **Phase 3** (Low) - Extract formatters = nice-to-have cleanup

**Minimum viable refactor:** Just Phase 1. It fixes the main issue (business logic in routes) and aligns with FastAPI service layer pattern.
