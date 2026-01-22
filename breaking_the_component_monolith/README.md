# Breaking the mammoth component
#### (for better testing and a longer, healthier, happier life)

## Intro
`App.ts` is a small component. It's logic is very simple: it receives two optional parameters, does some logic based on them, and has one button for the user to reveal or hide a field.

It also has other fields: it renders two static titles (Business Name and Business Rate), each followed by their respective dynamic value.

However, `App.ts` is not as innocent as it seems! It needs a longish test file that has to handle tests for both what the user sees, as well as logic that happens behind the scenes.

### But isn't this ok?!? It's still a small test file... ⁉️
Guess what? Now the business wants a feature flag: if it's set to true, then the button to reveal the hidden component triggers a Hello, Kitty! animation instead! 😽❤️

```
{revealOffer &&
  hasSpecialRate && 
  !hasHelloKittyFlag && (
    <div data-testId="offer">You have a special business offer!</div>
)}
```
The business likes that! But only if the user is external, otherwise Sainsbury's employees might get happy 👌

```
{revealOffer &&
  hasSpecialRate && 
  !hasHelloKittyFlag && 
  !isInternal && (
    <div data-testId="offer">You have a special business offer!</div>
)}
```

How are those tests going? 😏

If you keep all of this logic in the same place, you now have to combine testing each of these permutations alongside the render logic when, in fact, that logic resolves to a single `true` or `false`.

```
const showShowOffer = revealOffer &&
  hasSpecialRate && 
  !hasHelloKittyFlag && 
  !isInternal

...

{showShowOffer && (
    <div data-testId="offer">You have a special business offer!</div>
)}
```

This is tidier, but it doesn't change your test efforts: you still need to test for every permutation there.

### So what do I do? 🤔
How about extracting that piece of logic to a separate file, write all permutation using only simple unit tests, without worrying about the rendering logic? 

You'll still need to test the different behaviors in the render tests, but now you'll only have a `true` and a `false` to cover instead of all permutations.

## TASK 📝
Extract the business logic in `App.ts` into separate helper files, writing tests for each.

For each of the business logic extracted, think about:
1. What are you going to name the files?
2. Where are you going to put them (folder structure)?
3. Which existing tests should I remove now that that logic is being tested elsewhere?
4. Does your file need to have an `.tsx` extension?
5. Can / should I use `it.each` / `describe.each`?

## Running tests 🧪
`npm run test src/yourTestFileName.ts`

#### Motivation ✨
We have a testing issue. Caused by component issues. And it sucks.