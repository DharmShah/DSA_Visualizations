export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let idCounter = 0;
export const createId = (prefix = 'node') => {
    idCounter += 1;
    return `${prefix}-${idCounter}`;
};

export const parseNumber = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
};

export const parseNumberList = (text) => {
    if (!text || !text.trim()) {
        return [];
    }

    return text
        .split(/[\s,]+/)
        .map((item) => Number(item.trim()))
        .filter((item) => Number.isFinite(item));
};

export const formatValue = (value) => String(value);

export const clampIndex = (index, length) => {
    if (!length) {
        return -1;
    }

    return Math.max(0, Math.min(index, length - 1));
};

export const uniqueSorted = (values) => Array.from(new Set(values)).sort((a, b) => a - b);
