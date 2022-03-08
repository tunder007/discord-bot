const Discord = require("discord.js");
const axios = require ('axios');

// Crypto to currency eval
module.exports =
    async function cryptoPrice(message)
    {
        // Get the parameters
        const [userInput, ...args] = message.content.split(' ');
        // Check if there are two arguments present
        if (args.length < 2) {
        message.reply('You must provide the crypto and the currency to compare with!');
        message.delete();
        return;
        } else {
            const [coin, vsCurrency, ...restOfMessageIrrelevant] = args;
            try {
            // Get crypto price from coingecko API
            const { data } = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=${vsCurrency}`);
            // Check if data exists
            if (!data[coin][vsCurrency]) 
                throw Error();
                message.reply(`The current price of 1 ${coin} = ${data[coin][vsCurrency]} ${vsCurrency}`);
                message.delete();
                return;
            } catch (err) {
                message.reply('Please check your inputs. For example: !price cryptocurrency_name currency_name');
                message.delete();
                return;
            }
        }
    }