import React from "react";

interface ErrorDisplayProps {
  message: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => (
  <div style={{ color: "red" }}>{message}</div>
);
