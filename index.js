import isAsyncIterable from "is-async-iterable";

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
