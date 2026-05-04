import { createId, parseNumber, parseNumberList, sleep } from '../lib/utils.js';

export const createSinglyLinkedListAlgorithm = (notify) => {
    const state = {
        nodes: [11, 22, 33].map((value) => ({ id: createId('sll'), value })),
        draft: { value: '44', values: '7, 14, 21, 28', searchValue: '22' },
        status: 'A singly linked list stores a node and one forward pointer.',
        activeIndex: -1,
        foundIndex: -1,
        busy: false,
    };

    const setField = (key, value) => {
        state.draft[key] = value;
        notify();
    };

    const rebuildStatus = (message) => {
        state.status = message;
        notify();
    };

    const appendValue = (value) => {
        state.nodes.push({ id: createId('sll'), value });
        state.activeIndex = state.nodes.length - 1;
    };

    const prependValue = (value) => {
        state.nodes.unshift({ id: createId('sll'), value });
        state.activeIndex = 0;
    };

    const snapshot = () => ({
        title: 'Singly Linked List',
        description: 'Nodes point forward one step at a time, so head and tail are easy to trace visually.',
        kind: 'linked',
        status: state.status,
        badges: [
            { label: 'Head / Tail', tone: 'primary' },
            { label: 'Forward pointer', tone: 'success' },
            { label: 'Dynamic nodes', tone: 'warning' },
        ],
        nodes: state.nodes.map((node, index) => ({
            id: node.id,
            value: node.value,
            active: index === state.activeIndex || index === state.foundIndex,
        })),
        metrics: [
            { label: 'Length', value: String(state.nodes.length) },
            { label: 'Head', value: state.nodes.length ? String(state.nodes[0].value) : 'Empty' },
            { label: 'Tail', value: state.nodes.length ? String(state.nodes[state.nodes.length - 1].value) : 'Empty' },
        ],
        details: [
            { label: 'Add Head', value: 'Insert at front', helper: 'The new node immediately becomes the head.' },
            { label: 'Add Tail', value: 'Append at end', helper: 'Traversal walks to the last node before linking forward.' },
            { label: 'Search', value: 'Linear scan', helper: 'Each node is highlighted in order until the target is found.' },
        ],
    });

    const addHead = () => {
        const value = parseNumber(state.draft.value);
        if (value === null) {
            rebuildStatus('Enter a valid number to add at the head.');
            return;
        }
        prependValue(value);
        rebuildStatus(`Inserted ${value} at the head of the singly linked list.`);
    };

    const addTail = () => {
        const value = parseNumber(state.draft.value);
        if (value === null) {
            rebuildStatus('Enter a valid number to append at the tail.');
            return;
        }
        appendValue(value);
        rebuildStatus(`Appended ${value} to the tail of the singly linked list.`);
    };

    const deleteHead = () => {
        if (!state.nodes.length) {
            rebuildStatus('The list is empty, so the head cannot be removed.');
            return;
        }
        const removed = state.nodes.shift();
        state.activeIndex = 0;
        rebuildStatus(`Removed head node ${removed.value}.`);
    };

    const deleteTail = () => {
        if (!state.nodes.length) {
            rebuildStatus('The list is empty, so the tail cannot be removed.');
            return;
        }
        const removed = state.nodes.pop();
        state.activeIndex = state.nodes.length - 1;
        rebuildStatus(`Removed tail node ${removed.value}.`);
    };

    const search = async () => {
        const value = parseNumber(state.draft.searchValue);
        if (value === null) {
            rebuildStatus('Enter a valid number to search in the list.');
            return;
        }

        if (!state.nodes.length) {
            rebuildStatus('The list is empty, so the search cannot begin.');
            return;
        }

        state.busy = true;
        state.foundIndex = -1;
        for (let index = 0; index < state.nodes.length; index += 1) {
            state.activeIndex = index;
            state.status = `Scanning node ${index + 1} of ${state.nodes.length}...`;
            notify();
            await sleep(220);
            if (state.nodes[index].value === value) {
                state.foundIndex = index;
                state.status = `Found ${value} at node ${index + 1}.`;
                state.busy = false;
                notify();
                return;
            }
        }

        state.activeIndex = -1;
        state.status = `${value} was not found in the singly linked list.`;
        state.busy = false;
        notify();
    };

    const loadSample = () => {
        const values = parseNumberList(state.draft.values);
        if (!values.length) {
            rebuildStatus('Sample list must contain at least one number.');
            return;
        }
        state.nodes = values.map((value) => ({ id: createId('sll'), value }));
        state.activeIndex = state.nodes.length - 1;
        rebuildStatus(`Loaded ${values.length} singly linked list node${values.length === 1 ? '' : 's'}.`);
    };

    const clear = () => {
        state.nodes = [];
        state.activeIndex = -1;
        state.foundIndex = -1;
        rebuildStatus('Singly linked list cleared.');
    };

    return {
        meta: {
            title: 'Singly Linked List',
            short: 'Head, tail, append, remove, and search.',
            category: 'Linked DS',
            layout: 'linked',
            description: 'Each node keeps a single next pointer, so the chain is easy to follow from head to tail.',
            complexities: [
                { label: 'Add head', value: 'O(1)' },
                { label: 'Add tail', value: 'O(n)' },
                { label: 'Search', value: 'O(n)' },
            ],
        },
        controlGroups: [
            {
                label: 'Traversal',
                title: 'Search and sample',
                fields: [
                    { key: 'searchValue', label: 'Search value', placeholder: 'Enter a number', type: 'number' },
                    { key: 'values', label: 'Sample list', placeholder: '7, 14, 21, 28', type: 'text' },
                ],
                buttons: [
                    { label: 'Search', action: 'search', variant: 'primary' },
                    { label: 'Load Sample', action: 'loadSample', variant: 'secondary' },
                    { label: 'Clear', action: 'clear', variant: 'danger' },
                ],
            },
            {
                label: 'Node Updates',
                title: 'Single linked list actions',
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
