# tmux cheat sheet

* [参考](https://gist.github.com/andreyvit/2921703)



## tmux Cheatsheet

(C-x means Ctrl+x, M-x means Alt+x)


## Sessions, windows, panes

-   **Session** is a set of windows, plus a notion of which window is current.
-   **Window** is a single screen covered with panes (like a ‘virtual desktop’).
-   **Pane** is a rectangular part of a window that runs a specific command, e.g. a shell.

----------

## Getting help

Display a list of keyboard shortcuts:

```bash
C-b ?
```

You can navigate the help screen using Vim or Emacs shortcuts, depending on the value of `mode-keys`. If you want Vim shortcuts for help and copy modes (e.g. `j`, `k`, `C-u`, `C-d`), add:

```bash
setw -g mode-keys vi
```

Any command mentioned in this list can also be executed by running `tmux something` or typing `C-b :something` (or added to `~/.tmux.conf`).

----------

## Managing sessions

**Create a new session:**

```bash
tmux new-session -s work
```

**Create a new session that shares all windows with an existing session (but has its own notion of which window is current):**

```bash
tmux new-session -s work2 -t work
```

**Attach to a session:**

```bash
tmux attach -t work
```

**Detach from a session:**

```bash
C-b d
```

**Switch between sessions:**

```bash
C-b (   # previous session
C-b )   # next session
C-b L   # ‘last’ (previously used) session
C-b s   # choose a session from a list
```

**Other session commands:**

```bash
C-b $   # rename the current session
```

----------

## Managing windows

**Create a new window:**

```bash
C-b c
```

**Switch between windows:**

```bash
C-b 1 ...  # switch to window 1 ... 9, 0
C-b p       # previous window
C-b n       # next window
C-b l       # ‘last’ (previously used) window
C-b w       # choose window from a list
```

**Switch between windows with alerts:**

```bash
C-b M-n     # next window with a bell, activity, or content alert
C-b M-p     # previous such window
```

**Other window commands:**

```bash
C-b ,       # rename the current window
C-b &       # kill the current window
```

----------

## Managing split panes

**Create a new pane by splitting an existing one:**

```bash
C-b "       # split vertically (top/bottom)
C-b %       # split horizontally (left/right)
```

**Switch between panes:**

```bash
C-b left
C-b right
C-b up
C-b down
C-b o       # go to the next pane (cycle)
C-b ;       # go to the ‘last’ (previously used) pane
```

**Move panes around:**

```bash
C-b {       # move the current pane to the previous position
C-b }       # move the current pane to the next position
C-b C-o     # rotate window ‘up’
C-b M-o     # rotate window ‘down’
C-b !       # move the current pane into a new separate window (‘break pane’)
C-b :move-pane -t :3.2   # move the current pane into window 3's pane 2
```

**Resize panes:**

```bash
C-b M-up, C-b M-down, C-b M-left, C-b M-right    # resize by 5 rows/columns
C-b C-up, C-b C-down, C-b C-left, C-b C-right    # resize by 1 row/column
```

**Applying predefined layouts:**

```bash
C-b M-1     # even-horizontal layout
C-b M-2     # even-vertical layout
C-b M-3     # main-horizontal layout
C-b M-4     # main-vertical layout
C-b M-5     # tiled layout
C-b space   # switch to the next layout
```

**Other pane commands:**

```bash
C-b x       # kill the current pane
C-b q       # briefly display pane numbers
```

----------

## Other config file settings

**Force a reload of the config file on `C-b r`:**

```bash
unbind r
bind r source-file ~/.tmux.conf
```

**Another useful setting:**

```bash
setw -g xterm-keys on
```
<!--stackedit_data:
eyJoaXN0b3J5IjpbMTA2NDMwMjA2MSwxNDM5OTI5Mzk1LC05Mj
c0MjE2OTBdfQ==
-->