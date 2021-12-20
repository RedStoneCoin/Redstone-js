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
         test: function(){
            console.log("test")
            console.log(Redstone.hash("test"))
            let keypair = Redstone.keypair_create();
            console.log(keypair)
            let keypair2 = Redstone.import_private_key(keypair.priv)
            if (keypair.pub == keypair2.pub){
                console.log("keypair import success")
                console.log(keypair2)
            }
            let keypair3 = Redstone.import_private_key("5f94c10a0091a3f59cc3566ff479d0a84dba5fe5a47f126b045653800a83942c")
            let addr = Redstone.pubkey_to_address(keypair3.pub)
            console.log(keypair3)
            console.log(addr)

            // check import
            
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
            type_flag: type_flag,
            payload: payload, // Hex encoded payload
            pow: pow, // Spam protection PoW
            signature: "signature" // Signature of the transaction,
        };  
        Transaction.hash = blake2s.digest(Transaction);
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