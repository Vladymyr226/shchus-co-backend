import { Router } from 'express'
import multer from 'multer';
import {validateSchema} from "../../../middleware/validate.schema";
import {userLoginSchema, userRegisterSchema} from "../validation/user.schema";
import {login, registration} from "../controllers/user";
import {checkStatus, generateImage} from "../controllers/ai";


export function createAIRouter() {

    const router = Router({ mergeParams: true })

    const upload = multer({
        storage: multer.memoryStorage(),
        limits: {
            fileSize: 50 * 1024 * 1024 // ограничение размера файла до 10MB
        }
    });


    router.post('/generate/generate-image', generateImage);
    router.get('/generate/check-status/:id', checkStatus);
    router.post('/register', validateSchema(userRegisterSchema), registration)
    router.post('/login', validateSchema(userLoginSchema), login)

    return router;
  }
