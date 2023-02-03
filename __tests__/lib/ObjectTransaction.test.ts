import { describe, it, expect } from "@jest/globals";
import { ObjectTransaction } from "../../lib/ObjectTransaction";

describe("ObjectTransaction", () => {
  it("should update the state and call the callback function", () => {
    let callbackCallCounts = 0;

    function callback() {
      callbackCallCounts++;
    }

    const transaction = new ObjectTransaction({ age: 35 }, callback);

    const update1 = transaction
      .update(state => ({
        age: state.age + 1,
      }))
      .freeze();

    const update2 = transaction
      .update(state => ({
        age: state.age + 1,
      }))
      .freeze();

    expect(callbackCallCounts).toBe(2);

    expect(update1.currentState.age).toBe(36);
    expect(update2.currentState.age).toBe(37);

    expect(transaction.currentState.age).toBe(37);
  });

  it("should rollback to previous state", () => {
    const transaction = new ObjectTransaction(10);

    const result = transaction
      .update(state => state + 1) // 11
      .update(state => state + 1) // 12
      .rollback();

    expect(result.currentState).toBe(11);
    expect(transaction.currentState).toBe(11);
  });

  it("should return initial state when not have more rollbacks", () => {
    const transaction = new ObjectTransaction(10);

    const finalRollback = transaction
      .update(state => state + 1) // 11
      .update(state => state + 1) // 12
      .rollback()
      .rollback()
      .rollback()
      .rollback()
      .rollback();

    expect(finalRollback.currentState).toBe(10);
    expect(transaction.currentState).toBe(10);
  });

  it("should remove all past changes when call commit", () => {
    const transaction = new ObjectTransaction(10);

    transaction
      .update(state => state + 1) // 11
      .update(state => state + 1) // 12
      .update(state => state + 1) // 13
      .update(state => state + 1) // 14
      .commit()
      .rollback()
      .rollback()
      .rollback()
      .rollback();

    expect(transaction.currentState).toBe(14);
  });
});
