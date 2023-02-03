import {
  SQSClient,
  SendMessageCommand,
  DeleteMessageCommand,
  ReceiveMessageCommand,
} from "@aws-sdk/client-sqs"
import env from "../../env"

const client = new SQSClient({ region: "sa-east-1" })

export class SQSService {
  static async sendMessage(body: object) {
    const sendMessageCommand = new SendMessageCommand({
      QueueUrl: env.aws_sqs_queue_url,
      MessageBody: JSON.stringify(body),
    })

    const response = await client.send(sendMessageCommand)

    return response
  }

  static async receiveMessage() {
    const receiveMessageCommand = new ReceiveMessageCommand({
      QueueUrl: env.aws_sqs_queue_url,
    })

    const response = await client.send(receiveMessageCommand)

    return response
  }

  static async deleteMesasge(receiptHandle: string) {
    const deleteMessageCommand = new DeleteMessageCommand({
      QueueUrl: env.aws_sqs_queue_url,
      ReceiptHandle: receiptHandle,
    })

    const response = await client.send(deleteMessageCommand)

    return response
  }
}
