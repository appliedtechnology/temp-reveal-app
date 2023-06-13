<!-- {id="async-js-introduction"} -->

# Asynchronous code

## In Java-/TypeScript

---

<!-- {id="sync-execution"} -->
## Synchronous Execution

![Synchronous Execution](/assets/images/synchronous-execution.png) <!-- {style="height:550px;padding:10px;" class="plain"} -->

---

<!-- {id="async-execution"} -->
## Asynchronous Execution

![Asynchronous Execution](/assets/images/asynchronous-execution.png) <!-- {style="height:550px;padding:10px;" class="plain"} -->

---

<!-- {id="async-execution-2"} -->

Now we are getting more things done...

![Asynchronous Execution](/assets/images/asynchronous-execution-2.png) <!-- {style="height:550px;padding:10px;" class="plain"} -->

... in roughly the same amount of time!

---

<!-- {id="blocking-code" class="salt-slide-flex"} -->
## Blocking Code

```typescript
const heavyCalcSync = (iterations : number) => {
  let loopFrom = iterations;
  while (loopFrom > 0) {
    loopFrom -= 1;
  }
  return 'Heavy calc done!';
};

const doSyncExample = () => {
  const el = document.getElementById('sync-ex-container');
  if (el) {
    el.innerHTML += 'Before<br>';
    el.innerHTML += heavyCalcSync(9999999999);
    el.innerHTML += '<br>After';
  }
};
```
<!-- {class=" fragment fade-in"} -->

<iframe src="/assets/html/blocking-code.html"></iframe> <!-- {class="fragment fade-in" style="width: 90%; height: 300px;"} -->

**This code will freeze the app while fetching data!**
<!-- {class="fragment fade-in"} -->

---

<!-- {id="callbacks"} -->
## Callbacks

A callback function is a **function** that is passed as an argument to another function.

The callback function is not being executed immediately. It's **called back** at some later point in the function body.

A function that takes a callback as argument is a **higher order function**.
<!-- {class="fragment fade-in"} -->

---

<!-- {id="callbacks-example" class="salt-slide-flex"} -->
## Callback example

```typescript
const somethingAsync = (ms : number, callback : (str: string) => void) => {
  setTimeout(() => {
    callback('Heavy calc done!');
  }, ms);
};

const doCbExample = () => {
  const el = document.getElementById('cb-ex-container');

  if (!el) return;

  el.innerHTML += 'Before\n';
  somethingAsync(2000, (str : string) => {
    el.innerHTML += str;
  });
  el.innerHTML += 'After\n';
};
```
<!-- {class=" fragment fade-in"} -->

<iframe src="/assets/html/callback-code.html"></iframe> <!-- {class="fragment fade-in" style="width: 90%; height: 300px;"} -->

Notes:

This code will NOT freeze the app while fetching data!

---

<!-- {id="why-not-all-async"} -->

So why shouldn't I just write all my functions to be asynchronous using callbacks??

- Complexity in writing and testing. <!-- {class="fragment fade-in"} -->

Notes:

- How do you test something when you dont know when its finished?
- How long do you wait?

---

<!-- {id="callback-hell" data-background-image="/assets/images/callback-hell.jpeg" data-background-opacity="0.4"} -->
# 🔥CALLBACK HELL 🔥

Nested callbacks will quickly lead to unmaintainable code. <!-- {class="fragment fade-in"} -->

---

<!-- {id="callback-hell-example"} -->
## Typical Code Using Callbacks

```javascript
const listOpenAccounts = (credentials, user, callback) => {
  authorize(credentials, (err) => {
    if (err) {
      console.error('Authorization failure', err);
      return callback(err);
    }

    dbClient.getAccountsFor(user, (err, accounts) => {
      if (err) {
        console.error('Error while fetching user accounts from database', err);
        return callback(err);
      }

      const openAccounts = accounts.filter(account => account.isOpen());
      return callback(null, openAccounts);
    });
  });
}
```
<!-- {class=" fragment fade-in"} -->

