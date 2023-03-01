import React, { FC, useEffect } from "react";
import ReactDOM from "react-dom";
import clsx from "clsx";
import "./EmbedHandler.css";

const modalLayer = document.querySelector("#modals");

interface EmbedHandlerProps {
  onFinish: (embedObject: Object) => void;
}

const EmbedHandler: FC<EmbedHandlerProps> = ({ onFinish }) => {
  const isOpen = true;

  useEffect(() => {
    const body = document.querySelector("body");
    if (isOpen && body) {
      body.style.position = "fixed";
    }

    return () => {
      if (body) body.style.position = "";
    };
  }, [isOpen]);

  if (modalLayer)
    return ReactDOM.createPortal(
      <div className={clsx(`modal--container`, { "modal--hide": !isOpen })}>
        <div className={`modal--bg`} />
        <div
          className={clsx(`modal--modal`, {
            hidden: !isOpen,
          })}
        >
          <button
            onClick={() => {
              onFinish({
                title: "You just added a card",
                subtitle: "This is the subtitle",
                text: "Some info not shown on the preview",
                isCard: true,
              });
            }}
          >
            Add Card
          </button>
          <button
            onClick={() => {
              onFinish({
                img: "https://picsum.photos/512",
                isImg: true,
              });
            }}
          >
            Add Image
          </button>
        </div>
      </div>,
      modalLayer
    );

  console.error("Modal layer is null");
  return <></>;
};

export default EmbedHandler;
