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
HASH = ***BLAKE 2***
- Url must be redstone node json api
- Sender is senders ***PUBLIC KEY*** not address
- reciver is recivers ***ADDRESS***
- amount is int amount
- type_flag is allways 0 for send
- payload = hex encoded payload
- nonce = number in transaction that is hashed with transaction and hash starts with 4 zeros there pow
- pow = hash
- hash = hash
- signature = signature

How to generate address?
Rust example:
```rust
        format!(
            "0x{}",hash(hex::decode(&self.public_key).unwrap())[..40].to_string()
        )
```
How to generate POW?
Rust example:
```rust
        let mut rng = rand::thread_rng(); // rand generator
        for nonce_attempt in 0..=u64::MAX { 
            let nonce_attempt = rng.gen::<u64>(); // nonce attempt to be random
            self.nonce = nonce_attempt; // nonce = txc nonce
            let pow = self.hash_item(); // pow = hash transaction
            if pow.starts_with("0000") // if hash starts with '0000'
            {
                self.pow = self.hash_item();  // we found it pow = out hash
                self.hash = self.hash_item(); // our hash = hash
                self.nonce = nonce_attempt; // our nonce = nonce attempt
                println!("Found solution for , nonce {}, hash {}, hash value {}",self.nonce,self.hash,pow);
                break; // break loop
            }
            
        }
```
We use public key as sender becouse to verfy signature and ite easy to get address from public key.
