import { formatValue } from './utils.js';

const badgeClassMap = {
    primary: 'border-cyan-400/40 bg-cyan-400/15 text-cyan-100',
    success: 'border-emerald-400/40 bg-emerald-400/15 text-emerald-100',
    warning: 'border-amber-400/40 bg-amber-400/15 text-amber-100',
    danger: 'border-rose-400/40 bg-rose-400/15 text-rose-100',
    neutral: 'border-slate-400/20 bg-slate-800/70 text-slate-200',
};

export const badge = (label, tone = 'neutral') => `inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide ${badgeClassMap[tone] || badgeClassMap.neutral}`;

export const buttonClass = (variant = 'secondary') => {
    if (variant === 'primary') {
        return 'border-cyan-400/40 bg-cyan-400/15 text-cyan-50 hover:bg-cyan-400/25';
    }

    if (variant === 'danger') {
        return 'border-rose-400/35 bg-rose-400/10 text-rose-100 hover:bg-rose-400/20';
    }

    return 'border-slate-700 bg-slate-900/70 text-slate-100 hover:border-slate-500 hover:bg-slate-800';
};

const createElement = (tag, className = '', text) => {
    const element = document.createElement(tag);
    if (className) {
        element.className = className;
    }
    if (text !== undefined) {
        element.textContent = text;
    }
    return element;
};

const createChip = (label, tone = 'neutral') => {
    const chip = createElement('span', badge(label, tone), label);
    return chip;
};

const createNodeCard = ({ value, label, accent = 'primary', active = false, last = false, secondaryLabel }) => {
    const card = createElement(
        'div',
        [
            'relative flex min-w-[72px] flex-col items-center justify-center rounded-2xl border px-4 py-3 text-center shadow-glow transition-all duration-300',
            active ? 'border-cyan-400/70 bg-cyan-400/15' : 'border-slate-700 bg-slate-900/80',
            last ? 'ring-1 ring-cyan-300/20' : '',
        ].join(' '),
    );

    if (active) {
        card.classList.add('animate-pulse-pop');
    } else {
        card.classList.add('animate-rise-in');
    }

    if (label) {
        card.appendChild(createChip(label, accent));
    }

    const valueNode = createElement('div', 'mt-2 text-lg font-bold tracking-wide text-white', formatValue(value));
    card.appendChild(valueNode);

    if (secondaryLabel) {
        card.appendChild(createElement('div', 'mt-1 text-[11px] uppercase tracking-[0.24em] text-slate-400', secondaryLabel));
    }

    return card;
};

const createArrow = (direction = 'right', text = '→') => {
    const arrow = createElement(
        'div',
        'flex items-center justify-center px-2 text-lg font-semibold text-slate-500 sm:px-3',
        text,
    );

    if (direction === 'down') {
        arrow.className = 'flex items-center justify-center py-1 text-lg font-semibold text-slate-500';
    }

    return arrow;
};

export const renderVisualization = (container, snapshot) => {
    container.innerHTML = '';
    container.className = 'relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/65 p-4 shadow-glow backdrop-blur-xl sm:p-6';

    const header = createElement('div', 'flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3');
    const titleWrap = createElement('div', 'space-y-1');
    titleWrap.appendChild(createElement('h2', 'text-lg font-semibold text-white sm:text-2xl', snapshot.title));
    titleWrap.appendChild(createElement('p', 'max-w-2xl text-xs leading-5 text-slate-300 sm:text-sm sm:leading-6', snapshot.description));
    header.appendChild(titleWrap);

    const badgeWrap = createElement('div', 'flex flex-wrap items-center gap-2 sm:justify-end');
    snapshot.badges.forEach((item) => {
        badgeWrap.appendChild(createChip(item.label, item.tone));
    });
    header.appendChild(badgeWrap);
    container.appendChild(header);

    const statusBar = createElement('div', 'mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-xs text-slate-200 sm:px-4 sm:py-3 sm:text-sm');
    statusBar.appendChild(createChip(snapshot.kind.toUpperCase(), 'primary'));
    statusBar.appendChild(createElement('span', 'text-slate-300', snapshot.status));
    container.appendChild(statusBar);

    const surface = createElement('div', 'mt-4 min-h-[240px] rounded-[1.75rem] border border-slate-800/80 bg-gradient-to-b from-slate-950/90 to-slate-900/70 p-3 sm:mt-6 sm:min-h-[360px] sm:p-6');

    if (snapshot.kind === 'stack') {
        surface.appendChild(renderStack(snapshot));
    } else if (snapshot.kind === 'queue') {
        surface.appendChild(renderQueue(snapshot));
    } else if (snapshot.kind === 'linked') {
        surface.appendChild(renderLinkedList(snapshot));
    } else if (snapshot.kind === 'doubly') {
        surface.appendChild(renderDoublyList(snapshot));
    } else if (snapshot.kind === 'circular') {
        surface.appendChild(renderCircularList(snapshot));
    } else {
        surface.appendChild(renderArrayGrid(snapshot));
    }

    container.appendChild(surface);

    const foot = createElement('div', 'mt-4 grid gap-2 sm:grid-cols-3 sm:gap-3');
    snapshot.metrics.forEach((metric) => {
        const metricCard = createElement('div', 'rounded-2xl border border-slate-800 bg-slate-900/70 p-3 sm:p-4');
        metricCard.appendChild(createElement('div', 'text-xs uppercase tracking-[0.28em] text-slate-400', metric.label));
        metricCard.appendChild(createElement('div', 'mt-2 text-lg font-semibold text-white', metric.value));
        foot.appendChild(metricCard);
    });
    container.appendChild(foot);
};

