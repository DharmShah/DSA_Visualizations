import { createId, parseNumber, parseNumberList, sleep } from '../lib/utils.js';

export const createQueueAlgorithm = (notify) => {
    const state = {
        items: [5, 15, 25],
        draft: { value: '35', values: '10, 20, 30, 40' },
        status: 'Queue follows first-in, first-out order.',
        recentIndex: -1,
        preview: null,
        busy: false,
    };

    const setField = (key, value) => {
        state.draft[key] = value;
        notify();
    };

    const setBusy = (value) => {
        state.busy = value;
    };

    const snapshot = () => ({
        title: 'Queue',
        description: 'A first-in, first-out line where the front leaves before the back.',
        kind: 'queue',
        status: state.status,
        badges: [
            { label: 'FIFO', tone: 'primary' },
            { label: 'Front / Back', tone: 'success' },
            { label: 'O(1) enqueue/dequeue', tone: 'warning' },
        ],
        nodes: state.items.map((value, index) => ({
            id: `${value}-${index}`,
            value,
            recent: index === state.recentIndex,
        })),
        preview: state.preview,
        metrics: [
            { label: 'Length', value: String(state.items.length) },
            { label: 'Front', value: state.items.length ? String(state.items[0]) : 'Empty' },
            { label: 'Back', value: state.items.length ? String(state.items[state.items.length - 1]) : 'Empty' },
        ],
        details: [
            { label: 'Enqueue', value: 'Insert at back', helper: 'New values enter at the tail and wait their turn.' },
            { label: 'Dequeue', value: 'Remove from front', helper: 'The front item leaves first, matching queue order.' },
            { label: 'Front', value: 'Inspect head item', helper: 'Read the value without modifying the queue.' },
        ],
    });

    const enqueue = async () => {
        if (state.busy) return;
        const value = parseNumber(state.draft.value);
        if (value === null) {
            notify();
            state.status = 'Enter a valid numeric value to enqueue.';
            notify();
            return;
        }

        setBusy(true);
        state.preview = { value, mode: 'enqueue' };
        state.status = `Preparing to enqueue ${value}.`;
        notify();
        await sleep(240);
        state.items.push(value);
        state.recentIndex = state.items.length - 1;
        state.preview = null;
        setBusy(false);
        state.status = `Enqueued ${value} at the back of the queue.`;
        notify();
    };

    const dequeue = async () => {
        if (state.busy) return;
        if (!state.items.length) {
            state.status = 'Queue underflow: nothing to dequeue.';
            notify();
            return;
        }

        setBusy(true);
        const removed = state.items[0];
        state.preview = { value: removed, mode: 'dequeue' };
        state.status = `Removing ${removed} from the front.`;
        notify();
        await sleep(240);
        state.items.shift();
        state.recentIndex = 0;
        state.preview = null;
        setBusy(false);
        state.status = `Dequeued ${removed} from the queue.`;
        notify();
    };

    const front = () => {
        state.recentIndex = 0;
        state.status = state.items.length ? `Front value is ${state.items[0]}.` : 'Queue is empty, so front has no value.';
        notify();
    };

    const isEmpty = () => {
        state.status = state.items.length ? 'Queue is not empty.' : 'Queue is empty.';
        notify();
    };

    const loadSample = () => {
        const values = parseNumberList(state.draft.values);
        if (!values.length) {
            state.status = 'Sample list must contain at least one number.';
            notify();
            return;
        }

        state.items = values;
        state.recentIndex = state.items.length - 1;
        state.status = `Loaded ${values.length} queue item${values.length === 1 ? '' : 's'}.`;
        notify();
    };

    const clear = () => {
        state.items = [];
        state.recentIndex = -1;
        state.preview = null;
        state.status = 'Queue cleared.';
        notify();
    };

    return {
        meta: {
            title: 'Queue',
            short: 'Enqueue, dequeue, and front inspection.',
            category: 'Linear DS',
            layout: 'queue',
            description: 'Watch the head leave first while the back keeps growing with new arrivals.',
            complexities: [
                { label: 'Enqueue', value: 'O(1)' },
                { label: 'Dequeue', value: 'O(1)' },
                { label: 'Front', value: 'O(1)' },
            ],
        },
        controlGroups: [
            {
                label: 'Utilities',
                title: 'Sample data',
                fields: [{ key: 'values', label: 'Sample list', placeholder: '10, 20, 30, 40', type: 'text' }],
                buttons: [
                    { label: 'Load Sample', action: 'loadSample', variant: 'primary' },
                    { label: 'Clear', action: 'clear', variant: 'danger' },
                ],
            },
            {
                label: 'Primary Operations',
                title: 'Queue actions',
                fields: [{ key: 'value', label: 'Value', placeholder: 'Enter a number', type: 'number' }],
                buttons: [
                    { label: 'Enqueue', action: 'enqueue', variant: 'primary' },
                    { label: 'Dequeue', action: 'dequeue', variant: 'danger' },
                    { label: 'Front', action: 'front', variant: 'secondary' },
                    { label: 'Is Empty', action: 'isEmpty', variant: 'secondary' },
                ],
            },
        ],
        snapshot,
        setField,
        getField: (key) => state.draft[key] || '',
        isBusy: () => state.busy,
        enqueue,
        dequeue,
        front,
        isEmpty,
        loadSample,
        clear,
    };
};
