import { useState, useRef } from 'react';
import classes from './auth-form.module.css';
import { signIn } from 'next-auth/client';
import { useRouter } from 'next/router';

function AuthForm() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);

  const emailRef = useRef();
  const passwordRef = useRef();

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  const createUser = async (email, password) => {
    const userInput = {
      email,
      password,
    };

    const res = await fetch('api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userInput),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    if (!res.ok) {
      console.log(data.message || 'error while creating user');
      return;
    }

    console.log(data);
  };

  const signUser = async () => {
    const result = await signIn('credentials', {
      redirect: false,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    });

    if (!result.error) {
      router.replace('/');
    }
    console.log(result);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      signUser();
    } else {
      createUser(emailRef.current.value, passwordRef.current.value);
    }
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={handleSubmit}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input type="password" id="password" required ref={passwordRef} />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button type="button" className={classes.toggle} onClick={switchAuthModeHandler}>
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
