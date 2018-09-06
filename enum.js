/*
Naive and non-working art for ECMAScript enums

@see {@link https://github.com/isiahmeadows/enum-proposal}
@see {@link https://github.com/doug-wade/enum-polyfill}
@see {@link https://github.com/rbuckton/proposal-enum}
*/

/*
Enums are effectively frozen objects. Everyone would expect this.
Enum variants are themselves frozen objects.
Enum tables exist for remapping an enum variant to related data, in a way that is decoupled from the variant or enum itself.
Enums consist of their variants and two tables: their keys and their values.
Several helper methods exist on enums to make it easier for them to remap integers, strings, and symbols to their enum variants.
*/

/*
Example test:
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
*/


import { SetIntegrityLevel, CreateBuiltinFunction, CreateMethodProperty } from './ECMAScript2019'


Object[Symbol.toVariant] = (value, context) => {
  return _inferVariantSymbol(value, context, false)
}


Symbol[Symbol.toVariant] = (value, context) => {
  return _inferVariantSymbol(value, context, true)
}


String[Symbol.toVariant] = (value, context) => {
  return `${context != null && context.infer ? context.key : value}`
}


Number[Symbol.toVariant] = (value, context) => {
  if (context != null && context.infer) {
    value = context.prev
    return value == null ? 0 : value + 1
  }
  return +value
}


BigInt[Symbol.toVariant] = (value, context) => {
  if (context != null && context.infer) {
    value = context.prev
    return value == null ? 0n: value + 1n
  }
  return BigInt(value)
}


Function.prototype[Symbol.toVariant] = function (value, context) {
  if (context != null && context.infer || !(value instanceof this)) {
    // The side effects within `_inferName` and `this.name` don't really
    // exist
    throw new TypeError(
      `Expected ${_inferName(context)} to be an instance of ${this.name}`
    )
  }
  return value
}


// Private helper functions.
function _inferName (context) {
  return context != null
    ? `${context.enum.name || '<anonymous>'}.${context.key}`
    : '`value`'
}


function _inferVariantSymbol (value, context, checkSymbol) {
  if (context != null && context.infer) return Symbol(_inferName(context))
  if (checkSymbol && typeof value !== 'symbol') {
    // The side effects within `_inferName` don't really exist
    throw new TypeError(`Expected ${_inferName(context)} to be a symbol`)
  }
  return value
}


class Enum {
  constructor (variants) {
    this.variantCount = variants.length
    this.compare = (a, b) => {
      result = undefined
      if (b < a) {
        result = 1
      } elseif(a == b) {
        result = 0
      } elseif(a < b) {
        result = -1
      }
      return result
    }
    if (this.#isValueEnum) {
      this.fromIndex = (value) => undefined // Convert a raw value to an enum instance. This is a closure for convenience (for functional people) and to allow a few early optimizations with it. This is only present on value enums.
    }
    this.name = Enum.caller.name ? Enum.caller.name : ''
  }


  /*
  Normal enum. Doesn't support custom values or anything special.
  @example
  ```js
  enum Foo { FOO, BAR }
  ```
  */
  static CreateSimpleEnum (name, keys) {
    // Assert: Type(name) is String.
    assert(typeof name === 'string', 'Better be a string')
    // Let variantCount be the number of items in keys.
    const variantCount = keys.length
    // Let E be ObjectCreate(null, « [[EnumVariants]] »).
    const E = Object.create(null, /*« [[EnumVariants]] »*/)
    // Let compare be CreateBuiltinFunction(steps for an enum compare function, « [[Enum]] »).
    const compare = CreateBuiltinFunction([/*steps for an enum compare function*/], /*« [[Enum]] »*/)
    // Let fromValue be CreateBuiltinFunction(steps for an enum fromValue function, « [[Enum]] »).
    const fromValue = CreateBuiltinFunction([/*steps for an enum fromValue function*/], /*« [[Enum]] »*/)
    // Let hasInstance be CreateBuiltinFunction(steps for an enum @@hasInstance function, « [[Enum]] »).
    const hasInstance = CreateBuiltinFunction([/*steps for an enum @@hasInstance function*/], /*« [[Enum]] »*/)
    // Set compare.[[Enum]] to E.
    compare.enum = E
    // Set hasInstance.[[Enum]] to E.
    hasInstance.enum = E
    // Set E.[[EnumVariants]] to an empty list.
    E.variants = []
    // Set E.[[EnumValueType]] to undefined.
    E.valueType = undefined
    do {
      // Perform ! CreateMethodProperty(E, 'name', name).
      CreateMethodProperty(E, 'name', name)
      // Perform ! CreateMethodProperty(E, 'variantCount', variantCount).
      CreateMethodProperty(E, 'variantCount', variantCount)
      // Perform ! CreateMethodProperty(E, 'compare', compare).
      CreateMethodProperty(E, 'compare', compare)
      // Perform ! CreateMethodProperty(E, 'fromIndex', fromIndex).
      CreateMethodProperty(E, 'fromIndex', fromIndex)
      // Perform ! CreateMethodProperty(E, @@hasInstance, hasInstance).
      CreateMethodProperty(E, @@hasInstance, hasInstance)
      // Perform ! CreateMethodProperty(E, @@toStringTag, 'Enum').
      CreateMethodProperty(E, @@toStringTag, 'Enum')
    }
    // Let index be 0.
    let index = 0
    // For each key in keys,
    keys.forEach(key => {
      // Let V be CreateEnumVariant(E, index, keys[index]).
      let V = this.CreateEnumVariant(E, index, keys[index])
      // Append V to E.[[EnumVariants]].
      E.variants.push(V)
      // Perform ! CreateDataProperty(E, keys[index], V).
      CreateDataProperty(E, keys[index], V)
      // Increment V by 1.
      V++
      // Let status be ! SetIntegrityLevel(E, 'frozen').
      let status = SetIntegrityLevel(E, 'frozen')
      // Assert: status is true.
      assert(status)
  })
    // Return E.
    return E
  }


  static CreateEnumVariant (E, index, name) {
    const V = Object.create(EnumVariantPrototype)
  }
}


class EnumVariant extends Enum Object.freeze({
  #hasParentEnum = undefined
  #hasParentValue = super.enum && super.value

    // This returns the variant's declared name.
    name = declaredName
    enum = super.enum
    // This returns the variant's index, in case that's ever relevant.
    index = undefined
    value = hasParentValue ? (super.value ? super.value : super.name) : throw new TypeError('You fucked up')
    valueOf () { return #hasParentEnum ? this.value : this.index }
    toString = () => this.valueOf()
    toJSON = () => this.valueOf()
})
