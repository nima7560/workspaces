import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import contactRoutes from "./routes/contactRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import govtLandRoutes from "./routes/govtLandRoutes.js"; // Corrected import for govtLandRoutes
import transactionRoutes from "./routes/transactionRoutes.js"; // Import transactionRoutes
import { Gateway, Wallets } from 'fabric-network';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// CORS options
const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
};

// Use CORS with correct options
app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/govtland", govtLandRoutes);
app.use("/api/transactions", transactionRoutes);

// Setup __dirname for ES modules (for Fabric)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files (if needed for legacy/public)
app.use(express.static(path.join(__dirname, 'public')));

// --- Hyperledger Fabric Land Registry Endpoints ---

// Land listing endpoint
app.post('/lands', async (req, res) => {
  try {
    const { id, location, size, price, ownerIdentity } = req.body;
    if (!ownerIdentity) {
      return res.status(400).send("ownerIdentity is required");
    }
    const result = await submitTransactionAs(ownerIdentity, 'ListLand', id, location, size, price.toString());
    res.status(201).send(result);
  } catch (error) {
    console.error(`Failed to list land: ${error}`);
    res.status(500).send(`Failed to list land: ${error}`);
  }
});

// Get land details endpoint
app.get('/lands/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await evaluateTransaction('ReadLand', id);
    res.status(200).json(JSON.parse(result));
  } catch (error) {
    console.error(`Failed to read land: ${error}`);
    res.status(404).send(`Failed to read land: ${error}`);
  }
});

// Mark land for sale endpoint
app.put('/lands/:id/sell', async (req, res) => {
  try {
    const { id } = req.params;
    const { price, ownerIdentity } = req.body;
    if (!ownerIdentity) {
      return res.status(400).send("ownerIdentity is required");
    }
    const result = await submitTransactionAs(ownerIdentity, 'SellLand', id, price.toString());
    res.status(200).send(result);
  } catch (error) {
    console.error(`Failed to mark land for sale: ${error}`);
    res.status(500).send(`Failed to mark land for sale: ${error}`);
  }
});

// Buy land endpoint
app.post('/lands/:id/buy', async (req, res) => {
  try {
    const { id } = req.params;
    const { buyerIdentity } = req.body;
    if (!buyerIdentity) {
      return res.status(400).send("buyerIdentity is required");
    }
    const result = await submitTransactionAs(buyerIdentity, 'BuyLand', id);
    res.status(200).send(result);
  } catch (error) {
    console.error(`Failed to buy land: ${error}`);
    res.status(500).send(`Failed to buy land: ${error}`);
  }
});

// Transfer land ownership endpoint
app.put('/lands/:id/transfer', async (req, res) => {
  try {
    const { id } = req.params;
    const { newOwner } = req.body;
    const result = await submitTransaction('TransferLandOwnership', id, newOwner);
    res.status(200).send(result);
  } catch (error) {
    console.error(`Failed to transfer land ownership: ${error}`);
    res.status(500).send(`Failed to transfer land ownership: ${error}`);
  }
});

// Health check endpoint for Fabric API
app.get('/fabric-health', (req, res) => {
  res.send('TeraLand Fabric API is running');
});

// --- Hyperledger Fabric Helper Functions ---
async function getContract() {
  const walletPath = path.join(process.cwd(), 'wallet');
  const wallet = await Wallets.newFileSystemWallet(walletPath);
  const identity = await wallet.get('Admin@govt.tera.bt');

  if (!identity) {
    throw new Error('Identity not found in wallet');
  }

  const gateway = new Gateway();
  const connectionProfile = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'connection.json'), 'utf8'));
  const connectionOptions = { 
    wallet, 
    identity: identity, 
    discovery: { enabled: false, asLocalhost: true } 
  };

  await gateway.connect(connectionProfile, connectionOptions);
  const network = await gateway.getNetwork('teraconsortiumchannel');
  const contract = network.getContract('tera-landregistry');
  return contract;
}

async function submitTransaction(functionName, ...args) {
  const contract = await getContract();
  const result = await contract.submitTransaction(functionName, ...args);
  return result.toString();
}

async function submitTransactionAs(identityLabel, functionName, ...args) {
  const walletPath = path.join(process.cwd(), 'wallet');
  const wallet = await Wallets.newFileSystemWallet(walletPath);
  const identity = await wallet.get(identityLabel);
  if (!identity) {
    throw new Error(`Identity ${identityLabel} not found in wallet`);
  }
  const gateway = new Gateway();
  const connectionProfile = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'connection.json'), 'utf8'));
  const connectionOptions = {
    wallet,
    identity: identityLabel,
    discovery: { enabled: false, asLocalhost: true }
  };
  await gateway.connect(connectionProfile, connectionOptions);
  const network = await gateway.getNetwork('teraconsortiumchannel');
  const contract = network.getContract('tera-landregistry');
  const result = await contract.submitTransaction(functionName, ...args);
  await gateway.disconnect();
  return result.toString();
}

async function evaluateTransaction(functionName, ...args) {
  const contract = await getContract();
  const result = await contract.evaluateTransaction(functionName, ...args);
  return result.toString();
}

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({ message: err.message });
});

export default app;