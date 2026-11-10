import path from "node:path";

import scss from "postcss-scss";

const FLEX_DISPLAY = /\bflex\b|\binline-flex\b/iu;
const GRID_TEMPLATE_PROP =
  /^grid-template(?:-areas|-columns|-rows)?$/iu;

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

function hasGridTemplate(decls) {
  return decls.some(
    (decl) =>
      GRID_TEMPLATE_PROP.test(decl.prop) ||
      (decl.prop === "grid-template" && decl.value.trim().length > 0),
  );
}

function isComponentStylesheet(filename) {
  const normalized = filename.replaceAll("\\", "/");
  if (normalized.endsWith("/src/index.scss")) {
    return false;
  }
  if (normalized.includes("/src/styles/")) {
    return false;
  }
  return normalized.endsWith(".scss");
}

function isGlobalStylesheet(filename) {
  return path.basename(filename) === "global.scss";
}

/** @param {import('postcss').Rule} rule */
function collectDirectDecls(rule) {
  return rule.nodes.filter((node) => node.type === "decl");
}

/** @type {import('eslint').Rule.RuleModule} */
export const scssLayoutRule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Mobile-first grid layouts: no flex, media/container queries, or breakpoints; grid templates required",
    },
    messages: {
      parseError: "Could not parse SCSS: {{message}}",
      forbiddenAtRule:
        "@{{name}} is not allowed. Layout is mobile-first with CSS Grid templates only (no breakpoints).",
      noFlex:
        'display: flex is not allowed. Use CSS Grid and grid-template-* instead (found "{{value}}").',
      rootNotGrid:
        "Component root block must set display: grid for mobile-first layout.",
      rootNoTemplate:
        "Component root block must define grid-template, grid-template-rows, grid-template-columns, or grid-template-areas.",
      bodyNotGrid: "body must use display: grid in global styles.",
      bodyNoTemplate:
        "body must define a grid template (grid-template-* or grid-template).",
    },
    schema: [],
  },
  create(context) {
    const filename = context.filename;
    if (!filename.endsWith(".scss")) {
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

        root.walkAtRules((atRule) => {
          const name = atRule.name.toLowerCase();
          if (name === "media" || name === "container") {
            context.report({
              node,
              loc: locFromNode(atRule, context.sourceCode),
              messageId: "forbiddenAtRule",
              data: { name },
            });
          }
        });

        root.walkDecls((decl) => {
          if (decl.prop.toLowerCase() !== "display") {
            return;
          }
          if (FLEX_DISPLAY.test(decl.value)) {
            context.report({
              node,
              loc: locFromNode(decl, context.sourceCode),
              messageId: "noFlex",
              data: { value: decl.value.trim() },
            });
          }
        });

        if (isGlobalStylesheet(filename)) {
          let bodyRule;
          root.walkRules((rule) => {
            if (rule.selectors.some((sel) => sel.trim() === "body")) {
              bodyRule = rule;
            }
          });
          const bodyDecls = bodyRule ? collectDirectDecls(bodyRule) : [];
          const bodyDisplay = bodyDecls.find(
            (decl) => decl.prop.toLowerCase() === "display",
          );
          if (!bodyDisplay || !/\bgrid\b/iu.test(bodyDisplay.value)) {
            context.report({ node, messageId: "bodyNotGrid" });
          } else if (!hasGridTemplate(bodyDecls)) {
            context.report({ node, messageId: "bodyNoTemplate" });
          }
          return;
        }

        if (!isComponentStylesheet(filename)) {
          return;
        }

        const rootRules = root.nodes.filter((n) => n.type === "rule");
        if (rootRules.length !== 1) {
          return;
        }

        const mainRule = rootRules[0];
        const decls = collectDirectDecls(mainRule);
        const displayDecl = decls.find(
          (decl) => decl.prop.toLowerCase() === "display",
        );
        if (!displayDecl || !/\bgrid\b/iu.test(displayDecl.value)) {
          context.report({
            node,
            loc: locFromNode(mainRule, context.sourceCode),
            messageId: "rootNotGrid",
          });
          return;
        }
        if (!hasGridTemplate(decls)) {
          context.report({
            node,
            loc: locFromNode(mainRule, context.sourceCode),
            messageId: "rootNoTemplate",
          });
        }
      },
    };
  },
};
