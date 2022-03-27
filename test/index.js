const Redstone = require('redstonecrypto-js')

// craete wallet 
const wallet = Redstone.generateWallet();
console.log(Redstone)
console.log("=========================== REDSTONE JS WALLET ===========================")
console.log("= address: " + wallet.address + "                                         ")
console.log("= private key: " + wallet.privKey + "                                     ")
console.log("= public key: " + wallet.pubKey + "                                       ")
console.log("==========================================================================")


// create transaction
const tx = {
    url: "http://localhost:3000",
    sender: wallet.pubKey,
    reciver: wallet.address,
    amount: 1,
    payload: 'none',
    nonce: 0,
    privateKey: wallet.privKey
}

console.log("=========================== REDSTONE JS TRANSACTION ===========================")
console.log("= sender: " + tx.sender + "                                                 ")
console.log("= reciver: " + tx.reciver + "                                               ")
console.log("= amount: " + tx.amount + "                                                 ")
console.log("= payload: " + tx.payload + "                                               ")
console.log("= nonce: " + tx.nonce + "                                                   ")
console.log("= privateKey: " + tx.privateKey + "                                         ")
console.log("==========================================================================")
Redstone.send(tx.url, tx.sender, tx.reciver, tx.amount, tx.payload, tx.nonce, tx.privateKey)