"use client"
import React, { useState, useEffect } from "react";

const CountDown = () => {
  const targetDate = new Date("10/10/2023").getTime();

  const calculateTimeDifference = () => {
    const now = new Date().getTime();
    return targetDate - now;
  };

  const [delay, setDelay] = useState(calculateTimeDifference);

  const calculateTimeUnits = () => {
    const remainingTime = delay;

    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    return {
      days,
      hours,
      minutes,
      seconds,
    };
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setDelay(calculateTimeDifference);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [delay]);

  const { days, hours, minutes, seconds } = calculateTimeUnits();

  return (
    <span className="font-bold text-5xl text-yellow-300">
      {days}:{hours}:{minutes}:{seconds}
    </span>
  );
};

export default CountDown;
