import React from 'react';

const MenuLoader = () => {
  return (
    <div
      style={{
        width: '18px',
        height: '18px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      role="progressbar"
    >
      <svg
        style={{
          animation: 'rotate 1.4s linear infinite',
        }}
        viewBox="22 22 44 44"
      >
        <circle
          cx="44"
          cy="44"
          r="20.2"
          fill="none"
          stroke="#220047" // Change this to any color you prefer
          strokeWidth="3.6"
          strokeDasharray="126"
          strokeDashoffset="0"
          strokeLinecap="round"
          style={{
            animation: 'dash 1.4s ease-in-out infinite',
          }}
        />
      </svg>

      {/* Keyframe animations */}
      <style>
        {`
          @keyframes rotate {
            100% {
              transform: rotate(360deg);
            }
          }

          @keyframes dash {
            0% {
              stroke-dasharray: 1, 200;
              stroke-dashoffset: 0;
            }
            50% {
              stroke-dasharray: 100, 200;
              stroke-dashoffset: -15px;
            }
            100% {
              stroke-dasharray: 100, 200;
              stroke-dashoffset: -125px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default MenuLoader;
