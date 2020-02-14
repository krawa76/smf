npm install in Dockerfile fails with:
=================================

> couchbase@3.0.0 install /app/node_modules/couchbase
> prebuild-install || node-gyp rebuild
prebuild-install WARN install No prebuilt binaries found (target=10.13.0 runtime=node arch=x64 libc=musl platform=linux)

gyp
 ERR! configure error 

gyp ERR! stack Error: Can't find Python executable "python", you can set the PYTHON env variable.
gyp ERR! stack     at PythonFinder.failNoPython (/usr/local/lib/node_modules/npm/node_modules/node-gyp/lib/configure.js:484:19)
gyp ERR! stack     at PythonFinder.<anonymous> (/usr/local/lib/node_modules/npm/node_modules/node-gyp/lib/configure.js:406:16)
gyp
 ERR! stack     at F (/usr/local/lib/node_modules/npm/node_modules/which/which.js:68:16)
gyp ERR!
 stack     at E (/usr/local/lib/node_modules/npm/node_modules/which/which.js:80:29)
gyp ERR! stack
     at /usr/local/lib/node_modules/npm/node_modules/which/which.js:89:16
gyp
 ERR! stack     at /usr/local/lib/node_modules/npm/node_modules/isexe/index.js:42:5
gyp ERR! 
stack     at /usr/local/lib/node_modules/npm/node_modules/isexe/mode.js:8:5
gyp ERR! stack     at FSReqWrap.oncomplete (fs.js:154:21)

gyp ERR! System Linux 4.9.184-linuxkit

gyp ERR! command
 "/usr/local/bin/node" "/usr/local/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js" "rebuild"
gyp ERR!
 cwd /app/node_modules/couchbase
gyp ERR! node -v v10.13.0

gyp 
ERR! node-gyp -v v3.8.0

gyp
 ERR! not ok