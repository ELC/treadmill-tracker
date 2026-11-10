/** BEM block: `app`, `session-card` */
export const BEM_BLOCK =
  /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/u;

/** Full class: block, block__element, block--modifier, block__element--modifier */
export const BEM_CLASS =
  /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:__[a-z][a-z0-9]*(?:-[a-z0-9]+)*)?(?:--[a-z][a-z0-9]*(?:-[a-z0-9]+)*)?$/u;

/** Nested SCSS selector after `&` (element and/or modifier). */
export const BEM_AMPERSAND_SUFFIX =
  /^&(?:__[a-z][a-z0-9]*(?:-[a-z0-9]+)*)?(?:--[a-z][a-z0-9]*(?:-[a-z0-9]+)*)?$/u;

/** Trailing pseudo-class / pseudo-element chain on a nested `&` selector. */
export const BEM_AMPERSAND_PSEUDO_CHAIN =
  /(?:::[a-z][a-z0-9-]*|:[a-z][a-z0-9-]*(?:\([^)]*\))*)+$/iu;

/** Trailing attribute selectors on a nested `&` segment. */
export const BEM_AMPERSAND_ATTR_CHAIN = /(?:\[[^\]]+\])+$/u;

/** BEM `&` segment with trailing pseudo-class/element and attribute selectors removed. */
export function bemAmpersandCore(part) {
  let core = part;
  let previous;
  do {
    previous = core;
    core = core.replace(BEM_AMPERSAND_PSEUDO_CHAIN, "");
    core = core.replace(BEM_AMPERSAND_ATTR_CHAIN, "");
  } while (core !== previous);
  return core;
}

/** Root selector in a component stylesheet: single `.block` class. */
export const BEM_ROOT_SELECTOR =
  /^\.[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/u;

export function isBemClass(name) {
  return BEM_CLASS.test(name);
}

export function splitClassNames(value) {
  return value.split(/\s+/u).filter(Boolean);
}
