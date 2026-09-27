import { Router } from 'express';

const router = Router();

router.get('/', (req, res) =>{
    res.status(200).json({
        status: 'active',
        message: "servidor activo",
        timestamp: new Date().toISOString()
    });
});

export default router;

