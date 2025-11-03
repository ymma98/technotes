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
```

* 练习口语

```bash
请帮我练习英语口语。练习时，我们正常交流。我们用英文交流，如果我中间说了中文，说明说中文的地方是我不知道怎么用英语表达的地方，这时候你也要告诉我如何正确表达。在保持正常交流的同时，你也把改进的建议告诉我
```
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTE1NDU0MTM3MzgsMTU1Nzg5NTU3OSwxOT
E1NzU1NDg2LC0yMDQ1NTQ0NjYsLTEzODMwNDI4MTYsLTE3ODAw
NDc1NDgsLTEzOTk5NDIzMjldfQ==
-->