import { createId, parseNumber, parseNumberList, sleep } from '../lib/utils.js';

export const createDoublyLinkedListAlgorithm = (notify) => {
    const state = {
        nodes: [13, 26, 39].map((value) => ({ id: createId('dll'), value })),
        draft: { value: '52', values: '9, 18, 27, 36' },
        status: 'A doubly linked list stores both previous and next pointers.',
        activeIndex: -1,
        busy: false,
    };

    const setField = (key, value) => {
        state.draft[key] = value;
        notify();
    };

    const snapshot = () => ({
        title: 'Doubly Linked List',
        description: 'Each node keeps both forward and backward links, which makes bidirectional traversal possible.',
        kind: 'doubly',
        status: state.status,
        badges: [
            { label: 'Prev + Next', tone: 'primary' },
            { label: 'Bidirectional', tone: 'success' },
            { label: 'Flexible traversal', tone: 'warning' },
        ],
        nodes: state.nodes.map((node, index) => ({
            id: node.id,
            value: node.value,
            active: index === state.activeIndex,
        })),
        metrics: [
            { label: 'Length', value: String(state.nodes.length) },
            { label: 'Head', value: state.nodes.length ? String(state.nodes[0].value) : 'Empty' },
            { label: 'Tail', value: state.nodes.length ? String(state.nodes[state.nodes.length - 1].value) : 'Empty' },
        ],
        details: [
            { label: 'Add Head', value: 'Insert at front', helper: 'Update the old head’s prev pointer and promote the new node.' },
            { label: 'Add Tail', value: 'Insert at end', helper: 'Update the tail and connect both directions.' },
            { label: 'Traverse', value: 'Forward or backward', helper: 'The extra pointer makes reverse navigation straightforward.' },
        ],
    });

    const addHead = () => {
        const value = parseNumber(state.draft.value);
        if (value === null) {
            state.status = 'Enter a valid number to add at the head.';
            notify();
            return;
        }
        state.nodes.unshift({ id: createId('dll'), value });
        state.activeIndex = 0;
        state.status = `Inserted ${value} at the head of the doubly linked list.`;
        notify();
    };

    const addTail = () => {
        const value = parseNumber(state.draft.value);
        if (value === null) {
            state.status = 'Enter a valid number to add at the tail.';
            notify();
            return;
        }
        state.nodes.push({ id: createId('dll'), value });
        state.activeIndex = state.nodes.length - 1;
        state.status = `Inserted ${value} at the tail of the doubly linked list.`;
        notify();
    };

    const deleteHead = () => {
        if (!state.nodes.length) {
            state.status = 'The list is empty, so the head cannot be deleted.';
            notify();
            return;
        }
        const removed = state.nodes.shift();
        state.activeIndex = 0;
        state.status = `Deleted head node ${removed.value}.`;
        notify();
    };

    const deleteTail = () => {
        if (!state.nodes.length) {
            state.status = 'The list is empty, so the tail cannot be deleted.';
            notify();
            return;
        }
        const removed = state.nodes.pop();
        state.activeIndex = state.nodes.length - 1;
        state.status = `Deleted tail node ${removed.value}.`;
        notify();
    };

    const loadSample = () => {
        const values = parseNumberList(state.draft.values);
        if (!values.length) {
            state.status = 'Sample list must contain at least one number.';
            notify();
            return;
        }
        state.nodes = values.map((value) => ({ id: createId('dll'), value }));
        state.activeIndex = state.nodes.length - 1;
        state.status = `Loaded ${values.length} doubly linked list node${values.length === 1 ? '' : 's'}.`;
        notify();
    };

    const clear = () => {
        state.nodes = [];
        state.activeIndex = -1;
        state.status = 'Doubly linked list cleared.';
        notify();
    };

    const search = async () => {
        const value = parseNumber(state.draft.value);
        if (value === null) {
            state.status = 'Enter a valid number to search in the list.';
            notify();
            return;
        }
        if (!state.nodes.length) {
            state.status = 'The list is empty, so the search cannot begin.';
            notify();
            return;
        }

        state.busy = true;
        for (let index = 0; index < state.nodes.length; index += 1) {
            state.activeIndex = index;
            state.status = `Inspecting node ${index + 1} from the front.`;
            notify();
            await sleep(220);
            if (state.nodes[index].value === value) {
                state.status = `Found ${value} in the doubly linked list.`;
                state.busy = false;
                notify();
                return;
            }
        }

        state.activeIndex = -1;
        state.busy = false;
        state.status = `${value} was not found in the doubly linked list.`;
        notify();
    };

    return {
        meta: {
            title: 'Doubly Linked List',
            short: 'Add, remove, and traverse in both directions.',
            category: 'Linked DS',
            layout: 'doubly',
            description: 'Both prev and next pointers are visible, which makes the chain easier to reason about when nodes are inserted or removed.',
            complexities: [
                { label: 'Add head', value: 'O(1)' },
                { label: 'Add tail', value: 'O(1)' },
                { label: 'Search', value: 'O(n)' },
            ],
        },
        controlGroups: [
            {
                label: 'Traversal',
                title: 'Search and sample',
                fields: [{ key: 'values', label: 'Sample list', placeholder: '9, 18, 27, 36', type: 'text' }],
                buttons: [
                    { label: 'Search', action: 'search', variant: 'primary' },
                    { label: 'Load Sample', action: 'loadSample', variant: 'secondary' },
                    { label: 'Clear', action: 'clear', variant: 'danger' },
                ],
            },
            {
                label: 'Node Updates',
                title: 'Doubly linked list actions',
                fields: [{ key: 'value', label: 'Value', placeholder: 'Enter a number', type: 'number' }],
                buttons: [
                    { label: 'Add Head', action: 'addHead', variant: 'primary' },
                    { label: 'Add Tail', action: 'addTail', variant: 'secondary' },
                    { label: 'Delete Head', action: 'deleteHead', variant: 'danger' },
                    { label: 'Delete Tail', action: 'deleteTail', variant: 'danger' },
                ],
            },
        ],
        snapshot,
        setField,
        getField: (key) => state.draft[key] || '',
        isBusy: () => state.busy,
        addHead,
        addTail,
        deleteHead,
        deleteTail,
        search,
        loadSample,
        clear,
    };
};
