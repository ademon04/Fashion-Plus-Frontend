import React from 'react';

const StatsCard = ({ title, value, icon, change, changeType = 'neutral' }) => {
  return (
    <div className="stats-card">
      <div className="stats-icon">
        {icon}
      </div>
      <div className="stats-content">
        <h3 className="stats-value">{value}</h3>
        <p className="stats-title">{title}</p>
        {change && (
          <div className={`stats-change ${changeType}`}>
            {change}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
