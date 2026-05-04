import { parseNumber, parseNumberList, sleep } from '../lib/utils.js';

export const createLinearSearchAlgorithm = (notify) => {
    const state = {
        values: [18, 27, 36, 45, 54, 63],
        draft: { values: '18, 27, 36, 45, 54, 63', target: '45' },
        status: 'Linear search checks each value in order until it finds a match.',
        activeIndex: -1,
        foundIndex: -1,
        busy: false,
    };

    const setField = (key, value) => {
        state.draft[key] = value;
        notify();
    };

    const snapshot = () => ({
        title: 'Linear Search',
        description: 'The algorithm scans one value at a time from left to right until the target is found or the array ends.',
        kind: 'array',
        status: state.status,
        badges: [
            { label: 'Sequential scan', tone: 'primary' },
            { label: 'O(n)', tone: 'warning' },
            { label: 'Simple comparison', tone: 'success' },
        ],
        legend: [
            { label: 'Current', tone: 'primary' },
            { label: 'Found', tone: 'success' },
            { label: 'Array value', tone: 'neutral' },
        ],
        nodes: state.values.map((value, index) => ({
            value,
            active: index === state.activeIndex || index === state.foundIndex,
            badge: index === state.foundIndex ? { label: 'Found', tone: 'success' } : index === state.activeIndex ? { label: 'Scanning', tone: 'primary' } : null,
            note: index === state.foundIndex ? 'Match found here' : index === state.activeIndex ? 'Current comparison' : '',
        })),
        metrics: [
            { label: 'Length', value: String(state.values.length) },
            { label: 'Target', value: state.draft.target || 'None' },
            { label: 'Result', value: state.foundIndex >= 0 ? `Index ${state.foundIndex}` : 'Pending' },
        ],
        details: [
            { label: 'Compare', value: 'Check one by one', helper: 'Each cell is visited in order until the match appears.' },
            { label: 'Target', value: 'User supplied', helper: 'The target value drives the animated scan.' },
            { label: 'Best use', value: 'Unsorted arrays', helper: 'Linear search works even when the array is not ordered.' },
        ],
    });

    const loadSample = () => {
        const values = parseNumberList(state.draft.values);
        if (!values.length) {
            state.status = 'Sample list must contain at least one number.';
            notify();
            return;
        }
        state.values = values;
        state.activeIndex = -1;
        state.foundIndex = -1;
        state.status = `Loaded ${values.length} values for linear search.`;
        notify();
    };

    const reset = () => {
        state.activeIndex = -1;
        state.foundIndex = -1;
        state.status = 'Linear search state reset.';
        notify();
    };

    const search = async () => {
        const target = parseNumber(state.draft.target);
        if (target === null) {
            state.status = 'Enter a valid number to search for.';
            notify();
            return;
        }

        state.busy = true;
        state.foundIndex = -1;
        for (let index = 0; index < state.values.length; index += 1) {
            state.activeIndex = index;
            state.status = `Checking index ${index} with value ${state.values[index]}.`;
            notify();
            await sleep(220);
            if (state.values[index] === target) {
                state.foundIndex = index;
                state.busy = false;
                state.status = `Found ${target} at index ${index}.`;
                notify();
                return;
            }
        }

        state.activeIndex = -1;
        state.busy = false;
        state.status = `${target} was not found in the array.`;
        notify();
    };

    return {
        meta: {
            title: 'Linear Search',
            short: 'Scan the array one cell at a time.',
            category: 'Searching',
            layout: 'array',
            description: 'The target is compared against each element in sequence, which makes the animation easy to follow.',
            complexities: [
                { label: 'Search', value: 'O(n)' },
                { label: 'Best case', value: 'O(1)' },
                { label: 'Space', value: 'O(1)' },
            ],
        },
        controlGroups: [
            {
                label: 'Array Setup',
                title: 'Load and search',
                fields: [
                    { key: 'values', label: 'Array values', placeholder: '18, 27, 36, 45, 54, 63', type: 'text' },
                    { key: 'target', label: 'Target', placeholder: 'Enter a number', type: 'number' },
                ],
                buttons: [
                    { label: 'Search', action: 'search', variant: 'primary' },
                    { label: 'Load Sample', action: 'loadSample', variant: 'secondary' },
                    { label: 'Reset', action: 'reset', variant: 'danger' },
                ],
            },
        ],
        snapshot,
        setField,
        getField: (key) => state.draft[key] || '',
        isBusy: () => state.busy,
        loadSample,
        reset,
        search,
    };
};
