import express from 'express';
const adminRoute = express.Router();
import { isAdmin } from '../middleware/roleCheck.js';
import  { addPcMember, addAdmin, login } from '../controller/adminController.js';
import { authenticateToken } from '../middleware/jwtAuth.js';

adminRoute.post('/add-pc-member/',authenticateToken ,isAdmin, addPcMember);

adminRoute.post('/add/', addAdmin);

adminRoute.post('/login/', login);

export default adminRoute;
