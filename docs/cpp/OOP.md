# 面向对象编程

object-oriented programming

## `class`

在 C++ 中，结构体（struct）和类（class）在语义上是等价的。然而，应使用这两个关键字来区分不同的语义：

-   `struct` 代表被动 (passive) 对象，即物理状态（数据集）。使用 `struct` 关键字通常意味着该类型主要用于存储数据，没有太多复杂的行为。这是一种更接近于传统 C 语言的结构体的用法，适用于表示简单的数据结构。
-   `class` 代表主动 (active) 对象，即逻辑状态（数据抽象）。使用 `class` 关键字则意味着该类型不仅包含数据，还可能包括与这些数据相关的复杂行为。类更倾向于封装和数据抽象，适用于实现更复杂的逻辑。
-  在 `struct` 中，默认的成员访问权限是公开（public），这意味着结构体的成员在任何地方都可以直接访问。
-   在 `class` 中，默认的成员访问权限是私有（private），这意味着类的成员只能被类本身的方法或特定的友元（friend）访问。

`class` 的 member 分为两类:
* 数据成员 (data member). 类中的数据被称为数据成员或类字段
* 函数成员 (function member). 类中的函数被称为函数成员或方法

### RAII: Resource Acquisition is Initialization

- 资源的持有是类不变量，与对象生命周期紧密相关。这意味着一旦一个类的对象被创建，它就会持有某些资源（如文件句柄、数据库连接等），并且这些资源会一直被持有直到对象的生命周期结束。这是通过在类的构造函数中分配资源，并在析构函数中释放资源来实现的。
- RAII（资源获取即初始化）习惯法包括三个步骤：
  - 将资源封装进一个类（构造函数）
  - 通过类的本地实例使用资源
  - 当对象超出作用域时，资源会自动释放（析构函数）
- 影响1：C++ 编程语言不需要垃圾收集器！由于RAII保证了资源的及时释放，C++程序通常不需要垃圾收集器来管理内存或其他资源的回收，这与依赖垃圾收集器的语言（如Java）不同。
- 影响2：程序员有责任管理资源。虽然RAII提供了自动资源管理的机制，但程序员仍需在设计和实现类时确保正确使用RAII原则。错误的资源管理或误用RAII可能导致资源泄露、无效的资源引用等问题。

### `struct`/`class` 的声明

- 结构体声明与定义
```c++
struct A; // 结构体声明  
struct A { // 结构体定义
  int x; // 数据成员
  void f(); // 函数成员
};
```

- 类声明与定义
```c++
class A;  // 类声明
class A { // 类定义
  int x; // 数据成员
  void f(); // 函数成员
};
```

```c++
struct A {
  void g(); // 函数成员声明
  void f() { // 函数成员定义
    cout << "f"; // 内联定义
  }
};
void A::g() { // 函数成员定义
    cout << "g"; // 外部定义
 }
```

```cpp
struct B {
  void g() { cout << "g"; } // 函数成员定义
};
struct A {
  int x; // 数据成员
  B b; // 数据成员，类型为结构体B
  void f() { cout << "f"; } // 函数成员定义
};
A a; // 创建A类型的对象a
a.x; // 访问数据成员x
a.f(); // 调用成员函数f()
a.b.g(); // 访问成员对象b的成员函数g()
```

### 类的层次 (class hierarchy)

- 子类/派生类 (child/derived class or subclass)
  - 从另一个类继承变量和函数的新类被称为派生类或子类。

- 父类/基类 (parent/base class)
  - 为派生类提供变量和功能的最近的类被称为父类或基类。

- 扩展基类
  - 指创建一个新类，保留基类的特性，并在此基础上可以添加（而不能删除）自己的成员。

- 语法
```c++
    class DerivedClass : [<继承属性 (inheritance attribute)>] BaseClass {
    }
```

