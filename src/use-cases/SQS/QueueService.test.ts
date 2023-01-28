import { test, expect } from "vitest"

import { SQSService } from "./SQSSevice"

test("AWS SQS wrapper", async () => {
  const sendMessageResponse = await SQSService.sendMessage({
    hello: "world",
  })

  expect(sendMessageResponse.$metadata.httpStatusCode).toBe(200)

  console.log("SEND MESSAGE\n", sendMessageResponse)

  const receiveMessageResponse = await SQSService.receiveMessage()

  expect(receiveMessageResponse.$metadata.httpStatusCode).toBe(200)

  console.log("RECEIVE MESSAGE\n", receiveMessageResponse)

  const receiptHandle = receiveMessageResponse.Messages![0].ReceiptHandle

  const deleteResponse = await SQSService.deleteMesasge(receiptHandle!)

  expect(deleteResponse.$metadata.httpStatusCode).toBe(200)

  console.log("DELETE MESSAGE\n", deleteResponse)
})
