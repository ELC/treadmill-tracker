import path from "node:path";

import scss from "postcss-scss";

import {
  bemAmpersandCore,
  BEM_AMPERSAND_SUFFIX,
  BEM_ROOT_SELECTOR,
  isBemClass,
} from "../bem-utils.js";

function blockFromRootSelector(selector) {
  return selector.slice(1);
}

/** @param {import('postcss').Rule} rule */
function walkRules(rule, context, sourceCode, rootBlock) {
  const isRoot = rule.parent?.type === "root";

  for (const selector of rule.selectors) {
    if (isRoot) {
      if (!BEM_ROOT_SELECTOR.test(selector)) {
        context.report({
          loc: locFromRule(rule, sourceCode),
          messageId: "rootSelector",
          data: { selector },
        });
      }
      continue;
    }

    for (const part of selector.split(",").map((s) => s.trim())) {
      if (!part.startsWith("&")) {
        context.report({
          loc: locFromRule(rule, sourceCode),
          messageId: "missingAmpersand",
          data: { selector: part },
        });
        continue;
      }
      const bemPart = bemAmpersandCore(part);
      if (!BEM_AMPERSAND_SUFFIX.test(bemPart)) {
        context.report({
          loc: locFromRule(rule, sourceCode),
          messageId: "invalidAmpersand",
          data: { selector: part },
        });
        continue;
      }
      const fullClass = `${rootBlock}${bemPart.slice(1)}`;
      if (!isBemClass(fullClass)) {
        context.report({
          loc: locFromRule(rule, sourceCode),
          messageId: "invalidBem",
          data: { selector: part, fullClass },
        });
      }
    }
  }

  for (const child of rule.nodes) {
    if (child.type === "rule") {
      walkRules(child, context, sourceCode, rootBlock);
    }
  }
}

function locFromRule(rule, sourceCode) {
  if (rule.source?.start) {
    return {
      start: rule.source.start,
      end: rule.source.end ?? rule.source.start,
    };
  }
  return {
    start: sourceCode.ast.loc.start,
    end: sourceCode.ast.loc.end,
  };
}

/** @type {import('eslint').Rule.RuleModule} */
export const scssBemRule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Require BEM structure in SCSS with nested &__ / &-- using the & syntax",
    },
    messages: {
      rootSelector:
        'Root selector "{{selector}}" must be a single .block class (BEM block).',
      missingAmpersand:
        'Nested selector "{{selector}}" must use & (e.g. &__element, &--modifier).',
      invalidAmpersand:
        'Nested selector "{{selector}}" is not valid BEM with & syntax.',
      invalidBem:
        'Selector "{{selector}}" expands to "{{fullClass}}", which is not valid BEM.',
      cssAtImport: 'Use @use/@forward with .scss, not "{{path}}".',
      parseError: "Could not parse SCSS: {{message}}",
    },
    schema: [],
  },
  create(context) {
    const filename = context.filename;
    const basename = path.basename(filename);

    if (basename.startsWith("_") || basename === "global.scss") {
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

        root.walkAtRules("import", (atRule) => {
          const params = atRule.params.replace(/["']/gu, "").trim();
          if (/\.css(?:\?|$)/iu.test(params)) {
            context.report({
              node,
              loc: locFromRule(atRule, context.sourceCode),
              messageId: "cssAtImport",
              data: { path: params },
            });
          }
        });

        const rootRules = root.nodes.filter((n) => n.type === "rule");
        if (rootRules.length !== 1) {
          context.report({
            node,
            messageId: "rootSelector",
            data: { selector: `(expected 1 root .block, found ${String(rootRules.length)})` },
          });
          return;
        }

        const mainRule = rootRules[0];
        const rootSelector = mainRule.selectors[0];
        if (!BEM_ROOT_SELECTOR.test(rootSelector ?? "")) {
          context.report({
            node,
            messageId: "rootSelector",
            data: { selector: rootSelector ?? "" },
          });
          return;
        }

        const block = blockFromRootSelector(rootSelector);
        walkRules(mainRule, context, context.sourceCode, block);
      },
    };
  },
};