```cpp
struct A { // 基类
    int value = 3;
    void g() {}
};
struct B : A { // B 是 A 的派生类（B 继承 A）
    int data = 4; // B 继承自 A
    int f() { return data; }
};
A a;
B b;
a.value; // 访问 A 类的成员变量
b.g(); // 调用继承自 A 类的方法
```
```cpp
struct A {};
struct B : A {};
void f(A a) {} // 通过值传递
void g(B b) {} // 通过值传递
void f_ref(A& a) {} // 引用传递，适用于 A 类型和其子类对象
void g_ref(B& b) {} // 引用传递，适用于 B 类型和其子类对象
A a;
B b;
f(a); // 正确，也可以 f(b), f_ref(a), g_ref(b)
g(b); // 正确，也可以 g_ref(b), 但不可以 g(a), g_ref(a)
A a1 = b; // 正确，也可以 A& a2 = b
// 当派生类对象赋值给基类对象时，只有派生类对象中的基类部分被复制到基类对象中。这个过程通常称为对象的“切片”（slicing），因为派生类特有的属性被“切掉”了，只剩下基类的部分。
// B b1 = a; // 编译错误，因为 A 类型不能隐式转换为 B 类型
```

### 访问控制符/访问说明符 (access specifiers)

访问说明符定义了继承类成员的可见性。关键字 public、private 和 protected 指定了可见性区域。
访问说明符的目的是为了防止直接访问类的内部表示，以避免错误使用和潜在的不一致性（访问控制）。
- public：没有限制（函数成员、派生类、类外部）
- protected：函数成员和派生类访问
- private：仅限函数成员访问（内部）
结构体默认为公有成员
**类默认为私有成员，私有继承**

```c++
struct A1 {
    int value; // 公有（默认）
protected:
    void f1() {} // 受保护
private:
    void f2() {} // 私有
};
class A2 {
    int data; // 私有（默认）
};
struct B : A1 {
    void h1() { f1(); } // 正确，"f1" 在 B 中可见
    // void h2() { f2(); } // 编译错误，"f2" 在 A1 中为私有
};
A1 a;
a.value; // 正确
// a.f1() // 编译错误，受保护
// a.f2() // 编译错误，私有
```

访问控制符也用于定义，在继承中从基类到特定派生类的可见性如何传播。

| Member <br> declaration |  | Inheritance |  | Derived classes |
| :---: | :---: | :---: | :---: | :---: |
| public <br> protected <br> private | $\rightarrow$ | public | $\rightarrow$ | public <br> protected |
| public <br> protected <br> private | $\rightarrow$ | protected | $\rightarrow$ | protected <br> protected |
| public <br> protected <br> private | $\rightarrow$ | private | $\rightarrow$ | private <br> private |

* `struct` 默认是公有继承
```cpp
struct A {
    int var1; // 公有
protected:
    int var2; // 受保护
};
struct B : protected A {
    int var3; // 公有
};
B b;
// b.var1; // 编译错误，var1 在 B 中为受保护
// b.var2; // 编译错误，var2 在 B 中为受保护
b.var3; // 正确，var3 在 B 中为公有
```

* `class` 默认是私有继承
```cpp
class A {
public:
    int var1; // 公有
protected:
    int var2; // 受保护
};
class B1 : A {}; // 私有继承
class B2 : public A {}; // 公有继承
B1 b1;
// b1.var1; // 编译错误，var1 在 B1 中为私有
// b1.var2; // 编译错误，var2 在 B1 中为私有
B2 b2;
b2.var1; // 正确，var1 在 B2 中为公有
```

### 构造函数 `class constructor`


构造函数 [constructor, ctor]
构造函数是类的一种特殊成员函数，当创建类的新实例时执行。
目标：初始化和资源获取
语法：`T(...)` 与类名相同且无返回类型
- 构造函数应该初始化所有数据成员
- 我们可以定义具有不同签名的多个构造函数
- 任何构造函数都可以是 constexpr


#### 默认构造函数

