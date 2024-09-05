# git 速查

## git 区域

git 涉及 4 个区域:

* disk
* staging
* local
* remote

## git 分支

* 查看本地分支:
```bash
git branch
```

* 查看远程分支:
```bash
git branch -r
```

* 同时看到本地和远程分支
```bash
git branch -a
```

当你克隆一个仓库时，Git 会自动为仓库中的每个分支设置一个远程跟踪分支。这意味着，例如，本地的 `master` 分支会自动跟踪 `origin/master` 分支。这种关联允许你使用 `git push` 和 `git pull` 命令与远程仓库同步更改，而不需要每次都指定具体的远程仓库和分支。

如果你创建了一个新的本地分支，并希望它跟踪一个远程分支（比如，你想让本地的 `new-branch` 分支跟踪远程仓库的 `new-branch` 分支），你可以在推送时使用 `-u` 参数：

`git push -u origin new-branch` 

这会创建远程的 `new-branch`（如果它还不存在的话），并设置你的本地 `new-branch` 分支来跟踪 `origin/new-branch`。

如果你的分支已经存在，但你想改变它跟踪的远程分支，或者设置一个本地分支去跟踪一个远程分支，你可以使用 `git branch` 命令的 `-u` 选项
`git branch -u origin/new-branch`



## git 撤销

* case1, 在 `disk` 区域进行修改, 在 `git add` 之前

在 `disk` 区域，做了一些修改, 这个时候, 有:

```bash
git diff # 可以运行
git status # 可以运行, 然后输出 -> Changes not staged for commit
```

**在 `git add` 之前，如果想要撤销掉所有对文件的修改**, 可以用:

```bash
git checkout <changed_file>
git restore <changed_file>  # 适用于比较新的 git 版本, 和上面的命令等价
```



* case2, 已经通过 `git add` 将修改提交到了 `staging` 区域

这个时候有:

```bash
git status # 输出 -> Changes to be committed
```

**如果想撤销 `git add` 的操作, 即, 把修改从暂存区移除, 但保留 `disk` 上的修改**:

```bash
git reset <changed_file>
git restore --staged <changed file>  # 适用于比较新的 git 版本, 和上面的命令等价
```

**如果想撤销掉所有的修改，包括暂存区和 `disk` 上的修改** (注意! 这个操作会丢失硬盘上的修改):

```bash
git checkout HEAD <changed_file>  # HEAD 在 git 里表示最近一次的 commit
```



* case3, 已经通过 `git commit` 将修改变成了一个正式的 `commit`, 并被放到了 `local git` 里

这个时候，**如果只是单纯地想撤销这次的 `commit`, `disk` 和 `staging` 区域仍然有修改**:

```bash
git reset --soft HEAD~1  # HEAD 表示最近一次的 commit (就是这次啦), ~1 表示之前一个 (其实就是 git commit 之前的状态), ~2 就是之前两个 commit 的状态
# git reset 命令用来退回到任意一个 commit 的状态
```

**如果同时撤销 `git commit` 和 `git add`, 仅有 `disk` 区域保存有修改**:

```bash
git reset HEAD~1
git reset --mixed HEAD~1  # 和上面这个命令等价
```

**如果同时撤销 `git commit`, `git add` 和 `disk` 上的修改**:

```bash
git reset --hard HEAD~1
```



* case4, 如果想撤回某一次 `commit` 的修改，相当于基于当前 `commit`, 去减去撤回的那次 `commit` 的作用，并弄出来一个新的 commit:

```bash
git revert <commit1>  # git revert 可以跟多个 commit
```

<img src="figs/image-20230304183435150.png" alt="image-20230304183435150" style="zoom:50%;" />

当我们的修改目标是公有分支的时候（公有分支就是有多个人使用的分支，一般都是项目的主分支），公有分支只能增加，不能 reset, 这个时候只能用 `git revert`



* case5, 如果想删掉一个 commit：

```bash
git reset --hard HEAD~1
git push -f  # 必须使用 -f
```



## 在 github 上互动

* `fork` 代码
* `git clone` `fork` 的代码到本地

```bash
git remote -v  # 显示远端的仓库，id 是自己的
git branch  # 显示所有的 branch, 当前所在的 branch 会被高亮
git checkout <branch_name>  # 切换到想修改的 branch
```

* 每一个新实现的东西, 都基于想修改的那个 branch 新建一个 branch:

```bash
git checkout -b <new_branch_name>  # 新建一个 branch 并切换到新 branch 上面
```

* 修改代码，并上传到自己 `fork` 的仓库上

```bash
git add .
git commit xxx
git push origin <new_branch_name>
```

* 在自己 `fork` 的仓库里，在 `github` 页面, 点击 `Pull request` -> `New pull request`, 然后 `Create pull request`

```bash
upstream <- <new_branch_name>  # 把自己的 branch 拉到 upstream 的 branch
```



* 如果 upstream 的代码做了修改，想和 upstream 的代码同步: 

```bash
git remote add upstream https://...(github 仓库网址)
git checkout master
git pull --rebase upstream master  # 从 upstream 的 master 里获取最新的更新到我当前的 branch 里
# 如果 upstream 的更新不是在 master 分支里, 就把 master 替换成相应的分支就行了
```



## submodule

```bash
# add submodule in current folder:
git submodule add https://github.com/xxxxxxxxxxx

# clone current project with full submodule:
1. git clone --recurse-submodules https://github.com/chaconinc/MainProject
or:
1. git submodule init
2. git submodule update

# update submodule:
cd submodule_path
git fetch 
git merge origin/master
```


## git 显示中文乱码

* 设置 Git 的 `core.quotepath` 选项为 `false`**：Git 有一个名为 `core.quotepath` 的配置选项，它默认设置为 `true`，用来对非 ASCII 文件名进行引用。当设置为 `false` 时，Git 会显示原始的文件名。你可以通过运行以下命令来更改这个设置：
```bash
git config --global core.quotepath false
```


<!--stackedit_data:
eyJoaXN0b3J5IjpbNDI1NzAxMDg1XX0=
-->