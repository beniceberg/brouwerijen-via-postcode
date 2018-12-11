import React from "react";

const Item = ({ keyName, value }) => (
  <p className="item">
    <span className="boldKey">{keyName}</span>
    <span>{value}</span>
  </p>
);

const BeerCard = ({ beer }) => (
  <div className="beerCard">
    <h3>{beer.name}</h3>
    <Item keyName="Keg:" value={beer.keg} />
    <Item keyName="Volume:" value={`${beer.volume} L`} />
    <Item keyName="Style:" value={beer.style} />
    <Item keyName="Alcohol:" value={`${beer.alcohol} %`} />
  </div>
);

const Beerslist = ({ beers }) => (
  <div className="beersList">
    {beers ? beers.map(el => <BeerCard beer={el} key={el.name} />) : null}
  </div>
);

export default Beerslist;
