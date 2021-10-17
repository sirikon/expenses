import { expect } from "chai";

import { add } from "../src/example/example";

describe("Example", () => {
  it("should work", () => {
    expect(add(2, 7)).to.equal(9);
  });
});
