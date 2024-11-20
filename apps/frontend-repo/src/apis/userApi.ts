import { getIdTokenResult, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { LoginWithEmailPassword, User } from '@ebuddy/models';


export const login = async (payload: LoginWithEmailPassword) => {
  try {
    const userLogin = await signInWithEmailAndPassword(auth, payload?.email, payload?.password);
    return {
      data: userLogin
    };

  } catch (error) {
    throw error;
  }
};
