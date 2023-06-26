import React, { useContext, useEffect, useRef, useState } from "react";
import { FileContext } from "../../Helper/FileContext";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithRedirect,
} from "firebase/auth";
import { auth } from "../../Config/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleNotch,
  faClose,
  faEnvelope,
  faEye,
  faLock,
} from "@fortawesome/free-solid-svg-icons";

const provider = new GoogleAuthProvider();

const Auth = () => {
  const { setIsModalOpen, setUser, hasAccount, setHasAccount } =
    useContext(FileContext);
  let wrapperRef = useRef(null);
  let passwordRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsModalOpen(false);
        document.querySelector("body").style.overflow = "auto";
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef, setIsModalOpen]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsUpdatingUser(true);
    try {
      const currUser = await signInWithEmailAndPassword(auth, email, password);
      setUser(currUser?.user ?? currUser);
      setIsModalOpen(false);
      document.querySelector("body").style.overflow = "auto";
    } catch (err) {
      setIsUpdatingUser(false);
      setIsError(true);
      console.log(err?.message);
    } finally {
      setIsUpdatingUser(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsUpdatingUser(true);
    try {
      const newUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(newUser?.user ?? newUser);
      setIsModalOpen(false);
      document.querySelector("body").style.overflow = "auto";
    } catch (err) {
      setIsUpdatingUser(false);
      setIsError(true);
      console.log(err?.message);
    } finally {
      setIsUpdatingUser(false);
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      let googleUser = null;
      if (window.innerWidth < 767) {
        googleUser = await signInWithRedirect(auth.provider);
      } else {
        googleUser = await signInWithPopup(auth, provider);
      }
      setUser(googleUser?.user ?? googleUser);
      setIsModalOpen(false);
      document.querySelector("body").style.overflow = "auto";
    } catch (err) {
      setIsError(true);
      console.log(err.message);
    }
  };

  return (
    <div className="auth-container__wrapper">
      <div ref={wrapperRef} className="auth-container">
        <div className="auth-container__header">
          <p>
            Don't have an account?{" "}
            <span onClick={() => setHasAccount((v) => !v)}>
              {hasAccount ? "Log In" : "Sign Up"}
            </span>
          </p>
          <FontAwesomeIcon
            onClick={() => {
              setIsModalOpen(false);
              document.querySelector("body").style.overflow = "auto";
            }}
            className="icon"
            icon={faClose}
          />
        </div>
        {!hasAccount && (
          <div className="auth-container__login">
            <h2>Log In</h2>
            <button
              onClick={handleSignInWithGoogle}
              className="login-with-google"
            >
              <div className="google-logo">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g fill="none" transform="translate(2 2)">
                    <path
                      fill="#4285F4"
                      d="M19.5326718,10.1870992 C19.5326718,9.36770992 19.4661832,8.76977099 19.3222901,8.14969466 L9.96564885,8.14969466 L9.96564885,11.8480153 L15.4577863,11.8480153 C15.3470992,12.7670992 14.7491603,14.1512214 13.4203817,15.0812977 L13.4017557,15.2051145 L16.3601527,17.4969466 L16.5651145,17.5174046 C18.4474809,15.7789313 19.5326718,13.2210687 19.5326718,10.1870992"
                    ></path>
                    <path
                      fill="#34A853"
                      d="M9.96564885,19.9312977 C12.6563359,19.9312977 14.9151908,19.0454198 16.5651145,17.5174046 L13.4203817,15.0812977 C12.578855,15.6681679 11.4493893,16.0778626 9.96564885,16.0778626 C7.33030534,16.0778626 5.09358779,14.3394656 4.29625954,11.9366412 L4.17938931,11.9465649 L1.10320611,14.3272519 L1.0629771,14.439084 C2.70175573,17.6945038 6.06793893,19.9312977 9.96564885,19.9312977"
                    ></path>
                    <path
                      fill="#FBBC05"
                      d="M4.29625954,11.9366412 C4.08587786,11.3165649 3.96412214,10.6521374 3.96412214,9.96564885 C3.96412214,9.27908397 4.08587786,8.61473282 4.28519084,7.99465649 L4.27961832,7.86259542 L1.1648855,5.44366412 L1.0629771,5.4921374 C0.387557252,6.84305344 0,8.36007634 0,9.96564885 C0,11.5712214 0.387557252,13.0881679 1.0629771,14.439084 L4.29625954,11.9366412"
                    ></path>
                    <path
                      fill="#EB4335"
                      d="M9.96564885,3.85335878 C11.8369466,3.85335878 13.0992366,4.66167939 13.8190076,5.33717557 L16.6315267,2.5910687 C14.9041985,0.985496183 12.6563359,0 9.96564885,0 C6.06793893,0 2.70175573,2.23671756 1.0629771,5.4921374 L4.28519084,7.99465649 C5.09358779,5.59183206 7.33030534,3.85335878 9.96564885,3.85335878"
                    ></path>
                  </g>
                </svg>
              </div>
              Continue with Google
            </button>
            <span>or</span>
            <form action="login" onSubmit={handleLogin}>
              <div
                className={
                  isError ? "input-container input--error" : "input-container"
                }
              >
                <FontAwesomeIcon
                  className="icon input--icon"
                  icon={faEnvelope}
                />
                <input
                  type="email"
                  placeholder="Email"
                  pattern="^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div
                className={
                  isError ? "input-container input--error" : "input-container"
                }
              >
                <FontAwesomeIcon className="icon input--icon" icon={faLock} />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FontAwesomeIcon className="icon input--icon" icon={faEye} />
              </div>
              {isError && (
                <span className="error">Wrong email or password</span>
              )}
              <button
                className={`login-btn ${isUpdatingUser ? "loading--btn" : ""}`}
              >
                {isUpdatingUser ? (
                  <FontAwesomeIcon
                    className="loading--icon"
                    icon={faCircleNotch}
                    spin
                  />
                ) : (
                  "Log In"
                )}
              </button>
            </form>
          </div>
        )}
        {hasAccount && (
          <div className="auth-container__signup">
            <h2>Sign Up</h2>
            <button
              onClick={handleSignInWithGoogle}
              className="login-with-google"
            >
              <div className="google-logo">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g fill="none" transform="translate(2 2)">
                    <path
                      fill="#4285F4"
                      d="M19.5326718,10.1870992 C19.5326718,9.36770992 19.4661832,8.76977099 19.3222901,8.14969466 L9.96564885,8.14969466 L9.96564885,11.8480153 L15.4577863,11.8480153 C15.3470992,12.7670992 14.7491603,14.1512214 13.4203817,15.0812977 L13.4017557,15.2051145 L16.3601527,17.4969466 L16.5651145,17.5174046 C18.4474809,15.7789313 19.5326718,13.2210687 19.5326718,10.1870992"
                    ></path>
                    <path
                      fill="#34A853"
                      d="M9.96564885,19.9312977 C12.6563359,19.9312977 14.9151908,19.0454198 16.5651145,17.5174046 L13.4203817,15.0812977 C12.578855,15.6681679 11.4493893,16.0778626 9.96564885,16.0778626 C7.33030534,16.0778626 5.09358779,14.3394656 4.29625954,11.9366412 L4.17938931,11.9465649 L1.10320611,14.3272519 L1.0629771,14.439084 C2.70175573,17.6945038 6.06793893,19.9312977 9.96564885,19.9312977"
                    ></path>
                    <path
                      fill="#FBBC05"
                      d="M4.29625954,11.9366412 C4.08587786,11.3165649 3.96412214,10.6521374 3.96412214,9.96564885 C3.96412214,9.27908397 4.08587786,8.61473282 4.28519084,7.99465649 L4.27961832,7.86259542 L1.1648855,5.44366412 L1.0629771,5.4921374 C0.387557252,6.84305344 0,8.36007634 0,9.96564885 C0,11.5712214 0.387557252,13.0881679 1.0629771,14.439084 L4.29625954,11.9366412"
                    ></path>
                    <path
                      fill="#EB4335"
                      d="M9.96564885,3.85335878 C11.8369466,3.85335878 13.0992366,4.66167939 13.8190076,5.33717557 L16.6315267,2.5910687 C14.9041985,0.985496183 12.6563359,0 9.96564885,0 C6.06793893,0 2.70175573,2.23671756 1.0629771,5.4921374 L4.28519084,7.99465649 C5.09358779,5.59183206 7.33030534,3.85335878 9.96564885,3.85335878"
                    ></path>
                  </g>
                </svg>
              </div>
              Continue with Google
            </button>
            <span>or</span>
            <form action="signup" onSubmit={handleSignup}>
              <div
                className={
                  isError ? "input-container input--error" : "input-container"
                }
              >
                <FontAwesomeIcon
                  className="icon input--icon"
                  icon={faEnvelope}
                />
                <input
                  type="email"
                  placeholder="Email"
                  pattern="^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div
                className={
                  isError ? "input-container input--error" : "input-container"
                }
              >
                <FontAwesomeIcon className="icon input--icon" icon={faLock} />
                <input
                  ref={passwordRef}
                  type="password"
                  placeholder="Password"
                  pattern="^(?=.*[\d])(?=.*[!@#$%^&*])[\w!@#$%^&*]{6,16}$"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {isError && <span className="error">Email already exixts</span>}
              <button
                className={`signup-btn ${isUpdatingUser ? "loading--btn" : ""}`}
              >
                {isUpdatingUser ? (
                  <FontAwesomeIcon
                    className="loading--icon"
                    icon={faCircleNotch}
                    spin
                  />
                ) : (
                  "Continue with email"
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
