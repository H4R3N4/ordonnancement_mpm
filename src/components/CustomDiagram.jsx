import React, { useState, useRef, useEffect } from "react";

const CustomDiagram = ({
  id,
  tot,
  tard,
  marge,
  onMove,
  initialPosition = { x: 0, y: 0 },
}) => {
  const [position, setPosition] = useState(initialPosition);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const isDeb = id === "DEB";
  const isFin = id === "FIN";

  const handleMouseDown = (e) => {
    dragging.current = true;
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e) => {
    if (dragging.current) {
      const newPos = {
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      };
      setPosition(newPos);
      onMove(id, newPos);
    }
  };

  const handleMouseUp = () => {
    dragging.current = false;
  };

  useEffect(() => {
    onMove(id, position);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        cursor: "grab",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <svg width="100" height="140" viewBox="0 0 100 140">
        {/* Cercle */}
        <circle
          cx="50"
          cy="70"
          r="40"
          stroke={marge === 0 ? "orange" : "black"}
          strokeWidth={2}
          strokeDasharray="4"
          fill={marge === 0 ? "#fffacd" : "none"} // jaune clair si critique
        />

        {/* Croix intérieure uniquement pour tâches normales */}
        {!isDeb && !isFin && (
          <>
            <line x1="50" y1="30" x2="50" y2="70" stroke="black" />
            <line x1="10" y1="70" x2="90" y2="70" stroke="black" />
          </>
        )}

        {/* TOT (date au plus tôt) à gauche */}
        <text x="30" y="65" fill="red" fontSize="12" textAnchor="middle">
          {tot}
        </text>

        {/* TARD (date au plus tard) à droite sauf pour DEB/FIN */}
        {!isDeb && !isFin && (
          <text x="70" y="65" fill="blue" fontSize="12" textAnchor="middle">
            {tard}
          </text>
        )}

        {/* Nom ou étiquette centrale */}
        <text x="50" y="100" fontSize="14" textAnchor="middle">
          {isDeb ? "deb" : isFin ? "fin" : id}
        </text>

        {/* Marge uniquement pour les tâches normales */}
        {!isDeb && !isFin && (
          <>
            <rect
              x="35"
              y="15"
              width="30"
              height="20"
              fill="green"
              stroke="brown"
              strokeDasharray="2"
            />
            <text x="50" y="30" fontSize="14" fill="white" textAnchor="middle">
              {marge}
            </text>
          </>
        )}
      </svg>
    </div>
  );
};

export default CustomDiagram;
