---
title: Eliminating Partial Functions by Balancing Types in TypeScript
layout: post
description: "A look at 4 techniques using TypeScript to avoid partial functions and prevent unexpected errors"
image: "/images/domain_codomain.png"
tags: [programming, typescript]
---

<img src="/images/domain_codomain.png" alt="Graphic showing mapping of domain to codomain of functions" class="image-width-full" />

When writing software it's valuable to avoid code that throws exceptions as they lead to problems that are costly, complicate the code, and are hard to debug. Functions that don't return valid results for all valid inputs are called "partial functions". The better option is to create "total functions". In typed languages "valid" is encoded in the type, so for a function from `number[] => number` to be total there must not exist any array of numbers that causes the function to not return a number. Let's look at a counter example.

```typescript
const headNum = (xs: number[]): number => xs[0];
```
This function doesn't return a number when passed an empty array. In that case it will return `undefined`. This breaks the contract of the function. It's disappointing that TypeScript doesn't make this a type error but this can be overcome in a few ways.

# Weaken the return type
The first step is always to make the types not lie.

```typescript
const headNum = (xs: number[]): number | undefined => xs[0];
```

This succeeds in making the function total, but now it's harder to compose with other functions dealing with numbers.

```typescript
const suc = (n: number): number => n + 1;

suc(headNum([1])); // => Type Error
```

The caller of headNum now has to guard against `undefined` to use it.

Note: TypeScript 4.1 added [noUncheckedIndexedAccess](https://devblogs.microsoft.com/typescript/announcing-typescript-4-1-beta/#no-unchecked-indexed-access) compiler option to close the gap on accessing array items unsafely.

# Encode the weakness in another type
Rather than encoding the weakness in a union a type can be used to represent the failure. In this case the `Option` type is a good choice.

```typescript
type Option<T> = None | Some<T>;
type None = {tag: 'None'};
type Some<T> = {tag: 'Some', val: T};

const none: None = {tag: 'none'};
const some: <T>(val: T): Option<T> => {tag: 'Some', val};
```

Now change `headNum` to return `Option<number>`.

```typescript
const headNum = (xs: number[]): Option<number> =>
  xs.length ? some(xs[0]) : none;
```
However this hasn't yet increased the usability over simply doing the union with `undefined`. A way of composing functions with values of this type is needed:

```typescript
const mapOption = <T, U>(fn: (x: T) => U, o: Option<T>): Option<U> => {
  switch(o.tag){
    case 'None': return none;
    case 'Some': return some(fn(o.val));
  }
};
```
And now `suc` can be more easily composed with `headNum` and we remain confident that there won’t be exceptions.
```typescript
mapOption(suc, headNum([1])); // => Some(2)
mapOption(suc, headNum([])); // => none
```
There's a lot more to the Option type (AKA "Maybe"). Check out libraries like [fp-ts](https://gcanti.github.io/fp-ts/) for more info.

# Provide a fall-back
Rather than adjusting the return types we can choose to guard on the leading side. The simplest way is to accept the fallback value as an argument. This is not as flexible as using an Option but is great in a lot of cases, and easy to understand for most developers.

```typescript
const headNum = (fallback: number, xs: number[]): number =>
  xs.length ? xs[0] : fallback;
```
Usage:
```typescript
suc(headNum(1, [])); // => 1
```

The trade-off here is that it's harder to do something vastly different in the failure case as the failure is caught in advance. 

# Strengthen argument type
The last tactic I want to cover is strengthening the argument type so that there are no inputs which produce invalid numbers. In this case a type for an non-empty array is needed:

```typescript
type NonEmptyArray<T> = [T, T[]]; 
const nonEmpty = <T>(x: T, xs: T[]): NonEmptyArray<T> => [x, xs];
```
`headNum` then becomes:

```typescript
const headNum = (xs: NonEmptyArray<number>): number =>
  xs[0]
```
And usage:
```typescript
suc(headNum(nonEmpty(1, [])));
```

Notice how similar this is to the fall-back approach. The difference is that `NonEmptyArray` is now a proper type and it can be reused in other ways. Employing a library like [fp-ts](https://gcanti.github.io/fp-ts/) will help get the full benefits of this tactic.

# Conclusion
As I have demonstrated, there's a few options for dealing with weaknesses in function types. To make functions total the return type can be weakened or the argument types can be strengthened. I strongly encourage you to play with them next time you identify a partial function in your application. 

Friends don't let friends write partial functions.

# Further reading
* [Partial Function on Wikipedia](https://en.wikipedia.org/wiki/Partial_function)
* [Parse, Don't Validate](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate) My original inspiration
* [Type Safety Back and Forth](https://www.parsonsmatt.org/2017/10/11/type_safety_back_and_forth.html)
* [fp-ts](https://gcanti.github.io/fp-ts/) Functional TS library with `Option` and `NonEmptyArray` types and more 

