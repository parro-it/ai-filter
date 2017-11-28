import isAsyncIterable from "is-async-iterable";
import AsyncIterable from "asynciterable";

function checkPredicateArgument(predicate) {
  if (typeof predicate !== "function") {
    throw new TypeError("predicate argument must be a function.");
  }
}

/**
 * The filter() method creates a new async iterable
 * with all elements that pass the test implemented
 * by the provided function.
 *
 * @param {AsyncIterable} data The source async iterable to filter.
 * @param {Function} predicate is a predicate, to test each element of the async iterable. Return true to keep the element, false otherwise, taking three arguments:
 * ```
 * element: The current element being processed in the async iterable.
 * index: The index of the current element being processed in the async iterable.
 * iterable: The async iterable filter was called upon.
 * ```
 * @return {AsyncIterable} A new async iterable with the elements that pass the test.
 */
export default function filter(data, predicate) {
  return new AsyncIterable(async (write, end) => {
    checkPredicateArgument(predicate);

    if (!isAsyncIterable(data)) {
      throw new TypeError(
        "data argument must be an iterable or async-iterable."
      );
    }

    const generator = data[Symbol.asyncIterator] || data[Symbol.iterator];
    const iterator = generator.call(data);
    let index = 0;
    let item = await iterator.next();
    while (!item.done) {
      if (await predicate(await item.value, index, data)) {
        write(item.value);
      }
      index++;
      item = await iterator.next();
    }
    end();
  });
}

filter.with = predicate => {
  checkPredicateArgument(predicate);
  return iterable => filter(predicate, iterable);
};
