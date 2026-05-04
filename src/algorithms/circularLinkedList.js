import { createId, parseNumber, parseNumberList } from '../lib/utils.js';

export const createCircularLinkedListAlgorithm = (notify) => {
    const state = {
        nodes: [4, 8, 12].map((value) => ({ id: createId('cll'), value })),
        draft: { value: '16', values: '3, 6, 9, 12' },
        status: 'A circular linked list links the tail back to the head.',
        activeIndex: -1,
    };

    const setField = (key, value) => {
        state.draft[key] = value;
        notify();
    };

    const snapshot = () => ({
        title: 'Circular Linked List',
        description: 'The last node loops back to the first node, forming a closed chain that never truly ends.',
        kind: 'circular',
        status: state.status,
        badges: [
            { label: 'Circular', tone: 'primary' },
            { label: 'Tail → Head', tone: 'success' },
            { label: 'Looped traversal', tone: 'warning' },
        ],
        nodes: state.nodes.map((node, index) => ({
            id: node.id,
            value: node.value,
            active: index === state.activeIndex,
            circularTail: index === state.nodes.length - 1,
        })),
        metrics: [
            { label: 'Length', value: String(state.nodes.length) },
            { label: 'Head', value: state.nodes.length ? String(state.nodes[0].value) : 'Empty' },
            { label: 'Tail', value: state.nodes.length ? String(state.nodes[state.nodes.length - 1].value) : 'Empty' },
        ],
        details: [
            { label: 'Insert', value: 'Append into loop', helper: 'The new tail still points back to the head.' },
            { label: 'Remove', value: 'Delete from loop', helper: 'The loop is repaired after each removal.' },
            { label: 'Rotate', value: 'Move head to tail', helper: 'This highlights how the circular structure can be cycled endlessly.' },
        ],
    });

    const addNode = () => {
        const value = parseNumber(state.draft.value);
        if (value === null) {
            state.status = 'Enter a valid number to add into the circular list.';
            notify();
            return;
        }
        state.nodes.push({ id: createId('cll'), value });
        state.activeIndex = state.nodes.length - 1;
        state.status = `Inserted ${value} into the circular linked list.`;
        notify();
    };

    const removeNode = () => {
        if (!state.nodes.length) {
            state.status = 'The circular list is empty.';
            notify();
            return;
        }
        const removed = state.nodes.shift();
        state.activeIndex = 0;
        state.status = `Removed ${removed.value} from the circular linked list.`;
        notify();
    };

    const rotate = () => {
        if (!state.nodes.length) {
            state.status = 'The circular list is empty, so rotation has no effect.';
            notify();
            return;
        }
        const [first] = state.nodes.splice(0, 1);
        state.nodes.push(first);
        state.activeIndex = state.nodes.length - 1;
        state.status = `Rotated ${first.value} to the tail while keeping the loop intact.`;
        notify();
    };

    const loadSample = () => {
        const values = parseNumberList(state.draft.values);
        if (!values.length) {
            state.status = 'Sample list must contain at least one number.';
            notify();
            return;
        }
        state.nodes = values.map((value) => ({ id: createId('cll'), value }));
        state.activeIndex = state.nodes.length - 1;
        state.status = `Loaded ${values.length} circular linked list node${values.length === 1 ? '' : 's'}.`;
        notify();
    };

    const clear = () => {
        state.nodes = [];
        state.activeIndex = -1;
        state.status = 'Circular linked list cleared.';
        notify();
    };

    return {
        meta: {
            title: 'Circular Linked List',
            short: 'Looped traversal with the tail linked to the head.',
            category: 'Linked DS',
            layout: 'circular',
            description: 'A circular list closes the chain, making it useful for repeated traversal and round-robin style access.',
            complexities: [
                { label: 'Insert', value: 'O(1)' },
                { label: 'Remove', value: 'O(1)' },
                { label: 'Rotate', value: 'O(1)' },
            ],
        },
        controlGroups: [
            {
                label: 'Utilities',
                title: 'Sample data',
                fields: [{ key: 'values', label: 'Sample list', placeholder: '3, 6, 9, 12', type: 'text' }],
                buttons: [
                    { label: 'Load Sample', action: 'loadSample', variant: 'primary' },
                    { label: 'Clear', action: 'clear', variant: 'danger' },
                ],
            },
            {
                label: 'Node Updates',
                title: 'Circular list actions',
                fields: [{ key: 'value', label: 'Value', placeholder: 'Enter a number', type: 'number' }],
                buttons: [
                    { label: 'Add Node', action: 'addNode', variant: 'primary' },
                    { label: 'Remove Node', action: 'removeNode', variant: 'danger' },
                    { label: 'Rotate', action: 'rotate', variant: 'secondary' },
                ],
            },
        ],
        snapshot,
        setField,
        getField: (key) => state.draft[key] || '',
        isBusy: () => false,
        addNode,
        removeNode,
        rotate,
        loadSample,
        clear,
    };
};
