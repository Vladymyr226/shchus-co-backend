import { Router } from 'express'
import { checkStatus, generateImage } from "./controllers/ai";
import { synthesize } from './controllers/synthesize';

export function createGenerateImageRouter() {
    const router = Router({ mergeParams: true })
  
    router.post('/generate-image', generateImage);
    router.get('/check-status/:id', checkStatus);
    router.post('/synthesize', synthesize);
  
    return router;
  }