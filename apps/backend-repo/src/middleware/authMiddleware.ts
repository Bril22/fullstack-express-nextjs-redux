import { Response, NextFunction, Request } from 'express';
import { admin } from '../config/firebaseConfig';
import { User, AuthRequest } from '@ebuddy/models';

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    
    req.user = {
        id: decodedToken.uid,
        name: decodedToken.name || '',
        email: decodedToken.email || '',
        phone: decodedToken.phone || undefined,
        createdAt: new Date(decodedToken.auth_time * 1000),
        updatedAt: new Date(decodedToken.auth_time * 1000),
      } as User;

    next();
  } catch (err) {
    console.error(err);
    res.status(403).json({ message: 'Unauthorized' });
  }
};