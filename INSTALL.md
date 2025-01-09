Installation for development of **cmtools**
===========================================

**cmtools** is an experimental, proof of concept, set of tools for TypeScript, JavaScript, Python or Go programming projects. It provides a `cmt` command line program.

Compiled binaries are not provided at this time.

Required software
-----------------

1. Git (to clone the cold repository on GitHub)
2. Deno >= 2.1.4

Compiling **cmtools**
---------------------

Deno is used to compile the TypeScript and dependant JavaScript files into an executable.

1. Install handlebars via Deno
2. Use Deno's task to build project

~~~shell
deno install npm:handlebars
deno task build
~~~

This will provide the `cmt` command in the "bin" folder in your repository directory.

You can check to make sure `cmt` works for your system. The compiled version is self contain and can be copied someplace in your path. 

### Manual install on POSIX

~~~shell
mkdir -p $HOME/bin
export PATH="$HOME/bin:$PATH"
cp bin/cmt $HOME/bin/
~~~

### Manual install for Windows via Powershell

~~~ps1
mkdir $HOME/bin
$PATH = [Environment]::GetEnvironmentVariable("PATH")
[Environment]::SetEnvironmentVariable("PATH", "$PATH;$HOME/bin")
copy ./bin/cmt.exe $HOME/bin/
~~~



