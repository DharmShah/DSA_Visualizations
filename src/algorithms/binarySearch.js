import { parseNumber, parseNumberList, sleep } from '../lib/utils.js';

export const createBinarySearchAlgorithm = (notify) => {
    const state = {
        values: [4, 8, 12, 16, 20, 24, 28, 32],
        draft: { values: '4, 8, 12, 16, 20, 24, 28, 32', target: '20' },
        status: 'Binary search halves the search space on every comparison.',
        low: -1,
        high: -1,
        mid: -1,
        foundIndex: -1,
        busy: false,
    };

    const setField = (key, value) => {
        state.draft[key] = value;
        notify();
    };

    const snapshot = () => ({
        title: 'Binary Search',
        description: 'The array must be sorted, then the algorithm compares the target with the middle element and discards half the search space each step.',
        kind: 'array',
        status: state.status,
        badges: [
            { label: 'Sorted input', tone: 'primary' },
            { label: 'O(log n)', tone: 'success' },
            { label: 'Mid comparison', tone: 'warning' },
        ],
        legend: [
            { label: 'Low', tone: 'primary' },
            { label: 'Mid', tone: 'warning' },
            { label: 'High', tone: 'success' },
            { label: 'Found', tone: 'success' },
        ],
        nodes: state.values.map((value, index) => ({
            value,
            active: index === state.mid || index === state.foundIndex,
            badge: index === state.foundIndex
                ? { label: 'Found', tone: 'success' }
                : index === state.mid
                    ? { label: 'Mid', tone: 'warning' }
                    : index === state.low
                        ? { label: 'Low', tone: 'primary' }
                        : index === state.high
                            ? { label: 'High', tone: 'success' }
                            : null,
            note: index === state.foundIndex ? 'Target located here' : index === state.mid ? 'Current middle' : '',
        })),
        metrics: [
            { label: 'Length', value: String(state.values.length) },
            { label: 'Target', value: state.draft.target || 'None' },
            { label: 'Range', value: state.low >= 0 && state.high >= 0 ? `${state.low}..${state.high}` : 'Pending' },
        ],
        details: [
            { label: 'Sort first', value: 'Binary search requires order', helper: 'The array is normalized before the animation starts.' },
            { label: 'Split space', value: 'Compare with the middle', helper: 'Low, mid, and high are highlighted together.' },
            { label: 'Finish', value: 'Narrow to one index', helper: 'The search ends as soon as the target is found or the range becomes empty.' },
        ],
    });

    const loadSample = () => {
        const values = parseNumberList(state.draft.values).sort((a, b) => a - b);
        if (!values.length) {
            state.status = 'Sample list must contain at least one number.';
            notify();
            return;
        }
        state.values = values;
        state.low = -1;
        state.high = -1;
        state.mid = -1;
        state.foundIndex = -1;
        state.status = `Loaded ${values.length} sorted values for binary search.`;
        notify();
    };

    const reset = () => {
        state.low = -1;
        state.high = -1;
        state.mid = -1;
        state.foundIndex = -1;
        state.status = 'Binary search state reset.';
        notify();
    };

    const sortValues = () => {
        state.values = state.values.slice().sort((a, b) => a - b);
        state.status = 'Array sorted for binary search.';
        notify();
    };

    const search = async () => {
        const target = parseNumber(state.draft.target);
        if (target === null) {
            state.status = 'Enter a valid number to search for.';
            notify();
            return;
        }

        if (!state.values.length) {
            state.status = 'Load values before starting binary search.';
            notify();
            return;
        }

        state.busy = true;
        state.low = 0;
        state.high = state.values.length - 1;
        state.foundIndex = -1;

        while (state.low <= state.high) {
            state.mid = Math.floor((state.low + state.high) / 2);
            state.status = `Comparing target ${target} with middle value ${state.values[state.mid]} at index ${state.mid}.`;
            notify();
            await sleep(240);

            if (state.values[state.mid] === target) {
                state.foundIndex = state.mid;
                state.busy = false;
                state.status = `Found ${target} at index ${state.mid}.`;
                notify();
                return;
            }

            if (state.values[state.mid] < target) {
                state.low = state.mid + 1;
            } else {
                state.high = state.mid - 1;
            }
        }

        state.mid = -1;
        state.busy = false;
        state.status = `${target} was not found in the sorted array.`;
        notify();
    };

    return {
        meta: {
            title: 'Binary Search',
            short: 'Split the sorted array in half each step.',
            category: 'Searching',
            layout: 'array',
            description: 'The input is kept sorted and the search window shrinks around the target until the answer appears.',
            complexities: [
                { label: 'Search', value: 'O(log n)' },
                { label: 'Sort prep', value: 'O(n log n)' },
                { label: 'Space', value: 'O(1)' },
            ],
        },
        controlGroups: [
            {
                label: 'Array Setup',
                title: 'Load and search',
                fields: [
                    { key: 'values', label: 'Array values', placeholder: '4, 8, 12, 16, 20, 24, 28, 32', type: 'text' },
                    { key: 'target', label: 'Target', placeholder: 'Enter a number', type: 'number' },
                ],
                buttons: [
                    { label: 'Search', action: 'search', variant: 'primary' },
                    { label: 'Load Sample', action: 'loadSample', variant: 'secondary' },
                    { label: 'Sort Values', action: 'sortValues', variant: 'secondary' },
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
        sortValues,
        search,
    };
};
