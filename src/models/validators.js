// Checks for programming errors such as a misconfigured enemy or player.
// They throw instead of returning a result, so an invalid object is never created.

export function assertNonEmptyString(value, name) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new TypeError(`${name} must be a non-empty string, got ${value}`);
  }
}

export function assertPositiveInteger(value, name) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new RangeError(`${name} must be a positive integer, got ${value}`);
  }
}

export function assertNonNegativeInteger(value, name) {
  if (!Number.isInteger(value) || value < 0) {
    throw new RangeError(
      `${name} must be a non-negative integer, got ${value}`,
    );
  }
}

export function assertProbability(value, name) {
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new RangeError(
      `${name} must be a number between 0 and 1, got ${value}`,
    );
  }
}
