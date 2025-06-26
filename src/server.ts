import express, { Request, Response } from 'express';
import { initWhatsapp, sendConfirmationMessage } from './whatsapp';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post(
  '/send-message',
  async (req: Request, res: Response): Promise<void> => {
    const { phone, patientName, confirmationToken } = req.body;

    if (!phone || !patientName || !confirmationToken) {
      res.status(400).json({
        error: 'Campos obrigatórios: phone, patientName, confirmationToken',
      });
      return;
    }

    try {
      await sendConfirmationMessage(phone, patientName, confirmationToken);
      res.status(200).json({ success: true });
    } catch (err: any) {
      console.error('Erro ao enviar mensagem:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

app.listen(3001, async () => {
  await initWhatsapp();
  console.log('🚀 Servidor rodando em http://localhost:3001');
});
