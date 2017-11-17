import test from "tape-async";
import aiFilter from ".";

test("exports a function", t => {
  t.is(typeof aiFilter, "function");
});
