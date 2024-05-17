import React, { useContext, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faArrowRight,
  faCaretDown,
  faCaretRight,
  faClose,
  faDownload,
  faFile,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";
import { fileContext } from "../../providers/fileContext";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { convertSize, operationsBoxInfo } from "../../helper/Utilities";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import Auth from "../Authenticate/Auth";
import useModifiyFiles from "../../helper/useModifyFiles";

const NavBar = () => {
  let dropDownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { modifyFiles } = useModifiyFiles();
  const {
    uploadUrl,
    metadata,
    isCheckboxSelected,
    setIsModalOpen,
    isModalOpen,
    setIsUserLoggedIn,
  } = useContext(fileContext);
  const [user, setUser] = useState(auth.currentUser);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const pathsToCheck = [
    "delete-Pages/edit",
    "split-pdf/edit",
    "extract-pdf/edit",
    "rotate-pdf/edit",
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        setIsDropDownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropDownRef, setIsDropDownOpen]);

  useEffect(() => {
    onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          setUser(user);
        } else {
          setUser(null);
        }
        setIsUserLoading(false);
      },
      []
    );
  });

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.log(err.message);
    } finally {
      setIsUserLoggedIn(false);
      navigate("/");
    }
  };

  const findImageByRoute = (route) => {
    const operation = operationsBoxInfo.find((item) => item.link === route);
    if (operation) {
      return operation.image;
    }
    return null;
  };

  const getInitials = (name) => {
    const words = name.split(" ");
    const initials = words.map((word) => word.charAt(0).toUpperCase());
    return initials.slice(0, 2).join("");
  };

  const handleEditFiles = (
    route,
    user,
    isCheckboxSelected,
    metadata,
    operation,
    rotation,
    setRotation,
    password
  ) => {
    modifyFiles(
      route,
      user,
      isCheckboxSelected,
      metadata,
      operation,
      rotation,
      setRotation,
      password
    );
  };

  return (
    <div className="navbar-container__wrapper">
      {isDropDownOpen && <div className="modal-box__wrapper"></div>}
      <div className="navbar-container">
        <Link className="link" to={"/"}>
          <div className="logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
              <polygon
                fill="#FF46FB"
                points="19.922 19.922 29.883 19.922 29.883 29.883 19.922 29.883"
              ></polygon>
              <polygon
                fill="#CA41FC"
                points="9.961 19.922 19.922 19.922 19.922 29.883 9.961 29.883"
              ></polygon>
              <polygon
                fill="#8B48FE"
                points="0 19.922 9.961 19.922 9.961 29.883 0 29.883"
              ></polygon>
              <polygon
                fill="#81E650"
                points="19.922 9.961 29.883 9.961 29.883 19.922 19.922 19.922"
              ></polygon>
              <polygon
                fill="#00D267"
                points="9.961 9.961 19.922 9.961 19.922 19.922 9.961 19.922"
              ></polygon>
              <polygon
                fill="#00C0FF"
                points="0 9.961 9.961 9.961 9.961 19.922 0 19.922"
              ></polygon>
              <polygon
                fill="#FFD200"
                points="19.922 0 29.883 0 29.883 9.961 19.922 9.961"
              ></polygon>
              <polygon
                fill="#FF8E00"
                points="9.961 0 19.922 0 19.922 9.961 9.961 9.961"
              ></polygon>
              <polygon
                fill="#FF5400"
                points="0 0 9.961 0 9.961 9.961 0 9.961"
              ></polygon>
            </svg>
          </div>
        </Link>
        {!location.pathname.includes("edit") && (
          <Link
            to={"/documents"}
            className={`documents-link ${
              location.pathname.includes("documents")
                ? "documents-link--active"
                : ""
            }`}
          >
            <FontAwesomeIcon className="icon" icon={faFile} />
            Documents
          </Link>
        )}
        {!location.pathname.includes("result") &&
          location.pathname.split("/")[1].length === 2 && (
            <>
              <FontAwesomeIcon className="icon big--icon" icon={faCaretRight} />
              <Link
                to={`/${location.pathname.split("/")[1]}`}
                className="current-page--logo"
              >
                <div className="route-logo">
                  {findImageByRoute(location.pathname.split("/")[1])}
                </div>
                <p>{location.pathname.split("/")[1].replaceAll("-", " ")}</p>
              </Link>
            </>
          )}
        <div className="navbar-container__middle">
          {pathsToCheck.some((path) => location.pathname.includes(path)) && (
            <>
              <p>{metadata?.name}</p>
              <span>{convertSize(metadata?.size)}</span>
            </>
          )}
        </div>
        <div className="navbar-container__right">
          {(location.pathname.includes("/delete-Pages/edit") ||
            location.pathname.includes("/rotate-pdf/edit")) && (
            <a
              className="link"
              target="_blank"
              rel="noreferrer"
              href={uploadUrl?.[0]?.replace(/"/g, "")}
              download
            >
              <button className="convert-btn">
                Download
                <FontAwesomeIcon className="icon" icon={faDownload} />
              </button>
            </a>
          )}
          {(location.pathname.includes("/extract-pdf/edit") ||
            location.pathname.includes("/split-pdf/edit")) && (
            <button
              className={`convert-btn ${
                isCheckboxSelected &&
                Object.values(isCheckboxSelected).every(
                  (value) => value === false
                ) &&
                "convert-btn--deactive"
              }`}
              onClick={() =>
                handleEditFiles(
                  location.pathname.split("/")[1],
                  user,
                  isCheckboxSelected,
                  metadata,
                  null,
                  undefined,
                  undefined,
                  null
                )
              }
            >
              Extract
              <FontAwesomeIcon className="icon" icon={faArrowRight} />
            </button>
          )}
          {user ? (
            <div
              ref={dropDownRef}
              onClick={() => setIsDropDownOpen((prev) => !prev)}
              className="user-container"
            >
              {getInitials(
                user?.user?.displayName ?? user?.displayName ?? user?.email
              )}
              <FontAwesomeIcon
                onClick={() => setIsDropDownOpen(false)}
                className="dropdown-icon"
                icon={faCaretDown}
              />
              <div
                style={{ display: isDropDownOpen ? "block" : "none" }}
                className="user-dropdown"
              >
                <FontAwesomeIcon className="close-icon" icon={faClose} />
                <div className="user-detail">
                  <div className="user-name">
                    {getInitials(
                      user?.user?.displayName ??
                        user?.displayName ??
                        user?.email
                    )}
                  </div>
                  <div className="user-detail--extensive">
                    <p>{user?.user?.displayName ?? user?.displayName}</p>
                    <p>{user?.user?.email ?? user?.email}</p>
                  </div>
                </div>
                <ul>
                  <li onClick={handleLogout}>
                    <FontAwesomeIcon className="icon" icon={faSignOut} />
                    Log out
                    <FontAwesomeIcon className="icon" icon={faAngleRight} />
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <button
              disabled={isUserLoading}
              className="login-btn"
              onClick={() => {
                setIsModalOpen((v) => !v);
                document.querySelector("body").style.overflow = "hidden";
              }}
            >
              {isUserLoading ? "Loading..." : "Log In"}
            </button>
          )}
        </div>
      </div>
      {isModalOpen && <Auth />}
    </div>
  );
};

export default NavBar;
