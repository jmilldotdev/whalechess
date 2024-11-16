import React, { useState, useEffect } from 'react';

export const Store = () => {
  const [showCapsule, setShowCapsule] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCapsule(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <img
          src="/chess/store.png"
          alt="Store Background"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            opacity: 0,
            animation: showCapsule ? "fadeInOverlay 1s ease forwards" : "none",
          }}
        />

        {showCapsule && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              opacity: 0,
              animation: "fadeInCapsule 1s ease forwards",
            }}
          >
            <img
              src="/chess/capsule.png"
              alt="Store Capsule"
              style={{
                maxWidth: "80%",
                height: "auto",
              }}
            />
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes fadeInOverlay {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes fadeInCapsule {
            from {
              opacity: 0;
              transform: translate(-50%, -40%);
            }
            to {
              opacity: 1;
              transform: translate(-50%, -50%);
            }
          }
        `}
      </style>
    </>
  );
};

export default Store; 