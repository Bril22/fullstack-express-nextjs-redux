import { Request, Response } from 'express';
import { db } from '../config/firebaseConfig';
import { User, AuthRequest, ResponseInterface } from '@ebuddy/models';

export const fetchUserData = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req?.user?.id;

      if (!userId) {
        res.status(400).json({ message: 'User ID not found' });
        return;
      }

      const userDoc = await db.collection('USERS').doc(userId).get();
  
      if (!userDoc.exists) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const data: ResponseInterface<FirebaseFirestore.DocumentData> = {
        statusCode: 200,
        message: 'Success fetch data user',
        data: {
          data: userDoc.data(),
        }
      };

      res.status(200).json(data);

    } catch (err) {
      console.error(err);
      throw res.status(500).json({ message: 'Error fetching user data' });
    }
  };
  
  export const updateUserData = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req?.user?.id;

      if (!userId) {
        res.status(400).json({ message: 'User ID not found' });
        return;
      }

      // fields validation
      const { name, email, phone }: User = req.body;
      const requiredFields = {
        name: 'Name is required',
        email: 'Email is required',
        phone: 'Phone is required',
      };
      const errors: string[] = [];
      for (const [field, message] of Object.entries(requiredFields)) {
        if (!req.body[field]) {
          errors.push(message);
        }
      }
      if (errors.length > 0) {
        res.status(400).json({ message: errors.join(', ') });
        return;
      }

      const userDoc = await db.collection('USERS').doc(userId).get();
  
      if (!userDoc.exists) {
        await db.collection('USERS').doc(userId).set({
          id: userId,
          name,
          email,
          phone,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
  
        const data = {
          statusCode: 201,
          message: 'User created successfully',
        };
  
        res.status(201).json(data);
        return;
      } else {
        await db.collection('USERS').doc(userId).set(
          {
            name,
            email,
            phone,
            updatedAt: new Date(),
          },
          { merge: true }
        );
  
        const data = {
          statusCode: 200,
          message: 'Success update user data',
        };
  
        res.status(200).json(data);
        return;
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error updating or creating user data' });
    }
  };