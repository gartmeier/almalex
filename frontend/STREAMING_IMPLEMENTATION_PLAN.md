# Frontend Streaming Implementation Plan

## Overview
The backend now sends streaming events in a new format with `text`, `reasoning`, `tool_call`, `tool_result`, and `done` event types. The frontend needs to be updated to handle these new event types.

## Current State

### Backend Event Format
Events are sent as Server-Sent Events (SSE) with the format:
```
data: {"type":"reasoning","delta":"..."}
data: {"type":"text","delta":"..."}
data: {"type":"tool_call","id":"...","name":"...","arguments":{...}}
data: {"type":"tool_result","id":"...","result":{...}}
data: {"type":"done","content":"...","content_blocks":[...]}
```

### Current Frontend Implementation
- **SSE Parser** (`frontend/app/lib/sse.ts`): Expects events with `event: <name>` and `data: <value>` format
- **Event Handlers** (`frontend/app/routes/chat.tsx`): Handles `message_id`, `message_delta`, `search_query`, `search_results`
- **Content Blocks**: Only supports `TextContentBlock` and `SearchContentBlock`
- **UI Components**: `AssistantMessage` only renders text and search blocks

## Implementation Tasks

### 1. Update SSE Parser (`frontend/app/lib/sse.ts`)
**Current Issue**: Parser expects `event: <name>` but backend sends `data: {"type":"..."}`

**Solution**: 
- Update parser to handle events without explicit event names
- Parse the `type` field from the JSON data to determine event type
- Support both old format (with `event:` line) and new format (type in data)

**Changes**:
```typescript
// Parse events where type is in the data JSON
// If no "event:" line, extract type from data JSON
```

### 2. Update Type Definitions (`frontend/app/lib/api/types.gen.ts`)
**Add new content block types**:
- `ReasoningContentBlock`: `{ type: "reasoning", text: string }`
- `ToolCallContentBlock`: `{ type: "tool_call", id: string, name: string, arguments: object }`
- `ToolResultContentBlock`: `{ type: "tool_result", id: string, result: any }`

**Update `MessageDetail`**:
```typescript
content_blocks: Array<
  | TextContentBlock 
  | ReasoningContentBlock
  | ToolCallContentBlock
  | ToolResultContentBlock
  | SearchContentBlock  // Keep for backward compatibility
>
```

### 3. Update Event Handlers (`frontend/app/routes/chat.tsx`)

#### 3.1 Remove Old Event Handlers
- Remove `handleMessageIdEvent` (replaced by `done` event)
- Remove `handleMessageDeltaEvent` (replaced by `text` event)
- Remove `handleSearchQueryEvent` and `handleSearchResultsEvent` (if search is now handled via tools)

#### 3.2 Add New Event Handlers

**`handleTextEvent`**:
- Accumulate text deltas into a text content block
- Similar to current `appendToTextBlock` but triggered by `text` events

**`handleReasoningEvent`**:
- Accumulate reasoning deltas into a reasoning content block
- Create reasoning block if it doesn't exist, append deltas if it does

**`handleToolCallEvent`**:
- Add a new `ToolCallContentBlock` to the message
- Display tool call information (name, arguments)

**`handleToolResultEvent`**:
- Find the matching tool call block by ID
- Add a `ToolResultContentBlock` after the tool call block
- Display tool result

**`handleDoneEvent`**:
- Finalize the message with complete content and content blocks
- Update message ID if provided
- Mark message as complete

#### 3.3 Update Event Handler Registration
```typescript
let eventHandlers: Record<string, (event: ServerSentEvent) => void> = {
  text: handleTextEvent,
  reasoning: handleReasoningEvent,
  tool_call: handleToolCallEvent,
  tool_result: handleToolResultEvent,
  done: handleDoneEvent,
};
```

### 4. Update Message State Management

#### 4.1 Initialize Assistant Message
- Create assistant message when first event arrives (text, reasoning, or tool_call)
- Use temporary ID until `done` event provides final ID

