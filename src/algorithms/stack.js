import { createId, parseNumber, parseNumberList, sleep } from '../lib/utils.js';

export const createStackAlgorithm = (notify) => {
    const state = {
        items: [12, 24, 36],
        draft: { value: '48', values: '8, 16, 24, 32' },
        status: 'Push adds a value to the top of the stack.',
        recentIndex: -1,
        preview: null,
        busy: false,
    };

    const syncStatus = (message) => {
        state.status = message;
        notify();
    };

    const setBusy = (value) => {
        state.busy = value;
    };

    const setField = (key, value) => {
        state.draft[key] = value;
        notify();
    };

    const snapshot = () => ({
        title: 'Stack',
        description: 'A last-in, first-out structure where the newest item becomes the top.',
        kind: 'stack',
        status: state.status,
        badges: [
            { label: 'LIFO', tone: 'primary' },
            { label: 'Top = Head', tone: 'success' },
            { label: 'O(1) push/pop', tone: 'warning' },
        ],
        nodes: state.items.map((value, index) => ({
            id: `${value}-${index}`,
            value,
            recent: index === state.recentIndex,
        })),
        preview: state.preview,
        metrics: [
            { label: 'Size', value: String(state.items.length) },
            { label: 'Top', value: state.items.length ? String(state.items[state.items.length - 1]) : 'Empty' },
            { label: 'Peek', value: state.items.length ? String(state.items[state.items.length - 1]) : 'None' },
        ],
        details: [
            { label: 'Push', value: 'Insert at top', helper: 'The newest value becomes the visible top node.' },
            { label: 'Pop', value: 'Remove top item', helper: 'The current head slides off the stack container.' },
            { label: 'Peek', value: 'Inspect top only', helper: 'Read the value without changing the stack.' },
        ],
    });

    const push = async () => {
        if (state.busy) return;
        const value = parseNumber(state.draft.value);
        if (value === null) {
            syncStatus('Enter a valid numeric value to push onto the stack.');
            return;
        }

        setBusy(true);
        state.preview = { value, mode: 'push' };
        syncStatus(`Preparing to push ${value}.`);
        await sleep(240);
        state.items.push(value);
        state.recentIndex = state.items.length - 1;
        state.preview = null;
        setBusy(false);
        syncStatus(`Pushed ${value} and promoted it to the top of the stack.`);
    };

    const pop = async () => {
        if (state.busy) return;
        if (!state.items.length) {
            syncStatus('Stack underflow: nothing to pop.');
            return;
        }

        setBusy(true);
        const removed = state.items[state.items.length - 1];
        state.preview = { value: removed, mode: 'pop' };
        syncStatus(`Removing ${removed} from the top.`);
        await sleep(240);
        state.items.pop();
        state.recentIndex = state.items.length - 1;
        state.preview = null;
        setBusy(false);
        syncStatus(`Popped ${removed} from the stack.`);
    };

    const peek = () => {
        if (!state.items.length) {
            syncStatus('Stack is empty, so peek has nothing to show.');
            return;
        }

        state.recentIndex = state.items.length - 1;
        syncStatus(`Peek shows ${state.items[state.items.length - 1]} at the top.`);
    };

    const isEmpty = () => {
        syncStatus(state.items.length ? 'Stack is not empty.' : 'Stack is empty.');
    };

    const loadSample = () => {
        const values = parseNumberList(state.draft.values);
        if (!values.length) {
            syncStatus('Sample list must contain at least one numeric value.');
            return;
        }

        state.items = values.map((value) => value);
        state.recentIndex = state.items.length - 1;
        syncStatus(`Loaded ${values.length} stack item${values.length === 1 ? '' : 's'}.`);
    };

    const clear = () => {
        state.items = [];
        state.recentIndex = -1;
        state.preview = null;
        syncStatus('Stack cleared.');
    };

    return {
        meta: {
            title: 'Stack',
            short: 'Push, pop, peek, and empty checks.',
            category: 'Linear DS',
            layout: 'stack',
            description: 'Use the stack controls to watch the latest value move into the head position and animate out on pop.',
            complexities: [
                { label: 'Push', value: 'O(1)' },
                { label: 'Pop', value: 'O(1)' },
                { label: 'Peek', value: 'O(1)' },
            ],
        },
        controlGroups: [
            {
                label: 'Utilities',
                title: 'Sample data',
                fields: [{ key: 'values', label: 'Sample list', placeholder: '8, 16, 24, 32', type: 'text' }],
                buttons: [
                    { label: 'Load Sample', action: 'loadSample', variant: 'primary' },
                    { label: 'Clear', action: 'clear', variant: 'danger' },
                ],
            },
            {
                label: 'Primary Operations',
                title: 'Stack actions',
                fields: [{ key: 'value', label: 'Value', placeholder: 'Enter a number', type: 'number' }],
                buttons: [
                    { label: 'Push', action: 'push', variant: 'primary' },
                    { label: 'Pop', action: 'pop', variant: 'danger' },
                    { label: 'Peek', action: 'peek', variant: 'secondary' },
                    { label: 'Is Empty', action: 'isEmpty', variant: 'secondary' },
                ],
            },
        ],
        snapshot,
        setField,
        getField: (key) => state.draft[key] || '',
        isBusy: () => state.busy,
        push,
        pop,
        peek,
        isEmpty,
        loadSample,
        clear,
    };
};
