function SparkleLoader() {
    return (
      <div className="flex items-center justify-center">
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
        >
          <style>{`
            @keyframes sparkle-pop {
              0%, 100% { transform: scale(0.6); opacity: 0.3; }
              50%       { transform: scale(1.2); opacity: 1; }
            }
            .sp-a {
              animation: sparkle-pop 1.5s ease-in-out infinite;
              transform-origin: 12px 12px;
            }
            .sp-b {
              animation: sparkle-pop 1.5s ease-in-out infinite;
              animation-delay: 0.4s;
              transform-origin: 36px 28px;
            }
            .sp-c {
              animation: sparkle-pop 1.5s ease-in-out infinite;
              animation-delay: 0.8s;
              transform-origin: 24px 36px;
            }
          `}</style>
  
          <g className="sp-a">
            <path
              d="M12 4 L14 10 L20 12 L14 14 L12 20 L10 14 L4 12 L10 10 Z"
              fill="#D4537E"
            />
          </g>
          <g className="sp-b">
            <path
              d="M36 20 L38 26 L44 28 L38 30 L36 36 L34 30 L28 28 L34 26 Z"
              fill="#ED93B1"
            />
          </g>
          <g className="sp-c">
            <path
              d="M24 30 L25.5 34.5 L30 36 L25.5 37.5 L24 42 L22.5 37.5 L18 36 L22.5 34.5 Z"
              fill="#F4C0D1"
            />
          </g>
        </svg>
      </div>
    );
  }