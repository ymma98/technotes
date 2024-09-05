# bashrc

```bash
##################################### shortcut
alias ll='ls -alF'
alias la='ls -A' 
alias s="ls -F"
alias b="nvim"
alias p="python"
alias gitadog="git log --all --decorate --oneline --graph"
alias gitadog2="git log --graph --abbrev-commit --decorate --date=relative --all"
# clear duplicate $PATH
# reference: https://unix.stackexchange.com/questions/14895/duplicate-entries-in-path-a-problem
PATH=$(printf "%s" "$PATH" | awk -v RS=':' '!a[$1]++ { if (NR > 1) printf RS; printf $1 }')


#################################### wsl
## export DISPLAY=:0,0 # in wsl 1
export DISPLAY=$(awk '/nameserver / {print $2; exit}' /etc/resolv.conf 2>/dev/null):0 # in WSL 2
# export DISPLAY=localhost:0.0
export LIBGL_ALWAYS_INDIRECT=1

export PATH="/usr/local/texlive/2022/bin:$PATH"
export PATH="/usr/local/texlive/2022/:$PATH"
export PATH="/usr/local/texlive/2022/bin/x86_64-linux:$PATH"

alias setproxy="export ALL_PROXY=socks5://127.0.0.1:10808"
alias unsetproxy="unset ALL_PROXY"
alias sync190="rsync -auvz -e 'ssh -p 32158'"
alias sync172="rsync -auvz -e 'ssh -p 32157'"

alias winmode="git config oh-my-zsh.hide-dirty 1"
alias wslmode="git config oh-my-zsh.hide-dirty 0"


##################################  190
alias squeue="squeue -o'%.7i %.9P %.8j %.8u %.2t %.10M %.6D %C'"
alias sinfoall="sinfo -o '%n %e %m %a %c %C'"
alias squeuetot="squeue | awk '{if(NR>1) s+=\$8} END {print s}'"
alias squeuedelall="squeue|awk '{if(\$4==\"ymma\")print \$1}'|xargs scancel"

alias rsync172="rsync -auvze 'ssh -p 32157'"
alias scancelid="scancel \$(cat id | grep -Eo '[0-9]*')"

alias findid="for file in \$(find ./ -name id);do echo -n \${file}; echo -n '   ';cat \${file};done"
alias pc="python inpynim.py c &>/dev/null &"
alias cl1="ls |grep -vE 'gs|new|00000|org'|xargs rm"

# for tabby
export PS1="$PS1\[\e]1337;CurrentDir="'$(pwd)\a\]'

PATH=/home/ymma/.config/nvim/node/node-v16.14.0-linux-x64/bin:$PATH
PATH=/home/ymma/bin/VSCode-linux-x64/bin:$PATH


################################## end
# clear duplicate $PATH
# reference: https://unix.stackexchange.com/questions/14895/duplicate-entries-in-path-a-problem
PATH=$(printf "%s" "$PATH" | awk -v RS=':' '!a[$1]++ { if (NR > 1) printf RS; printf $1 }')



################################ 172
alias qdelall="showq | awk '{if(\$2==\"ymma\") print \$1}'|xargs qdel"
alias sqall="showq | awk '{if(NR>1 && \$2==\"ymma\") print \$1, \$4}'"
alias showqq="watch -n 1 showq"
alias nodefree="pestat|grep free"
alias qdelid="qdel \$(cat id | grep -Eo '^[0-9]*')"
alias pestatid="pestat | grep \$(cat id | grep -Eo '^[0-9]*')"
alias rsync190="rsync -auvze 'ssh -p 32158'"
alias pc="python inpynim.py c &>/dev/null &"
alias findid="for file in \$(find ./ -name id);do echo -n \${file}; echo -n '   ';cat \${file};done"
### nimhdf
## 172: nimhdf -> /home/lihl/something/gc/lihl/nimdevel/2019x2/nimbld/nimdevel/ser/bin/nimhdf
## ./nimhdf -vars "B V p ti nd" -phi -nphi 32 data/dump.64500
### nimhdf -h
alias cdump="ls | grep -vE 'org|new|gs'|xargs rm"
alias cl1="ls |grep -vE 'gs|new|00000|org'|xargs rm"

```
<!--stackedit_data:
eyJoaXN0b3J5IjpbMTgyNDMxOTY4N119
-->