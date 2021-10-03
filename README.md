# Redstone-js
Redstone web3 Javascript Library

## Docs

How to use it
```
<script type="text/javascript" src="index.js"></script>
```
In main.js
```
Redstone.send(
           url,
           sender,
           reciver,
           amount,
           type_flag,
           payload,
           nonce,
           pow,
           signature,
           hash);
```
Url must be redstone node json api
Sender is senders ***PUBLIC KEY*** not address
reciver is recivers ***ADDRESS***
amount is int amount
type_flag is allways 0 for send
payload = hex encoded payload
nonce = number in transaction that is hashed with transaction and hash starts with 4 zeros there pow
pow = hash
hash = hash
signature = signature
