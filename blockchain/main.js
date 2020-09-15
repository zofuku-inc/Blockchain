const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class Blockchain {
    constructor(){
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock(){
        return new Block(0, "10/01/2020", "Genesis block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length -1]
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid(){
        for (let i = 1; i < this.chain.length; i ++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if (currentBlock.hash != currentBlock.calculateHash()){
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }

        return true;
    }
}

let myCoin = new Blockchain();
myCoin.addBlock(new Block(1, "10/01/2020", {place_number: "1213-234234-234234", usage: 789}));
myCoin.addBlock(new Block(1, "10/01/2020", {place_number: "1213-23asdad234-234234", usage: 789}));

console.log('is Blockchain valid', myCoin.isChainValid())

myCoin.chain[1].data = { place_number: "1213-234234-234234", usage: 709}

console.log('is Blockchain valid', myCoin.isChainValid())

//console.log(JSON.stringify(myCoin, null, 4));