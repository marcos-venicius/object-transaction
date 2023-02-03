# Object Transaction

Você pode criar uma transaction a partir de qualquer objeto.

Ao criar essa transaction, você poderá fazer atualizações de estado, efetuar rollback e commit
da transaction.

## Code examples

```ts
// creating a transaction

const user = {
  age: 35,
};

function callback(currentState) {
  // atualizar algo externo
}

const objectTransaction = new ObjectTransaction(user, callback);
```

```ts
// update a transaction state

let stateUpdated = objectTransaction.update(state => {
  return {
    ...state,
    age: state.age + 1,
  };
});

stateUpdated = objectTransaction.update(state => {
  return {
    ...state,
    age: state.age + 1,
  };
});
```

```ts
// rollback

let stateUpdated = objectTransaction.rollback();
```

```ts
// commit

objectTransaction.commit();
```

and you can freeze the object return

```ts
const transaction = new ObjectTransaction(10);

const state1 = transaction.update(state => state + 1).freeze();
const state2 = transaction.update(state => state + 1).freeze();

console.log(state1.currentState); // 11
console.log(state2.currentState); // 12
```

if you not freeze the state

```ts
const transaction = new ObjectTransaction(10);

const state1 = transaction.update(state => state + 1);
const state2 = transaction.update(state => state + 1);

console.log(state1.currentState); // 12
console.log(state2.currentState); // 12
```
