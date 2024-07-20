# 基本概念-enum_struct_控制流


## Enumerator - `enum`

在 C++ 中，枚举（enum）是一种数据类型，它将一组命名的整数常量 (named integral constants) 分组在一起。

* 面临的问题: 虽然从技术上来说 `color` 和 `fruit` 是相等的（因为它们的整数值相同），但从逻辑上将颜色与水果进行比较并没有任何意义。这是使用枚举时可能遇到的一个问题，尤其是当枚举类型用于不相关的领域时。这种行为可能导致代码中出现难以发现的逻辑错误。在 C++11 之后的版本中，推荐使用强类型枚举（`enum class`），它可以避免这种类型之间的隐式比较，从而提供更高的类型安全。
```cpp
// 定义颜色枚举类型
enum color_t { BLACK, BLUE, GREEN };
// 定义水果枚举类型
enum fruit_t { APPLE, CHERRY };

// 创建颜色变量并赋值为 BLUE
color_t color = BLUE;
// 输出比较结果，预期为 false 因为 color 不是 BLACK
cout << (color == BLACK); // 输出：false
```

```cpp
// 将 color 设置为 BLACK (int: 0)
color_t color = BLACK;
// 将 fruit 设置为 APPLE (int: 0)
fruit_t fruit = APPLE;

// 比较 color 和 fruit 是否相等，由于底层值都是 0，所以返回 true
bool b = (color == fruit); // 输出：true=
```

* `enum class` 


`enum class`（也称为作用域枚举）是一种类型安全的枚举，它不会隐式转换为 `int`，增强了代码的安全性和可读性。

```cpp
// 定义强类型颜色枚举
enum class Color { BLACK, BLUE, GREEN };
// 定义强类型水果枚举
enum class Fruit { APPLE, CHERRY };

// 使用枚举值初始化变量
Color color = Color::BLUE;
Fruit fruit = Fruit::APPLE;

// 尝试比较颜色和水果，将导致编译错误
// bool b = (color == fruit); // 编译错误：我们试图将颜色与水果匹配

// 尝试将枚举值隐式转换为 int 类型，将导致编译错误
// int a1 = Color::GREEN; // 编译错误

// 尝试对两个枚举值进行算术运算，将导致编译错误
// int a2 = Color::RED + Color::GREEN; // 编译错误

// 显式类型转换是允许的
int a3 = (int) Color::GREEN; // 正确，显式转换
```


* `enum class` features
```cpp
// enum/enum class should be always initialized
enum class Color { RED, GREEN, BLUE };
Color my_color; // "my_color" may be outside RED, GREEN, BLUE!!

// enum/enum class can be compared
enum class Color { RED, GREEN, BLUE };
cout << (Color::RED < Color::GREEN); // print true

// enum/enum class are automatically enumerated in increasing order
enum class Color { RED, GREEN = -1, BLUE, BLACK };
// (0) (-1) (0) (1)
Color::RED == Color::BLUE; // true

// enum/enum class can contain alias
enum class Device { PC = 0, COMPUTER = 0, PRINTER };

// C++11 enum/enum class allows setting the underlying type
enum class Color : int8_t { RED, GREEN, BLUE };
```


## `struct`

* 结构体是一个将不同变量聚合到一个单元中的数据结构。每个结构体成员可以有不同的数据类型。

```cpp
struct A {
    int x;
    char y;
};
```

* 可以在定义结构体的同时声明一个或多个该类型的变量。

```cpp
struct A {
    int x;
} a, b;
```

* 在 C++ 中，可以在局部作用域（例如函数内部）声明结构体，但这种做法有一些限制
```cpp
// 这个示例展示了如何在函数 `f` 的局部作用域内定义和使用结构体 `A`。在这种情况下，结构体 `A` 只在函数 `f` 内部可见，并且在函数结束后不再存在。
int f() {
    // 在函数内部定义结构体 A
    struct A {
        int x;
    } a; // 声明结构体变量 a

    return a.x; // 返回结构体成员 x 的值
}
```

* 位域, `Bitfield`。这是一种数据结构中的变量类型，它允许你以位为单位而不是字节来定义变量的宽度。这对于节省内存和精确控制数据结构的大小非常有用

```cpp
// 这个示例中，`struct S1` 通过组合三个位域定义了一个紧凑的数据结构，总共占用 28 位，这可以被存储在 4 个字节内。
struct S1 {
    unsigned int b1 : 10; // 定义一个占用 10 位的整数位域，范围 [0, 1023]
    unsigned int b2 : 10; // 同上
    unsigned int b3 : 8;  // 定义一个占用 8 位的整数位域，范围 [0, 255]
}; // S1 结构体的总大小为 4 字节

// 在 `struct S2` 的定义中，中间的匿名位域 `int : 0;` 起到了重置对齐的作用。这告诉编译器下一个位域 `b2` 应该从新的存储单元开始，导致结构体大小增加到 8 字节。
struct S2 {
    unsigned int b1 : 10;   // 定义一个占用 10 位的整数位域
    unsigned int : 0;       // 特殊的位域，用于强制下一个位域从下一个整数边界开始
    unsigned int b2 : 10;   // 由于前面的重置，这个位域将开始于新的 32 位边界
}; // S2 结构体的总大小为 8 字节
```


