ddns (node.js)
====

A Dynamic DNS (DDNS / DynDNS) server written in node.js.

This module consists of 3 plugins:

* [ddns-rest](https://github.com/Daplie/ddns-api) (external https APIs, typically https port 443)
* [ddns-nameserver](https://github.com/Daplie/ddns-rest) (nameserver implementation, typically udp/tcp ports 53)
* [ddns-webapp](https://github.com/Daplie/ddns-frontend) (web interface, typically https port 443)

Install
-------

**Casual**

```
# Commandline
npm install --global ddnsd

# Library
npm install --save ddns-server
```

**For Development**

```bash
git clone git@github.com:Daplie/node-ddns.git
pushd node-ddns/

# These are not published yet
#npm install ddns-api
#npm install ddns-nameserver
#npm install ddns-frontend

mkdir node_modules/
git clone git@github.com:Daplie/node-ddns-api.git node_modules/ddns-api
git clone git@github.com:Daplie/node-ddns-server.git node_modules/ddns-nameserver
git clone git@github.com:Daplie/node-ddns-frontend.git node_modules/ddns-frontend
```

Usage
-----

**Commandline**

```
# by default, config is stored in ~/.ddnsdrc.json
ddnsd --config ~/.ddnsdrc.json
```

TODO

* Example of creating JWT
* Example of updating domain with device
* Example of updating device with ip

License
========

MIT + Apache2
