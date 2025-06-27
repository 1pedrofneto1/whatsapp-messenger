import * as wppconnect from '@wppconnect-team/wppconnect';

let client: any;

export const initWhatsapp = async () => {
  client = await wppconnect.create({
    session: 'default',
    catchQR: (base64Qrimg: string, asciiQR: string) => {
      console.log('📱 Escaneie este QR code com o WhatsApp:');
      console.log(asciiQR);
    },
    statusFind: (statusSession) => {
      console.log('🟡 Status da sessão:', statusSession);
    },
    puppeteerOptions: {
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-extensions',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-background-networking',
        '--disable-default-apps',
        '--disable-sync',
        '--metrics-recording-only',
      ],
      protocolTimeout: 60000, // ✅ aqui sim está certo!
    },
  });
};

export const sendConfirmationMessage = async (
  phone: string,
  patientName: string,
  confirmationToken: string
) => {
  if (!client) throw new Error('Cliente WhatsApp não inicializado.');

  const rawNumber = phone.replace(/\D/g, '');
  const completeNumber = rawNumber.startsWith('55')
    ? rawNumber
    : '55' + rawNumber;

  const result = await client.checkNumberStatus(completeNumber + '@c.us');

  if (!result.numberExists) {
    throw new Error('Número não existe no WhatsApp');
  }

  const jid = result.id._serialized;

  const confirmationLink = `https://healapp-prototype.netlify.app/confirm/${confirmationToken}`;
  const message = `Olá ${patientName}! 👋

Você tem uma consulta agendada.

Por favor, confirme sua presença clicando no link abaixo:

👉 *${confirmationLink}*

Caso não tenha solicitado, ignore esta mensagem.`;

  await client.sendText(jid, message);
  console.log('✅ Mensagem de confirmação enviada para', jid);
};
