node-ddns
======

A Dynamic DNS (DDNS / DynDNS) server written in io.js / node.js.

Start DNS Server

```bash
node node-dyndns/bin/node-dyndns
```

After that, you will find DNS Server on port 53, and Update HTTP Server on port 80. 


DNS API
========

DNS API are public API to manage the domains.
Management API is HTTP, RESTful, API on port 80.

Perform Update
--------

The update API is a REST-based system.

```
/nic/update?hostname=yourhostname&myip=ipaddress
```

IP Address Resolve
--------

The resolve API refers RFC 1035.



License
========

Apache2

Original Work
=========

v0.2.0 was taken from <https://bitbucket.org/ntakimura/node-dyndns/src>
