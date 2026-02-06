# Local QA UI

A simple web interface for running Claude CLI commands with real-time streaming output.

## Overview

This UI allows you to enter instructions/prompts and execute them against the Claude CLI, displaying the output in real-time as it streams from the CLI process.

## Features

- **Tabbed Output Interface** - Switch between Markdown (rendered) and JSON (raw) views
- **Markdown Rendering** - Beautiful rendered output with syntax highlighting using marked.js
- **Real-time Streaming Output** - Watch Claude CLI output as it happens in JSON tab
- **Dual Copy Buttons** - Copy MD (markdown text) and Copy JSON (raw JSONL) depending on active tab
- **Manual JSON Formatting** - Format button in JSON tab to prettify JSON output with 4-space indentation
- **Persistent Instructions** - Instructions are automatically saved and restored on page reload
- **Clear Button** - Quickly clear the instructions textarea
- **Status Indicator** - Visual pill badge showing current state (Idle, Running, Done)
- **Smart Button Control** - Copy, Clear, and Format buttons automatically disabled during QA execution
- **Color-Coded Output Border** - Left border changes color based on status (gray, yellow, green)

## Tabbed Output Interface

The UI provides two views of the QA test output:

### Markdown Tab (Default)
- Displays beautifully rendered output with:
  - Formatted headings with timestamps
  - Syntax-highlighted code blocks
  - Clear visual hierarchy with actor labels (ORCHESTRATOR, sub-agents)
  - Tool calls and results grouped together
  - Session summary with timing and cost information
- Shows "Processing..." message during streaming
- Renders markdown when streaming completes
- **Copy MD** button copies raw markdown text (not HTML)

### JSON Tab
- Displays raw JSONL output as it streams in real-time
- Preserves original Claude CLI output format
- **Format** button available to prettify JSON with 4-space indentation
- **Copy JSON** button copies raw JSONL text
- Useful for debugging and understanding raw data structure

### Tab Switching
- Click tab buttons to switch between views
- Each tab shows appropriate buttons (Copy MD vs Copy JSON, Format visibility)
- Border colors update on both containers based on status
- All buttons disabled during streaming

## Architecture

The system uses a **job-based SSE (Server-Sent Events)** architecture:

1. **POST `/api/start-qa`** - Starts a new Claude CLI job
   - Accepts `{ instructions: string }` in the request body
   - Spawns the Claude CLI process
   - Returns `{ jobId: number }`

2. **GET `/api/stream/:jobId`** - Streams job output via SSE
   - Client connects using the `EventSource` API
   - Receives real-time `stdout` and `stderr` chunks
   - Receives `done` event when process completes

3. **GET `/api/instructions`** - Retrieves saved instructions
   - Returns `{ instructions: string }`
   - Loads from `last-instructions.txt` file

4. **POST `/api/instructions`** - Saves instructions to filesystem
   - Accepts `{ instructions: string }` in the request body
   - Writes to `last-instructions.txt` file
   - Automatically called before running a QA test

This separation is necessary because `EventSource` only supports GET requests, but we need POST to send the instructions.

## Files

- `server.js` - Express server handling job management, SSE streaming, and instructions persistence
- `index.html` - Frontend UI with Tailwind CSS styling
- `package.json` - Dependencies (express, cors)
- `last-instructions.txt` - Auto-generated file storing the most recent instructions (gitignored)

## Running

```bash
cd local-ui
npm install
npm start
```

Then open http://localhost:3000 in your browser.

## Technical Details

### Claude CLI Invocation

The server spawns Claude CLI with these arguments:
```
claude --verbose --output-format stream-json --model sonnet -p '<instructions>'
```

Key spawn configuration:
- `shell: true` - Required for proper argument handling
- `stdio: ['pipe', 'pipe', 'pipe']` - Capture all streams
- `env: { CI: '1', FORCE_COLOR: '0' }` - Non-interactive mode
- `stdin.end()` - Close stdin immediately so CLI doesn't wait for input

### Markdown Rendering

**Dependencies:**
- `marked.js` - Loaded via CDN for converting markdown to HTML
- `markdown-parser.js` functions - Embedded directly in index.html

