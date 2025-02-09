import { Router } from 'express'
import { checkStatus, generateImage } from "./controllers/ai";

export function createGenerateImageRouter() {
    const router = Router({ mergeParams: true })
  
    router.post('/generate-image', generateImage);
    router.get('/check-status/:id', checkStatus);
  
    return router;
  }