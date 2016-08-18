| [ddnsd](https://github.com/coolaj86/ddnsd) | [ddns-server](https://github.com/Daplie/node-ddns-server) | [ddns-client](https://github.com/Daplie/node-ddns-client) |

ddns-server
====

A Dynamic DNS (DDNS / DynDNS) server written in node.js.

This server is capable of all of the following:

* static dns
* dynamic dns
* device dns
* multiple device dynamic dns

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

Here's how to create your own nameserver and ddns api using only the default plugins.

```
'use strict';

require('ddns-server').create({
  dnsPort: 53
, httpPort: 80
, filepath: path.join(require('os').homedir(), '.ddnsd.sqlite3')
, primaryNameserver: 'ns1.example.com'
, nameservers: [
    { name: 'ns1.example.com', ipv4: '192.168.1.101' }
  , { name: 'ns2.example.com', ipv4: '192.168.1.102' }
  ]
}).listen();
```

Walkthrough
-----------

You can follow this example verbatim and get working results.

There are three steps:

1. Create a token for a domain and a device
2. Set a device record
3. Update the device's ip

**Create a Token**

The device represents a physical device, like a server, Digital Ocean droplet, VPS, your laptop, or a Raspberry Pi

The domain is a domain the device is allowed to modify.

```bash
# node bin/ddns-jwtgen.js <<private key>> <<domain>> <<device name>>
node bin/ddns-jwtgen.js ./privkey.pem example.com digital-ocean-server-1 > srv1-example-com.jwt
```

**Example: A record**

```bash
curl 'http://localhost:80/api/com.daplie.ddns/dns' \
  -X POST \
  -H "Authorization: Bearer $(cat srv1-example-com.jwt)" \
  -H "Content-Type: application/json; charset=UTF-8" \
  -d '[
    { "registered": true
    , "groupIdx": 1
    , "type": "A"
    , "name": "example.com"
    , "device": "digital-ocean-server-1"
    , "value": "127.0.0.1"
    , "ttl": 600
    , "token": "$(cat srv1-example-com.jwt)"
    }
  ]'
```

And test

```bash
dig @127.0.0.1 example.com
```

Note: Yes, `token` is used twice, but that's just a workaround for a current problem.

Note: `value` will default to the IP address of the connecting client

Note: You can add multiple records for the same DNS host with various devices.
This means that some clients will pick any available record at random or will access each
device round-robin style.

**Update a device IP**

All A (and AAAA, if specified) records associated with the device `digital-ocean-server-1` will be updated
with the supplied IP addresses:

```bash
curl 'http://localhost:80/api/com.daplie.ddns/devices' \
  -X POST \
  -H "Authorization: Bearer $(cat srv1-example-com.jwt)" \
  -H "Content-Type: application/json; charset=UTF-8" \
  -d '{
        "name": "digital-ocean-server-1"
      , "addresses": [ { "type": "A", "value": "127.0.0.1" } ]
      }'
```

Note: `groupIdx` must exist and token and be the same as set in the dns record

**Example: other records**

```bash
curl 'http://localhost:80/api/com.daplie.ddns/dns' \
  -X POST \
  -H "Authorization: Bearer $(cat srv1-example-com.jwt)" \
  -d '[
    { "registered": true
    , "groupIdx": 1
    , "type": "CNAME"
    , "name": "www.example.com"
    , "value": "example.com"
    , "ttl": 600
    , "token": "'$(cat srv1-example-com.jwt)'"
    }
  ]'
```

Note: Yes, `token` is used twice, but that's just a workaround to another bug.

Note: MX records have the additional option `priority`.

License
========

MIT + Apache2
