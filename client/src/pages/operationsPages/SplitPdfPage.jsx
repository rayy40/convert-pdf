import React from "react";
import FileUploadBox from "../../components/FileUploadBox/FileUploadBox";
import Head from "../../components/Metadata/Head";

const SplitPdfPage = () => {
  return (
    <div className="operationsPage-container">
      <Head
        title={"Split PDF"}
        description={"Split a PDF into two or more PDFs"}
      />
      <div className="operationsPage-container__wrapper">
        <div className="operationsPage-container__header">
          <div className="operationsPage-container__header--content">
            <div className="operationsPage-container__header--content__img">
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
            </div>
            <h1>Split PDF</h1>
          </div>
          <h2>An easy way to split multiple PDFs from one PDF</h2>
        </div>
        <div className="operationsPage-container__body">
          <FileUploadBox
            route={"split-pdf"}
            image={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 60">
                <path d="M61.9655252,3.24869071 L61.9765763,3.41278068 L62.065,5.867 L73.2405238,6.25793424 C74.5651997,6.30419294 75.6130942,7.37295092 75.6521743,8.67919891 L75.6517521,8.84366004 L73.9765763,56.8144197 C73.9303176,58.1390957 72.8615596,59.1869902 71.5553116,59.2260703 L71.3908505,59.2256481 L68.3103384,59.1184351 C68.030126,59.8845975 67.2946494,60.4314488 66.4314488,60.4314488 L30.4314488,60.4314488 C29.3268793,60.4314488 28.4314488,59.5360183 28.4314488,58.4314488 L28.431,55.114 L25.262454,55.2256481 C23.9377781,55.2719068 22.8178834,54.2788497 22.6877793,52.9785097 L22.6767282,52.8144197 L21.0015524,4.84366004 C20.9552937,3.51898409 21.9483508,2.39908942 23.2486907,2.2689853 L23.4127807,2.25793424 L59.3908505,1.00155235 C60.7155264,0.955293651 61.8354211,1.94835077 61.9655252,3.24869071 Z M59.431,9.43 L30.4314488,9.43144877 C29.9186129,9.43144877 29.4959416,9.81748896 29.4381765,10.3148276 L29.4314488,10.4314488 L29.431,39.431 L49.4314488,39.4314488 C49.9837335,39.4314488 50.4314488,39.879164 50.4314488,40.4314488 L50.4314488,51.4314488 C50.4314488,51.9837335 49.9837335,52.4314488 49.4314488,52.4314488 L29.431,52.431 L29.4314488,58.4314488 C29.4314488,58.9442846 29.817489,59.3669559 30.3148276,59.424721 L30.4314488,59.4314488 L66.4314488,59.4314488 C66.9442846,59.4314488 67.3669559,59.0454086 67.424721,58.5480699 L67.4314488,58.4314488 L67.431,17.431 L59.4314488,17.4314488 L59.431,9.43 Z M37.2275545,6.00094318 C36.4483334,5.97373218 35.7872098,6.54589593 35.688023,7.30354781 L35.676119,7.44768018 L35.676,8.431 L60.4314488,8.43144877 L68.4314488,16.4314488 L68.431,58.121 L71.4257499,58.2262572 C72.2049711,58.2534682 72.8660946,57.6813045 72.9652815,56.9236526 L72.9771854,56.7795202 L74.6523613,8.80876055 C74.6795723,8.0295394 74.1074085,7.36841587 73.3497567,7.26922904 L73.2056243,7.25732506 L37.2275545,6.00094318 Z M59.4257499,2.00094318 L23.4476802,3.25732506 C22.668459,3.28453606 22.0488581,3.9014237 22.002764,4.6641489 L22.0009432,4.80876055 L23.676119,52.7795202 C23.70333,53.5587414 24.3202177,54.1783423 25.0829429,54.2244364 L25.2275545,54.2262572 L28.431,54.114 L28.431,52.431 L27.4314488,52.4314488 C26.879164,52.4314488 26.4314488,51.9837335 26.4314488,51.4314488 L26.4314488,40.4314488 C26.4314488,39.879164 26.879164,39.4314488 27.4314488,39.4314488 L28.431,39.431 L28.4314488,10.4314488 C28.4314488,9.32687927 29.3268793,8.43144877 30.4314488,8.43144877 L34.628,8.431 L34.6767282,7.41278068 C34.7229869,6.08810473 35.7917449,5.04021022 37.0979929,5.00113017 L37.262454,5.00155235 L61.042,5.831 L60.9771854,3.44768018 C60.9499744,2.66845903 60.3330868,2.04885809 59.5703616,2.00276399 L59.4257499,2.00094318 Z M58.4314488,50.4314488 L58.4314488,51.4314488 L52.4314488,51.4314488 L52.4314488,50.4314488 L58.4314488,50.4314488 Z M31.7460555,42.4314488 L29.4314488,42.4314488 L29.4314488,49.4314488 L30.7348196,49.4314488 L30.7348196,46.8626414 L31.7909993,46.8626414 C33.375269,46.8626414 34.5887521,46.1455161 34.5887521,44.5935283 C34.5887521,42.966617 33.375269,42.4314488 31.7460555,42.4314488 Z M37.9370668,42.4314488 L35.9707746,42.4314488 L35.9707746,49.4314488 L38.0044825,49.4314488 C40.1842578,49.4314488 41.5101005,48.2219687 41.5101005,45.8993387 C41.5101005,43.5874121 40.1842578,42.4314488 37.9370668,42.4314488 Z M47.4314488,42.4314488 L42.9932465,42.4314488 L42.9932465,49.4314488 L44.2966173,49.4314488 L44.2966173,46.5094304 L46.9707746,46.5094304 L46.9707746,45.4605008 L44.2966173,45.4605008 L44.2966173,43.4803784 L47.4314488,43.4803784 L47.4314488,42.4314488 Z M37.8471791,43.437565 C39.3303252,43.437565 40.1730218,44.1868005 40.1730218,45.8993387 C40.1730218,47.5536506 39.3963926,48.3596396 38.0220695,48.4214718 L37.8471791,48.4253326 L37.2741454,48.4253326 L37.2741454,43.437565 L37.8471791,43.437565 Z M58.4314488,45.4314488 L58.4314488,46.4314488 L52.4314488,46.4314488 L52.4314488,45.4314488 L58.4314488,45.4314488 Z M31.6449319,43.4268616 C32.7348196,43.4268616 33.3078533,43.7158524 33.3078533,44.5935283 C33.3078533,45.3994286 32.8400643,45.8166006 31.8763839,45.862891 L31.6898757,45.8672286 L30.7348196,45.8672286 L30.7348196,43.4268616 L31.6449319,43.4268616 Z M58.4314488,40.4314488 L58.4314488,41.4314488 L52.4314488,41.4314488 L52.4314488,40.4314488 L58.4314488,40.4314488 Z M58.4314488,35.4314488 L58.4314488,36.4314488 L38.4314488,36.4314488 L38.4314488,35.4314488 L58.4314488,35.4314488 Z M58.4314488,30.4314488 L58.4314488,31.4314488 L38.4314488,31.4314488 L38.4314488,30.4314488 L58.4314488,30.4314488 Z M60.431,9.846 L60.431,16.431 L67.016,16.431 L60.431,9.846 Z"></path>
              </svg>
            }
            bgColor={"rgb(121, 97, 242)"}
            file={"PDFs"}
          />
        </div>
        <div className="operationsPage-container__footer"></div>
      </div>
    </div>
  );
};

export default SplitPdfPage;