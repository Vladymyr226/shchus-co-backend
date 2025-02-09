import { Request, Response } from 'express';
import fetch from 'node-fetch';

export async function generateImage(req: Request, res: Response) {
    try {    
      if (!process.env.REPLICATE_API_TOKEN) {
        console.error('REPLICATE_API_TOKEN is not set');
        return res.status(500).json({ error: 'API token not configured' });
      }

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
  }


  export async function checkStatus(req: Request, res: Response) {
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
  }