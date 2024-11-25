const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: 'gif',
  version: '1.0.0',
  usePrefix: 'true',
  hasPermission: 0,
  credits: 'August Quinn',
  description: 'Search for GIFs on Giphy and send them as attachments.',
  commandCategory: 'Fun',
  usages: ['/gif [query]'],
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;

  if (args.length === 0) {
    api.sendMessage('Please provide a search query for Giphy.', threadID, messageID);
    return;
  }

  const query = args.join(' ');
  const apiKey = 'QHv1qVaxy4LS3AmaNuUYNT9zr40ReFBI';
  const cacheDir = path.join(__dirname, 'cache');

  // Ensure the cache directory exists
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir);
  }

  try {
    const response = await axios.get('https://api.giphy.com/v1/gifs/search', {
      params: {
        q: query,
        api_key: apiKey,
        limit: 6,
        rating: 'g',
      },
    });

    const gifResults = response.data?.data || [];

    if (gifResults.length > 0) {
      const gifAttachments = [];

      try {
        for (let i = 0; i < gifResults.length; i++) {
          const gifData = gifResults[i];
          const gifURL = gifData.images.original.url;

          const filePath = path.join(cacheDir, `giphy${i}.gif`);
          const getContent = (await axios.get(gifURL, { responseType: 'arraybuffer' })).data;
          fs.writeFileSync(filePath, Buffer.from(getContent, 'binary'));
          gifAttachments.push(fs.createReadStream(filePath));
        }

        await api.sendMessage(
          {
            attachment: gifAttachments,
          },
          threadID
        );
      } finally {
        // Clean up files after sending
        for (let i = 0; i < gifResults.length; i++) {
          const filePath = path.join(cacheDir, `giphy${i}.gif`);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      }
    } else {
      api.sendMessage('No GIFs found for the provided query.', threadID, messageID);
    }
  } catch (error) {
    console.error(error);
    api.sendMessage('An error occurred while searching for GIFs.', threadID, messageID);
  }
};
