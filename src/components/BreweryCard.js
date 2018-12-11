import React from "react";

import { today } from "../utils/contants";

const BreweryCard = ({ brewery }) => (
  <div className="breweryCard">
    <p>
      <span>The nearest brewery open today is</span>
      <span className="breweryName">{brewery.name}</span>
    </p>
    <p>It's open:</p>
    <ul>
      {brewery.open.map(el => (
        <li key={el} className={`${el === today ? `today` : ``}`}>
          {el}
        </li>
      ))}
    </ul>
    <p>{`Address: ${brewery.address}, ${brewery.city}, ${brewery.zipcode}`}</p>
  </div>
);

export default BreweryCard;
