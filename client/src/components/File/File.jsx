import React, { useRef, useEffect, useState } from "react";
import { convertSize } from "../../helper/Utilities";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../Modal/Modal";
import DropDownItem from "../DropDownItem/DropDownItem";

const File = ({ index, user, file, setFileList }) => {
  let dropDownRef = useRef(null);
  const imageExtension = ["jpg", "jpeg", "png"];
  const wordExtension = ["doc", "docx"];
  const [isDropDownVisible, setIsDropDownVisible] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isListActive, setIsListActive] = useState(false);
  const [isExtensiveDropDownVisible, setIsExtensiveDropDownVisible] =
    useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        setIsDropDownVisible(false);
        setIsExtensiveDropDownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatDateFormat = (dt) => {
    const date = new Date(dt);
    const now = new Date();

    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      // Today
      const options = {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };
      const formattedDate = date.toLocaleString("en-US", options);
      const [time, period] = formattedDate.split(" ");
      return `Today, ${time} ${period}`;
    } else if (diffInDays === 1) {
      // Yesterday
      return "Yesterday";
    } else {
      // Other days, display the day of the week
      const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const dayOfWeek = daysOfWeek[date.getDay()];
      return dayOfWeek;
    }
  };

  const getBgColorByExtension = (ext) => {
    if (ext === "pdf") {
      return "rgb(242, 48, 48)";
    } else if (ext === "pptx" || ext === "ppt") {
      return "rgb(255, 128, 0)";
    } else if (ext === "doc" || ext === "docx") {
      return "rgb(61, 153, 245)";
    } else if (ext === "png" || ext === "jpg" || ext === "jpeg") {
      return "rgb(255, 183, 0)";
    }
  };

  const handleCheck = (idx) => {
    setFileList((prev) =>
      prev.map((item, i) =>
        i === idx ? { ...item, isChecked: !item?.isChecked } : item
      )
    );

    setIsListActive((prev) => !prev);
  };

  return (
    <li className={`file-list ${isListActive ? "file-list--active" : ""}`}>
      <div className="file-list--checkbox">
        <input
          onChange={() => handleCheck(index)}
          type="checkbox"
          checked={isListActive}
        />
      </div>
      <div className="file-list__content--items">
        <div className="file-name">
          <div className="file-placeholder">
            <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4 2C4 0.895431 4.89543 0 6 0H28L36 8V38C36 39.1046 35.1046 40 34 40H6C4.89543 40 4 39.1046 4 38V2Z"
                fill="white"
              ></path>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M36 8V38C36 39.1046 35.1046 40 34 40H6C4.89543 40 4 39.1046 4 38V2C4 0.895431 4.89543 0 6 0H28L36 8ZM34 39H6C5.44772 39 5 38.5523 5 38V2C5 1.44772 5.44772 1 6 1H27.5858L28 1.41422V8H34.5858L35 8.41421V38C35 38.5523 34.5523 39 34 39Z"
                fill="#E8E8E8"
              ></path>
            </svg>
            <div
              style={{
                backgroundColor: getBgColorByExtension(
                  file?.metadata?.name?.substring(
                    file?.metadata?.name?.lastIndexOf(".") + 1
                  )
                ),
              }}
              className="file-extension"
            >
              {file?.metadata?.name?.substring(
                file?.metadata?.name?.lastIndexOf(".") + 1
              )}
            </div>
          </div>
          <p>{file?.metadata?.name}</p>
        </div>
        <div className="file-size">
          <p>{convertSize(file?.metadata?.size)}</p>
        </div>
        <div className="file-time">
          <p>{formatDateFormat(file?.metadata?.timeCreated)}</p>
        </div>
        <div
          ref={dropDownRef}
          onClick={() => {
            setIsDropDownVisible((prev) => !prev);
            setIsListActive(true);
          }}
          className={`actions ${isDropDownVisible ? "actions--active" : ""}`}
        >
          <FontAwesomeIcon className="icon" icon={faEllipsisVertical} />
          {isDropDownVisible && (
            <div className="dropdown-container">
              <ul>
                {imageExtension.includes(
                  file?.metadata?.name
                    ?.substring(file?.metadata?.name?.lastIndexOf(".") + 1)
                    .toLowerCase()
                ) && (
                  <DropDownItem
                    user={user}
                    to={"/jpg-to-pdf"}
                    title={"JPG to PDF"}
                    conversionType={"jpg-to-pdf"}
                    file={file}
                    icon={
                      <svg
                        viewBox="0 0 32 32"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0 4C0 1.79086 1.79086 0 4 0H28C30.2091 0 32 1.79086 32 4V28C32 30.2091 30.2091 32 28 32H4C1.79086 32 0 30.2091 0 28V4Z"
                          fill="#FFB700"
                        ></path>
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M9.33323 10L18.6666 19.2969L22.6058 15.373L32 23.5469V27L22.7273 19.0085L18.6666 23.0534L9.33323 13.7565L0 23.0156V19.2969L9.33323 10Z"
                          fill="white"
                        ></path>
                        <circle cx="25" cy="7" r="4" fill="white"></circle>
                      </svg>
                    }
                  />
                )}
                {wordExtension.includes(
                  file?.metadata?.name
                    ?.substring(file?.metadata?.name?.lastIndexOf(".") + 1)
                    .toLowerCase()
                ) && (
                  <DropDownItem
                    user={user}
                    to={"/word-to-pdf"}
                    title={"Word to PDF"}
                    conversionType={"word-to-pdf"}
                    file={file}
                    icon={
                      <svg
                        viewBox="0 0 32 32"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0 4C0 1.79086 1.79086 0 4 0H28C30.2091 0 32 1.79086 32 4V28C32 30.2091 30.2091 32 28 32H4C1.79086 32 0 30.2091 0 28V4Z"
                          fill="#3D99F5"
                        ></path>
                        <path
                          d="M23.0874 25L28 7H24.0597L21.0661 19.4034H21.0149L17.8934 7H14.1322L10.9595 19.2521H10.9083L8.01706 7H4L8.83582 25H12.9041L15.9488 12.7479H16L19.0959 25H23.0874Z"
                          fill="white"
                        ></path>
                      </svg>
                    }
                  />
                )}
                {file?.metadata?.name
                  ?.substring(file?.metadata?.name?.lastIndexOf(".") + 1)
                  .toLowerCase() === "pdf" && (
                  <>
                    <DropDownItem
                      user={user}
                      to={"/pdf-to-jpg"}
                      title={"PDF to JPG"}
                      conversionType={"pdf-to-jpg"}
                      file={file}
                      icon={
                        <svg
                          viewBox="0 0 32 32"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0 4C0 1.79086 1.79086 0 4 0H28C30.2091 0 32 1.79086 32 4V28C32 30.2091 30.2091 32 28 32H4C1.79086 32 0 30.2091 0 28V4Z"
                            fill="#FFB700"
                          ></path>
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M9.33323 10L18.6666 19.2969L22.6058 15.373L32 23.5469V27L22.7273 19.0085L18.6666 23.0534L9.33323 13.7565L0 23.0156V19.2969L9.33323 10Z"
                            fill="white"
                          ></path>
                          <circle cx="25" cy="7" r="4" fill="white"></circle>
                        </svg>
                      }
                    />
                    <DropDownItem
                      user={user}
                      to={"/pdf-to-word"}
                      title={"PDF to Word"}
                      conversionType={"pdf-to-word"}
                      file={file}
                      icon={
                        <svg
                          viewBox="0 0 32 32"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0 4C0 1.79086 1.79086 0 4 0H28C30.2091 0 32 1.79086 32 4V28C32 30.2091 30.2091 32 28 32H4C1.79086 32 0 30.2091 0 28V4Z"
                            fill="#3D99F5"
                          ></path>
                          <path
                            d="M23.0874 25L28 7H24.0597L21.0661 19.4034H21.0149L17.8934 7H14.1322L10.9595 19.2521H10.9083L8.01706 7H4L8.83582 25H12.9041L15.9488 12.7479H16L19.0959 25H23.0874Z"
                            fill="white"
                          ></path>
                        </svg>
                      }
                    />
                    <DropDownItem
                      user={user}
                      to={null}
                      title={"More tools"}
                      icon={
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="4"
                            y="4"
                            width="4"
                            height="4"
                            rx="1.125"
                            fill="#FF5400"
                          ></rect>
                          <rect
                            x="10"
                            y="4"
                            width="4"
                            height="4"
                            rx="1.125"
                            fill="#FF8E00"
                          ></rect>
                          <rect
                            x="16"
                            y="4"
                            width="4"
                            height="4"
                            rx="1.25"
                            fill="#FFD200"
                          ></rect>
                          <rect
                            x="16"
                            y="10"
                            width="4"
                            height="4"
                            rx="1.125"
                            fill="#81E650"
                          ></rect>
                          <rect
                            x="16"
                            y="16"
                            width="4"
                            height="4"
                            rx="1.125"
                            fill="#FF46FB"
                          ></rect>
                          <rect
                            x="10"
                            y="10"
                            width="4"
                            height="4"
                            rx="1.125"
                            fill="#00D267"
                          ></rect>
                          <rect
                            x="10"
                            y="16"
                            width="4"
                            height="4"
                            rx="1.125"
                            fill="#CA41FC"
                          ></rect>
                          <rect
                            x="4"
                            y="10"
                            width="4"
                            height="4"
                            rx="1.125"
                            fill="#00C0FF"
                          ></rect>
                          <rect
                            x="4"
                            y="16"
                            width="4"
                            height="4"
                            rx="1.125"
                            fill="#8B48FE"
                          ></rect>
                        </svg>
                      }
                      setIsExtensiveDropDownVisible={
                        setIsExtensiveDropDownVisible
                      }
                    />
                    {isExtensiveDropDownVisible && (
                      <div className="extensive-dropdown-container">
                        <ul>
                          <DropDownItem
                            user={user}
                            to={"/pdf-to-ppt"}
                            title={"PDF to PPT"}
                            file={file}
                            conversionType={"pdf-to-ppt"}
                            icon={
                              <svg
                                viewBox="0 0 32 32"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M0 4C0 1.79086 1.79086 0 4 0H28C30.2091 0 32 1.79086 32 4V28C32 30.2091 30.2091 32 28 32H4C1.79086 32 0 30.2091 0 28V4Z"
                                  fill="#FF8000"
                                ></path>
                                <path
                                  d="M12.4148 15.4706V10.0756H15.8453C16.3515 10.0756 16.8389 10.1092 17.3076 10.1765C17.7762 10.2437 18.1886 10.3782 18.5448 10.5798C18.901 10.7647 19.1822 11.0336 19.3884 11.3866C19.6134 11.7395 19.7258 12.2017 19.7258 12.7731C19.7258 13.3445 19.6134 13.8067 19.3884 14.1597C19.1822 14.5126 18.901 14.7899 18.5448 14.9916C18.1886 15.1765 17.7762 15.3025 17.3076 15.3697C16.8389 15.437 16.3515 15.4706 15.8453 15.4706H12.4148ZM8 7V25H12.4148V18.5462H17.0545C18.3105 18.5462 19.379 18.3866 20.2601 18.0672C21.1412 17.7311 21.8535 17.2941 22.3972 16.7563C22.9596 16.2185 23.3626 15.605 23.6063 14.916C23.8688 14.2101 24 13.4958 24 12.7731C24 12.0336 23.8688 11.3193 23.6063 10.6303C23.3626 9.94118 22.9596 9.32773 22.3972 8.78992C21.8535 8.2521 21.1412 7.82353 20.2601 7.5042C19.379 7.16807 18.3105 7 17.0545 7H8Z"
                                  fill="white"
                                ></path>
                              </svg>
                            }
                          />
                          <DropDownItem
                            user={user}
                            to={"/rotate-pdf/edit"}
                            title={"Rotate PDF"}
                            file={file}
                            icon={
                              <svg
                                viewBox="0 0 32 32"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M0 4C0 1.79086 1.79086 0 4 0H28C30.2091 0 32 1.79086 32 4V28C32 30.2091 30.2091 32 28 32H4C1.79086 32 0 30.2091 0 28V4Z"
                                  fill="#0FC0C5"
                                ></path>
                                <path
                                  d="M16.5 27C21.4706 27 25.5 22.7862 25.5 17.5882C25.5 15.0231 24.5187 12.6976 22.9273 11"
                                  stroke="white"
                                  strokeWidth="0.5"
                                  strokeDasharray="2 1"
                                ></path>
                                <path
                                  d="M16.5 27C10.9772 27 6.5 22.7467 6.5 17.5C6.5 12.2533 10.9772 8 16.5 8"
                                  stroke="white"
                                ></path>
                                <path
                                  d="M16 5L19 8L16 11V5Z"
                                  fill="white"
                                ></path>
                              </svg>
                            }
                          />
                          <DropDownItem
                            user={user}
                            to={"/protect-pdf"}
                            title={"Protect PDF"}
                            file={file}
                            icon={
                              <svg
                                viewBox="0 0 32 32"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M0 4C0 1.79086 1.79086 0 4 0H28C30.2091 0 32 1.79086 32 4V28C32 30.2091 30.2091 32 28 32H4C1.79086 32 0 30.2091 0 28V4Z"
                                  fill="#FF5975"
                                ></path>
                                <path
                                  d="M15.7888 7.61318L16 7.534L16.2112 7.61318L17.2307 7.99551L20.3244 9.15566L23.4182 10.3158L24.4377 10.6981L24.4943 10.7194C24.3596 16.4023 22.2126 19.8326 20.1128 21.85C19.0361 22.8844 17.9634 23.5551 17.1626 23.9662C16.7624 24.1716 16.4311 24.3117 16.2027 24.3997C16.1259 24.4292 16.0608 24.4528 16.0087 24.4711C15.9558 24.4507 15.8896 24.4243 15.8113 24.3914C15.5818 24.295 15.2494 24.143 14.848 23.9242C14.0447 23.4864 12.9691 22.7833 11.8899 21.7261C9.78492 19.6641 7.64168 16.2331 7.50585 10.7193L7.56228 10.6981L8.58181 10.3158L11.6756 9.15566L14.7693 7.99551L15.7888 7.61318Z"
                                  stroke="white"
                                ></path>
                              </svg>
                            }
                          />
                          <DropDownItem
                            user={user}
                            to={"/delete-Pages/edit"}
                            title={"Delete PDF pages"}
                            file={file}
                            icon={
                              <svg
                                viewBox="0 0 32 32"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M0 4C0 1.79086 1.79086 0 4 0H28C30.2091 0 32 1.79086 32 4V28C32 30.2091 30.2091 32 28 32H4C1.79086 32 0 30.2091 0 28V4Z"
                                  fill="#0FC0C5"
                                ></path>
                                <path
                                  d="M11.5 9.5V6.5H20.5V9.5"
                                  stroke="white"
                                ></path>
                                <path d="M7 9.5H25" stroke="white"></path>
                                <path
                                  d="M10.5 24.5L9.5 11.5H22.5L21.5 24.5H10.5Z"
                                  stroke="white"
                                ></path>
                                <path d="M14.5 14V21" stroke="white"></path>
                                <path d="M17.5 14V21" stroke="white"></path>
                              </svg>
                            }
                          />
                          <DropDownItem
                            user={user}
                            to={"/extract-pdf/edit"}
                            title={"Extract PDF"}
                            file={file}
                            icon={
                              <svg
                                viewBox="0 0 32 32"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M0 4C0 1.79086 1.79086 0 4 0H28C30.2091 0 32 1.79086 32 4V28C32 30.2091 30.2091 32 28 32H4C1.79086 32 0 30.2091 0 28V4Z"
                                  fill="#7961F2"
                                ></path>
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  fill="white"
                                  d="M9.38925 24.7847C11.2743 25.4574 13.3599 24.5013 14.0474 22.6493L16 17.3898L17.9526 22.6493C18.6401 24.5013 20.7257 25.4574 22.6108 24.7847C24.4958 24.112 25.4666 22.0653 24.7791 20.2133C24.0915 18.3612 22.006 17.4052 20.1209 18.0779C19.2467 18.3898 18.5691 18.9972 18.1624 19.7437L16.6442 15.6544L19.8571 7L19.1194 7.37144C18.575 7.64549 18.1561 8.1114 17.9466 8.67569L16 13.9191L14.0534 8.67569C13.8439 8.1114 13.425 7.64549 12.8806 7.37144L12.1429 7L15.3558 15.6544L13.8376 19.7437C13.4309 18.9972 12.7533 18.3898 11.8791 18.0779C9.99404 17.4052 7.9085 18.3612 7.22094 20.2133C6.53338 22.0653 7.50417 24.112 9.38925 24.7847ZM9.80423 23.6669C11.061 24.1153 12.4513 23.478 12.9097 22.2433C13.3681 21.0086 12.7209 19.6441 11.4641 19.1957C10.2074 18.7472 8.81706 19.3846 8.35869 20.6193C7.90032 21.854 8.54751 23.2184 9.80423 23.6669ZM22.1958 23.6669C23.4525 23.2184 24.0997 21.854 23.6413 20.6193C23.1829 19.3846 21.7926 18.7472 20.5359 19.1957C19.2791 19.6441 18.6319 21.0086 19.0903 22.2433C19.5487 23.478 20.939 24.1153 22.1958 23.6669Z"
                                ></path>
                              </svg>
                            }
                          />
                          <DropDownItem
                            user={user}
                            to={"/extract-images"}
                            title={"Extract images"}
                            file={file}
                            conversionType={"extract-images"}
                            icon={
                              <svg
                                viewBox="0 0 32 32"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M0 4C0 1.79086 1.79086 0 4 0H28C30.2091 0 32 1.79086 32 4V28C32 30.2091 30.2091 32 28 32H4C1.79086 32 0 30.2091 0 28V4Z"
                                  fill="#0FC0C5"
                                ></path>
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M10.948 17V16.063H12.0346V13.1732H11.0976V12.4567C11.6409 12.3543 11.9874 12.2126 12.3417 12H13.1921V16.063H14.1291V17H10.948Z"
                                  fill="white"
                                ></path>
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M19.0541 21V20.3509L19.6174 19.8154C20.5623 18.9061 21.187 18.2163 21.187 17.6306C21.187 17.1515 20.9165 16.8887 20.4915 16.8887C20.136 16.8887 19.8655 17.1283 19.6182 17.391L19 16.7805C19.4869 16.2628 19.9428 16 20.6461 16C21.6121 16 22.2689 16.6182 22.2689 17.5611C22.2689 18.3879 21.4961 19.2689 20.7002 20.1036C20.9474 20.0726 21.2875 20.0417 21.5193 20.0417H22.5085V21H19.0541Z"
                                  fill="white"
                                ></path>
                                <rect
                                  x="7.5"
                                  y="7.5"
                                  width="10"
                                  height="13"
                                  stroke="white"
                                ></rect>
                                <path
                                  d="M18 11.5H24.5V24.5H14.5V20"
                                  stroke="white"
                                ></path>
                              </svg>
                            }
                          />
                        </ul>
                      </div>
                    )}
                  </>
                )}
                <DropDownItem
                  user={user}
                  to={file?.downloadUrl}
                  title={"Download"}
                  download={true}
                  icon={
                    <svg
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                    >
                      <path d="M18 20H5V15H6V19H17V15H18V20ZM12 4V15.19L14.3 13L15 13.6667L11.5 17L8 13.6667L8.7 13L11 15.19V4H12Z"></path>
                    </svg>
                  }
                />
                <DropDownItem
                  user={user}
                  to={null}
                  title={"Rename"}
                  setIsRenameModalOpen={setIsRenameModalOpen}
                  icon={
                    <svg
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                    >
                      <path d="M22 17H16V17.5C16 18.8255 17.0315 19.91 18.3356 19.9947L18.5 20H21V21H18.5C17.2265 21 16.1119 20.3198 15.5005 19.303C14.9242 20.26 13.9029 20.9188 12.723 20.993L12.5 21H10V20H12.5L12.6644 19.9947C13.9141 19.9136 14.9136 18.9141 14.9947 17.6644L15 17.5V12H13V11H15V6.5C15 5.17452 13.9685 4.08996 12.6644 4.00532L12.5 4H10V3H12.5C13.7735 3 14.8881 3.68016 15.5005 4.69702C16.1119 3.68016 17.2265 3 18.5 3H21V4H18.5C17.1193 4 16 5.11929 16 6.5V6.999L22 7V17ZM13 7V8L3 7.999V16H13V17H2V7H13ZM21 16V8H16V11H18V12H16V16H21Z"></path>
                    </svg>
                  }
                />
                <DropDownItem
                  user={user}
                  to={null}
                  title={"Delete"}
                  file={file}
                  icon={
                    <svg
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                    >
                      <path d="M16 4V6.999L20 7V8L17.934 7.999L17.1429 20H6.85714L6.066 7.999L4 8V7L8 6.999V4H16ZM17 8H7L7.73708 19H16.2629L17 8ZM12.5 9V18H11.5V9H12.5ZM10 9V18H9V9H10ZM15 9V18H14V9H15ZM15 5H9V7H15V5Z"></path>
                    </svg>
                  }
                />
              </ul>
            </div>
          )}
          {isRenameModalOpen && (
            <Modal
              user={user}
              file={file}
              setIsRenameModalOpen={setIsRenameModalOpen}
            />
          )}
        </div>
      </div>
    </li>
  );
};

export default File;
