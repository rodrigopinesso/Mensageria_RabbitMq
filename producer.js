import amqp from "amqplib";

async function sendTasks() {
  try {
    const connection = await amqp.connect("amqp://admin:admin@localhost");
    const channel = await connection.createChannel();

    const queue = "task_queue";
    const message = process.argv.slice(2).join(" ") || "Tarefa padrão";

    await channel.assertQueue(queue, { durable: true });

    channel.sendToQueue(queue, Buffer.from(message), { persistent: true });

    console.log(`[x] Enviado: '${message}'`);

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error("Erro ao enviar tarefa:", error);
  }
}

sendTasks();
