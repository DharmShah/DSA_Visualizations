# 🎯 DSA Visualizer Studio

> **The best free, interactive DSA visualization tool** — animate and explore Data Structures & Algorithms step-by-step in your browser. No installation. No frameworks. Just open and learn.

🔗 **Live Demo → [https://dharmshah.github.io/DSA_Visualizations/](https://dharmshah.github.io/DSA_Visualizations/)**

---

## What Is DSA Visualizer Studio?

**DSA Visualizer Studio** is an open-source, browser-based tool that lets students, developers, and educators **visualize data structures and algorithms with real-time animations**. Every operation — push, pop, enqueue, dequeue, search, insert, traverse — is rendered frame-by-frame so you can *see* exactly what the algorithm is doing, not just read about it.

Built with plain HTML, Tailwind CSS, and vanilla JavaScript (ES Modules), it is completely dependency-free and runs in any modern browser.

---

## 🚀 Live Features

| Data Structure / Algorithm | Animated Operations |
|---|---|
| **Stack** | Push, Pop, Peek, Empty check |
| **Queue** | Enqueue, Dequeue, Front, Rear |
| **Singly Linked List** | Insert (head/tail/position), Delete, Traverse |
| **Doubly Linked List** | Bidirectional Insert, Delete, Forward/Backward Traverse |
| **Circular Linked List** | Circular Insert, Delete, Loop Traverse |
| **Linear Search** | Step-by-step element highlight, found/not-found state |
| **Binary Search** | Low/Mid/High pointer animation, halving visualization |

### Visual Markers & Animation States
- **Head / Tail** pointers shown on linked lists
- **Low / Mid / High** markers animate during binary search
- **Current node** highlighted during traversal
- **Push / Pop / Enqueue / Dequeue** states color-coded distinctly
- **Sample data loaders** for instant demos — no typing needed

---

## ✨ Why Use DSA Visualizer Studio?

- ✅ **Free & open-source** — use it forever, fork it, improve it
- ✅ **Zero dependencies** — no npm, no build step, no frameworks
- ✅ **Runs in any browser** — Chrome, Firefox, Safari, Edge
- ✅ **Mobile-responsive** — single-page layout with Tailwind CSS
- ✅ **Great for learners** — see exactly how Stack LIFO, Queue FIFO, and linked list pointers work
- ✅ **Great for teachers** — embed or share the live URL directly in lessons
- ✅ **Great for interview prep** — visualize binary search and linear search side-by-side

---

## 🎓 Who Is This For?

- **CS students** learning DSA for the first time and wanting visual intuition
- **Developers** brushing up on data structures before coding interviews
- **Teachers and tutors** who want a free, shareable visual aid
- **Competitive programmers** who want to verify their mental model of an algorithm
- **Anyone** who Googled: *"how does a stack work animation"*, *"linked list visualization"*, *"binary search step by step"*, *"DSA animation online"*, or *"data structure visualizer"*

---

## 📐 Project Structure

```
DSA_Visualizations/
├── index.html              # App shell — Tailwind CDN, meta tags, entry point
├── src/
│   ├── main.js             # App bootstrap / module entry
│   ├── app.js              # Layout, navigation routing, control panel wiring
│   ├── styles.css          # Custom CSS (page backdrop, glow shadow, etc.)
│   ├── lib/
│   │   └── renderer.js     # Shared visualization rendering engine
│   └── algorithms/
│       ├── stack.js                  # Stack — push / pop / peek
│       ├── queue.js                  # Queue — enqueue / dequeue
│       ├── singlyLinkedList.js       # Singly Linked List
│       ├── doublyLinkedList.js       # Doubly Linked List
│       ├── circularLinkedList.js     # Circular Linked List
│       ├── linearSearch.js           # Linear Search
│       └── binarySearch.js          # Binary Search
└── README.md
```

---

## ⚡ Run Locally in 30 Seconds

The app uses **ES Modules**, so you need a local static server (not a direct file open). Pick either option:

### Option 1 — Python (no install needed)
```bash
git clone https://github.com/DharmShah/DSA_Visualizations.git
cd DSA_Visualizations
python -m http.server 4173
```
Then open **http://localhost:4173** in your browser.

### Option 2 — VS Code Live Server
1. Clone or download the repository
2. Open `index.html` in VS Code
3. Click **"Go Live"** in the bottom status bar (requires the Live Server extension)

### Option 3 — Node.js `serve`
```bash
npx serve .
```

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Markup** | HTML5 (semantic, accessible) |
| **Styling** | Tailwind CSS (CDN) + custom CSS |
| **Logic** | Vanilla JavaScript (ES Modules) |
| **Hosting** | GitHub Pages |
| **Build Tools** | None — zero build step |

---

## 📚 Algorithm Concepts Covered

### Data Structures
- **Stack (LIFO)** — Last In, First Out. Applications: undo systems, call stacks, bracket matching
- **Queue (FIFO)** — First In, First Out. Applications: task scheduling, BFS, print queues
- **Singly Linked List** — Nodes pointing forward only. Applications: dynamic lists, memory management
- **Doubly Linked List** — Nodes pointing forward and backward. Applications: browser history, LRU cache
- **Circular Linked List** — Last node links back to head. Applications: round-robin scheduling, music playlists

### Search Algorithms
- **Linear Search** — O(n) — checks every element; works on unsorted data
- **Binary Search** — O(log n) — divides sorted array in half each step; visualizes low/mid/high pointers

---

## 🗺️ Roadmap / Coming Soon

- [ ] Sorting algorithms: Bubble Sort, Merge Sort, Quick Sort, Insertion Sort animations
- [ ] Tree visualizations: Binary Tree, BST insert/search/delete, AVL rotations
- [ ] Graph algorithms: BFS, DFS, Dijkstra's Shortest Path
- [ ] Hash Table with collision visualization
- [ ] Heap / Priority Queue animation
- [ ] Step-by-step mode with play / pause / next controls
- [ ] Drag-and-drop node reordering
- [ ] Dark/light theme toggle

---

## 🤝 Contributing

Contributions are welcome! To add a new algorithm or data structure:

1. Fork the repository
2. Create `src/algorithms/yourAlgorithm.js` following the existing module pattern
3. Register it in `src/app.js`
4. Open a Pull Request with a brief description and screenshot/GIF

Please keep all modules dependency-free and vanilla JS.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 🔗 Links

- 🌐 **Live Site:** [https://dharmshah.github.io/DSA_Visualizations/](https://dharmshah.github.io/DSA_Visualizations/)
- 📦 **GitHub Repo:** [https://github.com/DharmShah/DSA_Visualizations](https://github.com/DharmShah/DSA_Visualizations)

---

## 🏷️ Keywords

`DSA visualization` · `data structure animation` · `algorithm visualizer` · `stack animation` · `queue animation` · `linked list visualizer` · `binary search animation` · `linear search visualization` · `DSA for beginners` · `interactive algorithm learning` · `JavaScript DSA` · `learn data structures online` · `free DSA tool` · `algorithm step by step` · `CS education tool`

---

*Built with ❤️ by [Dharm Shah](https://github.com/DharmShah). If this helped you, please ⭐ the repo!*