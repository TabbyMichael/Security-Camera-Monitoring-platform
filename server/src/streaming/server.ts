/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Enable CORS
router.use(cors());

router.get('/camera-feeds', async (req: Request, res: Response) => {
  try {
    const WINDY_API_KEY = 'za7us71w9pVyGzS9Ilt4jkSDBHY1PPmv';
    
    console.log('Attempting to fetch camera feeds from Windy API V3...');
    
    // First try to get traffic cameras
    let response = await axios.get(
      'https://api.windy.com/webcams/api/v3/webcams',
      {
        headers: {
          'X-WINDY-API-KEY': WINDY_API_KEY
        },
        params: {
          categories: 'traffic',
          sortKey: 'popularity',
          sortDirection: 'desc',
          limit: 9,
          include: 'categories,images,location,player,urls',
          lang: 'en'
        }
      }
    );
    
    // If no traffic cameras, fall back to any popular cameras
    if (!response.data?.webcams?.length) {
      console.log('No traffic cameras found, fetching popular cameras instead...');
      response = await axios.get(
        'https://api.windy.com/webcams/api/v3/webcams',
        {
          headers: {
            'X-WINDY-API-KEY': WINDY_API_KEY
          },
          params: {
            sortKey: 'popularity',
            sortDirection: 'desc',
            limit: 9,
            include: 'categories,images,location,player,urls',
            lang: 'en'
          }
        }
      );
    }
    
    console.log('Raw Windy API response:', JSON.stringify(response.data, null, 2));
    
    if (!response.data?.webcams) {
      console.error('Invalid API response structure:', response.data);
      throw new Error('Invalid response format from Windy API');
    }

    const cameras = response.data.webcams.map((cam: any) => {
      console.log('Processing camera:', {
        id: cam.webcamId,
        title: cam.title,
        player: cam.player
      });
      
      // Get the best available video URL
      let videoUrl = '';
      if (cam.player) {
        videoUrl = cam.player.live || 
                  cam.player.day || 
                  cam.player.month || 
                  cam.player.year ||
                  '';
      }

      if (!videoUrl) {
        console.warn(`No video URL found for camera ${cam.webcamId}`);
      }
      
      return {
        id: cam.webcamId,
        name: cam.title,
        url: videoUrl,
        location: `${cam.location?.city || 'Unknown City'}, ${cam.location?.country || 'Unknown Country'}`,
        status: videoUrl ? 'online' : 'offline',
        recording: true,
        lastUpdated: cam.lastUpdatedOn || null
      };
    }).filter((camera: { url: string }) => camera.url);

    if (!cameras.length) {
      console.warn('No valid cameras found in API response');
      throw new Error('No cameras available');
    }

    console.log(`Successfully processed ${cameras.length} cameras`);
    
    return res.status(200).json({
      success: true,
      data: cameras,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    // Enhanced error logging
    console.error('Error in /camera-feeds:', {
      message: error.message,
      response: {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      },
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      }
    });

    // More specific error handling
    if (error.response?.status === 401) {
      res.status(401).json({
        success: false,
        error: 'API authentication failed',
        details: 'Invalid or expired API key',
        timestamp: new Date().toISOString()
      });
    } else if (error.response?.status === 404) {
      res.status(404).json({
        success: false,
        error: 'API endpoint not found',
        details: 'The requested API endpoint does not exist',
        timestamp: new Date().toISOString()
      });
    } else if (error.response?.status === 429) {
      res.status(429).json({
        success: false,
        error: 'Rate limit exceeded',
        details: 'Too many requests to the Windy API',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch camera feeds',
        details: error.response?.data || error.message,
        status: error.response?.status,
        timestamp: new Date().toISOString()
      });
    }
  }
});

export default router; 