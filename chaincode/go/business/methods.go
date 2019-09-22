
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
	"time"
)

const DOC_TYPE = "eduObj"

func (t *SmartContract)PutValue(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 1 {
		return shim.Error("不正确的参数个数，必须是1个参数")
	}
	var msg MsgDate
	err := json.Unmarshal([]byte(args[0]), &msg)
	if err != nil {
		return shim.Error(err.Error()+"反序列化信息时发生错误:"+args[0])
	}

	// 查重: 证书编号必须唯一
	_, exist := GetMsgInfo(stub, msg.CertNo)
	if exist {
		return shim.Error("要添加的证书编号已存在")
	}

	_, bl := PutMsg(stub, msg)
	if !bl {
		return shim.Error("保存信息时发生错误")
	}

	err = stub.SetEvent("addMsg", []byte{})
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success([]byte("信息添加成功"))
}
func (t *SmartContract) UpDate(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 1{
		return shim.Error("给定的参数个数不符合要求")
	}

	var info MsgDate
	err := json.Unmarshal([]byte(args[0]), &info)
	if err != nil {
		return  shim.Error("反序列化edu信息失败")
	}

	// 根据证书编号查询信息
	msg, bl := GetMsgInfo(stub, info.CertNo)
	if !bl{
		return shim.Error("根据证书编号查询信息时发生错误")
	}

	msg.OperatorName=info.OperatorName
	msg.OperatorPhone=info.OperatorPhone
	msg.Photo=info.Photo
	msg.Type=info.Type
	msg.NowAddress=info.NowAddress

	_, bl = PutMsg(stub, msg)
	if !bl {
		return shim.Error("保存信息信息时发生错误")
	}

	err = stub.SetEvent("updateEdu", []byte{})
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success([]byte("信息更新成功"))
}
// 根据订单号删除信息（暂不对外提供）
// args: EntityId
func (t *SmartContract) DelDate(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 1{
		return shim.Error("给定的参数个数不符合要求")
	}

	err := stub.DelState(args[0])
	if err != nil {
		return shim.Error("删除信息时发生错误")
	}

	err = stub.SetEvent("eventDelEdu", []byte{})
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success([]byte("信息删除成功"))
}

//根据手机号追踪快递
func (t *SmartContract)GetValue(stub shim.ChaincodeStubInterface, args []string) peer.Response {

	if len(args) != 1 {
		return shim.Error("给定的参数个数不符合要求")
	}
	Receivephone := args[0]

	// 拼装CouchDB所需要的查询字符串(是标准的一个JSON串)
	// queryString := fmt.Sprintf("{\"selector\":{\"docType\":\"eduObj\", \"CertNo\":\"%s\"}}", CertNo)
	queryString := fmt.Sprintf("{\"selector\":{\"docType\":\"%s\", \"receivePhone\":\"%s\"}}", DOC_TYPE,Receivephone )


	// 查询数据
	result, err := getMsgByQueryString(stub, queryString)
	if err != nil {
		return shim.Error("根据手机号查询信息时发生错误")
	}
	if result == nil {
		return shim.Error("根据手机号没有查询到相关的信息")
	}
	return shim.Success(result)
}
func (t *SmartContract)GetHistory(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 1 {
		return shim.Error("给定的参数个数不符合要求")
	}

	// 获取历史变更数据
	iterator, err := stub.GetHistoryForKey(args[0])
	if err != nil {
		return shim.Error("根据指定的证书编号查询对应的历史变更数据失败")
	}
	defer iterator.Close()

	// 迭代处理
	var historys []HistoryItem
	var hisMsg MsgDate
	for iterator.HasNext() {
		hisData, err := iterator.Next()
		if err != nil {
			return shim.Error("获取edu的历史变更数据失败")
		}

		var historyItem HistoryItem
		historyItem.TxId = hisData.TxId
		tm := time.Unix(hisData.Timestamp.Seconds, 0);
		historyItem.TxTime = tm.Format("2006-01-02 03:04:05 PM") //交易发生的时间戳,转为毫秒
		json.Unmarshal(hisData.Value, &hisMsg)

		if hisData.Value == nil {
			var empty MsgDate
			historyItem.MsgDate = empty
		}else {
			historyItem.MsgDate = hisMsg
		}

		historys = append(historys, historyItem)

	}

	if len(historys) == 0 {
		return shim.Error("根据证书编号没有查询到相关的信息")
	}

	// 返回
	result, err := json.Marshal(historys)
	if err != nil {
		return shim.Error("序列化historys信息时发生错误")
	}
	return shim.Success(result)
}


func PutMsg(stub shim.ChaincodeStubInterface, msg MsgDate) ([]byte, bool) {

	msg.ObjectType = DOC_TYPE

	b, err := json.Marshal(msg)
	if err != nil {
		return nil, false
	}

	// 保存edu状态
	err = stub.PutState(msg.CertNo, b)
	if err != nil {
		return nil, false
	}

	return b, true
}
// 根据证书编号查询信息状态
// args: CertNo
func GetMsgInfo(stub shim.ChaincodeStubInterface, certNo string) (MsgDate, bool)  {
	var msg MsgDate
	// 根据证书编号查询信息状态
	b, err := stub.GetState(certNo)
	if err != nil {
		return msg, false
	}

	if b == nil {
		return msg, false
	}

	// 对查询到的状态进行反序列化
	err = json.Unmarshal(b, &msg)
	if err != nil {
		return msg, false
	}

	// 返回结果
	return msg, true
}

// 根据指定的查询字符串实现富查询
func getMsgByQueryString(stub shim.ChaincodeStubInterface, queryString string) ([]byte, error) {
	resultsIterator, err := stub.GetQueryResult(queryString)
	if err != nil {
		return nil, err
	}
	defer  resultsIterator.Close()

	// buffer is a JSON array containing QueryRecords
	var buffer bytes.Buffer

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}

		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		bArrayMemberAlreadyWritten = true
	}

	fmt.Printf("- getQueryResultForQueryString queryResult:\n%s\n", buffer.String())

	return buffer.Bytes(), nil

}