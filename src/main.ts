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
      
      // Check if the prediction was created successfully
      if (!prediction || prediction.error) {
        console.error('Prediction creation failed:', prediction.error || 'Unknown error');
        return res.status(500).json({ error: 'Failed to create prediction' });
      }

      // Check if we have a valid get URL
      if (!prediction.urls || !prediction.urls.get) {
        console.error('Invalid prediction response structure:', prediction);
        return res.status(500).json({ error: 'Invalid API response structure' });
      }

      // Poll for results
      let result = prediction;
      while (result.status !== 'succeeded' && result.status !== 'failed') {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        const pollResponse = await fetch(prediction.urls.get, {
          headers: {
            'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
          },
        });
        result = await pollResponse.json();
      }
      
      if (result.status === 'failed') {
        return res.status(500).json({ error: 'Image generation failed', details: result.error });
      }
      
      res.json(result);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to generate image' });
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
