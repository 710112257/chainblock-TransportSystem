package main

import (
	"github.com/hyperledger/fabric/core/chaincode/shim"
	"fmt"
	"github.com/hyperledger/fabric/protos/peer"
)

type SmartContract struct {
}

func (t *SmartContract) Init(stub shim.ChaincodeStubInterface) peer.Response {
	return shim.Success([]byte("实例化完成..."))
}
func (t *SmartContract) Invoke(stub shim.ChaincodeStubInterface) peer.Response {
	// 获得要调用的函数和参数
	function, args := stub.GetFunctionAndParameters()
	// 路由到指定的处理函数
	if function == "putValue" {
		return t.PutValue(stub, args)
	} else if function == "getValue" {
		return t.GetValue(stub, args)
	} else if function == "getHistory" {
		return t.GetHistory(stub, args)
	} else if function == "upDate" {
		return t.UpDate(stub, args)
	} else if function == "delDate" {
		return t.DelDate(stub, args)
	} 

	return shim.Error("无效的合约函数名.")
}

func main() {

	// 创建智能合约
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}