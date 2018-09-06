# ecmascript-enum

Naive and non-working art for ECMAScript enums

See https://github.com/isiahmeadows/enum-proposal
See https://github.com/doug-wade/enum-polyfill
See https://github.com/rbuckton/proposal-enum


From https://github.com/isiahmeadows/enum-proposal
> * Enums are effectively frozen objects. Everyone would expect this.
> * Enum variants are themselves frozen objects.
> * Enum tables exist for remapping an enum variant to related data, in a way that is decoupled from the variant or enum itself.
> * Enums consist of their variants and two tables: their keys and their values.
> * Several helper methods exist on enums to make it easier for them to remap integers, strings, and symbols to their enum variants.


### Example test

From https://github.com/isiahmeadows/enum-proposal

```js
const baz = {}

enum Foo: Object {
    FOO,
    BAR = 1,
    BAZ = baz,
}

assert(Foo.FOO.value === "FOO")
assert(Foo.BAR.value === 1)
assert(Foo.BAZ.value === baz)
```