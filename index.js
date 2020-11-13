const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
var stageCodes = require('./stage-codes.json');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
    if (message.author.bot) return;

    //Take in arguments
    //const args = message.content.slice(prefix.length).trim().split(/ +/);
    //const command = args.shift().toLowerCase();
    //console.log(`command = ${command}`)

    if (message.content.toLowerCase().startsWith('!startset')) {
        if (!message.mentions.users.size) {
			return message.reply(' you need to include @<your opponent\'s name>');
        }

        console.log("Starting set...");
        //Store players for the set
        const player1 = "<@".concat(message.author.id, ">");
        const player2 = message.mentions.users.first();
        const player1Id = message.author.id;
        const player2Id = player2.toString().substr(2, player2.toString().length - 3);
        console.log(`Player 1: ${player1} Player 2: ${player2}`);
        console.log(`Player 1: ${player1Id} Player 2: ${player2Id}`);

        // Filters define what kinds of messages should be collected
        const filter = m => !m.author.bot;
        // `m` is a message object that will be passed through the filter function 
        const collector = message.channel.createMessageCollector(filter, { time: 15000 });
    
        // The 'collect' event will fire whenever the collector receives input
        collector.on('collect', (message) => {
          console.log(`Collected ${message.content}`);
        });
    
        // The 'end' event will fire when the collector is finished.
        collector.on('end', (collected) => {
          console.log(`Collected ${collected.size} items`);
        });
    
        message.channel.send(`Player 1: ${player1} vs Player 2: ${player2}`);
        let winner = player1Id;
        let flip = Math.random();
        if (flip <= 0.5) {
            message.channel.send(`${player2} won the coin flip!`);
            winner = player2Id;
        }
        else {
            message.channel.send(`${player1} won the coin flip!`);
        }
        message.channel.send(`<@${winner}> what would you like to strike?`);
        message.channel.send(getStageList("neutral"));
        //let filter = m => m.author.id === winner;
      }
      if (message.content.toLowerCase().startsWith('!stages')) {
        let stageString = getStageList("");
        message.channel.send(stageString);
      }
});

function getStageList(isNeutral) {
    var neutralStages = ["gg","bc","shl","sodr","ft"]; 
    var counterPickStages = ["bb","je"];
    var stageString = "**Neutral Stages**:\n";
    for (const stage in neutralStages){
        stageString = stageString.concat(neutralStages[stage] + " - " + stageCodes[neutralStages[stage]] + "\n");
    }
    if(isNeutral){
        return stageString;
    }
    stageString += "\n**Counterpick Stages**:\n"
    for (const stage in counterPickStages){
        console.log(counterPickStages[stage]);
        stageString = stageString.concat(counterPickStages[stage] + " - " + stageCodes[counterPickStages[stage]] + "\n");
    }
    return stageString;
}

client.login(token);