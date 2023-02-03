export class ObjectTransaction<T> {
  private state: T;
  private callback?: Callback<T>;
  private changes: T[];

  constructor(state: T, callback?: Callback<T>) {
    this.state = state;
    this.callback = callback;

    this.changes = [state];
  }

  update(updater: CallbackUpdate<T>): T {
    const newState = updater(this.state);

    this.state = newState;
    this.changes.push(newState);

    try {
      this.callback?.(newState);
    } finally {
      return newState;
    }
  }

  rollback(): T {
    if (this.changes.length === 1) {
      return this.state;
    }

    this.changes.pop();

    this.state = this.changes[this.changes.length - 1];

    try {
      this.callback?.(this.state);
    } finally {
      return this.state;
    }
  }

  commit() {
    this.changes = [this.state];
  }

  get currentState() {
    return this.state;
  }
}

type Callback<T> = (data: T) => void;
type CallbackUpdate<T> = (state: T) => T;
