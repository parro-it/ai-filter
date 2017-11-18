function isAsyncIterable(val) {
  const isIterable = typeof val[Symbol.iterator] === "function";
  const isAsync = typeof val[Symbol.asyncIterator] === "function";
  // ? console.log({ val, isIterable, isAsync, s: Symbol.asyncIterator });
  return isAsync || isIterable;
}

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
