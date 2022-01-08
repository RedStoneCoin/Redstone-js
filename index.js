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
        pow: "pow", // Spam protection PoW
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
            for(key in tx){
                let bytesize = Buffer.byteLength(tx[key]) 
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
            let keypair = {
                pub: pubKey.toString('hex'),
                priv: privKey.toString('hex')
            }
            // sign the message
            const sigObj = secp256k1.sign(msg, privKey)
             
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
            let keypair = {
                pub: pubKey.toString('hex'),
                priv: privKey
            }
            return keypair;
         },
         sign: function(msg, privKey){
            const { randomBytes } = require('crypto')
            const secp256k1 = require('secp256k1')
            const sigObj = secp256k1.ecdsaSign(msg, privKey)

            return sigObj;
            },
         test: function(){
            console.log(Redstone.hash("test"))
            let keypair = Redstone.keypair_create();
            let keypair2 = Redstone.import_private_key(keypair.priv)
            if (keypair.pub == keypair2.pub){
                console.log("keypair import success")
                console.log(keypair2)
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
            let hash = Redstone.tx_hash(dummy_tx) // hash done maybe?
            console.log("hash: " + hash)
            console.log("=========================== SIGNATURE TEST ===========================")
            console.log(keypair3.priv)
            let sign_hash = Redstone.sign(keypair3.priv, hash)
            console.log("sign_hash: " + sign_hash)
        },
       send: function(
           url,
           sender,
           reciver,
           amount,
           type_flag,
           payload,
           nonce,
           pow,
           privateKey
       ){
        let Transaction = {
            hash: "",
            sender: sender,
            reciver: reciver,
            amount: amount,
            nonce: nonce,
            type_flag: 0,
            payload: payload, // Hex encoded payload
            pow: pow, // Spam protection PoW
            signature: "signature" // Signature of the transaction,
        };  
        let bytes = Redstone.tx_get_bytes(dummy_tx)
        console.log("bytes: " + bytes)
        let hash = Redstone.tx_hash(dummy_tx) // hash done maybe?
        console.log("hash: " + hash)
        let keypair = Redstone.import_private_key(privateKey)
        let signature = Redstone.sign(hash, keypair.priv)
        // make the transaction to json and send post req to url
        const options = {
            method: 'POST',
            body: JSON.stringify( Transaction )  
        };
        fetch(url, options )
        .then( response => response.json() )
        .then( response => {
            alert(response);
        } );
        // return the transaction
       }
    }
 })();
// test it
Redstone.test();