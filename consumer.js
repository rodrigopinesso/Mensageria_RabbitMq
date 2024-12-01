import amqp from "amqplib";

async function receiveTask() {
  try {
    const connection = await amqp.connect("amqp://admin:admin@localhost");
    const channel = await connection.createChannel();

    const queue = "task_queue";

    await channel.assertQueue(queue, { durable: true });
    channel.prefetch(1);

    console.log("[*] Aguardando mensagens. Pressione Ctrl+C para sair.");

    channel.consume(
      queue,
      (msg) => {
        const messageContent = msg.content.toString();
        const processingTime = (messageContent.split(".").length - 1) * 1000;

        console.log(`[x] Recebido: '${messageContent}'`);

        setTimeout(() => {
          console.log(`[x] Processado: '${messageContent}'`);
          channel.ack(msg);
        }, processingTime);
      },
      { noAck: false }
    );
  } catch (error) {
    console.error("Erro ao receber tarefa:", error);
  }
}

receiveTask();