**Conversion Pipeline:**
1. Raw JSONL accumulates in `rawJsonlOutput` during streaming
2. When stream completes, `convertToMarkdown()` transforms JSONL to markdown text
3. `marked.parse()` converts markdown to HTML
4. HTML injected into `outputMarkdown` div with styling

**Embedded Parser Functions:**
- `parseJSONL()` - Parses JSONL string (handles line-by-line and multi-line formats)
- `formatDuration()` - Converts milliseconds to readable format (ms/s)
- `extractTextContent()` - Extracts text from various content structures
- `convertToMarkdown()` - Main conversion function (JSONL → markdown)
  - Two-pass algorithm: collects tool calls/results, then renders chronologically
  - Groups tool calls with their results (except Task tools for parallel visibility)
  - Adds timestamps, actor labels (ORCHESTRATOR/sub-agents), and status icons

**Markdown CSS Styling:**
Custom styles applied to `.markdown-content` class:
- Headings (h1-h4) with bottom borders
- Code blocks with dark background (#1f2937) and syntax colors
- Lists (ul/ol) with proper indentation
- Blockquotes with left border
- Tables with borders
- Links, strong, em, hr styling

### SSE Event Types

Events sent to the client:
- `{ type: 'stdout', content: string }` - CLI stdout output
- `{ type: 'stderr', content: string }` - CLI stderr output
- `{ type: 'done', exitCode: number }` - Process completed
- `{ type: 'error', message: string }` - Process error

### Job Cleanup

Jobs are automatically cleaned up 5 minutes after completion.

### Server-Side Job Management

**Job Storage:**
- Jobs are stored in a `Map` on the server: `jobs = new Map()`
- Each job has structure: `{ process, stdout: '', stderr: '', done: false, exitCode: null, clients: Set }`
- Job IDs are generated using a simple counter: `let jobIdCounter = 0`
- Multiple clients can connect to the same job via SSE

**Job Lifecycle:**
1. POST to `/api/start-qa` creates a new job entry
2. Spawns the Claude CLI process with `child_process.spawn()`
3. Process output is buffered in `job.stdout` and `job.stderr`
4. Each output chunk is broadcast to all connected SSE clients in real-time
5. When process exits, `job.done = true` and `exitCode` is recorded
6. Cleanup timer starts (5 minutes) to remove job from memory

**Process Management:**
- Uses `spawn('claude', [...], { shell: true, stdio: ['pipe', 'pipe', 'pipe'], env: { CI: '1', FORCE_COLOR: '0' } })`
- `stdin` is closed immediately with `process.stdin.end()` to prevent CLI from waiting for input
- `stdout` and `stderr` are captured via `.on('data')` event listeners
- Process exit is captured via `.on('close')` event

### Frontend State Management

**State Variables:**
- `eventSource` - Current SSE connection (EventSource object or null)
- `stderrOutput` - Accumulated stderr during streaming (displayed at end)
- `rawJsonlOutput` - Accumulated raw JSONL for conversion to markdown
- `rawMarkdownText` - Generated markdown text from JSONL (for Copy MD)
- `currentTab` - Active tab ('markdown' or 'json')
- Status is managed via `setStatus()` which updates:
  - Status badge (text, color, animation)
  - Output border colors (both outputMarkdown and outputJson)
  - Button disabled states (run, copy MD, copy JSON, clear, format)

**Request Flow:**
1. User enters instructions and clicks "Run QA Test"
2. Reset state: `rawJsonlOutput = ''`, `rawMarkdownText = ''`
3. Set initial messages: JSON shows "Starting...", Markdown shows "Processing..."
4. Instructions saved via POST `/api/instructions` (async, no wait)
5. POST to `/api/start-qa` receives `{ jobId }`
6. EventSource connects to GET `/api/stream/:jobId`
7. Messages received and processed:
   - `stdout` → appended to JSON view and `rawJsonlOutput`
   - `stderr` → buffered for end display
   - `done` → call `updateMarkdownView()`, show stderr, enable buttons
   - `error` → display error in both views, close connection
8. Auto-scroll to bottom on each stdout update (JSON view)
9. Markdown view updated only once when streaming completes

**Error Handling:**
- Network errors during POST show error in output area
- EventSource `onerror` shows "[Connection error]" message
- Both paths reset UI state (enable buttons, set status to "done")
- Try-catch around event parsing prevents crashes from malformed SSE data

### Connection Lifecycle

**SSE Connection:**
- Uses browser's built-in `EventSource` API (GET-only limitation)
- Connection established to `/api/stream/:jobId`
- Server keeps response open and writes `data: {...}\n\n` chunks
- Connection closes when:
  - Process completes (server sends `done` event)
  - Error occurs (client or server)
  - Client calls `eventSource.close()`

**Reconnection:**
- If user clicks "Run QA Test" while a job is running, previous EventSource is closed first
- No automatic reconnection (each job is one-time execution)
- Jobs that complete before client connects will still deliver full output (buffered in `job.stdout`)

### Styling and UI Framework

**Tailwind CSS:**
- Loaded via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- No build process required
- All styling is inline utility classes

**marked.js:**
- Loaded via CDN: `<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>`
- Used for markdown-to-HTML conversion
- No configuration needed

**Custom CSS:**
- Pulse animation for status badge (1.5s intervals for "Running" state)
- Markdown content styles (`.markdown-content` class):
  - Headings with borders and sizing
  - Code blocks with dark theme
  - List, blockquote, table, link styling
- Tab button styles (`.tab-button` class):
  - Active tab: white background, border, font-weight
  - Inactive tab: gray background, lighter text, hover effect

**Responsive Design:**
- Max width container: `max-w-4xl mx-auto`
- Textarea: 10 rows, full width
- Output area: Max height 96 (24rem), scrollable vertically and horizontally

### UI Status Feedback

The interface provides clear visual feedback about the QA process state:

**Status Pill Badge**
- **Idle** (gray) - Ready to start a new test
- **Running** (yellow with pulse animation) - QA process is executing
- **Done** (green) - Process completed successfully

**Output Area Border**
The output `<pre>` element has a colored left border that matches the status:
- Gray border when Idle
- Yellow border when Running (matches the pulsing badge)
- Green border when Done

**Button States**
- **Copy MD button** - Visible in Markdown tab, copies raw markdown text (disabled while Running)
- **Copy JSON button** - Visible in JSON tab, copies raw JSONL (disabled while Running)
- **Format button** - Visible only in JSON tab (disabled while Running)
- **Clear button** - Disabled while Running to prevent accidental data loss during execution

The `setStatus()` function centralizes all status updates, ensuring consistent UI state across all completion and error paths. Button visibility is controlled by `switchTab()` function.

### JSON Output Formatting

The UI provides **manual** JSON formatting via the Format button in the JSON tab. Output streams as raw text, and users can format it on demand once complete.

**Why Manual Formatting?**
- **Avoids streaming issues** - Stream chunks may break mid-JSON object, causing parse errors
- **Simpler implementation** - No buffering logic or chunk boundary handling needed
- **User control** - See raw output first, format when ready
- **Easier debugging** - Raw output shows exactly what Claude CLI produces

**How it works:**
1. During streaming: Output is appended raw to the `<pre id="outputJson">` element
2. User switches to JSON tab and clicks "Format" button when ready
3. The `formatOutput()` function processes the entire output:
   - Splits content by newlines (each line is a complete JSON object from `--output-format stream-json`)
   - Attempts to parse each line as JSON using `JSON.parse()`
   - If successful, formats with `JSON.stringify(parsed, null, 4)` (4-space indentation)
   - If parsing fails (non-JSON text), returns the line unchanged
   - Empty lines are preserved to maintain output structure
4. Formatted output replaces the raw output in place

**Example transformation:**
```
// Raw output (as streamed)
{"type":"system","subtype":"init","cwd":"/Users/...","tools":[...]}
{"type":"agent","subtype":"text","content":"Let me help you..."}

// After clicking "Format" button
{
    "type": "system",
    "subtype": "init",
    "cwd": "/Users/...",
    "tools": [...]
}
{
    "type": "agent",
    "subtype": "text",
    "content": "Let me help you..."
}
```

This works with Claude CLI's `--output-format stream-json` flag, which outputs complete JSON objects per line. Non-JSON output (error messages, plain text) passes through unchanged.

**Note:** The Format button is only visible in the JSON tab. The Markdown tab shows pre-processed, rendered output.
