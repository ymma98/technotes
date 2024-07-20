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
struct S1 {
    int b1 : 10; // 定义一个占用 10 位的整数位域，范围 [0, 1023]
    int b2 : 10; // 同上
    int b3 : 8;  // 定义一个占用 8 位的整数位域，范围 [0, 255]
}; // S1 结构体的总大小为 4 字节

<!--stackedit_data:
eyJoaXN0b3J5IjpbMTgwNDExNTAwMSwtNjkwOTUwNjA4LDkzOD
g5NDA3OF19
-->