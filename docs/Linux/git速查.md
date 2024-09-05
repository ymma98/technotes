# git 速查

## cheat sheet

这一节主要[参考这里](https://github.com/RehanSaeed/Git-Cheat-Sheet)

### Configuration
| Command | Description |
| - | - |
| `git config --global user.name "foo"`              | Set user name |
| `git config --global user.email "foo@example.com"` | Set user email |

### Branches
| Command | Description |
| - | - |
| `git branch foo`                          | Create a new branch |
| `git branch -d foo`                       | Deletes a branch |
| `git switch foo`                          | Switch to a branch |
| `git switch -c\|--create foo`             | Create and switch to a branch |
| `git restore foo.js`                      | Undo all changes on the foo.js file |
| `git checkout foo.js`                     | Undo all changes on the foo.js file |
| `git checkout foo`                        | Use `git switch` instead |
| `git checkout -b foo`                     | Use `git switch -c` instead |
| `git merge foo`                           | Merge branch into current branch |

### Pulling
| Command | Description |
| - | - |
| `git pull --rebase --prune`               | Get latest, rebase any changes not checked in and delete branches that no longer exist | 

### Staged Changes
| Command | Description |
| - | - |
| `git add file.txt`                        | Stage file |
| `git add -p`|--patch file.txt`            | Stage some but not all changes in a file |
| `git mv file1.txt file2.txt`              | Move/rename file |
| `git rm --cached file.txt`                | Unstage file |
| `git rm --force file.txt`                 | Unstage and delete file |
| `git reset HEAD`                          | Unstage changes |
| `git reset --hard HEAD`                   | Unstage and delete changes |
| `git clean -f\|--force -d`                | Recursively remove untracked files from the working tree |
| `git clean -f\|--force -d -x`             | Recursively remove untracked and ignored files from the working tree |

### Changing Commits
| Command | Description |
| - | - |
| `git reset 5720fdf`                           | Reset current branch but not working area to commit |
| `git reset HEAD~1`                            | Reset the current branch but not working area to the previous commit |
| `git reset --hard 5720fdf`                    | Reset current branch and working area to commit |
| `git commit --amend -m "New message"`         | Change the last commit message |
| `git commit --fixup 5720fdf -m "New message"` | Merge into the specified commit |
| `git revert 5720fdf`                          | Revert a commit |
| `git rebase --interactive [origin/main]`      | Rebase a PR (`git pull` first) |
| `git rebase --interactive 5720fdf`            | Rebase to a particular commit |
| `git rebase --interactive --root 5720fdf`     | Rebase to the root commit |
| `git rebase --continue`                       | Continue an interactive rebase |
| `git rebase --abort`                          | Cancel an interactive rebase |
| `git cherry-pick 5720fdf`                     | Copy the commit to the current branch |

### Compare
| Command | Description |
| - | - |
| `git diff`                                | See difference between working area and current branch |
| `git diff HEAD HEAD~2`                    | See difference between te current commit and two previous commits |
| `git diff main other`                     | See difference between two branches |

### View
| Command | Description |
| - | - |
| `git log`                                 | See commit list |
| `git log --patch`                         | See commit list and line changes |
| `git log --decorate --graph --oneline`    | See commit visualization |
| `git log --grep foo`                      | See commits with foo in the message |
| `git show HEAD`                           | Show the current commit |
| `git show HEAD^` or `git show HEAD~1`     | Show the previous commit |
| `git show HEAD^^` or `git show HEAD~2`    | Show the commit going back two commits |
| `git show main`                           | Show the last commit in a branch |
| `git show 5720fdf`                        | Show named commit |
| `git blame file.txt`                      | See who changed each line and when |

### Stash
| Command | Description |
| - | - |
| `git stash push -m "Message"`             | Stash staged files |
| `git stash --include-untracked`           | Stash working area and staged files |
| `git stash --staged`                      | Stash staged files |
| `git stash list`                          | List stashes |
| `git stash apply`                         | Moved last stash to working area |
| `git stash apply 0`                       | Moved named stash to working area |
| `git stash clear`                         | Clear the stash |

### Tags
| Command | Description |
| - | - |
| `git tag`                                              | List all tags |
| `git tag -a\|--annotate 0.0.1 -m\|--message "Message"` | Create a tag |
| `git tag -d\|--delete 0.0.1`                           | Delete a tag |
| `git push --tags`                                      | Push tags to remote repository |

### Remote
| Command | Description |
| - | - |
| `git remote -v`                           | List remote repositories |
| `git remote show origin`                  | Show remote repository details |
| `git remote add upstream <url>`           | Add remote upstream repository |
| `git fetch upstream`                      | Fetch all remote branches |
| `git rebase upstream/main`                | Refresh main branch from upstream |
| `git remote -v`                           | List remote repositories |
| `git push --force`                        | Push any changes while overwriting any remote changes |
| `git push --force-with-lease`             | Push any changes but stop if there are any remote changes |
| `git push --tags`                         | Push tags to remote repository |

### Submodules
| Command | Description |
| - | - |
| `git submodule status`                    | Check status of all submodules |

- Pull submodules
  1. `git submodule sync`
  2. `git submodule init`
  3. `git submodule update`
- Change branch
  1. `cd /submodule`
  2. `git fetch origin <branch-name>`
  3. `git checkout <branch-name>`
  4. `cd /`

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


## git 显示中文乱码

* 设置 Git 的 `core.quotepath` 选项为 `false`**：Git 有一个名为 `core.quotepath` 的配置选项，它默认设置为 `true`，用来对非 ASCII 文件名进行引用。当设置为 `false` 时，Git 会显示原始的文件名。你可以通过运行以下命令来更改这个设置：
```bash
git config --global core.quotepath false
```


<!--stackedit_data:
eyJoaXN0b3J5IjpbLTEyMjUyNjQ3NzVdfQ==
-->