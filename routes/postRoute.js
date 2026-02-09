import { createPost, updatePost } from '../controllers/postController.js';
import express from 'express';

const router = express.Router();

router.post('/', createPost);
router.put('/:id', updatePost);

export default router;