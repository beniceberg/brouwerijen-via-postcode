import React from "react";
import PropTypes from "prop-types";

const Item = ({ keyName, value }) => (
  <p className="item">
    <span className="boldKey">{keyName}</span>
    <span>{value}</span>
  </p>
);

Item.propTypes = {
  keyName: PropTypes.string,
  value: PropTypes.string
};

const BeerCard = ({ beer }) => (
  <div className="beerCard">
    <h3>{beer.name}</h3>
    <Item keyName="Keg:" value={beer.keg} />
    <Item keyName="Volume:" value={`${beer.volume} L`} />
    <Item keyName="Style:" value={beer.style} />
    <Item keyName="Alcohol:" value={`${beer.alcohol} %`} />
  </div>
);

BeerCard.propTypes = {
  beer: PropTypes.object
};

const Beerslist = ({ beers }) => (
  <div className="beersList">
    {beers ? beers.map(el => <BeerCard beer={el} key={el.name} />) : null}
  </div>
);

Beerslist.propTypes = {
  beera: PropTypes.array
};

export default Beerslist;