const renderStack = (snapshot) => {
    const wrap = createElement('div', 'flex h-full min-h-[220px] items-start justify-center sm:min-h-[300px]');
    const stack = createElement('div', 'flex w-full max-w-sm flex-col items-stretch gap-2 sm:gap-3');

    if (snapshot.preview) {
        const preview = createElement('div', 'animate-rise-in self-center rounded-2xl border border-cyan-400/50 bg-cyan-400/15 px-3 py-2 text-xs font-semibold text-cyan-100 shadow-glow sm:px-4 sm:text-sm', `Pushing ${snapshot.preview.value}`);
        stack.appendChild(preview);
    }

    if (!snapshot.nodes.length) {
        stack.appendChild(createElement('div', 'rounded-2xl border border-dashed border-slate-700 bg-slate-900/55 px-6 py-12 text-center text-slate-400 sm:py-16', 'Stack is empty'));
    } else {
        snapshot.nodes.slice().reverse().forEach((node, index) => {
            const isTop = index === 0;
            const card = createNodeCard({
                value: node.value,
                label: isTop ? 'Top / Head' : '',
                accent: isTop ? 'primary' : 'neutral',
                active: node.recent,
                secondaryLabel: `Node ${snapshot.nodes.length - index}`,
            });
            stack.appendChild(card);
        });
    }

    wrap.appendChild(stack);
    return wrap;
};

const renderQueue = (snapshot) => {
    const wrap = createElement('div', 'flex h-full min-h-[220px] items-center justify-center sm:min-h-[300px]');
    const queue = createElement('div', 'flex w-full max-w-5xl flex-col gap-6');
    const labels = createElement('div', 'flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-slate-500 sm:text-xs sm:tracking-[0.28em]');
    labels.appendChild(createElement('span', '', 'Front'));
    labels.appendChild(createElement('span', '', 'Back'));
    queue.appendChild(labels);

    const row = createElement('div', 'flex flex-wrap items-center justify-start gap-2 rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-3 sm:gap-3 sm:p-5');
    if (!snapshot.nodes.length) {
        row.appendChild(createElement('div', 'rounded-2xl border border-dashed border-slate-700 bg-slate-900/55 px-6 py-14 text-center text-slate-400', 'Queue is empty'));
    } else {
        snapshot.nodes.forEach((node, index) => {
            row.appendChild(
                createNodeCard({
                    value: node.value,
                    label: index === 0 ? 'Front' : index === snapshot.nodes.length - 1 ? 'Back' : '',
                    accent: index === 0 ? 'primary' : index === snapshot.nodes.length - 1 ? 'warning' : 'neutral',
                    active: node.recent,
                    secondaryLabel: `Index ${index}`,
                }),
            );
            if (index !== snapshot.nodes.length - 1) {
                row.appendChild(createArrow());
            }
        });
    }
    queue.appendChild(row);
    wrap.appendChild(queue);
    return wrap;
};

const renderLinkedList = (snapshot) => renderLinkedChain(snapshot, false);
const renderDoublyList = (snapshot) => renderLinkedChain(snapshot, true);

