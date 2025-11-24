import React from 'react';

const SizeSelector = ({ sizes, selectedSize, onSizeSelect }) => {
  if (!sizes || sizes.length === 0) {
    return null;
  }

  return (
    <div className="size-selector">
      <label>Tallas:</label>
      <div className="size-options">
        {sizes.map(size => (
          <button
            key={size.size}
            className={`size-option ${selectedSize === size.size ? 'selected' : ''} ${size.stock === 0 ? 'out-of-stock' : ''}`}
            onClick={() => onSizeSelect(size.size)}
            disabled={size.stock === 0}
          >
            {size.size}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;
