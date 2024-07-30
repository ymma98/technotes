# python无法支持汉字

报错
```bash
Non-ASCII character '\xe6' in file <stdin> on line 9, but no encoding declared; see http://python.org/dev/peps/pep-0263/ for details
```

文件开头加上这一行
```bash
# -*- coding: utf-8 -*-
```
<!--stackedit_data:
eyJoaXN0b3J5IjpbMTA0MTMyNDk4OV19
-->