# Node.js Core Concepts 
---

##  Table of Contents

- [1️⃣ What is the Node.js Event Loop?](#1️⃣-what-is-the-nodejs-event-loop)
- [2️⃣ What is Libuv and its Role?](#2️⃣-what-is-libuv-and-its-role)
- [3️⃣ How Does Node.js Handle Async Operations?](#3️⃣-how-does-nodejs-handle-async-operations)
- [4️⃣ Call Stack vs Event Queue vs Event Loop](#4️⃣-call-stack-vs-event-queue-vs-event-loop)
- [5️⃣ Thread Pool and Configuration](#5️⃣-thread-pool-and-configuration)
- [6️⃣ Blocking vs Non-Blocking Code](#6️⃣-blocking-vs-non-blocking-code)


---

## 1️⃣ What is the Node.js Event Loop?

### Definition

The **Event Loop** is Node.js's core mechanism that enables **non-blocking I/O operations** despite JavaScript being single-threaded. It continuously checks for completed async operations and executes their callbacks when the call stack is empty.

### Visual Overview

```
+--------------+
|  Call Stack  |  ← JavaScript execution happens here
+------+-------+
       |
       v
+--------------+
|  Event Loop  |  ← Coordinator/Traffic Controller
+------+-------+
       |
       v
+--------------+
|   Queues     |  ← Callbacks waiting to be executed
+--------------+
```

### Event Loop Phases

The event loop runs in **6 phases**, each handling specific callback types:

```
   ┌───────────────────────────┐
┌─>│     1. TIMERS             │  setTimeout/setInterval
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │  2. PENDING CALLBACKS     │  System callbacks
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │  3. IDLE, PREPARE         │  Internal use
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     4. POLL               │  ← Most important!
│  │  (I/O callbacks)          │    Retrieves new I/O events
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     5. CHECK              │  setImmediate() callbacks
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤  6. CLOSE CALLBACKS       │  socket.on('close')
   └───────────────────────────┘
```

**Between each phase:** Microtask queues are checked:
- `process.nextTick()` (highest priority)
- Promise callbacks


> This mechanism allows Node.js to handle thousands of concurrent operations on a single thread!

[↑ Back to top](#-table-of-contents)

---

## 2️⃣ What is Libuv and its Role?

### Definition

**Libuv** is a **cross-platform C library** that provides Node.js with the event loop implementation, asynchronous I/O capabilities, and a thread pool for operations that can't be done asynchronously at the OS level.

### Architecture Visualization

```
        Node.js Application
              |
              v
        V8 JavaScript Engine
              |
              v
        Node.js Bindings (C++)
              |
              v
    +----------------------+
    |       LIBUV       |
    |---------------------|
    | ┌─────────────────┐|
    | │  Event Loop     ││  ← Orchestrates everything
    | └─────────────────┘|
    | ┌─────────────────┐|
    | │ Thread Pool (4) ││  ← For blocking operations
    | └─────────────────┘|
    | ┌─────────────────┐|
    | │ OS Integration  ││  ← epoll/kqueue/IOCP
    | └─────────────────┘|
    +----------+----------+
               |
               v
         Operating System
```

### What Libuv Provides

| Feature | Description |
|---------|-------------|
| **Event Loop** | The actual implementation Node.js uses |
| **Thread Pool** | Worker threads for blocking operations (fs, crypto, DNS) |
| **Platform Abstraction** | Unified API across OS (Linux: `epoll`, macOS: `kqueue`, Windows: `IOCP`) |
| **Async I/O** | Network sockets, timers, signals |
| **File System Operations** | Asynchronous file handling |


> Libuv is the **engine under the hood** that makes Node.js's async capabilities possible!

[↑ Back to top](#-table-of-contents)

---

## 3️⃣ How Does Node.js Handle Async Operations?

### Simple Flow

```
JS Code → libuv/OS background work → callback queued → executed later
```

### Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│  1. Call async function (e.g., fs.readFile)            │
└────────────────────┬────────────────────────────────────┘
                     │
                     v
┌─────────────────────────────────────────────────────────┐
│  2. Is it Network I/O?                                  │
└─────────┬──────────────────────┬────────────────────────┘
         Yes                    No
          │                      │
          v                      v
┌─────────────────────┐  ┌──────────────────────────┐
│  OS Kernel handles  │  │  Libuv Thread Pool       │
│  (epoll/kqueue/     │  │  (File ops, DNS, crypto) │
│   IOCP)             │  │                          │
└──────────┬──────────┘  └──────────┬───────────────┘
           │                        │
           v                        v
┌──────────────────────────────────────────────────┐
│  3. Work completes in background                │
└────────────────────┬─────────────────────────────┘
                     │
                     v
┌─────────────────────────────────────────────────────────┐
│  4. Callback added to appropriate Event Queue           │
└────────────────────┬────────────────────────────────────┘
                     │
                     v
┌─────────────────────────────────────────────────────────┐
│  5. Event Loop picks up callback when stack is empty    │
└────────────────────┬────────────────────────────────────┘
                     │
                     v
┌─────────────────────────────────────────────────────────┐
│  6. Callback executed on main thread                    │
└─────────────────────────────────────────────────────────┘
```

### Code Examples

#### Type A: Network I/O (Truly Async)

```javascript
const http = require('http');

// Delegated to OS kernel - doesn't block
http.get('http://example.com', (res) => {
  console.log('Response received');
});
// Main thread continues immediately 
```

#### Type B: File System (Uses Thread Pool)

```javascript
const fs = require('fs');

// Delegated to thread pool worker
fs.readFile('file.txt', (err, data) => {
  console.log('File read complete');
});
// Main thread continues immediately 
```


> Node.js never blocks the main thread - work happens in the background!

[↑ Back to top](#-table-of-contents)

---

## 4️⃣ Call Stack vs Event Queue vs Event Loop

### Simple Definitions

```
┌──────────────────────────────────────────────┐
│  1️⃣ CALL STACK                              │
│     Where functions execute NOW              │
│     Structure: LIFO (Last In, First Out)     │
│     [ function3() ]  ← Currently executing   │
│     [ function2() ]                          │
│     [ function1() ]                          │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  2️⃣ EVENT QUEUE (Callback Queue)            │
│     Where callbacks WAIT                     │
│     Structure: FIFO (First In, First Out)    │
│     [ callback1 → callback2 → callback3 ]    │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  3️⃣ EVENT LOOP                               │
│     The traffic controller                   │
│     Moves callbacks: Queue → Stack           │
└──────────────────────────────────────────────┘
```

### Example: Execution Order

```javascript
// Example execution flow:
console.log('1: Start');              // Call Stack

setTimeout(() => {
  console.log('2: Timer');            // → Timer Queue
}, 0);

Promise.resolve().then(() => {
  console.log('3: Promise');          // → Microtask Queue
});

process.nextTick(() => {
  console.log('4: nextTick');         // → nextTick Queue (highest priority)
});

console.log('5: End');                // Call Stack

// Output order:
// 1: Start
// 5: End
// 4: nextTick      ← Microtask (highest priority)
// 3: Promise       ← Microtask
// 2: Timer         ← Macrotask (next loop)
```

### Event Loop Algorithm

```
while (true) {
  if (call_stack.isEmpty()) {
    // 1. Check microtask queues first
    if (nextTick_queue.hasCallbacks()) {
      execute(nextTick_queue.shift());
      continue;
    }
    if (promise_queue.hasCallbacks()) {
      execute(promise_queue.shift());
      continue;
    }
    
    // 2. Move to next event loop phase
    execute_current_phase_callbacks();
  }
  
  if (no_more_work()) break;
}
```


> Event Loop = Traffic controller between async callbacks and the call stack!

[↑ Back to top](#-table-of-contents)

---

## 5️⃣ Thread Pool and Configuration

**Grade Value:** 0.5 points

### What is the Thread Pool?

The **thread pool** is part of **libuv** - a set of worker threads that handle operations the OS can't do asynchronously.

```
            LIBUV
   ┌─────────────────────────┐
   │   Thread Pool (Default) │
   │  [T1] [T2] [T3] [T4]    │  ← 4 threads
   └─────────────────────────┘
```

### Operations Using the Thread Pool

| Uses Thread Pool | Doesn't Use Thread Pool |
|---------------------|---------------------------|
| File System (`fs`) | Network I/O (HTTP, TCP, UDP) |
| DNS lookups (`dns.lookup()`) | Timers (`setTimeout`, `setInterval`) |
| Cryptographic (`crypto`) | `setImmediate()` |
| Compression (`zlib`) | Most async operations |

### How to Change Thread Pool Size

#### Method 1: Environment Variable (Recommended)

```bash
# Linux/macOS
export UV_THREADPOOL_SIZE=8
node app.js

# Windows (Command Prompt)
set UV_THREADPOOL_SIZE=8
node app.js

# Windows (PowerShell)
$env:UV_THREADPOOL_SIZE=8
node app.js
```

#### Method 2: In Code (Must be first line!)

```javascript
// MUST be at the very top before any require
process.env.UV_THREADPOOL_SIZE = 8;

const fs = require('fs');
// Now using 8 threads
```

#### Method 3: Dynamic Based on CPU Cores

```javascript
const os = require('os');
process.env.UV_THREADPOOL_SIZE = os.cpus().length;
console.log(`Thread pool: ${os.cpus().length} threads`);
```

### Performance Example

```javascript
const crypto = require('crypto');

// With default 4 threads:
for (let i = 0; i < 8; i++) {
  crypto.pbkdf2('password', 'salt', 100000, 512, 'sha512', () => {
    console.log(`Hash ${i + 1} complete`);
  });
}

// Result with UV_THREADPOOL_SIZE=4:
// First 4 finish around same time 
// Next 4 wait for threads to free up 

// Result with UV_THREADPOOL_SIZE=8:
// All 8 finish around same time 
```

### Best Practices

| Do | Don't |
|-------|----------|
| Match CPU cores for I/O-heavy apps | Over-increase (memory cost ~8MB/thread) |
| Increase for heavy file/crypto operations | Large pools for network-only apps |
| Monitor performance metrics | Blindly use max (1024) threads |


> Default is 4, max is 1024, optimal often matches CPU count!

[↑ Back to top](#-table-of-contents)

---

## 6️⃣ Blocking vs Non-Blocking Code

**Grade Value:** 0.5 points

### Visual Comparison

#### BLOCKING (Bad for servers)

```
Call Stack:
[ readFileSync() ]  ━━━━━━━  Nothing else can run!
                             Event loop is stuck 
```

#### NON-BLOCKING (Recommended)

```
Call Stack:    readFile()  ━  Returns immediately
                  |
Background:   work happens  ━  Thread pool/OS
                  |
Queue:        callback added ━  Waiting
                  |
Event Loop:   runs later    ━  When ready
```

### Code Examples

#### Blocking Example (Synchronous)

```javascript
const fs = require('fs');

console.log('Start');

// BLOCKS - Nothing else can run
const data = fs.readFileSync('huge-file.txt', 'utf8');

console.log('End'); // Only runs after file is completely read

// Server becomes unresponsive during read! 
```

#### Non-Blocking Example (Asynchronous)

```javascript
const fs = require('fs');

console.log('Start');

// NON-BLOCKING - Event loop continues
fs.readFile('huge-file.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log('File read complete');
});

console.log('End'); // Runs immediately!

// Server remains responsive!
```

#### ⭐ Modern Async/Await

```javascript
const fs = require('fs').promises;

async function readFiles() {
  console.log('Start');
  
  // Non-blocking with cleaner syntax
  try {
    const data = await fs.readFile('huge-file.txt', 'utf8');
    console.log('File read complete');
  } catch (err) {
    console.error(err);
  }
  
  console.log('End');
}

readFiles();
console.log('Main thread continues'); // Runs immediately!
```

### Performance Impact

```javascript
// BLOCKING - Sequential (slow)
const data1 = fs.readFileSync('file1.txt'); // 100ms
const data2 = fs.readFileSync('file2.txt'); // 100ms
const data3 = fs.readFileSync('file3.txt'); // 100ms
// Total: 300ms 

// NON-BLOCKING - Parallel (fast)
Promise.all([
  fs.promises.readFile('file1.txt'),  // 100ms
  fs.promises.readFile('file2.txt'),  // 100ms
  fs.promises.readFile('file3.txt')   // 100ms
]).then(results => {
  // Total: ~100ms (all parallel in thread pool)
});
```

### CPU-Intensive Operations

For heavy CPU work that would block the event loop:

```javascript
const { Worker } = require('worker_threads');

// Bad - Blocks event loop for 5+ seconds
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
const result = fibonacci(45); // BLOCKS EVERYTHING!

// Good - Offload to worker thread
const worker = new Worker('./fibonacci-worker.js', {
  workerData: 45
});

worker.on('message', (result) => {
  console.log('Result:', result);
});

console.log('Main thread continues!'); // Runs immediately
```


> Always use async (non-blocking) methods in production servers!

[↑ Back to top](#-table-of-contents)

---

## Quick Reference

### Summary Table

| Concept | What It Is | Why It Matters |
|---------|-----------|----------------|
| **Event Loop** | Coordinator that runs callbacks | Enables non-blocking on single thread |
| **Libuv** | C library powering Node.js | Provides event loop + thread pool |
| **Call Stack** | Where JS executes NOW | LIFO, single-threaded execution |
| **Event Queue** | Where callbacks WAIT | FIFO, multiple priority levels |
| **Thread Pool** | Worker threads (default: 4) | Handles file I/O, crypto, DNS |
| **Non-blocking** | Async, doesn't wait | Keeps server responsive |
| **Blocking** | Sync, waits for completion | Freezes everything |

### Complete Memory Map

```
         Your Application Code
                  |
                  v
         V8 JavaScript Engine
                  |
                  v
         Call Stack (LIFO)
                  |
         Is operation async?
         /              \
       Yes              No
        |                |
        v                v
    Event Loop    Execute now
        |
        v
┌───────────────────────────────┐
│  Background Work:             │
│  • OS Kernel (network I/O)    │
│  • Libuv Thread Pool (fs)     │
└──────────┬────────────────────┘
           |
           v
    Event Queues (FIFO)
    1. nextTick
    2. Promises
    3. Timers
    4. I/O
    5. Check
    6. Close
           |
           v
    Event Loop moves to Call Stack
           |
           v
    Callback Executed
```


