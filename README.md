# DSA Visualizer Studio

Interactive data-structure and algorithm visualizations built with HTML, Tailwind CSS, and vanilla JavaScript.

## Included Modules

- Stack
- Queue
- Singly linked list
- Doubly linked list
- Circular linked list
- Linear search
- Binary search

## Features

- Separate JavaScript module for each algorithm
- Animated node highlights for push, pop, enqueue, dequeue, search, and traversal states
- Head, tail, current, low, high, and mid markers where they matter
- Responsive single-page layout with Tailwind styling
- Sample data loaders for fast demos

## Run Locally

Because the app uses ES modules, open it through a local static server instead of loading it directly from disk.

### Option 1: Python

```powershell
python -m http.server 4173
```

Then open `http://localhost:4173` in your browser.

### Option 2: VS Code Live Server

Open `index.html` and start a static server from VS Code.

## Project Structure

- `index.html` - app shell and Tailwind CDN setup
- `src/main.js` - app entry point
- `src/app.js` - layout, navigation, and control panel wiring
- `src/lib/renderer.js` - shared visualization renderer
- `src/algorithms/*.js` - one module per DSA algorithm

## Notes

The current version is intentionally static and dependency-free. If you want, I can extend it with drag-and-drop node reordering, step-by-step queues, or more algorithms next.

## Stack Reference Code

### JavaScript

```javascript
class Stack {
	constructor() {
		this.items = [];
	}

	push(value) {
		this.items.push(value);
	}

	pop() {
		return this.items.pop();
	}

	peek() {
		return this.items[this.items.length - 1] ?? null;
	}

	isEmpty() {
		return this.items.length === 0;
	}
}
```

### Python

```python
class Stack:
		def __init__(self):
				self.items = []

		def push(self, value):
				self.items.append(value)

		def pop(self):
				if self.items:
						return self.items.pop()
				return None

		def peek(self):
				return self.items[-1] if self.items else None

		def is_empty(self):
				return len(self.items) == 0
```
