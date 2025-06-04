#!/bin/bash
#Sets the context for native peer commands

export ORG_CONTEXT=sellers
MSP_ID="$(tr '[:lower:]' '[:upper:]' <<< ${ORG_CONTEXT:0:1})${ORG_CONTEXT:1}"
export ORG_NAME=$MSP_ID

# Added this Oct 22
export CORE_PEER_LOCALMSPID="SellersMSP"

# Logging specifications
export FABRIC_LOGGING_SPEC=INFO

# Location of the core.yaml
export FABRIC_CFG_PATH=/workspaces/config/seller

# Address of the peer
export CORE_PEER_ADDRESS=teraconsortium-sellers:7051

# Local MSP for the admin - Commands need to be executed as org admin
export CORE_PEER_MSPCONFIGPATH=/workspaces/config/crypto-config/peerOrganizations/sellers.tera.bt/users/Admin@sellers.tera.bt/msp

# Address of the orderer
export ORDERER_ADDRESS=orderer.tera.bt:7050

export CORE_PEER_TLS_ENABLED=false

#### Chaincode related properties 
export CC_NAME="tera-landregistry" 
export CC_PATH="/workspaces/chaincodes/tera-landregistry/" 
export CC_CHANNEL_ID="teraconsortiumchannel" 
export CC_LANGUAGE="golang" 

# Properties of Chaincode 
export INTERNAL_DEV_VERSION="1.1"
export CC_VERSION="1.0"
export CC2_PACKAGE_FOLDER="/workspaces/chaincodes/packages/"
export CC2_SEQUENCE=1
export CC2_INIT_REQUIRED="--init-required"

# Create the package with this name 
export CC_PACKAGE_FILE="$CC2_PACKAGE_FOLDER$CC_NAME.$CC_VERSION-$INTERNAL_DEV_VERSION.tar.gz" 

# Extracts the package ID for the installed chaincode 
export CC_LABEL="$CC_NAME.$CC_VERSION-$INTERNAL_DEV_VERSION"

peer channel list 