Notes:

**Note - this is JavaScript for brevity**

---

<!-- {id="callback-hell-example-cont"} -->
### This is better

```javascript
const listOpenAccounts = (credentials, user, callback) => {
  authorize(credentials, (err) => {
    if (err) {
      console.log('Authorization failure', err);
      return callback(err);
    }

    return fetchOpenAccounts(user, callback);
  });
}

const fetchOpenAccounts = (user, callback) => {
  dbClient.getAccountsFor(user, (err, accounts) => {
    if (err) {
      console.log('Error while fetching user accounts from database', err);
      return callback(err);
    }

    return callback(null, accounts.filter(account => account.isOpen()))
  });
}

```
<!-- {class="" style="font-size:0.4em;"} -->
Only ever call a callback once! <!-- {class="fragment fade-in" data-fragment-index="1"} -->

[lint rule](https://github.com/zkqiang/eslint-plugin-node/blob/cd97880ca2792db47c7952ac517e9e32d2ec783e/docs/rules/callback-return.md)<!-- {class="fragment fade-in" data-fragment-index="1"} -->

Notes:

- Mention controlling flow.
- Only ever call a callback once!
- _Always_ return after calling a callback

---

<!-- {id="avoiding-callback-hell"} -->
### Avoiding Callback Hell

- A function should only do one thing <!-- {class="fragment fade-in"} -->
- Create many small modules <!-- {class="fragment fade-in"} -->
- Use Promise <!-- {class="fragment fade-in"} -->

---

### Writing callbacks in TypeScript - 1

- Need to define signature of callback function
- Gives type-safety but looks a bit weird

```typescript
const functionThatTakesCallback = (callback : (str: string) => void) => {
  // we call/execute the callback function
  callback('HI is the message');
};
```

Notes:

- the callback function takes a `str` parameter
- the `str` parameter is of type string
- hence we cannot call it with `callback(1)` for example;
- it returns `void` - which means that it doesn't return anything

---

### Writing callbacks in TypeScript - 2


- Type definition of (callback) function can be pulled out to separate type for reuse and readability

```typescript
type CallbackFunction = (str: string) => void
const functionThatTakesCallback = (callback : CallbackFunction) => { /*...*/};
```

- Especially useful for gnarly/long parameter lists:

```typescript
const readFileAndReturn = (
    fileName: string, callback : (err : Error, data: string[]) => void
  ) => { /* ... */ }

type FileReadCallback = (err : Error, data: string[]) => void;
const readFileAndReturn2 = (
    fileName: string, callback : FileReadCallback
  ) => { /* ... */ }
```

Notes:

This slide is the answer to many of the questions they will face during the weekend test. I guarantee it.


---

### Writing callbacks in TypeScript - 3

- Type inference is great in TypeScript, thanks to static typing

```typescript
const functionThatCallsTheCallback = () => {
  // we pass in the function that should be
  // used as the callback
  // message will automatically be `:string`
  // message is the local name of the returned parameters
  functionThatTakesCallback(message => {
    console.log(message);
  });
};
```

| | | |
| :-- | :-- | :-- |
| We get callback signature | We see parameters for callback | Returned value is typed to string |
|![We get callback signature](/assets/images/tscb-showsCallbackSignature.png) <!-- {style="heigh:80px" class="plain"} --> | ![We see parameters for callback](/assets/images/tscb-getHelpForTypeOfCallback.png) <!-- {style="heigh:80px" class="plain"} --> |  ![Returned value is typed to string](/assets/images/tscb-returnedValueIsString.png) <!-- { style="heigh:80px" class="plain"} --> |

Notes:

- Important to understand that here we _define_ the callback function
- It has to match the signature we previously declared
- Hence, no need to specify type again
- However, we would get errors if we did

---

<!-- {id="js-promise"} -->
### Promise

> The **Promise** object represents the eventual completion (or failure) of an asynchronous operation, and its resulting value.
> — MDN

---

<!-- {id="promise-states"} -->
### Possible states of a Promise

- Pending
- Fulfilled
- Rejected

---

<!-- {id="promise-example-fulfilled"} -->
### Fulfilled

```typescript
const allIntegers = (nums : number[]) => nums.every(n => Number.isInteger(n));

const areEvensAsync = (numbers:number[]) =>
  new Promise<boolean>((resolve, reject) => {

    if (allIntegers(numbers)) {
      resolve(numbers.every(n => n % 2 === 0));
    } else {
      reject(new Error('Illegal argument: Not an integer.'));
    }

  });

const result = areEvensAsync([2, 4, 6]);
console.log(result); // Promise { true }, the promise is fulfilled.

```
<!-- {class=" fragment fade-in"} -->

---

<!-- {id="promise-example-pending"} -->
### Pending

```typescript
const allIntegers = (nums:number[]) => nums.every(n => Number.isInteger(n));
const onlyEven = (nums:number[]) => nums.every(n => n % 2 === 0);

const areEvensAsync = (nums:number[]) => new Promise<boolean>((resolve, reject) => {
  // Delaying execution
  setTimeout(() => {
    if (allIntegers(nums)) {
      resolve(onlyEven(nums));
    } else {
      reject(new Error('Illegal argument: Not an integer.'));
    }
  }, 100);
});

const result = areEvensAsync([2, 4, 6]);
console.log(result); // Promise { pending }, the promise is pending.

result.then(r => console.log(r)); // true

```
<!-- {class=" fragment fade-in"} -->

---

<!-- {id="promise-example-rejected"} -->
### Rejected

```typescript
const allIntegers = (nums:number[]) => nums.every(n => Number.isInteger(n));
const onlyEven = (nums:number[]) => nums.every(n => n % 2 === 0);

const isEvensAsync = (nums:number[]) => new Promise<boolean>((resolve, reject) => {
  // Delaying execution
  setTimeout(() => {
    if (allIntegers(nums)) {
      resolve(onlyEven(nums));
    } else {
      reject(new Error('Illegal argument: Not an integer.'));
    }
  }, 100);
});

const result = isEvensAsync([2, 4, 2.4]); // 2.4 is not integer
console.log(result); // Promise { pending }, the promise is pending.

result
  .then(r => console.log(r)) // the promise is rejected
  .catch(err => console.log('error: ', err)); // error: Not an integer

```
<!-- {class=" fragment fade-in" style="font-size:0.5em;"} -->

---

<!-- {id="promise-chainable"} -->
### Promises are chainable

**`Promise.prototype.then`** returns a new promise!

```typescript
const txt = new Promise<string>(resolve => resolve('foo'));

txt
  .then(t => `${t} bar`)
  .then(t => `${t} baz`)
  .then(t => console.log(t)) // 'foo bar baz'
  .catch(err => console.log(err));
```
<!-- {class=" fragment fade-in"} -->

---

<!-- {id="avoid-callback-hell-with-promise"} -->
### Avoiding Callback Hell - 2

Callbacks <!-- {class="fragment fade-in"} -->

```javascript
doSomething(function(result) {
  doSomethingElse(result, function(newResult) {
    doThirdThing(newResult, function(finalResult) {
      console.log('Got the final result: ' + finalResult);
    }, failureCallback);
  }, failureCallback);
}, failureCallback);
```
<!-- {class=" fragment fade-in"} -->

Promises <!-- {class="fragment fade-in"} -->

```javascript
doSomething()
  .then(result => doSomethingElse(result))
  .then(newResult => doThirdThing(newResult))
  .then(finalResult => console.log('Got the final result: ' + finalResult))
  .catch(failureCallback);
```
<!-- {class=" fragment fade-in"} -->

---

<!-- {id="parallel-execution"} -->
### Promise.all

```typescript
const weatherPromise = new Promise<Weather>(
  resolve => resolve({ monday: '19 deg', tuesday: '21 deg' }),
);
const trafficPromise = new Promise<Traffic>(
  resolve => resolve({ lindhagenvägen: 'mild traffic, no queues' }),
);
const openingHoursPromise = new Promise<OpeningHours>(
  resolve => resolve({ eatery: 'open: 10.00 - 20.00' }),
);

const allPromises = Promise.all(
  [weatherPromise, trafficPromise, openingHoursPromise],
);

// runs when all are fulfilled
allPromises.then(result => {
  console.log(result); // [{ monday: '19 deg', tuesday: '21 deg' },
  //  { lindhagenvägen: 'mild traffic, no queues' },
  //  { eatery: 'open: 10.00 - 20.00' } ]

  decideWhereToGo(result); // some function that requires ALL data
});

```
<!-- {class=" fragment fade-in"} -->

---

<!-- {id="parallel-execution-handling-errors"} -->
### Handling Errors

One error stops the entire chain

```typescript
const p1 = new Promise(resolve => resolve('foo'));
const p2 = new Promise((_resolve, reject) => reject(new Error('haw haw')));

const total = Promise.all([p1, p2]); // continue when all are done

total
  .then(r => console.log(r))
  .catch(err => console.log('error:', err.message)); // haw haw
```
<!-- {class=" fragment fade-in"} -->

_Catch all exceptions before calling **`.all`**_ <!-- {class="fragment fade-in"} -->

```typescript
const p1 = new Promise(resolve => resolve('foo'));
const p2 = new Promise((resolve, reject) => reject(new Error('haw haw')));

const total = Promise.all([
  p1.catch(err => console.error(err.message)),
  p2.catch(err => console.error(err.message)),
]);

total.then(r => console.log(r)); // [ 'foo', 'haw haw' ]
```
<!-- {class="fragment fade-in"} -->

Notes:

- You could point out that `_resolve` is a convention to indicate that a parameter will not be used.

---

<!-- {id="typed-promises-with-typescript"} -->
### Typed Promises with TypeScript


- Our returned values doesn't have any type:

```typescript
const imOk = () => new Promise<string>(resolve => resolve('foo'));

imOk().then((val) => { console.log(val); };
// error: Argument of type '(val:string) => void'
// is not assignable to parameter of type '(value:unknown) => void'
imOk().then((val:string) => { console.log(val); };
```

- Solution is to use generics
- Promise _of_ string, `Promise<T>`

```typescript
const imOk = () => new Promise<string>(resolve => resolve('foo'));
imOk().then((val) => { console.log(val); }; // val is now typed to string
```

Notes:

- T is just a variable name that is often used for types
- Generics is WAY out of scope for this lecture and should probably be a separate lecture before you run this. I [wrote it here](041-ts-generics.md)

---

<!-- {id="example-of-promises"} -->
### More real-life example of `Promise<T>`

```typescript
type MyListOfUsers = {
  count: number,
  result: User[]
}
type User = {
  id: number,
  name: string
  // etc.
}

const data = () => new Promise<MyListOfUsers>(resolve =>
  resolve(
    {
      count: 2,
    result: [
      {id: 1, name: "Marcus"},
      {id: 2, name: "Catherine"}
    ]}
  );
)
```

---


<!-- {id="errorhandling-err-in-callback"} -->
## Errors in callbacks

- not throwing errors
- returning as first parameter
- **using JavaScript for brevity**

```javascript
const listOpenAccounts = (credentials, user, callback) => {
  authorize(credentials, (err) => {
    if (err) { // <= checking for errors
      console.log('Authorization failure', err);
      return callback(err); // <= passing as first parameter
    }

    dbClient.getAccountsFor(user, (err, accounts) => {
      if (err) { // <= checking for errors
        console.log('Error while fetching user accounts from database', err);
        return callback(err); // <-- Error can happen here too!
      }

      const openAccounts = accounts.filter(account => account.isOpen());
      return callback(null, openAccounts); // <= OK, phew - err is undefined
    });
  });
}
```
<!-- {class=" fragment fade-in" } -->

---

<!-- {id="errorhandling-testing-cb"} -->
## Testing for callback errors


```javascript
// api.js
const getOne = (id, callback) => {
  // loads of code here
  // ...
  // when failing
  callback(new Error('FAAAAAIL'));
}
```
<!-- {class=" fragment fade-in"} -->

```javascript
// tests.js
const assert = require('assert');
const api = require('./api.js');

describe('my function should fail for non-existing ids', () => {
  it('should err on non-existing id', (done) => {
    api.getOne('fail this', (err) => {
      assert.strictNotEqual(err, undefined); // that the error is present (not undefined)
      assert.strictEqual(err.message, 'FAAAAAIL'); // verify the correct message
      done();
    });
  });
});
```
<!-- {class=" fragment fade-in"} -->

Notes:

**using JavaScript for brevity**

---

<!-- {id="errorhandling-testing-promises"} -->
## Testing for promise errors

```typescript
// index.js
const imOk = () => new Promise<string>(resolve => resolve('foo'));
const imNotOk = () => new Promise<string>((_resolve, reject) => reject(new Error('haw haw')));
```
<!-- {class=" fragment fade-in" style="font-size: 0.5em"} -->

```typescript
// tests.js
import * as api from './index'

describe('promises', () => {
  it('should validate that promise is resolved', (done) => {
    api.imOk()
      .then((val:string) => {
        assert.strictEqual('foo', val);
        done();
      }).catch((err) => { // <-- add catch to avoid timeout for rejects
        assert.fail('ImOk should not end up in catch');
      });
  });

  it('should detect rejected promises', (done) => {
    api.imNotOk()
    .then(() => {
      assert.fail('imNotOk should not resolve'); // < -- will end test execution
    }).catch((err : Error) => { // typed Error
      assert.strictEqual('haw haw', err.message);
      done(); // <--  call done(); or see it time out :)
    });
  });
});
```
<!-- {class=" fragment fade-in" style="font-size: 0.5em"} -->

---

<!-- {id="promises-problem"} -->
## The problem with promises

Nested code

```typescript
const fetchFoo = () =>
  new Promise<string>(resolve => {
    setTimeout(() => resolve('foo'), 500);
  });

const fetchBar = (foo:string) =>
  new Promise(resolve => {
    setTimeout(() => resolve(`${foo} bar`), 200);
  });

const asyncFooBarBaz = () =>
  new Promise<string>(resolve => {
    fetchFoo().then(result => {
      fetchBar(result)
        .then(barResult => resolve(`${barResult} baz`));
    });
});

asyncFooBarBaz().then(val => console.log(val)); // foo bar baz
```
<!-- {class=" fragment fade-in" style="font-size: 0.5em"} -->

**This looks an awful lot like the callback hell we just left!**
<!-- {class="fragment fade-in"} -->

---

<!-- {id="one-way-of-solving-the-problem"} -->

## One way of solving the problem

- Return values from a `.then` gets passed to the next `.then`
- The `.then`-chain can often be one level nested

```typescript
const fetchFoo = // as before
const fetchBar = // as before

const asyncFooBarBaz = () =>
  new Promise<string>(resolve => {
    fetchFoo()
      .then(result => fetchBar(result))
      .then(barResult => `${barResult} baz - and added 1`)
      .then(resultFromThen1 => `${resultFromThen1} and added 2`)
      .then(resultFromThen2 => `${resultFromThen2} and added 3`)
      .then(resultFromThen3 => resolve(resultFromThen3));
  });

asyncFooBarBaz().then(result => console.log(result));
// foo bar baz - and added 1 and added 2 and added 3
```

---

<!-- {id="pro-tips-on-callback"} -->
### Pro-tips on Callbacks

- <https://appliedtechnology.github.io/protips/passingFunctions>
- <https://appliedtechnology.github.io/protips/callingBack>
- <https://appliedtechnology.github.io/protips/writingDeepFunctions>
- <https://appliedtechnology.github.io/protips/makingPromises>
