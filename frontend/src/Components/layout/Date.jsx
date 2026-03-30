import React, { useState, useEffect } from "react";

const DateTimeDisplay = () => {
  const [time, setTime] = useState("");

  // La date ne change jamais dans la journée
  const date = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  useEffect(() => {
    const updateTime = () => {
      const t = new Date().toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setTime(t);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className=" text-sm  text-center font-medium text-gray-800">
      {date}{" "}
      <span className="inline-block min-w-[8ch]">{time}</span>
    </span>
  );
};

export default DateTimeDisplay;
