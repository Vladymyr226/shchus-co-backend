import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import { createAuthRouter } from './modules/auth/routes/routes'
import cors from 'cors'
import { Router } from 'express'
import { createPaymentRouter } from './modules/payment/routes/payment'
import './configs/dotenv.config'
import { createCabinetRouter } from './modules/cabinet/shchus/routes/routes'
import { errorHandlerMiddleware } from './middleware/error.middleware'
import http from 'http'
import { setupChatSocket } from './modules/chats/chat'
import fetch from 'node-fetch'

const app = express()
const server = http.createServer(app)

const io = setupChatSocket(server) // Setup chat socket

app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

function createGenerateImageRouter() {
  const router = Router({ mergeParams: true })

  router.post('/generate-image', async (req: Request, res: Response) => {
    try {
      console.log('Generate image request body:', req.body);
      
      if (!process.env.REPLICATE_API_TOKEN) {
        console.error('REPLICATE_API_TOKEN is not set');
        return res.status(500).json({ error: 'API token not configured' });
      }

      // Create prediction
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body)
      });
      
      const prediction = await response.json();
      console.log('Replicate API response:', prediction);
      
      if (!prediction || prediction.error) {
        console.error('Prediction creation failed:', prediction.error || 'Unknown error');
        return res.status(500).json({ error: 'Failed to create prediction', details: prediction.error });
      }

      res.json({
        id: prediction.id,
        status: prediction.status,
        urls: prediction.urls,
      });
      
    } catch (error) {
      console.error('Error in generate-image:', error);
      res.status(500).json({ error: 'Failed to generate image', details: error });
    }
  });

  // Добавляем новый эндпоинт для проверки статуса
  router.get('/check-status/:id', async (req: Request, res: Response) => {
    try {
      const response = await fetch(`https://api.replicate.com/v1/predictions/${req.params.id}`, {
        headers: {
          'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
        },
      });
      
      const result = await response.json();
      console.log(`Status check for ${req.params.id}:`, result);
      
      if (result.status === 'succeeded' && Array.isArray(result.output) && result.output.length > 0) {
        console.log('Generated image URL:', result.output[0]);
      }
      
      res.json(result);
    } catch (error) {
      console.error('Error in check-status:', error);
      res.status(500).json({ error: 'Failed to check prediction status', details: error });
    }
  });

  return router;
}

function addApiRoutes() {
  const router = Router({ mergeParams: true })

  router.use('/auth', createAuthRouter())
  router.use('/cabinet', createCabinetRouter())
  router.use('/payment', createPaymentRouter())
  router.use('/generate', createGenerateImageRouter())

  return router
}

app.use('/api', addApiRoutes())

app.get('/', (req: Request, res: Response) => {
  res.status(200).json('Health check works!')
})

app.use(errorHandlerMiddleware)

server.listen(process.env.PORT || 4000, () => {
  console.log(`Server listening at http://localhost:${process.env.PORT || 4000}`)
})

export default app
