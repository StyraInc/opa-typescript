/**
 * MaskRule defines the currently supported types of mask rules for usage with
 * {@link mask}.
 */
export interface MaskRule {
  replace: { value: any };
}

/**
 * Apply masking rules to an object (i.e. "mask" it)
 *
 * @param maskRules Masking rules as returned from the Compile API.
 * @param targetObject Object to apply replacements to
 * @param targetType Type of the object to apply replacements to (prefix of maskRules).
 * @returns A new object with values replaced according to the rules
 */
export function mask<T extends Record<string, any>>(
  maskRules: Record<string, Record<string, MaskRule> | MaskRule>,
  targetObject: T,
  targetType?: string
): T {
  if (targetType) {
    // optionally project mask rules to target type
    maskRules = project(maskRules as Record<string, MaskRule>, targetType);
  }

  // Create a deep clone of the target object to avoid mutating the original
  const result = JSON.parse(JSON.stringify(targetObject)) as Record<
    string,
    any
  >;

  // Process top-level replacements
  for (const key in maskRules) {
    let rule = maskRules[key];

    // If it's for the primary target, i.e. non-nested.
    if (
      rule &&
      typeof rule === "object" &&
      "replace" in rule &&
      typeof rule.replace === "object" &&
      "value" in rule.replace
    ) {
      // Apply to the target if the key exists
      if (key in result) {
        result[key] = rule.replace.value;
      }
    }
    // If it's a nested object with rules for child properties
    else if (rule && typeof rule === "object" && !rule.replace) {
      rule = rule as Record<string, MaskRule>;
      // Apply rules to child properties (one level deep only)
      if (key in result && result[key] && typeof result[key] === "object") {
        for (const childKey in rule) {
          const childRule = rule[childKey];

          // Check if the child rule is a valid replacement rule
          if (
            childRule &&
            typeof childRule === "object" &&
            "replace" in childRule &&
            typeof childRule.replace === "object" &&
            "value" in childRule.replace
          ) {
            // Apply to the child property if it exists
            if (childKey in result[key]) {
              result[key][childKey] = childRule.replace.value;
            }
          }
        }
      }
    }
  }
  return result as T;
}

/**
 * Filter an object by key prefix, removing the prefix from the keys.
 *
 * @param obj The object to filter, e.g. `{"users.id": {...}, "groups.name": {...}}`
 * @param type The prefix to filter by (e.g. "users")
 * @returns A new object with only keys that had the specified prefix, with the prefix removed
 */
export function project(
  obj: Record<string, MaskRule>,
  type: string
): Record<string, MaskRule> {
  const { [type]: primary, ...rest } = splitKeys(obj);
  return { ...primary, ...rest };
}

/**
 * Transforms an object (maskRules) with dot-notation keys into a nested structure
 *
 * @example
 * Input: { "users.age": {"replace": {"value": "hidden"}} }
 * Output: { "users": { "age": {"replace": {"value": "hidden"}} } }
 *
 * @param maskRules Mask rules object with dot-notation keys, e.g. `{ "users.age": {"replace": {"value": "hidden"}} }`
 * @returns Nested object structure, e.g. `{ "users": { "age": {"replace": {"value": "hidden"}} } }`
 */
function splitKeys(maskRules: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};

  // Process each key in the flat object
  for (const [key, value] of Object.entries(maskRules)) {
    // Split the key by dot notation
    const pathParts = key.split(".");

    // Start from the root of our result object
    let current = result;

    // Navigate through each path part except the last one
    for (let i = 0; i < pathParts.length - 1; i++) {
      const part = pathParts[i] as string; // can't be undefined

      // If this path doesn't exist yet, create it
      if (!current[part]) {
        current[part] = {};
      }
      // If it exists but isn't an object, we have a conflict
      else if (
        typeof current[part] !== "object" ||
        Array.isArray(current[part])
      ) {
        throw new Error(
          `Path conflict at ${pathParts
            .slice(0, i + 1)
            .join(".")}: Expected an object but found ${typeof current[part]}`
        );
      }

      // Move to the next level of nesting
      current = current[part];
    }

    // Set the value at the final path part
    const lastPart = pathParts[pathParts.length - 1] as string;
    current[lastPart] = value;
  }

  return result;
}
