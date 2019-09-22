package main

import (
	"fmt"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
)

const CHAINCODE_NAME  = "cc_business" //安装链码时的名称
const CHANNEL_NAME  = "mychannel"//通道名称

type SmartContract struct {
}


func (t *SmartContract) Init(stub shim.ChaincodeStubInterface) peer.Response{

	return shim.Success(nil)
}

func (t *SmartContract) Invoke(stub shim.ChaincodeStubInterface) peer.Response{
	// 获取用户意图

	args := stub.GetStringArgs();
	if len(args) < 1{
		return shim.Error("给定的参数个数不符合要求")
	}

	if args[0] == "getValue" {
		return invokeOtherChainCode(stub, args)  // 查询最新信息
	}else if args[0] == "getHistory" {
		return invokeOtherChainCode(stub, args)  // 查询历史信息
	}

	return shim.Error("指定的函数名称错误")

}

func invokeOtherChainCode (stub shim.ChaincodeStubInterface, args []string) peer.Response{
	bargs := make([][]byte, len(args))
	for i, arg := range args {
		bargs[i] = []byte(arg)
	}
	return stub.InvokeChaincode(CHAINCODE_NAME, bargs, CHANNEL_NAME);
}


func main(){
	err := shim.Start(new(SmartContract))
	if err != nil{
		fmt.Printf("启动EducationChaincode时发生错误: %s", err)
	}
}