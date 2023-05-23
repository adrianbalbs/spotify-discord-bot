export default function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
  if (val === null || val === undefined) {
    throw Error("Expected value to be defined, but received null | undefined");
  }
}
