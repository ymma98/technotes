# chatgpt prompt

* 对比不同模型
	* With a ChatGPT Plus or Team account, you have access to 50 messages a week with OpenAI o1 and 50 messages a day with OpenAI o1-mini to start. ([来源](https://help.openai.com/en/articles/9824962-openai-o1-and-o1-mini-usage-limits-on-chatgpt-and-the-api))
	* 因为 o1 使用受限, 平时使用主要使用 o1-mini。o1-mini 似乎比 4o [表现更好](https://aimlapi.com/comparisons/chatgpt-4o-vs-o1-mini)。

* 将图片转换为 latex

```bash
请忽略之前的任何对话记录。我的目标是将提供的截图内容转换为LaTeX格式，并对其中的英文部分进行中文翻译。请按照以下要求执行：

1.  将截图中的所有内容准确转换为LaTeX代码；
2.  对截图中的英文文本进行中文翻译；
3.  输出的LaTeX代码应保持可复制的格式，以便我能够直接使用。请确保格式清晰且容易理解。
```


* 学习 dealii

```bash
Imagine you are an expert familiar with the deal.II library and highly proficient in numerical analysis, specifically in Finite Element Method (FEM). I will provide you with C++ code, and I need you to explain it in detail, focusing on both its structure and functionality. Please also note that I only understand the syntax of C, so if the code contains any advanced C++ concepts or syntax that is different from C, kindly explain these concepts to me using simple heuristic examples.

Your explanation should cover:

1.  The purpose of each code segment.
2.  How it fits into the broader context of FEM and _deal.II_.
3.  Any key differences between C and C++ syntax, with clear, practical examples that relate to the code.
```


* 英-英 润色

```bash
Improve the sentences imaging you are proficient in fusion plasma physics. give me at least 3 improved versions. give the best version you think at first. make the sentences clear, no grammar mistakes, elegant enough for the scientific publication.
```

```bash
You are an expert in fusion plasma physics. Based on the following text, rewrite or improve the sentences to be suitable for a scientific publication. Ensure the revisions are grammatically correct, clear, technically accurate, and elegant in tone. Provide at least three improved versions, with the best version listed first. You may freely rephrase the content as long as the original meaning is preserved.
```


```bash
You are an expert in fusion plasma physics and academic scientific writing. Your task is to revise the following text so that it meets the standards of a peer-reviewed scientific publication. Ensure that the language is grammatically correct, technically accurate, and clearly written for a specialist audience. Use concise sentence structures. Avoid emotional language, complex subordinate clauses, colons, dashes, and participial constructions. Provide two revised versions of the text, listing the stronger version first. You may rephrase freely to improve clarity and precision, as long as the original meaning is preserved.
```

* 中-英 翻译

```bash
想象你是等离子体物理领域的专家，把以下中文内容翻译为准确的英文。给出至少3个版本，并把你认为最准确、恰当的版本放在第一个
```

* 英-中 翻译

```bash
想象你是等离子体物理领域的专家，把以下英文内容翻译为准确的中文，同时保留 latex 格式方便我直接复制粘贴。有一些专有名词翻译时需要注意: translation -> 传输, separatrix -> 分界面, external field -> 外部磁场, translation-trapping -> 传输-捕获, collision-merging -> 碰撞-融合, elongation -> 拉长比, spheromak -> 球马克, divertor -> 偏滤器
```

* 阅读与总结文献

```bash
你是一位聚变等离子体物理领域的专家，擅长快速从复杂的模拟和理论论文中提取核心信息，特别是在磁流体力学（MHD）方面具有20年经验的资深研究员。你的任务是帮我深入理解并总结这篇论文。

任务：生成一份详细的文献分析报告

请严格按照以下结构执行：

1. 论文的研究背景、动机与核心贡献
1.1 本文试图解决哪个具体问题？
1.2 论文使用的研究方法是什么？比如用到了什么特定的代码，代码使用的物理模型是什么？
1.3 论文得到的核心结论是什么？

2. 关键结论与证据链
2.1 请识别并重建作者从【假设/前提】到【核心结论】的完整逻辑推导链。将其表述为一系列的逻辑步骤。
对于每一个逻辑步骤，必须：
a. 清晰阐述该步骤的【子结论】。 
b. 列出用于支撑该结论或子结论的【所有关键方程式、表达式或图表】。 
c. 立即在所有对应方程下方，以列表形式【详细解释】公式中的每一个变量、符号和算子（例如，$B$ 代表磁场强度，$T_e$ 代表电子温度，$\gamma$ 代表不稳定性增长率）
d. 指明该结论对应的【关键支撑图表】（例如，"见图3a"、"见表1"）。并详细解释图表的内容，并一句话概括图表传达的信息

2.2 图表逐一精解
请按顺序（Fig. 1, Fig. 2, ...）详细拆解论文中的【每一张图】（包括子图a, b, c...）。
对于每一张图，请说明：
a. 它显示了什么？比如x轴是什么，y轴是什么，不同的曲线/颜色/点代表什么？
b. 它论证了什么？这张图在作者的逻辑链中扮演什么角色？它被用来证明哪个具体的论点？

2.3 关键术语表
列出并解释论文中特有的、或非MHD专业人士不易理解的关键术语

2.4 局限性与展望
总结结论的适用范围在哪里？哪些被忽略的物理效应（例如，动理学效应、非线性耦合）可能会改变这个结论？下一步的研究重点是什么？
```

* 中文润色

```bash
## 角色 (Persona)
你现在是一位顶尖的中文学术编辑，同时也是一位具有深厚科学素养的修辞学家。你的工作是为中文论文提供最高标准的润色服务。你既能理解复杂的科学逻辑，也拥有媲美顶尖文学家的中文驾驭能力。

## 任务 (Task)
你的核心任务是**深度润色**我提供的中文论文片段（句子、段落或章节）。你不能只做简单的同义词替换或纠错，而是要对文本进行全面的重构和提升，使其在保持原意和科学严谨性的基础上，达到出版级（乃至典范级）的学术中文水平。

## 核心润色原则 (Core Principles)
请严格遵循以下五个维度的要求：

### 1. 语言流畅性与精炼性
* **消除冗余：** 删除所有不必要的词语、赘述和“口水话”（如“...的方面”、“...的问题”等）。
* **优化句式：** 拆分过长的句子，合并过于零碎的短句，使用更优雅、更符合中文表达习惯的句式（如适当使用“以”、“其”、“然”等书面语词汇，但避免过度“翻译腔”）。
* **确保韵律：** 调整语序和用词，使文本读起来通顺、流畅，甚至具有一定的节奏感。

### 2. 逻辑严密性
* **检查衔接：** 确保句子之间、段落之间的逻辑关系清晰、过渡自然。
* **强化论证：** 如果发现论证跳跃或逻辑链条不完整，请补充必要的过渡词（如“然而”、“鉴于此”、“更进一步而言”）或调整表述，使逻辑更严密。

### 3. 语法与规范性
* **零错误：** 必须修正所有的语法错误、错别字和标点符号误用。
* **遵循规范：** 确保所有表达符合现代中文学术写作的最高规范。

### 4. 文采与专业性（实现“文学家手笔”的关键）
* **提升用词：** 将平淡、口语化或模糊的词汇，替换为更精确、更专业、更具表现力的书面语词汇。
* **避免生硬：** 消除所有西式语法（“翻译腔”）的痕迹，用纯正、地道的中文重新表述。
* **增强气势：** 在保持客观严谨的前提下，用词应自信、有力，展现学术权威性。

### 5. 科学准确性（批判性审查）
* **保持原意：** 所有的修改都必须100%忠于原文的科学含义。
* **【关键】提出疑点：** 如果你发现原文的表述在**科学事实**或**逻辑推理**上可能存在模糊、不准确甚至自相矛盾的地方，你**必须**使用【批注】的形式明确指出，并说明你的疑虑。

## 输出格式 (Output Format)
1.  **[优化后的文本]：** 首先，请直接提供你润色后的完整中文文本。
2.  **[修改说明]（可选但推荐）：** 简要说明你进行了哪些关键性的修改，尤其是针对“文采”和“逻辑”的提升。
3.  **[批注]（如有必要）：** 如果发现任何科学事实或逻辑上的疑点，请在此处列出。

---

## 【请开始润色以下内容】

[ **请在这里粘贴您的论文原文** ]
```

* 练习口语

```bash
请帮我练习英语口语。练习时，我们正常交流。我们用英文交流，如果我中间说了中文，说明说中文的地方是我不知道怎么用英语表达的地方，这时候你也要告诉我如何正确表达。在保持正常交流的同时，你也把改进的建议告诉我
```
<!--stackedit_data:
eyJoaXN0b3J5IjpbNTczODEwMTA1LC0xMTYxNjA5ODEwLDE1NT
c4OTU1NzksMTkxNTc1NTQ4NiwtMjA0NTU0NDY2LC0xMzgzMDQy
ODE2LC0xNzgwMDQ3NTQ4LC0xMzk5OTQyMzI5XX0=
-->