default constructor
默认构造函数 `T()` 是一个**无参数的构造函数**
每个类总是具有隐式的 (implicit)、显式的 (explicit) 或删除的 (explicit) 默认构造函数之一
```c++
struct A {
    A() {} // 显式的默认构造函数
    A(int) {} // 用户定义的（非默认）构造函数
};
```
在 C++ 中，在定义函数或构造函数的参数时，如果参数名在函数体内未被使用，你可以选择不给这个参数命名。这种做法常见于以下情况：

1.  **函数声明中**：在声明函数或构造函数时，常常只需要指定参数类型而不是参数名。这主要是为了说明函数的接口，不关心参数的具体名称。
2.  **函数定义中**：如果函数实现不需要使用某个参数，那么可以省略该参数的名称。这有助于避免编译器警告关于未使用变量的信息，同时也使得函数定义更简洁。


```cpp
struct A {
    int x = 3; // 隐式的默认构造函数
};
A a{}; // 调用默认构造函数，等价于：A a;
```

注意：一个隐式的默认构造函数是 constexpr
注意，`A a2();` 语句实际上会被解释为一个函数声明，这是一个常见的错误，称为“最令人疑惑的 C++ 解析”。

**直接列表初始化**： - 使用 `{}`（C++11 引入的直接列表初始化）可以调用默认构造函数。这种语法更加明确，可以避免与函数声明混淆。 - 在创建数组或使用 `new` 关键字动态分配数组时，每个元素都将通过默认构造函数进行初始化。



一个类的隐式默认构造函数会被标记为删除，如果：
- 它有任何用户定义的构造函数
```cpp
struct A {
    A(int x) {}
};
// A a; // 编译错误
```

-   它有非静态成员/基类是引用或常量类型
```cpp
struct NoDefault { // 删除的默认构造函数
    int& x;
    const int y;
};
```

* 它有一个非静态成员/基类，其自身的默认构造函数被删除（或不可访问）
```cpp
struct A {
    NoDefault var; // 删除的默认构造函数
};
struct B : NoDefault {}; // 删除的默认构造函数
```

* 它有一个非静态成员/基类，其析构函数被删除或不可访问
```cpp
struct A {
private:
    ∼A() {}
};
```

#### 初始化列表 (initializer list)

初始化列表用于初始化类的数据成员，或在进入构造函数体之前显式调用基类的构造函数（不要与 std::initializer_list 混淆）
```cpp
struct A {
    int x, y;
    A(int x1) : x(x1) {} // ": x(x1)" 是初始化列表
    // 直接初始化语法
    A(int x1, int y1) : // ": x{x1}, y{y1}"
    x{x1}, // 是初始化列表
    y{y1} {} // 直接列表初始化语法
}; // (C++11)
```


C++11 中的类内非静态数据成员初始化（In-class non-static data members initialization, NSDMI）允许在声明数据成员的地方初始化它们。用户定义的构造函数可以用来覆盖这些默认值。
```cpp
struct A {
    int x = 0; // 类内成员初始化器
    const char* str = nullptr; // 类内成员初始化器
    A() {} // 如果调用默认构造函数，“x”和“str”都将被良好定义
    A(const char* str1) : str{str1} {}
};
```


常量和引用数据成员必须使用初始化列表, 或 C++11 的类内大括号, 或等号初始化器语法进行初始化
```cpp
struct A {
    int x;
    const char y; // 必须初始化
    int& z; // 必须初始化
    int& v = x; // 等号初始化器（C++11）, equal-initializer
    const int w{4}; // 大括号初始化器（C++11）
    A() : x(3), y('a'), z(x) {}
};
```

类成员的初始化顺序遵循声明的顺序，而不是初始化列表中的顺序。在 C++ 中，类成员的初始化顺序并不由构造函数中初始化列表的顺序决定，而是由成员在类中声明的顺序决定。这意味着，即使在初始化列表中先初始化某个成员，如果它在类定义中的声明顺序在另一个成员之后，它实际上会在那个成员之后被初始化。
```cpp
struct ArrayWrapper {
    int* array;
    int size;
    ArrayWrapper(int user_size) :
    size{user_size},
    array{new int[size]} {} // 错误！！：“size” 还未定义
};
ArrayWrapper a(10);
cout << a.array[4]; // 段错误
```

