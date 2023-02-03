import { describe, it, expect } from "@jest/globals";
import { ObjectTransaction } from "../../lib/ObjectTransaction";

describe("ObjectTransaction", () => {
  it("should update the state and call the callback function", () => {
    let callbackCallCounts = 0;

    function callback() {
      callbackCallCounts++;
    }

    const transaction = new ObjectTransaction({ age: 35 }, callback);

    const update1 = transaction.update(state => ({
      age: state.age + 1,
    }));

    const update2 = transaction.update(state => ({
      age: state.age + 1,
    }));

    expect(callbackCallCounts).toBe(2);

    expect(update1.age).toBe(36);
    expect(update2.age).toBe(37);

    expect(transaction.currentState.age).toBe(37);
  });
});
