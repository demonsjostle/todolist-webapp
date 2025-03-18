"use client";

import React from "react";
interface CardProps {
  children?: React.ReactNode;
}
const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-96 bg-white shadow-lg rounded-lg p-5 overflow-x-hidden overflow-y-auto">
      {children}
    </div>
  );
};
export default Card;
