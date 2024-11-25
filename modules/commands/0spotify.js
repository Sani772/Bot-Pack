const axios = require('axios');
const fs = require('fs');

module.exports.config = {
    usePrefix: true,
    name: "spotify",
    version: "1.0.0",
    hasPermision: 0,
    credits: "sakibin", 
    description: "Search and play music from Spotify",
    commandCategory: "spotify",
    usage: "[song name]",
    cooldowns: 5,
    usages: "[song name]",
    cooldown: 5,  
};

module.exports.run = async function ({ api, event, args }) {
    const listensearch = encodeURIComponent(args.join(" "));
    const apiUrl = `https://xakibin-fs8d.onrender.com/api/spotify?keyword=${listensearch}`;

    if (!listensearch) {
        api.setMessageReaction("❌", event.messageID, (err) => {}, true);
        return api.sendMessage("Please provide the name of the song you want to search.", event.threadID, event.messageID);
    }

    try {
        // Set initial reaction indicating the start of the process
        api.setMessageReaction("⏳", event.messageID, (err) => {}, true);

        const response = await axios.get(apiUrl);
        const { trackName, artist, album, previewUrl } = response.data;

        if (trackName) {
            const filePath = `${__dirname}/cache/${event.senderID}.mp3`;
            const writeStream = fs.createWriteStream(filePath);

            const audioResponse = await axios.get(previewUrl, { responseType: 'stream' });

            audioResponse.data.pipe(writeStream);

            writeStream.on('finish', () => {
                api.sendMessage({
                    body: `🎵 | New Spotify by Sakibin.\n\n🎶 Music: ${trackName}\n👤 Artist: ${artist}\n📂 Album: ${album}\n`,
                    attachment: fs.createReadStream(filePath),
                }, event.threadID, () => {
                    fs.unlinkSync(filePath);
                    // Set reaction to ✅ when done
                    api.setMessageReaction("✅", event.messageID, (err) => {
                        if (err) console.error("Error setting reaction:", err);
                    }, true);
                }, event.messageID);
            });
        } else {
            api.sendMessage("❓ | Sorry, couldn't find the requested music on Spotify.", event.threadID);
            // Set reaction to ❌ for failure
            api.setMessageReaction("❌", event.messageID, (err) => {
                if (err) console.error("Error setting reaction:", err);
            }, true);
        }
    } catch (error) {
        console.error("Error while processing Spotify search:", error);
        api.sendMessage("🚧 | An error occurred while processing your request.", event.threadID);
        // Set reaction to ❌ for failure
        api.setMessageReaction("❌", event.messageID, (err) => {
            if (err) console.error("Error setting reaction:", err);
        }, true);
    }
};