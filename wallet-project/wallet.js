const fs = require('fs');
const path = require('path');
const { Wallets } = require('fabric-network');

const CRYPTO_CONFIG = path.resolve(__dirname, '../config/crypto-config');
const CRYPTO_CONFIG_PEER_ORGS = path.join(CRYPTO_CONFIG, 'peerOrganizations');

const WALLET_FOLDER = './wallet';
var wallet;

main();

async function main() {
    let action = 'list';
    if (process.argv.length > 2) {
        action = process.argv[2];
    } else {
        console.log(
            `Usage: node wallet.js list 
        node wallet.js add govt Admin) 
        Not enough arguments.`
        );
        return;
    }
    console.log('Crypto config peer orgs path:', CRYPTO_CONFIG_PEER_ORGS);

    wallet = await Wallets.newFileSystemWallet(WALLET_FOLDER);

    console.log('Args length:', process.argv.length);
    if (action == 'list') {
        console.log('List of identities in wallet:');
        await listIdentities();
    } else if (action == 'add' || action == 'export') {
        if (process.argv.length < 5) {
            console.log("For 'add' & 'export' - Org & User are needed!!!");
            process.exit(1);
        }
        if (action == 'add') {
            await addToWallet(process.argv[3], process.argv[4]);
            console.log('Done adding/updating.');
        } else {
            await exportIdentity(process.argv[3], process.argv[4]);
        }
    }
}

async function addToWallet(org, user) {
    try {
        console.log('Reading certificate...');
        var cert = readCertCryptogen(org, user);
        console.log('Certificate read successfully.');

        console.log('Reading private key...');
        var key = readPrivateKeyCryptogen(org, user);
        console.log('Private key read successfully.');
    } catch (e) {
        console.error('Error reading certificate or key:', e);
        console.log(`Error reading certificate or key!!! ${org}/${user}`);
        process.exit(1);
    }

    let mspId = createMSPId(org);
    const identityLabel = createIdentityLabel(org, user);

    const userIdentity = await wallet.get(identityLabel);
    if (userIdentity) {
        console.log(`An identity for the user "${identityLabel}" already exists in the wallet`);
        return;
    }

    const identity = {
        credentials: {
            certificate: cert,
            privateKey: key,
        },
        mspId: mspId,
        type: 'X.509',
    };

    await wallet.put(identityLabel, identity);
    console.log(`Successfully added user "${identityLabel}" to the wallet`);
}

async function listIdentities() {
    console.log('Identities in Wallet:');
    const identities = await wallet.list();

    // Debug: print raw identities array
    console.log('Wallet identities raw:', identities);

    if (identities.length === 0) {
        console.log('No identities found in wallet.');
        return;
    }

    for (const identity of identities) {
        if (identity.label) {
            console.log(`user: ${identity.label}`);
        } else if (identity.id) {
            console.log(`user: ${identity.id}`);
        } else {
            console.log('user: (unknown identity format)', identity);
        }
    }
}

async function exportIdentity(org, user) {
    let label = createIdentityLabel(org, user);
    let identity = await wallet.export(label);
    if (identity == null) {
        console.log(`Identity ${user} for ${org} Org Not found!!!`);
    } else {
        console.log(identity);
    }
}

function readCertCryptogen(org, user) {
    var certPath =
        CRYPTO_CONFIG_PEER_ORGS +
        '/' +
        org +
        '.tera.bt/users/' +
        user +
        '@' +
        org +
        '.tera.bt/msp/signcerts/' +
        user +
        '@' +
        org +
        '.tera.bt-cert.pem';

    console.log('Certificate path:', certPath);

    if (!fs.existsSync(certPath)) {
        throw new Error(`Certificate file not found at ${certPath}`);
    }

    const cert = fs.readFileSync(certPath).toString();
    return cert;
}

function readPrivateKeyCryptogen(org, user) {
    var pkFolder =
        CRYPTO_CONFIG_PEER_ORGS +
        '/' +
        org +
        '.tera.bt/users/' +
        user +
        '@' +
        org +
        '.tera.bt/msp/keystore';

    console.log('Private key directory:', pkFolder);

    if (!fs.existsSync(pkFolder)) {
        throw new Error(`Private key directory not found at ${pkFolder}`);
    }

    const keyFiles = fs.readdirSync(pkFolder);
    if (keyFiles.length === 0) {
        throw new Error('No key files found in keystore');
    }

    console.log('Key files found:', keyFiles);

    // Read first key file
    const keyPath = path.join(pkFolder, keyFiles[0]);
    console.log('Private key path:', keyPath);

    if (!fs.existsSync(keyPath)) {
        throw new Error(`Private key file not found at ${keyPath}`);
    }

    const privateKey = fs.readFileSync(keyPath).toString();
    return privateKey;
}

function createMSPId(org) {
    return org.charAt(0).toUpperCase() + org.slice(1) + 'MSP';
}

function createIdentityLabel(org, user) {
    return user + '@' + org + '.tera.bt';
}
