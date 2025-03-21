import { Router } from 'express'
import { checkStatus, generateImage } from "./controllers/ai";
import { listVoices, synthesize, transcribe } from './controllers/synthesize';
import multer from 'multer';


export function createGenerateImageRouter() {

    const router = Router({ mergeParams: true })

    const upload = multer({ 
        storage: multer.memoryStorage(),
        limits: {
            fileSize: 50 * 1024 * 1024 // ограничение размера файла до 10MB
        }
    });

  
    router.post('/generate-image', generateImage);
    router.get('/check-status/:id', checkStatus);
    router.post('/synthesize', synthesize);
    router.get('/list-voices', listVoices);
    router.post('/transcribe', upload.single('audio'), transcribe);
  
    return router;
  }