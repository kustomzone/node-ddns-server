| [ddnsd](https://github.com/coolaj86/ddnsd) | [ddns-server](https://github.com/Daplie/node-ddns-server) | [ddns-client](https://github.com/Daplie/node-ddns-client) |

ddns
====

A Dynamic DNS (DDNS / DynDNS) server written in node.js.

This module consists of 3 plugins:

* [ddns-rest](https://github.com/Daplie/ddns-rest) (external https APIs, typically https port 443)
* [ddns-nameserver](https://github.com/Daplie/ddns-nameserver) (nameserver implementation, typically udp/tcp ports 53)
* [ddns-webapp](https://github.com/Daplie/ddns-webapp) (web interface, typically https port 443)

For the command line server see [ddnsd](https://github.com/coolaj86/ddnsd)

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
#npm install ddns-rest
#npm install ddns-nameserver
#npm install ddns-webapp

mkdir node_modules/
git clone git@github.com:Daplie/ddns-rest.git node_modules/ddns-rest
git clone git@github.com:Daplie/ddns-nameserver.git node_modules/ddns-nameserver
git clone git@github.com:Daplie/ddns-webapp.git node_modules/ddns-webapp
```

Usage
-----

**Commandline**

```
ddnsd
```

**Library**

```
require('ddns-server').create({}).listen();
```

**Client Access**

TODO

* Example of creating JWT
* Example of updating domain with device
* Example of updating device with ip

License
========

MIT + Apache2
