import React from 'react';

const OverviewCard = ({ title, value, description }) => {
  return (
    <div className="overview-card">
      <h3>{title}</h3>
      <p className="value">{value}</p>
      <p className="description">{description}</p>
    </div>
  );
};

export default OverviewCard;