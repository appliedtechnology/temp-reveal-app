<!-- {id="ts-generics"} -->
# Generics in TypScript

> Write once - run for all types

Notes:

This lecture is about features that is used at development time.
It's best shown in the development environment
You might want to show the code examples in VS Code

---

## What is generics

- development-time tool
- creates re-usable parts of our code
- can create one function/class/type that operates on many types
- with preserved type-safety

---

### Example, please!

```typescript
function addToStart<T>(list:T[], itemToAdd: T) : T[] {
  return [itemToAdd, ...list];
}
```

or

```typescript
const addToStart = <T>(list:T[], itemToAdd: T) : T[] {
  return [itemToAdd, ...list];
}
```

Notes:

- `T` indicates a type that we decided at call-time
- like a variable for the type that we are going to use for the function
- Point out all places where `T` is used.

---

### Calling a generic function

```typescript
const listOfNumbers = [1,2,3,4,5];
const listOfStrings = ["hello", "goodbye"];
type Person = {
  name: string,
  age: number
}
const listOfPeople : Person[] = [{name: "Marcus", age: 50}, {name: "David", age: 47} ]

// we can now do
const newListOfNumbers = addToStart<number>(listOfNumbers, 2);
const newListOfStrings = addToStart<string>(listOfStrings, "cheers");
const j:Person = {name: "Julia", age: 30};
const newListOfPeople = addToStart<Person>(listOfPeople, j);

// error - "Marcus" is not a number
const newListOfNumbers2 = addToStart<number>(listOfNumbers, "Marcus");
// error - "listOfPeople" is not string[]
const newListOfNumbers3 = addToStart<number>(listOfPeople, 2);
```

Notes:

- go through each example slowly, there's a lot to unpack here

---

## Generics - classes

- Where the code really becomes reusable
- Have to use classes for the real value to be present
- Generics can also be used for `interface` and `type`

---

### Generics in classes - example

- Let's build a class that holds list of any type
- And methods to return first and last

```typescript
class ListWrapper<T> {
  private list: T[];

  constructor(list : T[]) {
    this.list = list;
  }

  public getFirst() : T { return this.list[0]; }
  public getLast() : T { return this.list[this.list.length - 1]; }
  // public getLast() : T { return this.list.at(-1); } // optional variant from es2022
}
```

---

### Using a generic class

```typescript
const listOfNumbers = new ListWrapper<number>([1, 2, 3, 4, 5]);
const listOfStrings = new ListWrapper<string>(['hello', 'goodbye']);

type Person = {
  name: string,
  age: number
};
const listOfPeople = new ListWrapper<Person>([{ name: 'Marcus', age: 50 }, { name: 'David', age: 47 }]);

const firstPerson = listOfPeople.getFirst(); // firstPerson is Person
const lastString = listOfStrings.getLast(); // lastString is string
const lastNumber = listOfNumbers.getLast(); // lastNumber is number
```

---

## Real-life examples that we will see

- `Promise<string>` - a Promise of String
  - a promise that will resolve with a `string`

Notes:

- `useState<Person>` (from React) - state of Person
  - the state is typed to be of type `Person`

---

## Summary

- Generics is very cool
- Write once - use for any type
  - WITH type-safe code
- Looks weird!
