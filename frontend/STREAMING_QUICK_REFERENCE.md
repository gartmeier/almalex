# Streaming Implementation Quick Reference

## Backend Event Format

All events are sent as:
```
data: {"type":"<event_type>", ...}
```

### Event Types

1. **`reasoning`** - Reasoning deltas (streaming)
   ```json
   {"type":"reasoning","delta":"..."}
   ```

2. **`text`** - Text deltas (streaming)
   ```json
   {"type":"text","delta":"..."}
   ```

3. **`tool_call`** - Tool call (single event)
   ```json
   {"type":"tool_call","id":"call_xxx","name":"search_legal_documents","arguments":{...}}
   ```

4. **`tool_result`** - Tool result (single event)
   ```json
   {"type":"tool_result","id":"call_xxx","result":[...]}
   ```

5. **`done`** - Final message (single event)
   ```json
   {"type":"done","content":"...","content_blocks":[...]}
   ```

## Key Changes Needed

### 1. SSE Parser (`lib/sse.ts`)
- Parse `type` from JSON data when no `event:` line exists
- Return event name as the `type` field value

### 2. Event Handlers (`routes/chat.tsx`)
- Replace old handlers with: `text`, `reasoning`, `tool_call`, `tool_result`, `done`
- Accumulate deltas for `text` and `reasoning`
- Add blocks for `tool_call` and `tool_result`
- Finalize message on `done`

### 3. Types (`lib/api/types.gen.ts`)
Add to `MessageDetail.content_blocks`:
- `ReasoningContentBlock`
- `ToolCallContentBlock`
- `ToolResultContentBlock`

### 4. UI Components (`components/assistant-message.tsx`)
- `ReasoningBlock` - Show reasoning (collapsible, muted)
- `ToolCallBlock` - Show tool name + args
- `ToolResultBlock` - Show tool results (reuse SearchBlock for search results)

## Implementation Checklist

- [ ] Update SSE parser to extract type from data
- [ ] Add new content block types
- [ ] Implement `handleTextEvent` (accumulate deltas)
- [ ] Implement `handleReasoningEvent` (accumulate deltas)
- [ ] Implement `handleToolCallEvent` (add block)
- [ ] Implement `handleToolResultEvent` (add block, match by ID)
- [ ] Implement `handleDoneEvent` (finalize message)
- [ ] Create `ReasoningBlock` component
- [ ] Create `ToolCallBlock` component
- [ ] Create `ToolResultBlock` component
- [ ] Update `renderContentBlock` to handle new types
- [ ] Test with various event combinations
- [ ] Handle backward compatibility (if needed)

