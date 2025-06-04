const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const connectionProfilePath = path.resolve(__dirname, 'connection.json');
const walletPath = path.resolve(__dirname, 'wallet');

const channelName = 'teralandchannel';
const chaincodeName = 'teralandregistry';

// Identities
const identities = {
  govt: 'Admin@govt.tera.bt',
  buyers: 'buyer1@buyers.tera.bt',
  sellers: 'seller1@sellers.tera.bt'
};

// Test data
const testLand = {
  id: 'land123',
  location: 'Mongar, Bhutan',
  size: '500sqm',
  price: '10000', // string type for chaincode args
};

async function main() {
  try {
    // Load connection profile
    if (!fs.existsSync(connectionProfilePath)) {
      console.error(`Connection profile not found at ${connectionProfilePath}`);
      return;
    }
    const connectionProfile = JSON.parse(fs.readFileSync(connectionProfilePath, 'utf8'));

    // Load wallet
    if (!fs.existsSync(walletPath)) {
      console.error(`Wallet directory not found at ${walletPath}`);
      return;
    }
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Verify identities exist
    for (const id of Object.values(identities)) {
      if (!(await wallet.get(id))) {
        console.error(`Identity ${id} missing in wallet`);
        return;
      }
    }

    console.log('=== Starting Tera Land Registry Tests ===');

    // 1. Seller lists the land
    await submitTransaction(connectionProfile, wallet, identities.sellers, 'ListLand', [
      testLand.id,
      testLand.location,
      testLand.size,
      testLand.price,
    ], 'Seller should list a new land');

    // 2. Seller puts land for sale
    await submitTransaction(connectionProfile, wallet, identities.sellers, 'SellLand', [
      testLand.id,
      testLand.price,
    ], 'Seller should mark land for sale');

    // 3. Buyer buys the land
    await submitTransaction(connectionProfile, wallet, identities.buyers, 'BuyLand', [
      testLand.id,
    ], 'Buyer should buy land');

    // 4. Govt approves the transaction
    await submitTransaction(connectionProfile, wallet, identities.govt, 'ApproveTransaction', [
      testLand.id,
    ], 'Govt should approve transaction');

    // 5. Query land info as buyer
    await queryLand(connectionProfile, wallet, identities.buyers, testLand.id);

    console.log('\n=== All tests completed successfully ===');

  } catch (error) {
    console.error(`Test run failed: ${error}`);
    process.exit(1);
  }
}

async function submitTransaction(connectionProfile, wallet, identity, func, args, testName) {
  console.log(`\n--- ${testName} ---`);
  const gateway = new Gateway();
  try {
    await gateway.connect(connectionProfile, {
      wallet,
      identity,
      discovery: { enabled: false, asLocalhost: true },
    });

    const network = await gateway.getNetwork(channelName);
    const contract = network.getContract(chaincodeName);

    await contract.submitTransaction(func, ...args);
    console.log(`✓ ${identity} successfully executed ${func} with args: ${args.join(', ')}`);

  } catch (error) {
    console.error(`✗ ${identity} failed to execute ${func}: ${error.message}`);
  } finally {
    gateway.disconnect();
  }
}

async function queryLand(connectionProfile, wallet, identity, landId) {
  console.log('\n--- Query Land Info ---');
  const gateway = new Gateway();
  try {
    await gateway.connect(connectionProfile, {
      wallet,
      identity,
      discovery: { enabled: false, asLocalhost: true },
    });

    const network = await gateway.getNetwork(channelName);
    const contract = network.getContract(chaincodeName);

    const resultBuffer = await contract.evaluateTransaction('ReadLand', landId);
    const land = JSON.parse(resultBuffer.toString());

    console.log('✓ Land details:', JSON.stringify(land, null, 2));
  } catch (error) {
    console.error(`✗ Failed to query land: ${error.message}`);
  } finally {
    gateway.disconnect();
  }
}

main();
