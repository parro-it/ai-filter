import test from "tape-async";
import filter from ".";
import { createReadStream } from "fs";
import toLines from "ai-lines";
import fromStream from "ai-from-stream";
import concat from "ai-concat";

function readLines() {
  const stream = createReadStream(`${__dirname}/fixtures/test`, "utf8");
  const lines = toLines(fromStream(stream));
  return lines;
}

test("exports a function", async t => {
  t.is(typeof filter, "function");
});

test("transform a stream into an async iterable", async t => {
  const lines = readLines();
  const filtered = filter(line => line.match(/id/), lines);
  t.deepEqual(await concat.obj(filtered), ["pids", "*.pid"]);
});

test("predicate receive item, index, iterable", async t => {
  const lines = readLines();
  const result = [];
  await concat(
    filter((line, index, iterable) => {
      result.push({ index });
      t.is(iterable, lines);
      return true;
    }, lines)
  );
  t.deepEqual(result.slice(0, 3), [{ index: 0 }, { index: 1 }, { index: 2 }]);
});

test("predicate could return a promise", async t => {
  const lines = readLines();
  const filtered = filter(async line => line.match(/id/), lines);
  t.deepEqual(await concat.obj(filtered), ["pids", "*.pid"]);
});

test("throw async if data is not an async iterable", async t => {
  const err = await filter(() => 0, 0)
    .next()
    .catch(err => err);

  t.is(err.message, "data argument must be an iterable or async-iterable.");
});

test("throw async during iteration if predicate throws", async t => {
  const lines = readLines();

  const filtered = filter(() => {
    throw new Error("test");
  }, lines);

  const err = await (async () => {
    for await (const _ of filtered) {
      console.log(_);
    }
  })().catch(err => err);

  t.is(err.message, "test");
});

test("throw async during iteration if predicate rejected", async t => {
  const lines = readLines();

  const filtered = filter(async () => {
    throw new Error("test");
  }, lines);

  const err = await (async () => {
    for await (const _ of filtered) {
      console.log(_);
    }
  })().catch(err => err);

  t.is(err.message, "test");
});
