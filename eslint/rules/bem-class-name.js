import { isBemClass, splitClassNames } from "../bem-utils.js";

/** @type {import('eslint').Rule.RuleModule} */
export const bemClassNameRule = {
  meta: {
    type: "problem",
    docs: {
      description: "Require BEM class names in JSX className",
    },
    messages: {
      invalid:
        'Class "{{name}}" is not valid BEM. Use block, block__element, or block--modifier.',
      nonLiteral:
        "className must be a string literal so BEM can be verified (no dynamic expressions).",
    },
    schema: [],
  },
  create(context) {
    function checkValue(node, value) {
      for (const name of splitClassNames(value)) {
        if (!isBemClass(name)) {
          context.report({ node, messageId: "invalid", data: { name } });
        }
      }
    }

    return {
      JSXAttribute(node) {
        if (
          node.name.type !== "JSXIdentifier" ||
          node.name.name !== "className" ||
          !node.value
        ) {
          return;
        }

        if (node.value.type === "Literal" && typeof node.value.value === "string") {
          checkValue(node.value, node.value.value);
          return;
        }

        if (
          node.value.type === "JSXExpressionContainer" &&
          node.value.expression.type === "Literal" &&
          typeof node.value.expression.value === "string"
        ) {
          checkValue(node.value.expression, node.value.expression.value);
          return;
        }

        context.report({ node: node.value, messageId: "nonLiteral" });
      },
    };
  },
};
