# 快速搭建技术博客: read the docs + stackedit

搭建技术博客的方式有很多，目前我认为最便捷的一种是使用 read the docs + stackedit，优点有:
* 一切操作都在浏览器中进行，不用在本地管理文档、编译项目
* 网页自动更新，专注于写 markdown 就可以
* 配置简单, 可以快速上手
* 免费

## 操作步骤

* 注册 stackedit (这里我使用的是 [stackedit 中文版](https://stackedit.cn/)；stackedit 的 [初始项目](https://stackedit.io/) 已经不维护了, 并且原项目编辑 markdown 时不支持直接复制粘贴图片，而需要用到图床)，这是一个在线编辑 markdown 的平台，并且可以将 markdown 文件自动同步到 github 仓库中，选择同步到别的地方，比如 google drive、gitlab 等，也是可以的
* 注册 [read the docs](https://about.readthedocs.com/), 将 github 仓库导入其中后，可以自动构建和构建网页；当 github 仓库更新时，也会自动更新网页
* 新建一个 github public repo (免费版 read the docs 不支持自动部署 private repo)，命名为 xxx, 然后新建 xxx/mkdocs.yml, xxx/docs/index.md。为什么新建这两个文件，是因为 read the docs 主要支持两种自动渲染网页的方式: mkdocs 与 sphinx. 我比较熟悉 mkdocs。mkdocs 与 sphinx 都是用来构建静态网页的。这里只用知道 [mkdocs.yml](https://www.mkdocs.org/user-guide/configuration/) 用来设置网页渲染的参数，比如文档的结构，网站的标题等，index.md 用来设置



<!--stackedit_data:
eyJoaXN0b3J5IjpbNjk1OTEzNjk2XX0=
-->