 var Redstone = Redstone||(function () {
    var privateArray=[];
    //Cannot be called from outside this function
    return {
         hash: function(str){
            var blake = require('blakejs')
            return blake.blake2bHex(str)
            },
         keypair_create: function(){
            const crypto = require('crypto')
            const assert = require('assert')
            const Secp256k1 = require('@enumatech/secp256k1-js')
            
            // Generating private key
            const privateKeyBuf = crypto.randomBytes(32)
            const privateKey = Secp256k1.uint256(privateKeyBuf, 16)
            
            // Generating public key
            const publicKey = Secp256k1.generatePublicKeyFromPrivateKeyData(privateKey)
            const pubX = Secp256k1.uint256(publicKey.x, 16)
            const pubY = Secp256k1.uint256(publicKey.y, 16)
            console.log("public key: ", publicKey, "Private key: ", privateKey)
         },
         test: function(){
            console.log("test")
            console.log(Redstone.hash("test"))
            Redstone.keypair_create()
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