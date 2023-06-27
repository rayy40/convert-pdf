import React from "react";
import OperationsBox from "../../Layouts/OperationsBox";
import { operationsBoxInfo } from "../../Helper/Utilities";
import Head from "../../Components/Metadata/Head";

const HomePage = () => {
  return (
    <div className="homePage-container">
      <Head title={"Empyrean PDF"} description={"A place for your PDFs"} />
      <header>
        <h1>All Pdf Tools</h1>
        <p>
          Make use of our collection of PDF tools to process digital documents
          and streamline your workflow seamlessly.
        </p>
      </header>
      <div className="homePage-container__wrapper">
        <ul>
          {operationsBoxInfo.map((box, i) => (
            <li key={i} className="operations-box--list">
              <OperationsBox
                header={box?.header}
                description={box?.description}
                link={box?.link}
                image={box?.image}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HomePage;
