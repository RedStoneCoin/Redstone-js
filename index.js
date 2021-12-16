export var Redstone = Redstone||(function () {
    var privateArray=[];
    //Cannot be called from outside this function

    return {
       test: function(){
              console.log("test from redstone-js");  
              const b2b = require('./blake2b.cjs')
              console.log(blake.blake2bHex('abc'))
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