import isAsyncIterable from "is-async-iterable";

/**
 * The filter() method creates a new async iterable
 * with all elements that pass the test implemented
 * by the provided function.
 *
 * @param {Function} predicate is a predicate, to test each element of the async iterable. Return true to keep the element, false otherwise, taking three arguments:
 * 1 - element - The current element being processed in the async iterable.
 * 2 - index - The index of the current element being processed in the async iterable.
 * 3 - iterable - The async iterable filter was called upon.
 *
 * @param {AsyncIterable} data The source async iterable to filter.
 * @return {AsyncIterable} A new async iterable with the elements that pass the test.
 */
export default async function* filter(predicate, data) {
  if (typeof predicate !== "function") {
    throw new TypeError("predicate argument must be a function.");
  }

  if (typeof data === "undefined") {
    return filter.bind(null, predicate);
  }

  if (!isAsyncIterable(data)) {
    throw new TypeError("data argument must be an iterable or async-iterable.");
  }

  let index = 0;
  for await (const item of data) {
    if (await predicate(item, index++, data)) {
      yield item;
    }
  }
}