const renderCircularList = (snapshot) => {
    const wrap = createElement('div', 'flex h-full min-h-[220px] items-center justify-center sm:min-h-[300px]');
    const shell = createElement('div', 'w-full space-y-5');
    const hint = createElement('div', 'flex items-center gap-2 text-sm text-slate-300');
    hint.appendChild(createChip('Circular link', 'warning'));
    hint.appendChild(createElement('span', '', 'Tail wraps back to head'));
    shell.appendChild(hint);

    const row = createElement('div', 'flex flex-wrap items-center gap-2 rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-3 sm:gap-3 sm:p-5');
    if (!snapshot.nodes.length) {
        row.appendChild(createElement('div', 'rounded-2xl border border-dashed border-slate-700 bg-slate-900/55 px-6 py-14 text-center text-slate-400', 'Circular list is empty'));
    } else {
        snapshot.nodes.forEach((node, index) => {
            row.appendChild(
                createNodeCard({
                    value: node.value,
                    label: index === 0 ? 'Head' : '',
                    accent: index === 0 ? 'primary' : 'neutral',
                    active: node.active,
                    secondaryLabel: node.circularTail ? 'Tail closes loop' : `Node ${index + 1}`,
                }),
            );
            if (index !== snapshot.nodes.length - 1) {
                row.appendChild(createArrow());
            }
        });
        row.appendChild(createArrow('right', '↺'));
        row.appendChild(createNodeCard({ value: 'Head', label: '', accent: 'success', secondaryLabel: 'Loop closure' }));
    }

    shell.appendChild(row);
    wrap.appendChild(shell);
    return wrap;
};

const renderLinkedChain = (snapshot, bidirectional) => {
    const wrap = createElement('div', 'flex h-full min-h-[220px] items-center justify-center sm:min-h-[300px]');
    const shell = createElement('div', 'w-full space-y-5');
    const tags = createElement('div', 'flex flex-wrap gap-2');
    tags.appendChild(createChip('Head', 'primary'));
    tags.appendChild(createChip('Tail', 'warning'));
    if (bidirectional) {
        tags.appendChild(createChip('Prev + Next', 'success'));
    }
    shell.appendChild(tags);

    const row = createElement('div', 'flex flex-wrap items-center gap-2 rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-3 sm:gap-3 sm:p-5');
    if (!snapshot.nodes.length) {
        row.appendChild(createElement('div', 'rounded-2xl border border-dashed border-slate-700 bg-slate-900/55 px-6 py-14 text-center text-slate-400', 'Linked list is empty'));
    } else {
        snapshot.nodes.forEach((node, index) => {
            const labels = [];
            if (index === 0) {
                labels.push('Head');
            }
            if (index === snapshot.nodes.length - 1) {
                labels.push('Tail');
            }

            row.appendChild(
                createNodeCard({
                    value: node.value,
                    label: labels.join(' / '),
                    accent: index === 0 ? 'primary' : index === snapshot.nodes.length - 1 ? 'warning' : 'neutral',
                    active: node.active,
                    secondaryLabel: bidirectional ? 'Prev | Value | Next' : 'Value | Next',
                }),
            );

            if (index !== snapshot.nodes.length - 1) {
                row.appendChild(createArrow());
            }
            if (bidirectional && index !== snapshot.nodes.length - 1) {
                row.appendChild(createArrow('left', '←'));
            }
        });
    }

    shell.appendChild(row);
    wrap.appendChild(shell);
    return wrap;
};

const renderArrayGrid = (snapshot) => {
    const wrap = createElement('div', 'flex h-full min-h-[220px] items-center justify-center sm:min-h-[300px]');
    const shell = createElement('div', 'w-full space-y-4');
    const legend = createElement('div', 'flex flex-wrap gap-2');
    snapshot.legend.forEach((item) => legend.appendChild(createChip(item.label, item.tone)));
    shell.appendChild(legend);

    const grid = createElement('div', 'grid gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-4');
    if (!snapshot.nodes.length) {
        grid.appendChild(createElement('div', 'col-span-full rounded-2xl border border-dashed border-slate-700 bg-slate-900/55 px-6 py-14 text-center text-slate-400', 'No values loaded'));
    } else {
        snapshot.nodes.forEach((node, index) => {
            const card = createElement(
                'div',
                [
                    'rounded-2xl border px-4 py-4 transition-all duration-300',
                    node.active ? 'border-cyan-400/70 bg-cyan-400/15 shadow-glow' : 'border-slate-800 bg-slate-900/80',
                ].join(' '),
            );
            if (node.active) {
                card.classList.add('animate-pulse-pop');
            }
            const meta = createElement('div', 'flex items-center justify-between gap-2 text-xs uppercase tracking-[0.24em] text-slate-400');
            meta.appendChild(createElement('span', '', `Index ${index}`));
            if (node.badge) {
                meta.appendChild(createChip(node.badge.label, node.badge.tone));
            }
            card.appendChild(meta);
            card.appendChild(createElement('div', 'mt-3 text-2xl font-bold text-white', formatValue(node.value)));
            if (node.note) {
                card.appendChild(createElement('div', 'mt-2 text-sm text-slate-300', node.note));
            }
            grid.appendChild(card);
        });
    }
    shell.appendChild(grid);
    wrap.appendChild(shell);
    return wrap;
};
