package main

type MsgDate struct {
	ObjectType string `json:"docType"`
	Type 	string 	`json:"Type"`	//类型
	CertNo   string `json:"assertId"`   // 订单编号
	Money 	string	`json:"money"` //运费
	WhatThing 	string	`json:"remark"` //什么东西
	GuaranteeMoney 	string `json:"guaranteeMoney"`//保金

	SenderName 	string 	`json:"senderCustomer"`	//寄件人
	SenderPhone 	string 	`json:"senderPhone"`//寄件人电话
	SenderAddress 	string 	`json:"senderAddress"`//寄件人地址

	ReceiveName 	string 	`json:"receiveName"`	//收件人
	ReceivePhone 	string 	`json:"receivePhone"`//收件人电话
	ReceiveAddress 	string 	`json:"receiveAddress"`//收件人地址

	OperatorName 	string 	`json:"operator"` //负责人
	OperatorPhone 	string 	`json:"operatorPhone"` //负责人电话
	NowAddress 		string 	`json:"place"`//当前位置
	Photo 			[]string `json:"photo"` // 货品拍照
}

type HistoryItem struct {
	TxId      string
	TxTime    string
	MsgDate MsgDate
}
