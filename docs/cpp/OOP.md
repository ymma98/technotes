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

### 构造器 `class constructor`


构造函数 [ctor]
构造函数是类的一种特殊成员函数，当创建类的新实例时执行。
目标：初始化和资源获取
语法：T(...) 与类名相同且无返回类型
- 构造函数应该初始化所有数据成员
- 我们可以定义具有不同签名的多个构造函数
- 任何构造函数都可以是 constexpr

<!--stackedit_data:
eyJoaXN0b3J5IjpbLTExODA5Mzg2OTcsNjUwODcyNDMwLDMwOD
MyNjg5MCwtOTk2NjEyNzYxLDExNDg4NDI2NDYsMjI1OTgwNDc1
LC02NDExNjgzOSw5NzY0NDEzMTZdfQ==
-->