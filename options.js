const createKeyboard = () => {
    const arr = [];
    for (let i = 1; i <= 3; i++) {
        arr.push([]);
        for (let j = 1; j <= 3; j++) {
            const num = j + 3 * (i - 1);
            arr[i - 1].push({ text: num, callback_data: num });
        }
    }
    arr.push([{ text: 0, callback_data: 0 }]);
    return arr;
};

module.exports = {
    gameOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: createKeyboard(),
        }),
    },
    againOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'How about one more time?', callback_data: '/again' }],
            ],
        }),
    },
};