* 联合, `union`, 联合是一种特殊的数据类型，它允许在同一内存位置存储不同的数据类型。联合体的大小仅仅足够大，以容纳其最大的成员。联合体是一种“重叠”存储的形式。

```cpp
union A {
int x;
char y;
}; // sizeof(A): 4
A a;
a.x = 1023; // bits: 00..000001111111111
a.y = 0; // bits: 00..000001100000000
cout << a.x; // print 512 + 256 = 768
```

一个很好的例子，`union` 可以用来高效控制寄存器:

```cpp
#include <stdint.h>

typedef union DeviceControlRegister {
    uint32_t value;     // 用于一次性读写整个寄存器
    struct {
        uint32_t reset : 1;       // 重置位
        uint32_t enable : 1;      // 启用位
        uint32_t mode : 2;        // 模式位
        uint32_t reserved : 28;   // 保留位，未使用
    } bits;
} DeviceControlRegister;

void configureDevice() {
    DeviceControlRegister reg;
    reg.value = 0;  // 清零所有位

    // 设置特定的控制位
    reg.bits.reset = 1;  // 发送重置信号
    reg.bits.enable = 1; // 启用设备
    reg.bits.mode = 3;   // 设置为模式 3

    // 假设这是向设备写入寄存器的函数
    writeDeviceRegister(reg.value);
}
```


## `[[deprecated]]`

在 C++14 中，新增了一个特性，允许开发者通过添加 `[[deprecated]]` 属性来标记某些实体为“已弃用”，意在鼓励开发者不再使用这些实体。可以选择性地添加一条消息来说明弃用的原因。

`[[deprecated]]` 这个属性可以应用于：

-   函数 functions
-   变量 variables
-   类和结构体 class and structures
-   枚举值（在 C++17 中支持单个值枚举）enumerators
-   类型 types
-   命名空间 namespaces

声明了 `[[deprecated]]` 之后，编译的时候会报 warning

```cpp
// 弃用函数
[[deprecated("Use newFunction() instead.")]]
void oldFunction() {
  // implementation
}

// 弃用类
[[deprecated("Use NewClass instead.")]]
class OldClass {
  // class definition
};

// 弃用变量
[[deprecated("This variable will be removed in future versions.")]]
int oldVariable;

// 弃用类型定义
[[deprecated("Use int32_t instead of Int.")]]
using Int = int;

// 弃用枚举值
enum class Fruit {
  Apple,
  Orange,
  Banana,
  [[deprecated("Grape will be removed in future releases.")]]
  Grape
};
```


## 控制流

* `if` 的短路 (short-circuiting) 机制
```cpp
if (<true expression> r| array[-1] == 0)
... // no error!! even though index is -1
// left-to-right evaluation
```


* 三元运算符 (Ternary operator) `<cond> ? <expression1> : <expression2>`
```cpp
int value = (a == b) ? a : (b == c ? b : 3); // nested
```

* `for`，当迭代次处已知的时候使用

```cpp
for ([init]; [cond]; [increment]) {
 ... 
}
```

* `while`, 迭代次处未知的时候使用

```cpp
while (cond) {
...
}
```


* `do while`，迭代次处未知，且至少有一次迭代的时候使用

```cpp
do {
...
} while (cond);
```

* `for` loop 进阶

1. loop definition

```cpp
for (int i = 0, k = 0; i < 10; i++, k += 2) 
...
```

2. 无限循环

```cpp
for (;;) // also while(true); 
...
```

3. `break`,  `continue`, `return`

```cpp
for (int i = 0; i < 10; i++) {
if (<condition>)
break; // exit from the loop
if (<condition>)
continue; // continue with a new iteration and exec. i++
return; // exit from the function
} 
```

4. **range-based for loop**, 可以避免指定 start, end, increment

```cpp
for (int v : { 3, 2, 1 }) // INITIALIZER LIST
cout << v << " "; // print: 3 2 1
int values[] = { 3, 2, 1 };
for (int v : values) // ARRAY OF VALUES
cout << v << " "; // print: 3 2 1
for (auto c : "abcd") // RAW STRING
cout << c << " "; // print: a b c d
```

基于范围的 for 循环可以应用于三种情况：

-   固定大小的数组，例如 `int array[3]`，或字符串字面量 `"abcd"`
-   列表初始化器，例如 `{1, 2, 3}`
-   任何带有 `begin()` 和 `end()` 方法的对象

<!--stackedit_data:
eyJoaXN0b3J5IjpbLTEyODA5NDAyOTgsLTIwOTIxOTExMTksNj
ExMzgwMTksLTYxOTg1MjAwMywxNTgxOTg4NTU3LDE1NDg1Mzk4
MDAsLTY5MDk1MDYwOCw5Mzg4OTQwNzhdfQ==
-->