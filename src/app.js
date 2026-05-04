import { renderVisualization, buttonClass } from './lib/renderer.js';
import { createStackAlgorithm } from './algorithms/stack.js';
import { createQueueAlgorithm } from './algorithms/queue.js';
import { createSinglyLinkedListAlgorithm } from './algorithms/singlyLinkedList.js';
import { createDoublyLinkedListAlgorithm } from './algorithms/doublyLinkedList.js';
import { createCircularLinkedListAlgorithm } from './algorithms/circularLinkedList.js';
import { createLinearSearchAlgorithm } from './algorithms/linearSearch.js';
import { createBinarySearchAlgorithm } from './algorithms/binarySearch.js';

const algorithmOrder = [
    'stack',
    'queue',
    'singly',
    'doubly',
    'circular',
    'linear',
    'binary',
];

export const createApp = (root) => {
    let activeKey = 'stack';
    let pendingFrame = null;

    const requestRender = () => {
        if (pendingFrame) {
            cancelAnimationFrame(pendingFrame);
        }
        pendingFrame = requestAnimationFrame(render);
    };

    const algorithms = {
        stack: createStackAlgorithm(requestRender),
        queue: createQueueAlgorithm(requestRender),
        singly: createSinglyLinkedListAlgorithm(requestRender),
        doubly: createDoublyLinkedListAlgorithm(requestRender),
        circular: createCircularLinkedListAlgorithm(requestRender),
        linear: createLinearSearchAlgorithm(requestRender),
        binary: createBinarySearchAlgorithm(requestRender),
    };

    const render = () => {
        pendingFrame = null;
        const algorithm = algorithms[activeKey];
        const snapshot = algorithm.snapshot();

        root.innerHTML = '';

        const shell = document.createElement('div');
        shell.className = 'relative mx-auto flex min-h-screen w-full max-w-[1600px] flex-col gap-4 px-3 py-3 sm:px-6 sm:py-6 lg:px-8';

        const hero = document.createElement('section');
        hero.className = 'overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/70 px-4 py-4 shadow-glow backdrop-blur-xl sm:px-8 sm:py-6';
        hero.innerHTML = `
      <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div class="max-w-4xl space-y-3">
          <div class="flex flex-wrap items-center gap-2">
            <span class="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100">DSA Visualizer</span>
            <span class="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-slate-300">Vanilla JS + Tailwind</span>
          </div>
          <div>
            <h1 class="font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">Interactive data structure and algorithm studio</h1>
            <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-300 sm:mt-3 sm:text-base">Switch between stack, queue, linked lists, circular linked lists, linear search, and binary search. Each module keeps its own controls and animates state changes so the structure is visible as it evolves.</p>
          </div>
        </div>
        <div class="hidden grid gap-3 rounded-[1.5rem] border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-300 sm:grid sm:min-w-[280px]">
          <div class="flex items-center justify-between gap-4"><span class="uppercase tracking-[0.28em] text-slate-500">Active module</span><span id="active-module-label" class="font-semibold text-white"></span></div>
          <div class="flex items-center justify-between gap-4"><span class="uppercase tracking-[0.28em] text-slate-500">State mode</span><span class="font-semibold text-cyan-100">Animated</span></div>
          <div class="flex items-center justify-between gap-4"><span class="uppercase tracking-[0.28em] text-slate-500">Hint</span><span class="font-semibold text-white">Use the controls below</span></div>
        </div>
      </div>
    `;
        shell.appendChild(hero);

        const nav = document.createElement('section');
        nav.className = 'flex gap-3 overflow-x-auto pb-1 lg:grid lg:grid-cols-7 lg:overflow-visible lg:pb-0';
        algorithmOrder.forEach((key) => {
            const item = algorithms[key];
            const button = document.createElement('button');
            button.type = 'button';
            button.className = [
                'min-w-[11rem] rounded-2xl border px-4 py-4 text-left transition-all duration-300 lg:min-w-0',
                key === activeKey ? 'border-cyan-400/60 bg-cyan-400/15 text-white shadow-glow' : 'border-slate-800 bg-slate-900/70 text-slate-200 hover:border-slate-600 hover:bg-slate-900',
            ].join(' ');
            button.innerHTML = `
        <div class="text-xs uppercase tracking-[0.3em] text-slate-400">${item.meta.category}</div>
        <div class="mt-2 text-lg font-semibold">${item.meta.title}</div>
        <div class="mt-1 text-xs leading-5 text-slate-400">${item.meta.short}</div>
      `;
            button.addEventListener('click', () => {
                activeKey = key;
                requestRender();
            });
            nav.appendChild(button);
        });
        shell.appendChild(nav);

        const grid = document.createElement('section');
        grid.className = 'grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]';

        const controlsPanel = document.createElement('aside');
        controlsPanel.className = 'space-y-4 rounded-[2rem] border border-slate-800 bg-slate-950/70 p-4 shadow-glow backdrop-blur-xl sm:space-y-5 sm:p-6';

        const controlsHeader = document.createElement('div');
        controlsHeader.className = 'space-y-2';
        controlsHeader.innerHTML = `
      <div class="flex flex-wrap items-center gap-2">
        <span class="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">Controls</span>
        <span class="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">${algorithm.meta.layout}</span>
      </div>
      <h2 class="text-2xl font-semibold text-white">${algorithm.meta.title}</h2>
      <p class="hidden text-sm leading-6 text-slate-300 sm:block">${algorithm.meta.description}</p>
    `;
        controlsPanel.appendChild(controlsHeader);

        const statusCard = document.createElement('div');
        statusCard.className = 'rounded-2xl border border-slate-800 bg-slate-900/70 p-3 sm:p-4';
        statusCard.innerHTML = `
      <div class="text-xs uppercase tracking-[0.28em] text-slate-500">Current status</div>
      <div class="mt-2 text-sm leading-6 text-slate-200">${snapshot.status}</div>
    `;
        controlsPanel.appendChild(statusCard);

        algorithm.controlGroups.forEach((group) => {
            const card = document.createElement('div');
            card.className = 'space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-3 sm:space-y-4 sm:p-4';
            const header = document.createElement('div');
            header.innerHTML = `
        <div class="text-xs uppercase tracking-[0.28em] text-slate-500">${group.label}</div>
        <div class="mt-1 text-base font-semibold text-white">${group.title}</div>
      `;
            card.appendChild(header);

            if (group.fields.length) {
                const fieldWrap = document.createElement('div');
                fieldWrap.className = 'grid gap-3';
                group.fields.forEach((field) => {
                    const fieldCard = document.createElement('label');
                    fieldCard.className = 'grid gap-2 text-sm text-slate-300';
                    fieldCard.innerHTML = `
            <span class="uppercase tracking-[0.24em] text-slate-500">${field.label}</span>
            <input
              class="rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
              placeholder="${field.placeholder}"
              type="${field.type || 'text'}"
              value="${algorithm.getField(field.key)}"
            />
          `;
                    const input = fieldCard.querySelector('input');
                    input.addEventListener('input', (event) => {
                        algorithm.setField(field.key, event.target.value);
                    });
                    fieldWrap.appendChild(fieldCard);
                });
                card.appendChild(fieldWrap);
            }

            const buttonRow = document.createElement('div');
            buttonRow.className = 'flex flex-wrap gap-2';
            group.buttons.forEach((buttonDef) => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = `rounded-2xl border px-4 py-3 text-sm font-semibold transition ${buttonClass(buttonDef.variant)}`;
                button.textContent = buttonDef.label;
                button.disabled = algorithm.isBusy();
                button.addEventListener('click', async () => {
                    const result = algorithm[buttonDef.action]();
                    if (result && typeof result.then === 'function') {
                        await result;
                    }
                    requestRender();
                });
                buttonRow.appendChild(button);
            });
            card.appendChild(buttonRow);
            controlsPanel.appendChild(card);
        });

        const complexityCard = document.createElement('div');
        complexityCard.className = 'hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-950/80 p-4 sm:block';
        complexityCard.innerHTML = `
      <div class="text-xs uppercase tracking-[0.28em] text-slate-500">Complexity snapshot</div>
      <div class="mt-3 grid gap-2 text-sm text-slate-200">
        ${algorithm.meta.complexities.map((line) => `<div class="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2"><span>${line.label}</span><span class="font-semibold text-white">${line.value}</span></div>`).join('')}
      </div>
    `;
        // complexityCard will be rendered after the visualization for better flow on mobile

        const visualizationPanel = document.createElement('section');
        visualizationPanel.className = 'space-y-4';
        const visualization = document.createElement('div');
        visualization.id = 'visualization-root';
        renderVisualization(visualization, snapshot);
        visualizationPanel.appendChild(visualization);

        const details = document.createElement('div');
        details.className = 'grid gap-3 sm:grid-cols-3';
        snapshot.details.forEach((item) => {
            const card = document.createElement('div');
            card.className = 'rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-3 shadow-glow sm:p-4';
            card.innerHTML = `
        <div class="text-xs uppercase tracking-[0.28em] text-slate-500">${item.label}</div>
        <div class="mt-2 text-lg font-semibold text-white">${item.value}</div>
        <div class="mt-1 text-sm leading-6 text-slate-400">${item.helper}</div>
      `;
            details.appendChild(card);
        });
        visualizationPanel.appendChild(details);
        visualizationPanel.appendChild(complexityCard);

        grid.appendChild(controlsPanel);
        grid.appendChild(visualizationPanel);
        shell.appendChild(grid);
        root.appendChild(shell);

        const activeModuleLabel = root.querySelector('#active-module-label');
        if (activeModuleLabel) {
            activeModuleLabel.textContent = algorithm.meta.title;
        }
    };

    requestRender();
};
