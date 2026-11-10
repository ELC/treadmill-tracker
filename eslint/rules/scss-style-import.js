/** @type {import('eslint').Rule.RuleModule} */
export const scssStyleImportRule = {
  meta: {
    type: "problem",
    docs: {
      description: "Require .scss (not .css) for stylesheet imports",
    },
    messages: {
      cssImport: 'Import "{{path}}" uses .css. Use .scss for all styles.',
      unknownStyle:
        'Import "{{path}}" looks like a stylesheet but is not .scss.',
    },
    schema: [],
  },
  create(context) {
    const styleExt = /\.(css|scss|sass)$/iu;

    return {
      ImportDeclaration(node) {
        const path = node.source.value;
        if (typeof path !== "string" || !styleExt.test(path)) {
          return;
        }
        if (path.endsWith(".css")) {
          context.report({
            node: node.source,
            messageId: "cssImport",
            data: { path },
          });
          return;
        }
        if (!path.endsWith(".scss") && !path.endsWith(".sass")) {
          context.report({
            node: node.source,
            messageId: "unknownStyle",
            data: { path },
          });
        }
      },
    };
  },
};
