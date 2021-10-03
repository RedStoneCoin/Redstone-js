import JSBlake2s from "js-blake2s";
var Redstone=Redstone||(function () {
    const blake2s = new JSBlake2s();
    //Accessible only here
    var privateArray=[];
 
    //Cannot be called from outside this function
    var privateFunction=function(){
    }
 
    //Return only what must be publicly accessible, in this
    //case only the show() method
    return {
       send: function(
           url,
           sender,
           reciver,
           amount,
           type_flag,
           payload,
           nonce,
           pow,
           signature
           //hash
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
            signature: signature // Signature of the transaction,
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