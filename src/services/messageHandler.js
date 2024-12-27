import { getResponseForTrigger } from './googleSheetsService.js';
import whatsappService from './whatsappService.js';

class MessageHandler {
  constructor() {
  }

  async handleIncomingMessage(message, senderInfo) {
    const fromNumber = message.from.slice(0, 2) + message.from.slice(3);

    if (message.type === "text") {
        const incomingMessage = message.text.body.toLowerCase().trim();
        const response = await this.handleTextMessage(incomingMessage, senderInfo);

        switch (response.type) {
            case 'text':
                await whatsappService.sendMessage(fromNumber, response.message, message.id);
                break;
            case 'image':
                await whatsappService.sendMediaMessage(fromNumber, 'image', response.url, response.caption);
                break;
            default:
                await whatsappService.sendMessage(fromNumber, "Unsupported message type received.", message.id);
        }
        await whatsappService.markAsRead(message.id);
    }
}

async handleTextMessage(incomingMessage, senderInfo) {
  if (this.isGreeting(incomingMessage)) {
    const name = this.getSenderName(senderInfo); // Obtener el nombre desde senderInfo
    return { message: `Hola, ${name}.Soy *Dra. Empaque*, la doc que receta empaques perfectos y cura defectos en bolsitas. 🩺💼
¿Listo para reducir desperdicios y mantener la operación al 💯?                                                                   
*Solucionar un defecto.*
¿Tienes algún problema con el empaque? Escribe *Defecto* 

*Ver los básicos operativos.*
Consulta actividades clave para mantener la operación eficiente. Escribe *Básicos* 

*Aprender cómo hacer algo.*
Encuentra instrucciones para limpieza, ajustes o procedimientos específicos. Escribe *Aprender*`, type: 'text' }; // Personaliza el mensaje con el nombre del usuario
  } else {
    return await getResponseForTrigger(incomingMessage);
  }
}

  isGreeting(message) {
    const greetings = ["hola", "hello", "hi", "buenas tardes"];
    return greetings.includes(message);
  }

  getSenderName(senderInfo) {
    // Suponemos que senderInfo tiene un campo 'profile' que a su vez tiene un campo 'name'
    return senderInfo?.profile?.name || "User";  // Usar un nombre por defecto si no está disponible
  }
}

export default new MessageHandler();
