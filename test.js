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

test("return lines that respect the predicate", async t => {
  const lines = readLines();
  const filtered = filter(lines, line => line.match(/id/));
  t.deepEqual(await concat.obj(filtered), ["pids", "*.pid"]);
});

test("predicate receive item, index, iterable", async t => {
  const lines = readLines();
  const result = [];
  await concat(
    filter(lines, (line, index, iterable) => {
      result.push({ index });
      t.is(iterable, lines);
      return true;
    })
  );
  t.deepEqual(result.slice(0, 3), [{ index: 0 }, { index: 1 }, { index: 2 }]);
});

test("predicate could return a promise", async t => {
  const lines = readLines();
  const filtered = filter(lines, async line => line.match(/id/));
  t.deepEqual(await concat.obj(filtered), ["pids", "*.pid"]);
});

test("throw async if data is not an async iterable", async t => {
  const err = await filter(0, () => 0)
    .next()
    .catch(err => err);

  t.is(err.message, "data argument must be an iterable or async-iterable.");
});

test("throw async if predicate is not a function", async t => {
  const err = await filter([], 0)
    .next()
    .catch(err => err);

  t.is(err.message, "predicate argument must be a function.");
});

test("with throw sync if transform is not a function", async t => {
  t.throws(
    () => filter.with(0),
    TypeError,
    "predicate argument must be a function."
  );
});

test("throw async during iteration if predicate throws", async t => {
  const lines = readLines();

  const filtered = filter(lines, () => {
    throw new Error("test");
  });
  const err = await filtered.next().catch(err => err);

  t.is(err.message, "test");
});

test("throw async during iteration if predicate rejected", async t => {
  const lines = readLines();

  const filtered = filter(lines, async () => {
    throw new Error("test");
  });

  const err = await filtered.next().catch(err => err);

  t.is(err.message, "test");
});
