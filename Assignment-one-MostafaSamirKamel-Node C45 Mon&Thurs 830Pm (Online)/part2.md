# Part 2: Essay Questions

---

### 1. Difference between forEach and for...of (0.5 Grade)

**forEach** is an array method that executes a callback function for each element. **for...of** is a loop statement that iterates over iterable objects.

#### Key Differences:

- **Control Flow**: `forEach` cannot use `break` or `continue` statements, while `for...of` can
- **Return Values**: `forEach` cannot be stopped early and ignoring `return` inside the callback doesn't exit the loop; `for...of` respects loop control statements
- **Async Handling**: `for...of` works well with `await` inside the loop body, while `forEach` doesn't handle async/await properly
- **Scope**: `forEach` uses a callback function creating a new scope; `for...of` shares the same scope

#### When to use each:

**Use forEach:**
- When you need the index parameter
- When doing side effects on each element
- When you don't need to break early

**Use for...of:**
- When you need to break/continue
- When working with async/await
- When iterating over any iterable (Maps, Sets, strings)
- When you need better performance

#### Examples:

```javascript
// forEach - cannot break
[1, 2, 3].forEach(num => {
  if (num === 2) return; // only skips this iteration
  console.log(num);
});
// Output: 1, 3

// for...of - can break
for (const num of [1, 2, 3]) {
  if (num === 2) break; // exits loop entirely
  console.log(num);
}
// Output: 1
```

---

### 2. Hoisting and Temporal Dead Zone (0.5 Grade)

**Hoisting** is JavaScript's behavior of moving declarations to the top of their scope during compilation, before code execution.

#### How it works:

- `var` declarations are hoisted and initialized with `undefined`
- `function` declarations are fully hoisted (both declaration and definition)
- `let`, `const`, and `class` declarations are hoisted but NOT initialized

**Temporal Dead Zone (TDZ)** is the period between entering a scope and the actual declaration of a `let`, `const`, or `class` variable. Accessing the variable in this zone throws a ReferenceError.

#### Examples:

```javascript
// var - hoisted and initialized
console.log(x); // undefined (no error)
var x = 5;

// let/const - hoisted but in TDZ
console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 10;

// Function hoisting
greet(); // "Hello!" - works fine
function greet() {
  console.log("Hello!");
}

// TDZ example
{
  // TDZ starts here for 'temp'
  console.log(temp); // ReferenceError
  let temp = 100; // TDZ ends here
}
```

---

### 3. Differences between == and === (0.5 Grade)

**== (Loose Equality)** performs type coercion before comparison, converting operands to the same type.

**=== (Strict Equality)** does NOT perform type coercion and checks both value and type.

#### Key Differences:

| Aspect | == | === |
|--------|-------|---------|
| Type Coercion | Yes | No |
| Type Checking | No | Yes |
| Performance | Slightly slower | Faster |
| Predictability | Less predictable | More predictable |

#### Examples:

```javascript
// Loose equality (==)
5 == "5"        // true (string converted to number)
0 == false      // true (both converted to numbers)
null == undefined // true (special case)
[] == false     // true (complex coercion)

// Strict equality (===)
5 === "5"       // false (different types)
0 === false     // false (different types)
null === undefined // false (different types)
[] === false    // false (different types)

// Recommended: Use === by default
const userInput = "42";
if (userInput === "42") { // explicitly check for string
  // safer, more intentional
}
```

Always use `===` unless you specifically need type coercion, as it makes code more predictable and prevents subtle bugs.

---

### 4. Try-Catch and Async Operations (0.5 Grade)

**try-catch** is an error handling mechanism that allows you to "try" code that might throw an error and "catch" it gracefully instead of crashing.

#### Structure:

```javascript
try {
  // Code that might throw an error
} catch (error) {
  // Handle the error
} finally {
  // Optional: runs regardless of success or failure
}
```

#### Why it's important in async operations:

1. **Prevents Unhandled Promise Rejections**: Async operations can fail (network errors, invalid data), and without try-catch, these become unhandled rejections
2. **Graceful Error Handling**: Allows you to provide user-friendly error messages instead of application crashes
3. **Error Recovery**: Enables retry logic, fallback mechanisms, or alternative actions
4. **Debugging**: Captures error details for logging and debugging

#### Examples:

```javascript
// Async/await with try-catch
async function fetchUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    
    if (!response.ok) {
      throw new Error('User not found');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch user:', error.message);
    // Return fallback data or rethrow
    return null;
  } finally {
    console.log('Request completed');
  }
}

// Without try-catch - dangerous!
async function badExample() {
  const data = await fetch('/api/data'); // If this fails, entire app could crash
  return data.json();
}

// Multiple async operations
async function processData() {
  try {
    const [users, posts] = await Promise.all([
      fetch('/api/users').then(r => r.json()),
      fetch('/api/posts').then(r => r.json())
    ]);
    return { users, posts };
  } catch (error) {
    // Handles errors from either request
    throw new Error(`Data processing failed: ${error.message}`);
  }
}
```

---

### 5. Type Conversion vs Type Coercion (0.5 Grade)

**Type Conversion (Explicit)** is when you manually convert a value from one type to another using built-in functions or operators.

**Type Coercion (Implicit)** is when JavaScript automatically converts types behind the scenes during operations.

#### Differences:

| Aspect | Type Conversion | Type Coercion |
|--------|-----------------|---------------|
| Control | Developer decides | JavaScript decides |
| Visibility | Explicit in code | Implicit/hidden |
| Predictability | Predictable | Can be surprising |
| Intentionality | Intentional | Automatic |

#### Type Conversion Examples (Explicit):

```javascript
// String conversion
String(123)           // "123"
(123).toString()      // "123"

// Number conversion
Number("456")         // 456
parseInt("42px")      // 42
parseFloat("3.14")    // 3.14

// Boolean conversion
Boolean(1)            // true
Boolean(0)            // false
Boolean("")           // false
Boolean("hello")      // true

// Explicit conversions are clear and intentional
const userAge = Number(prompt("Enter age:")); // clearly converting input
```

#### Type Coercion Examples (Implicit):

```javascript
// String coercion
"5" + 3              // "53" (number coerced to string)
"Hello " + true      // "Hello true"

// Number coercion
"5" - 3              // 2 (string coerced to number)
"10" * "2"           // 20 (both strings coerced to numbers)

// Boolean coercion
if ("hello") {}      // "hello" coerced to true
!!"text"             // true (double negation coerces to boolean)

// Comparison coercion (with ==)
"5" == 5             // true (string coerced to number)
false == 0           // true (boolean coerced to number)

// Surprising coercion examples
[] + []              // "" (empty string)
[] + {}              // "[object Object]"
true + true          // 2
```

---
