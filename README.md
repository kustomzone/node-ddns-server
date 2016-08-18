node-ddns
======

A Dynamic DNS (DDNS / DynDNS) server written in node.js.

This server is capable of all of the following:

* static dns
* dynamic dns
* device dns
* multiple device dynamic dns

Install
-------

```bash
git clone git@github.com:Daplie/node-ddns.git
pushd node-ddns/

mkdir node_modules/
pushd node_modules/

git clone git@github.com:Daplie/node-ddns-server.git ddns-api
git clone git@github.com:Daplie/node-ddns-server.git ddns-nameserver
git clone git@github.com:Daplie/node-ddns-frontend.git ddns-frontend

#npm install ddns-api
#npm install ddns-nameserver
#npm install ddns-frontend
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
