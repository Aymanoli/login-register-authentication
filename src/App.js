import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import { useState } from "react";
import './App.css';
import initializeAuthentication from './Firebase/firebase.initilize';

initializeAuthentication();
// const googleProvider = new GoogleAuthProvider();

function App() {
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
const [isLogin, setIsLogin] = useState(false)

const auth = getAuth();

  // const handleGoogleSingIn = () =>{
  //   signInWithPopup(auth, googleProvider)
  //   .then(result =>{
  //     const user = result.user;
  //     console.log(user)
  //   })
  // }

  const toggleLogIn = e =>{
    setIsLogin(e.target.checked)
  }
  const handleNameChange = e =>{
    setName(e.target.value);
  }

  const handleEmailChange = e =>{
    setEmail(e.target.value);
  }
  const handlePasswordChange = e =>{
    setPassword(e.target.value);
  }

  const handleRegistration = e =>{
    e.preventDefault();
    console.log(email, password);
    if(password.length < 6){
      setError('password must be at least 6 charecters long.')
      return;
    }
    if(!/(?=.*[A-Z].*[A-Z])/.test(password)){
      setError('passowrd must contain 2 upper case');
      return;
    }

    // isLogin? processLogin(email, password) : createNewUser(email, password);

    //another process
    if(isLogin){
      processLogin(email, password);
    }
    else{
      registerNewUser(email, password);
    }
  }

  const processLogin = (email, password) =>{
    signInWithEmailAndPassword(auth, email, password)
    .then(result =>{
      const user = result.user;
      console.log(user);
      setError('');
    })
    .catch(error =>{
      setError(error.message);
    })
  }

  const verifyEmail= () =>{
    sendEmailVerification(auth.currentUser)
    .then(result =>{
      console.log(result);
    })
  }

  const registerNewUser = (email, password) =>{
    createUserWithEmailAndPassword(auth, email, password)
    .then(result =>{
      const user =result.user;
      console.log(user);
      setError('');
      verifyEmail();
      setUserName();
    })
    .catch(error =>{
      setError(error.message);
    })
  }

const setUserName = () =>{
  updateProfile(auth.currentUser, {displayName: name})
  .then(result =>{})
}

const  handleResetPassword =() =>{
  sendPasswordResetEmail(auth, email)
  .then(result=>{

  })
}

  return (
    <div className="mx-5 my-5">
      <form onSubmit={handleRegistration}>
        <h3 className="text-success">Please {isLogin ? 'Login' : 'Register'}</h3>

     {! isLogin && <div className="row mb-3">
    <label htmlFor="inputName" className="col-sm-2 col-form-label">Name</label>
    <div className="col-sm-10">
      <input onBlur={handleNameChange} type="text" placeholder="your name" className="form-control" id="inputName" required/>
    </div>
  </div>}

  <div className="row mb-3">
    <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Email</label>
    <div className="col-sm-10">
      <input onBlur={handleEmailChange} type="email" className="form-control" id="inputEmail3" required/>
    </div>
  </div>
  <div className="row mb-3">
    <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Password</label>
    <div className="col-sm-10">
      <input onBlur={handlePasswordChange} type="password" className="form-control" id="inputPassword3" required/>
    </div>
  </div>
  
  <div className="row mb-3">
    <div className="col-sm-10 offset-sm-2">
      <div className="form-check">
        <input onChange={toggleLogIn} className="form-check-input" type="checkbox" id="gridCheck1"/>
        <label className="form-check-label" htmlFor="gridCheck1">
          Already Registered?
        </label>
      </div>
    </div>
  </div>
  <div className="row mb-3 text-danger">{error}</div>
  <button type="submit" className="btn btn-primary">{isLogin ? 'Login' : 'Register'}</button>
  <button onClick={handleResetPassword} type="button" className ="btn btn-primary btn-sm">reset passowrd</button>

</form>
</div>
  );
}

export default App;
