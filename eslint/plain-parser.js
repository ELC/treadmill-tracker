/** Minimal parser so ESLint can lint non-JS files with custom rules. */
export const plainParser = {
  meta: {
    name: "treadmill-tracker/plain-parser",
    version: "1.0.0",
  },
  parseForESLint(code) {
    const lineCount = Math.max(code.split(/\r?\n/u).length, 1);
    return {
      ast: {
        type: "Program",
        body: [],
        sourceType: "module",
        range: [0, code.length],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: lineCount, column: 0 },
        },
        tokens: [],
        comments: [],
      },
      services: {},
      scopeManager: null,
      visitorKeys: { Program: [] },
    };
  },
};
