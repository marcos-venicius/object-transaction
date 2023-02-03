export class ObjectTransaction<T> {
  private state: T;
  private callback?: Callback<T>;
  private changes: T[];

  constructor(state: T, callback?: Callback<T>) {
    this.state = state;
    this.callback = callback;

    this.changes = [state];
  }

  /**
   * freeze the current class state
   * @returns a copy of the class with a freeze state
   */
  public freeze(): ObjectTransaction<T> {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }

  /**
   * update the current state
   * @param updater a method that returns the new state
   * @returns
   */
  public update(updater: CallbackUpdate<T>): ObjectTransaction<T> {
    const newState = updater(this.state);

    this.state = newState;
    this.changes.push(newState);

    try {
      this.callback?.(newState);
    } finally {
      return this;
    }
  }

  /**
   * rollback the current state to the previous state
   * @returns
   */
  public rollback(): ObjectTransaction<T> {
    if (this.changes.length === 1) {
      return this;
    }

    this.changes.pop();

    this.state = this.changes[this.changes.length - 1];

    try {
      this.callback?.(this.state);
    } finally {
      return this;
    }
  }

  /**
   * commit all changes
   * @returns
   */
  public commit() {
    this.changes = [this.state];

    return this;
  }

  public get currentState() {
    return this.state;
  }
}

type Callback<T> = (data: T) => void;
type CallbackUpdate<T> = (state: T) => T;
