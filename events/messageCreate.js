module.exports = {
    name: "messageCreate",
    once: false,
    async execute(message) {
        if (message.author.bot) return;

        if (message.content == "__test") return client.currency.add(message.author.id, 30);
        message.client.currency.add(message.author.id, 1);
    }
}