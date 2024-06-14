import React, { useState } from 'react';
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';

export default function Login() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    async function loginWithGoogle() {
        await signInWithPopup(getAuth(), new GoogleAuthProvider());
    }

    async function loginWithEmailAndPassword() {
        try {
            await signInWithEmailAndPassword(getAuth(), email, password);
        } catch (error) {
            alert(error);
        }
    }

    async function signUpWithEmailAndPassword() {
        try {
            await createUserWithEmailAndPassword(getAuth(), email, password);
        } catch (error) {
            alert(error);
        }
    }

    return <div>
        <Button variant="contained" onClick={loginWithGoogle}>
            Logg inn med Google
        </Button>
        <p></p>
        <TextField label='Email' onChange={v => setEmail(v.target.value)} />
        <p></p>
        <TextField label='Passord' type='password' onChange={v => setPassword(v.target.value)} />
        <p></p>
        <Button variant="contained" onClick={loginWithEmailAndPassword}>
            Logg inn
        </Button>
        <p></p>
        <Button variant="contained" onClick={signUpWithEmailAndPassword}>
            Lag bruker
        </Button>
    </div>
}