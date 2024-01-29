import React, { useEffect, useState, CSSProperties } from "react";
import { Prism } from "react-syntax-highlighter";
import { okaidia as codeStyle } from "react-syntax-highlighter/dist/esm/styles/prism";

const PythonCodeDisplay: React.FC<{
  codeFile: string;
  startOpen?: boolean;
}> = ({ codeFile, startOpen = false }) => {
  const [code, setCode] = useState("");
  const [showCode, setShowCode] = useState(startOpen);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false); // New state
  const [isHoveringHide, setIsHoveringHide] = useState(false);
  const [isHoveringCopy, setIsHoveringCopy] = useState(false);

  useEffect(() => {
    fetch(codeFile)
      .then((response) => response.text())
      .then((text) => {
        setCode(text);
      });
  }, [codeFile]);

  const toggleCode = () => {
    setShowCode(!showCode);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code).then(
      () => {
        setShowCopiedMessage(true);
        setTimeout(() => {
          setShowCopiedMessage(false);
        }, 2000);
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  const codeContainerStyle: CSSProperties = {
    position: "relative",
    cursor: showCode ? "default" : "pointer",
    maxWidth: showCode ? "100%" : "fit-content",
    padding: "0",
    margin: "0 auto",
    overflowX: "auto",
  };

  const buttonStyle: CSSProperties = {
    position: "absolute",
    top: "0.6rem",
    right: "0.6rem",
    cursor: "pointer",
    padding: "0.6rem",
    backgroundColor: "transparent",
    color: "white",
    border: "none",
    borderRadius: "1rem",
    display: showCode ? "block" : "none",
    height: "2.5rem",
    margin: "0.3rem 0 0 0",
  };

  const copyButtonStyle: CSSProperties = {
    ...buttonStyle,
    right: "3.1rem",
  };

  const hoverEffect: CSSProperties = {
    backgroundColor: "rgba(0,0,0,0.3)",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
  };

  const cornerIconStyle: CSSProperties = {
    width: "1rem",
    filter: "invert(100%)",
  };

  const messageStyle: CSSProperties = {
    position: "absolute",
    top: "3.1rem",
    right: "0.6rem",
    padding: "0.4rem",
    backgroundColor: "rgba(0,0,0,0.3)",
    color: "white",
    borderRadius: "0.6rem",
    display: "block",
    margin: "0.3rem 0 0 0",
    fontSize: "1rem",
  };

  const handleMouseEnterHide = () => setIsHoveringHide(true);
  const handleMouseLeaveHide = () => setIsHoveringHide(false);
  const handleMouseEnterCopy = () => setIsHoveringCopy(true);
  const handleMouseLeaveCopy = () => setIsHoveringCopy(false);

  return (
    <div
      style={codeContainerStyle}
      onClick={!showCode ? toggleCode : undefined}
    >
      <button
        style={{ ...buttonStyle, ...(isHoveringHide ? hoverEffect : null) }}
        onMouseEnter={handleMouseEnterHide}
        onMouseLeave={handleMouseLeaveHide}
        onClick={toggleCode}
      >
        <img
          src="/images/blog/google-foobar-challenge/minimise.svg"
          alt="Hide"
          style={cornerIconStyle}
        />
      </button>
      <button
        style={{ ...copyButtonStyle, ...(isHoveringCopy ? hoverEffect : null) }}
        onMouseEnter={handleMouseEnterCopy}
        onMouseLeave={handleMouseLeaveCopy}
        onClick={copyToClipboard}
      >
        <img
          src="/images/blog/google-foobar-challenge/clipboard.svg"
          alt="Copy"
          style={cornerIconStyle}
        />
      </button>
      {showCopiedMessage && <div style={messageStyle}>Copied!</div>}
      <Prism language="python" style={codeStyle}>
        {showCode ? code : "--- Reveal Code ---"}
      </Prism>
    </div>
  );
};

export default PythonCodeDisplay;
