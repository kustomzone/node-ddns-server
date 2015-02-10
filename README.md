node-ddns
======

A Dynamic DNS (DDNS / DynDNS) server written in io.js / node.js.

Start DNS Server

```bash
git clone git@github.com:Daplie/node-ddns.git
pushd node-ddns

echo '{}' > dns.db.json

# node bin/node-dyndns <<dns port>> <<https port>>
node bin/node-dyndns 65053 65443
```

Test that it works

```bash
# update a DNS record
curl https://localhost:65443/api/ddns \
  -X POST \
  --cacert certs/ca/my-root-ca.crt.pem \
  -u admin:secret \
  -H 'Content-Type: application/json' \
  -d '{ "name": "example.com"
      , "value": "127.0.0.1"
      , "type": "A"
      }'
  
# test that the record was updated
dig -p 65053 @localhost example.com A
```

**via GET**

```
/nic/update?name=example.com&type=A&value=127.0.0.1
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
