package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type TeraLandContract struct {
	contractapi.Contract
}

type Land struct {
	ID            string `json:"id"`
	Owner         string `json:"owner"`
	Location      string `json:"location"`
	Size          string `json:"size"`
	Price         int    `json:"price"`
	ForSale       bool   `json:"forSale"`
}

func (t *TeraLandContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	return nil
}

// List a new land
func (t *TeraLandContract) ListLand(ctx contractapi.TransactionContextInterface, id, location, size string, price int) error {
	exists, err := t.LandExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("land with ID %s already exists", id)
	}

	clientID, err := t.GetClientID(ctx)
	if err != nil {
		return err
	}

	land := Land{
		ID:       id,
		Owner:    clientID,
		Location: location,
		Size:     size,
		Price:    price,
		ForSale:  true,
	}

	landJSON, err := json.Marshal(land)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, landJSON)
}

// Mark land for sale
func (t *TeraLandContract) SellLand(ctx contractapi.TransactionContextInterface, id string, price int) error {
	land, err := t.ReadLand(ctx, id)
	if err != nil {
		return err
	}

	clientID, err := t.GetClientID(ctx)
	if err != nil {
		return err
	}
	if land.Owner != clientID {
		return fmt.Errorf("only the owner can sell the land")
	}

	land.Price = price
	land.ForSale = true

	updatedJSON, err := json.Marshal(land)
	if err != nil {
		return err
	}
	return ctx.GetStub().PutState(id, updatedJSON)
}

// Buy land if it is listed
func (t *TeraLandContract) BuyLand(ctx contractapi.TransactionContextInterface, id string) error {
	land, err := t.ReadLand(ctx, id)
	if err != nil {
		return err
	}
	if !land.ForSale {
		return fmt.Errorf("land %s is not for sale", id)
	}

	buyerID, err := t.GetClientID(ctx)
	if err != nil {
		return err
	}
	if land.Owner == buyerID {
		return fmt.Errorf("owner cannot buy their own land")
	}

	land.Owner = buyerID
	land.ForSale = false

	landJSON, err := json.Marshal(land)
	if err != nil {
		return err
	}
	return ctx.GetStub().PutState(id, landJSON)
}

// Transfer land to another user directly
func (t *TeraLandContract) TransferLandOwnership(ctx contractapi.TransactionContextInterface, id, newOwner string) error {
	land, err := t.ReadLand(ctx, id)
	if err != nil {
		return err
	}

	clientID, err := t.GetClientID(ctx)
	if err != nil {
		return err
	}
	if land.Owner != clientID {
		return fmt.Errorf("only the owner can transfer the land")
	}

	land.Owner = newOwner
	land.ForSale = false

	landJSON, err := json.Marshal(land)
	if err != nil {
		return err
	}
	return ctx.GetStub().PutState(id, landJSON)
}

// Read land
func (t *TeraLandContract) ReadLand(ctx contractapi.TransactionContextInterface, id string) (*Land, error) {
	landJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if landJSON == nil {
		return nil, fmt.Errorf("land %s does not exist", id)
	}

	var land Land
	err = json.Unmarshal(landJSON, &land)
	if err != nil {
		return nil, err
	}
	return &land, nil
}

// Check if land exists
func (t *TeraLandContract) LandExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	landJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, err
	}
	return landJSON != nil, nil
}

// Get client ID
func (t *TeraLandContract) GetClientID(ctx contractapi.TransactionContextInterface) (string, error) {
	return ctx.GetClientIdentity().GetID()
}

func main() {
	chaincode, err := contractapi.NewChaincode(&TeraLandContract{})
	if err != nil {
		panic(fmt.Sprintf("Error creating chaincode: %v", err))
	}
	if err := chaincode.Start(); err != nil {
		panic(fmt.Sprintf("Error starting chaincode: %v", err))
	}
}
