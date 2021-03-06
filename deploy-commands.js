const fs = require("fs");
const Rest = require("@discordjs/rest");
const Api = require("discord-api-types/v9");
const config = require("./config.json");
require("dotenv").config();

const commandFileInit = (path, cmd) => {
    const commandFiles = fs.readdirSync(path).filter(file => file.endsWith(".js"));
    for (const file of commandFiles) {
        const command = require(path + `/${file}`);
        cmd.push(command.data.toJSON());
    }
};

const cmd_jc = [];
commandFileInit("./commands_jc", cmd_jc);

const cmd_ofl = [];
commandFileInit("./commands_official", cmd_ofl);

const cmd_demo = [];
commandFileInit("./commands_demo", cmd_demo);

const rest = new Rest.REST({version: '9'}).setToken(process.env.token);

(async () => {
    try {
        const jc_guilds = [config.guild_id_jc, config.guild_id_mannam];
        const demo_guilds = [config.guild_id_demo];

        const parts = [jc_guilds, demo_guilds];
        let cmd = [];
        console.log(`Started refreshing application commands.`);
        for (const part of parts) {
            if (part == jc_guilds) cmd = cmd_jc;
            if (part == demo_guilds) cmd = cmd_demo;
            for (const guild of part) {
                await rest.put(
                    Api.Routes.applicationGuildCommands(config.client_id, guild),
                    { body: cmd }
                );
            }
        }
        await rest.put(
            Api.Routes.applicationCommands(config.client_id),
            { body: cmd_ofl }
        );
        console.log(`Successfully registered application commands.`);

    } catch (error) {
        console.error(error);
    }
})();