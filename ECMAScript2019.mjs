// Module Record

// This doesn't work


/*
@see {@link https://tc39.github.io/ecma262/#sec-createbuiltinfunction}
realm and prototype arguments are optional
*/
function CreateBuiltinFunction ( steps, internalSlotsList, realm, prototype ) {
  // Assert: steps is either a set of algorithm steps or other definition of a function's behaviour provided in this specification.
  assert(Object.is(Type(steps), SetOfAlgorithSteps) || global.functionBehaviorDefinitions.find( (Definition) => Object.is(Type(steps), Definition)))
  // If realm is not present, set realm to the current Realm Record.
  const realm = realm ? realm : agent.context.realm
  // Assert: realm is a Realm Record.
  assert(Object.is(Type(realm), Realm))
  // If prototype is not present, set prototype to realm.[[Intrinsics]].[[%FunctionPrototype%]].
  if (!prototype) {
    prototype = realm.intrinsics.functionPrototype
  }
  // Let func be a new built-in function object that when called performs the action described by steps. The new function object has internal slots whose names are the elements of internalSlotsList. The initial value of each of those internal slots is undefined.
  const func = new Function()
  func.call = Function.call(this, thisArg, thisArgArray) {
    do {...steps}
  }
  func.internalSlotsList = internalSlotsList
  func.internalSlotsList.fill(undefined)
  // Set func.[[Realm]] to realm.
  func.realm = realm
  // Set func.[[Prototype]] to prototype.
  func.prototype = prototype
  // Set func.[[Extensible]] to true.
  func.extensible = true
  // Set func.[[ScriptOrModule]] to null.
  func.scriptOrModule = null
  // Return func.
  return func
}


export { CreateBuiltinFunction }
