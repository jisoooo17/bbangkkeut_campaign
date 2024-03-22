import React from "react";

function Practice() {
  const labels = ["electricity", "gas", "water", "transportation", "waste"];
  return (
    <>
      {labels.map((label, index) => (
        <div key={index} className="result_box">
          <div className="practice_box">
            <img src={`/img/${label}.png`} />
          </div>{" "}
        </div>
      ))}
    </>
  );
}

export default Practice;
