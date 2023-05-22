import { Client, SlashCommandBuilder, CommandInteraction, Collection, PermissionResolvable, Message, AutocompleteInteraction, ClientOptions } from "discord.js";
export interface SlashCommand {
    command: SlashCommandBuilder | any;
    execute: (interaction: CommandInteraction) => void;
    autocomplete?: (interaction: AutocompleteInteraction) => void;
    cooldown?: number;
}
export interface Command {
    name: string;
    execute: (message: Message, args: Array<string>) => void;
    permissions: Array<PermissionResolvable>;
    aliases: Array<string>;
    cooldown?: number;
}
export default class MyClient extends Client {
    commands: Collection<string, SlashCommand>;
    constructor(options: ClientOptions);
}
