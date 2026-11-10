import path from "node:path";

import scss from "postcss-scss";
import valueParser from "postcss-value-parser";

const ALLOWED_KEYWORDS = new Set([
  "auto",
  "none",
  "inherit",
  "initial",
  "unset",
  "revert",
  "revert-layer",
  "transparent",
  "currentcolor",
  "grid",
  "block",
  "inline",
  "inline-block",
  "center",
  "start",
  "end",
  "stretch",
  "solid",
  "hidden",
  "visible",
]);

const UNIT_PATTERN =
  /^-?\d*\.?\d+(?:rem|px|em|vw|vh|vi|vb|dvh|dvw|dvi|dvb|svh|svw|lvh|lvw|ch|ex|cm|mm|in|pt|pc)$/iu;

function locFromNode(node, sourceCode) {
  if (node.source?.start) {
    return {
      start: node.source.start,
      end: node.source.end ?? node.source.start,
    };
  }
  return {
    start: sourceCode.ast.loc.start,
    end: sourceCode.ast.loc.end,
  };
}

function isTokenDefinitionFile(filename) {
  const base = path.basename(filename);
  return base === "tokens.scss" || base.startsWith("_tokens");
}

function isExemptStylesheet(filename) {
  const normalized = filename.replaceAll("\\", "/");
  if (normalized.endsWith("/src/index.scss")) {
    return true;
  }
  if (normalized.includes("/src/styles/")) {
    return true;
  }
  return false;
}

function isAllowedWord(word) {
  const lower = word.toLowerCase();
  if (ALLOWED_KEYWORDS.has(lower)) {
    return true;
  }
  if (lower === "0") {
    return true;
  }
  if (/^-?\d*\.?\d+%$/u.test(word)) {
    return true;
  }
  if (/^-?\d*\.?\d+fr$/iu.test(word)) {
    return true;
  }
  return false;
}

function walkValueNodes(nodes, onMagic, insideVar = false) {
  for (const node of nodes) {
    if (node.type === "function") {
      if (node.value === "var") {
        continue;
      }
      walkValueNodes(node.nodes, onMagic, insideVar);
      continue;
    }
    if (node.type === "word") {
      if (insideVar) {
        continue;
      }
      if (isAllowedWord(node.value)) {
        continue;
      }
      if (node.value.startsWith("#")) {
        onMagic(node.value, "color");
        continue;
      }
      if (UNIT_PATTERN.test(node.value)) {
        onMagic(node.value, "length");
      }
    }
  }
}

/** @type {import('eslint').Rule.RuleModule} */
export const scssTokensRule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow magic numbers and raw colors; use design tokens (var(--*)) in component SCSS",
    },
    messages: {
      parseError: "Could not parse SCSS: {{message}}",
      magicColor:
        'Raw color "{{value}}" is not allowed. Use a token such as var(--color-*).',
      magicLength:
        'Magic value "{{value}}" is not allowed. Use a design token var(--*).',
    },
    schema: [],
  },
  create(context) {
    const filename = context.filename;
    if (!filename.endsWith(".scss") || isExemptStylesheet(filename)) {
      return {};
    }
    if (isTokenDefinitionFile(filename)) {
      return {};
    }

    return {
      Program(node) {
        const text = context.sourceCode.getText();
        let root;

        try {
          root = scss.parse(text);
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          context.report({ node, messageId: "parseError", data: { message } });
          return;
        }

        root.walkDecls((decl) => {
          const parsed = valueParser(decl.value);
          walkValueNodes(parsed.nodes, (value, kind) => {
            context.report({
              node,
              loc: locFromNode(decl, context.sourceCode),
              messageId: kind === "color" ? "magicColor" : "magicLength",
              data: { value },
            });
          });
        });
      },
    };
  },
};
