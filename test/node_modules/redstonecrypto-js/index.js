var Redstone = Redstone||(function () {
    var privateArray=[];
    //Cannot be called from outside this function
    let Transaction = {
        hash: "",
        sender: "sender",
        reciver: "reciver",
        amount: "amount",
        nonce: "nonce",
        type_flag: "type_flag",
        payload: "payload", // Hex encoded payload
        signature: "signature" // Signature of the transaction,
    };  
    return {
         hash: function(str){
            var blake = require('blakejs')
            return blake.blake2bHex(str)
            },
         tx_pow: function(str){
            var blake = require('blakejs')
            // random nonce
            for(nonce_attempt=0;nonce_attempt<1000000000;nonce_attempt++){
                var nonce_attempt = Math.floor(Math.random() * 100000);
                var hash = blake.blake2bHex(str+nonce_attempt)
                if(hash.substring(0,4)=="0000"){
                    return hash,nonce_attempt
                }
            }
        },
        tx_get_bytes: function(tx){
            let out = []
            for(i=0;i<tx.length;i++){
                console.log(tx[i])
                let bytesize = Buffer.byteLength(tx.key)
                out.push(bytesize)
            }
            return out
        },
         tx_hash: function(transaction){
            var blake = require('blakejs')
            // First we calculate the bytes of the object being passed to us
            // Then we hash the bytes
            let beforeBuffer = Redstone.tx_get_bytes(transaction)
            let buffer = Buffer.from(beforeBuffer)
            let hash = blake.blake2bHex(buffer)
            // Then we return the hash
            return hash
        },
         keypair_create: function(){
            //extract the necessary usage keys
            const { randomBytes } = require('crypto')
            const secp256k1 = require('secp256k1')
            //   if you want to use pure js implementation in node
            // generate message to sign
            const msg = randomBytes(32)
            // generate privKey
            let privKey
            do {
              privKey = randomBytes(32)
            } while (!secp256k1.privateKeyVerify(privKey))
             
            // get the public key in a compressed format
            const pubKey = secp256k1.publicKeyCreate(privKey)
            // pub key from buffer to hex
            const pubKeyHex = Buffer.from(pubKey).toString('hex')
            let keypair = {
                pub: pubKeyHex,
                priv: privKey.toString('hex')
            }
            // sign the message
             
            // verify the signature
            return keypair;
         },
         pubkey_to_address: function(pubkey){
            var blake = require('blakejs')
            pubkey = Buffer.from(pubkey, 'hex')
            let addr = '0x' + blake.blake2bHex(pubkey)
            addr = addr.substring(0, 42)
            return addr;
         },
         import_private_key: function(privKey){
            const { randomBytes } = require('crypto')
            const secp256k1 = require('secp256k1')
            // revert privkey from hex to buffer
            const privKeyBuffer = Buffer.from(privKey, 'hex')
            const pubKey = secp256k1.publicKeyCreate(privKeyBuffer)
            const pubKeyHex = Buffer.from(pubKey).toString('hex')

            let keypair = {
                pub: pubKeyHex,
                priv: privKey
            }
            return keypair;
         },
         sign: function(msg, privKey){
            const secp256k1 = require('secp256k1')
            const privKeyBuffer = Buffer.from(privKey, 'hex')
            const msgBuffer = Buffer.from(msg, 'hex')
            // make msgBuffer Uint8array 32 bytes 
            const msgUint8Array = new Uint8Array(32)
            for (let i = 0; i < msgUint8Array.byteLength; i++) {
                msgUint8Array[i] = msgBuffer[i]
            }
            const sigObj = secp256k1.ecdsaSign(msgUint8Array, privKeyBuffer)
            const sigHex1 = sigObj.signature
            const sigHex = Buffer.from(sigHex1).toString('hex')
            return sigHex;
        },
        verify : function(msg, sigObj, pubKey){
            const secp256k1 = require('secp256k1')
            const msgBuffer = Buffer.from(msg, 'hex')
            const sigBuffer = Buffer.from(sigObj, 'hex')
            const pubKeyBuffer = Buffer.from(pubKey, 'hex')
            // make buffer uint8 array 64 length
            const sig = new Uint8Array(64);
            for (let i = 0; i < 64; i++) {
              sig[i] = sigBuffer[i]
            }
            console.log(sig)
            const result = secp256k1.ecdsaVerify(msgBuffer, sig, pubKeyBuffer)
            return result;
            // todo
        },
        generateWallet: function(){
            let keypair = Redstone.keypair_create()
            let address = Redstone.pubkey_to_address(keypair.pub)
            let wallet = {
                address: address,
                privKey: keypair.priv,
                pubKey: keypair.pub
            }
            return wallet;
        },
         test: function(){
            console.log(Redstone.hash("test"))
            let keypair = Redstone.keypair_create();
            let keypair2 = Redstone.import_private_key(keypair.priv)
            if (keypair.pub == keypair2.pub){
                console.log("keypair import success")
                console.log(keypair2)
                console.log("address:"+Redstone.pubkey_to_address(keypair2.pub))
            } else {
                console.log("keypair import failed")
            }
            let keypair3 = Redstone.import_private_key("5f94c10a0091a3f59cc3566ff479d0a84dba5fe5a47f126b045653800a83942c")
            let addr = Redstone.pubkey_to_address(keypair3.pub)
            console.log("=========================== TRANSACTION TEST ===========================")
            let dummy_tx = {
                sender: "0x5f94c10a0091a3f59cc3566ff479d0a84dba5fe5a47f126b045653800a83942c",
                reciver: "0x5f94c10a0091a3f59cc3566ff479d0a84dba5fe5a47f126b045653800a83942c",
                amount: "1",
                nonce: "0",
                type_flag: "0",
                payload: "0",
                pow: "0",
                signature: "0"
            }
            let bytes = Redstone.tx_get_bytes(dummy_tx)
            console.log("bytes: " + bytes)
            let hash = Redstone.tx_hash(dummy_tx)
            console.log("hash: " + hash)
            console.log("=========================== SIGNATURE TEST ===========================")
            const { randomBytes } = require('crypto')
            const secp256k1 = require('secp256k1')
            let privKey
            do {
            privKey = randomBytes(32)
            } while (!secp256k1.privateKeyVerify(privKey))
            const msgHex = Buffer.from(randomBytes(32)).toString('hex')
            const prvHex = Buffer.from(privKey).toString('hex')
            const sigObj = Redstone.sign(msgHex, prvHex)
            console.log("signature: " + sigObj)
            console.log("=========================== SIMPLE WALLET EXAMPLE ===========================")
            let wallet = Redstone.generateWallet()
            // fancy console output
            console.log("address: " + wallet.address)
            console.log("private key: " + wallet.privKey)
            console.log("public key: " + wallet.pubKey)

        },
       send: function(
           url,
           sender,
           reciver,
           amount,
           payload,
           nonce,
           privateKey
       ){
        let Transaction = {
            hash: "",
            sender: sender,
            reciver: reciver,
            amount: amount,
            nonce: nonce, // todo add api for getaccount nonce and add 1
            payload: payload,
            type_flag: 0,
            signature: "signature" 
        };  
        let hash = Redstone.tx_hash(Transaction)
        Transaction.hash = hash
        let signature = Redstone.sign(hash, Buffer.from(privateKey, 'hex'))
        Transaction.signature = signature
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.responseText);
        }};
        xhr.send(Transaction);
       }
    }
})
();
module.exports = Redstone;
