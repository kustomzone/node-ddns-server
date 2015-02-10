curl https://redirect-www.org:65443/api/ddns \
  -X POST \
  --cacert ../certs/ca/my-root-ca.crt.pem \
  -u admin:secret \
  -H 'Content-Type: application/json' \
  -d '{ "name": "local.doesntexist.com"
      , "value": "250.1.1.127"
      , "type": "A"
      }'