#### 4.2 Accumulate Deltas
- **Text deltas**: Append to last text block or create new one
- **Reasoning deltas**: Append to last reasoning block or create new one
- Both can exist simultaneously in the same message

#### 4.3 Handle Tool Events
- Tool calls and results should be added as separate content blocks
- Tool results should be matched to tool calls by ID

### 5. Update UI Components (`frontend/app/components/assistant-message.tsx`)

#### 5.1 Add Reasoning Block Component
Create `ReasoningBlock` component:
- Display reasoning text (similar to text block but with different styling)
- Optionally collapsible/expandable
- Different visual treatment (e.g., italic, muted color) to distinguish from final text

#### 5.2 Add Tool Call Block Component
Create `ToolCallBlock` component:
- Display tool name and arguments
- Show loading state while waiting for result
- Collapsible to show/hide arguments

#### 5.3 Add Tool Result Block Component
Create `ToolResultBlock` component:
- Display tool result data
- For search results, reuse existing `SearchBlock` component
- Collapsible to show/hide result details

#### 5.4 Update `renderContentBlock` Function
```typescript
function renderContentBlock(
  block: TextContentBlock | ReasoningContentBlock | ToolCallContentBlock | ToolResultContentBlock | SearchContentBlock,
  index: number,
  searchResults: SearchResult[],
) {
  switch (block.type) {
    case "text":
      // Existing text rendering
    case "reasoning":
      return <ReasoningBlock block={block} index={index} />;
    case "tool_call":
      return <ToolCallBlock block={block} index={index} />;
    case "tool_result":
      return <ToolResultBlock block={block} index={index} searchResults={searchResults} />;
    case "search":
      // Existing search rendering (for backward compatibility)
  }
}
```

### 6. Handle Backward Compatibility

#### 6.1 Old Event Format
- Keep support for old `message_id` and `message_delta` events if backend still sends them
- Detect event format and route to appropriate handler

#### 6.2 Search Blocks
- If search is now handled via tools, map tool results to search blocks for UI consistency
- Or update UI to display tool results directly

### 7. Testing Considerations

#### 7.1 Test Cases
- Stream with only text events
- Stream with reasoning + text events
- Stream with tool calls and results
- Stream with mixed content (reasoning, tools, text)
- Handle `done` event properly
- Handle rapid delta updates
- Handle message initialization

#### 7.2 Edge Cases
- Empty deltas
- Tool result without matching tool call
- Multiple tool calls with same ID
- Very long reasoning/text streams

## Implementation Order

1. **Phase 1: Core Infrastructure**
   - Update SSE parser to handle new format
   - Update type definitions
   - Add basic event handlers

2. **Phase 2: Text and Reasoning**
   - Implement text event handler
   - Implement reasoning event handler
   - Add reasoning block UI component

3. **Phase 3: Tool Support**
   - Implement tool_call event handler
   - Implement tool_result event handler
   - Add tool call/result UI components

4. **Phase 4: Finalization**
   - Implement done event handler
   - Update message initialization
   - Add error handling

5. **Phase 5: Polish**
   - UI styling and animations
   - Collapsible sections
   - Loading states
   - Backward compatibility

## Files to Modify

1. `frontend/app/lib/sse.ts` - Update SSE parser
2. `frontend/app/lib/api/types.gen.ts` - Add new types (or create manual types file)
3. `frontend/app/routes/chat.tsx` - Update event handlers
4. `frontend/app/components/assistant-message.tsx` - Add new block components
5. Potentially create new component files:
   - `frontend/app/components/reasoning-block.tsx`
   - `frontend/app/components/tool-call-block.tsx`
   - `frontend/app/components/tool-result-block.tsx`

## Notes

- The backend sends events without explicit event names, so the SSE parser needs to extract the type from the JSON data
- Reasoning blocks should be visually distinct from final text (e.g., shown in a collapsed state by default)
- Tool calls and results should be grouped together visually
- Consider showing reasoning as "thinking" indicator that can be expanded
- Tool results that are search results should reuse the existing SearchBlock component for consistency

