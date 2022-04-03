const { gameOptions, againOptions } = require('./options.js');
const TelegramAPI = require('node-telegram-bot-api');

const TOKEN = process.env.TOKEN;
console.log(TOKEN);
const bot = new TelegramAPI(TOKEN, { polling: { autoStart: true } });

// manual db
const chats = {};

const timeout = (ms) => {
    return new Promise((r) => setTimeout(r, ms));
};

const startGame = async (chatID) => {
    await bot.sendMessage(chatID, 'Now guess the number from 0 to 9!');
    chats[chatID] = {};
    chats[chatID]['data'] = (~~(Math.random() * 10)).toString();
    chats[chatID]['active'] = true;
    return bot.sendMessage(chatID, 'Your turn', gameOptions);
};

const endGame = (chatID) => {
    chats[chatID]['active'] = false;
};

const start = async () => {
    await bot.setMyCommands([
        { command: '/start', description: 'Start the bot' },
        { command: '/info', description: 'Get my info' },
        { command: '/game', description: 'Guess the number from 0 to 9' },
    ]);

    bot.on('message', async (msg) => {
        const text = msg?.text;
        const chatID = msg?.chat?.id;
        if (text === '/start') {
            await bot.sendSticker(
                chatID,
                'https://cdn.tlgrm.ru/stickers/f7e/fba/f7efbacf-9817-4b7e-8e07-dac0cf0430d1/96/9.webp',
            );
            return bot.sendMessage(chatID, 'Zzz...');
        } else if (text === '/info') {
            return bot.sendMessage(
                chatID,
                `Your name is ${msg.from.first_name} ${
                    msg.from.last_name
                } aka ${msg.from.username || '[no username]'} `,
            );
        } else if (text === '/game') {
            return startGame(chatID);
        }
        return bot.sendMessage(chatID, "I don't understand you.");
    });

    bot.on('callback_query', async (msg) => {
        const data = msg.data;
        const chatID = msg?.message?.chat?.id;
        if (data === '/again') {
            return startGame(chatID);
        } else if (data.match(/\d/) && chats[chatID]['active']) {
            await bot.sendMessage(chatID, `So you have chosen ${data}...`);
            await timeout(1000);
            if (data === chats[chatID]['data']) {
                await bot.sendMessage(chatID, 'You win!', againOptions);
            } else if (data !== chats[chatID]['data']) {
                await bot.sendMessage(
                    chatID,
                    `You lose. The correct answer is ${chats[chatID].data}.`,
                    againOptions,
                );
            }
            endGame(chatID);
        }
    });
};

start().then(() => console.log('Bot has been started...'));
