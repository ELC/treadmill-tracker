/** @param {import('estree').CallExpression} node */
function isLocatorCall(node) {
  return (
    node.type === "CallExpression" &&
    node.callee.type === "MemberExpression" &&
    node.callee.property.type === "Identifier" &&
    node.callee.property.name === "locator"
  );
}

/** @type {import('eslint').Rule.RuleModule} */
export const playwrightTestIdLocatorsRule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Playwright tests must locate elements with getByTestId, not locator()",
    },
    messages: {
      noLocator:
        "Do not use locator() with class, id, or CSS selectors. Use getByTestId(...) instead.",
    },
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node) {
        if (isLocatorCall(node)) {
          context.report({ node, messageId: "noLocator" });
        }
      },
    };
  },
};