#### 列表初始化 (统一初始化, uniform initialization)

统一初始化（C++11）
统一初始化 `{}`，也称为列表初始化，是一种完全独立于数据类型的方式来初始化任何对象
- 最小化冗余的类型名
  - 在函数参数中
  - 在函数返回中
- 解决“最令人困惑的解析”问题 (most vexing parse problem)
  - 构造函数被解释为函数原型
 
```cpp
struct Point {
    int x, y;
    Point(int x1, int y1) : x(x1), y(y1) {}
};
// C++03 版本的 add 函数
Point add(Point a, Point b) {
    return Point(a.x + b.x, a.y + b.y);
}
Point c = add(Point(1, 2), Point(3, 4));

// C++11 版本的 add 函数
Point add(Point a, Point b) {
    return { a.x + b.x, a.y + b.y }; // 使用列表初始化返回
}
auto c = add({1, 2}, {3, 4}); // 使用列表初始化构造参数
```

* “最令人困惑的解析”问题 (most vexing parse problem)
```cpp
struct A {
A(int) {}
};
struct B {
// A a(1); // compile error It works in a function scope
A a{2}; // ok, call the constructor
};
```

```cpp
struct A {};
struct B {
B(A a) {}
void f() {}
};
B b( A() ); // "b" is interpreted as function declaration
			// with a single argument A (*)() (func. pointer)
// b.f() // compile error "Most Vexing Parse" problem
		 // solved with B b{ A{} };
```

#### 构造函数的继承


类构造函数永远不会被继承
派生类必须在当前类构造函数之前隐式或显式地调用基类构造函数
类构造函数的调用顺序是从最顶层的基类开始，一直到最派生的类（C++对象的构建像洋葱一样层层递进）
```cpp
struct A {
    A() { cout << "A"; }
};
struct B1 : A { // 隐式调用 "A()"
    int y = 3; // 然后, "y = 3"
};
struct B2 : A { // 显式调用 "A()"
    B2() : A() { cout << "B"; }
};
B1 b1; // 打印 "A"
B2 b2; // 打印 "A", 然后打印 "B"
```



### 详细解释

在 C++ 中，类构造函数在继承中的行为遵循特定的规则：

1. **构造函数不被继承**：
   - 在 C++ 中，基类的构造函数不会被派生类自动继承。派生类必须定义自己的构造函数，如果需要，也必须显式地调用基类的构造函数。

2. **构造函数的调用顺序**：
   - 当创建派生类的对象时，构造函数的调用顺序始于最顶层的基类，逐步向下直到最派生的类。这保证了每个类的构造函数都能正确地初始化其各自的部分。

3. **隐式和显式调用基类构造函数**：
   - 如果派生类的构造函数中没有显式地调用基类的构造函数，编译器将自动插入对基类无参数构造函数的调用（如果存在）。
   - 派生类可以通过其初始化列表显式地调用基类的构造函数，以确保基类的成员被适当地初始化。

### 示例解释

在代码示例中：
- **结构体 B1**：派生自 `A`，并隐式调用了 `A` 的构造函数。在执行 `A` 的构造函数后，初始化成员变量 `y`。
- **结构体 B2**：派生自 `A`，但在其构造函数中显式地调用了 `A` 的构造函数，然后执行自己的额外逻辑（打印 "B"）。

这个例子展示了如何通过继承关系构造对象，并明确了在多层继承结构中构造函数的调用顺序和方法。

<!--stackedit_data:
eyJoaXN0b3J5IjpbLTExMTg1MzkxOTQsMTk2MDcwNzUxMiwtMT
k4NDYzODkyNSwxNzY4MDUxMjgwLDE1MTI3NTcwNDYsMTU2MDMz
NDYyNCw2NTA4NzI0MzAsMzA4MzI2ODkwLC05OTY2MTI3NjEsMT
E0ODg0MjY0NiwyMjU5ODA0NzUsLTY0MTE2ODM5LDk3NjQ0MTMx
Nl19
-->