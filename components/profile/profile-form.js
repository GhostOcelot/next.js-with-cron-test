import { useRef, useState } from 'react';
import classes from './profile-form.module.css';

function ProfileForm() {
  const [isError, setError] = useState(false);
  const [isSuccess, setSuccess] = useState(false);

  const oldPassword = useRef();
  const newPassword = useRef();

  const changePassword = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/user/change-password', {
      method: 'PATCH',
      body: JSON.stringify({
        oldPassword: oldPassword.current.value,
        newPassword: newPassword.current.value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    if (!res.ok) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 2000);
    } else {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    }

    console.log(data);
  };

  return (
    <>
      <form className={classes.form} onSubmit={changePassword}>
        <div className={classes.control}>
          <label htmlFor="new-password">New Password</label>
          <input type="password" id="new-password" ref={newPassword} />
        </div>
        <div className={classes.control}>
          <label htmlFor="old-password">Old Password</label>
          <input type="password" id="old-password" ref={oldPassword} />
        </div>
        <div className={classes.action}>
          <button>Change Password</button>
        </div>
      </form>
      {isError && <p className={classes.error}>Old password incorrect</p>}
      {isSuccess && <p className={classes.success}>Password changed</p>}
    </>
  );
}

export default ProfileForm;
