const crypto = require('crypto');

class BlockchainVerification {
  constructor() {
    this.chain = [];
    this.createGenesisBlock();
  }

  createGenesisBlock() {
    const genesisBlock = {
      index: 0,
      timestamp: Date.now(),
      data: 'Genesis Block - Disaster Verification System',
      previousHash: '0',
      hash: this.calculateHash(0, Date.now(), 'Genesis Block', '0')
    };
    this.chain.push(genesisBlock);
  }

  calculateHash(index, timestamp, data, previousHash) {
    return crypto.createHash('sha256')
      .update(index + timestamp + JSON.stringify(data) + previousHash)
      .digest('hex');
  }

  addDisasterBlock(disasterData) {
    const previousBlock = this.chain[this.chain.length - 1];
    const newBlock = {
      index: previousBlock.index + 1,
      timestamp: Date.now(),
      data: {
        reportId: disasterData.reportId,
        type: disasterData.type,
        location: disasterData.location,
        verifiedBy: disasterData.verifiedBy,
        imageHashes: disasterData.imageHashes
      },
      previousHash: previousBlock.hash
    };
    
    newBlock.hash = this.calculateHash(
      newBlock.index,
      newBlock.timestamp,
      newBlock.data,
      newBlock.previousHash
    );
    
    this.chain.push(newBlock);
    return newBlock;
  }

  verifyChain() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];
      
      if (currentBlock.hash !== this.calculateHash(
        currentBlock.index,
        currentBlock.timestamp,
        currentBlock.data,
        currentBlock.previousHash
      )) {
        return false;
      }
      
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

module.exports = new BlockchainVerification();