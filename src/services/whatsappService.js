import axios from 'axios';
import config from '../config/env.js';

class WhatsAppService {
  async sendMessage(to, body, messageId) {
    try {
      await axios({
        method: 'POST',
        url: `https://graph.facebook.com/${config.API_VERSION}/${config.BUSINESS_PHONE}/messages`,
        headers: {
          Authorization: `Bearer ${config.API_TOKEN}`,
        },
        data: {
          messaging_product: 'whatsapp',
          to,
          text: { body },
          //context: {
            //message_id: messageId,
          //},
        },
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
  async markAsRead(messageId) {
    try {
      await axios({
        method: 'POST',
        url: `https://graph.facebook.com/${config.API_VERSION}/${config.BUSINESS_PHONE}/messages`,
        headers: {
          Authorization: `Bearer ${config.API_TOKEN}`,
        },
        data: {
          messaging_product: 'whatsapp',
          status: 'read',
          message_id: messageId,
        },
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  }

  async snedInteractiveButtons(to,BodyText,buttons){
    try{
      await axios({
        method: 'POST',
        url: `https://graph.facebook.com/${config.API_VERSION}/${config.BUSINESS_PHONE}/messages`,
        headers: {
          Authorization: `Bearer ${config.API_TOKEN}`,
        },
        data: {
          messaging_product: 'whatsapp',
          to,
          type: 'interactive',
          interactive : {
            type: 'button',
            body:{ text: BodyText},
            action:{
              buttons: buttons  
            }
          }

        },
      });
    } catch(error){
      console.error(error);

    }
  }
  async sendMediaMessage(to, type, mediaUrl, caption) {
    try {
        const mediaObject = {};
        switch (type) {
            case 'image':
                mediaObject.image = { link: mediaUrl, caption: caption };
                break;
            default:
                throw new Error('Not Supported Media Type');
        }

        console.log('Sending media message:', { to, type, mediaObject });

        const response = await axios({
            method: 'POST',
            url: `https://graph.facebook.com/${config.API_VERSION}/${config.BUSINESS_PHONE}/messages`,
            headers: {
                Authorization: `Bearer ${config.API_TOKEN}`,
            },
            data: {
                messaging_product: 'whatsapp',
                to,
                type,
                ...mediaObject,
            },
        });

        console.log('Media message sent successfully:', response.data);
    } catch (error) {
        console.error('Error sending media message:', error.response?.data || error.message);
    }
}

}

export default new WhatsAppService();