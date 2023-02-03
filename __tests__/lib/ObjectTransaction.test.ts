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

  it("should rollback to previous state", () => {
    const transaction = new ObjectTransaction(10);

    transaction.update(state => state + 1); // 11
    transaction.update(state => state + 1); // 12

    const result = transaction.rollback();

    expect(result).toBe(11);
    expect(transaction.currentState).toBe(11);
  });

  it("should return initial state when not have more rollbacks", () => {
    const transaction = new ObjectTransaction(10);

    transaction.update(state => state + 1); // 11
    transaction.update(state => state + 1); // 12

    transaction.rollback();
    transaction.rollback();
    transaction.rollback();
    transaction.rollback();

    const finalRollback = transaction.rollback();

    expect(finalRollback).toBe(10);
    expect(transaction.currentState).toBe(10);
  });
});
