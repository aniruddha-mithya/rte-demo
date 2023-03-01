import React from "react";
import { DEFAULT_FONT_SIZE } from "./Constants";
import { QuillFontSizeOption } from "./RFReactQuill";

type ToolbarOption = "size" | "color" | "image" | "align" | "indents" | "lists";
export interface QuillToolbarProps {
  id: string;
  // variant?: 'headings' | 'size';
  toolbarOptions?: ToolbarOption[];
  customSizes?: QuillFontSizeOption[];
  formats?: QuillFormat[];
}

const QuillToolbar: React.FC<QuillToolbarProps> = (props) => {
  const {
    toolbarOptions = ["align", "color", "image", "size", "indents", "lists"],
    customSizes,
    formats,
  } = props;

  return (
    <>
      <div id={props.id}>
        {toolbarOptions.includes("size") && customSizes
          ? getCustomSizeOptions(customSizes)
          : Size}
        <span className="ql-formats">
          {formats
            ? formats.map((format) => {
                return (
                  <button key={format} className={`ql-${format}`}></button>
                );
              })
            : Formatting}
          {toolbarOptions.includes("color") && Color}
        </span>
        {toolbarOptions.includes("image") && Image}
        {toolbarOptions.includes("align") && Align}
        {toolbarOptions.includes("indents") && Indents}
        {toolbarOptions.includes("lists") && Lists}
      </div>
    </>
  );
};

const Image = <button className="ql-image"></button>;

const Color = <input id="color" type="color" className="ql-color" />;

const getCustomSizeOptions = (customSizes: QuillFontSizeOption[]) => {
  if (!customSizes.length) {
    return null;
  }
  return (
    <select className="ql-size">
      {customSizes.map((size, index) => (
        <option
          style={{ fontSize: size.value }}
          key={size.value}
          selected={index === 0}
          value={size.value}
        >
          {size.label} ({size.value})
        </option>
      ))}
    </select>
  );
};

export const defaultFormats = ["bold", "italic", "underline", "link"];

const Size = (
  <select className="ql-size" defaultValue={`${DEFAULT_FONT_SIZE}`}>
    <option value="34px">Heading 1 (34px) </option>
    <option value="24px">Heading 2 (24px) </option>
    <option value="20px">Heading 3 (20px) </option>
    <option value="16px">Body 1 (16px) </option>
    <option value="14px">Body 2 (14px) </option>
    <option value="11px">Body 3 (11px) </option>
  </select>
);
const Lists = (
  <span className="ql-formats">
    <button className="ql-list" value="ordered"></button>
    <button className="ql-list" value="bullet"></button>
  </span>
);
const Indents = (
  <span className="ql-formats">
    <button className="ql-indent" value="-1"></button>
    <button className="ql-indent" value="+1"></button>
  </span>
);

const Formatting = (
  <>
    {defaultFormats.map((format) => (
      <button key={format} className={`ql-${format}`}></button>
    ))}
  </>
);

const Align = (
  <span className="ql-formats">
    <button className="ql-direction" value="rtl"></button>
    <select className="ql-align"></select>
  </span>
);

export default QuillToolbar;
export type QuillFormat =
  | "header"
  | "image"
  | "bold"
  | "italic"
  | "underline"
  | "strike"
  | "indent"
  | "link"
  | "image"
  | "color"
  | "script"
  | "font"
  | "align"
  | "direction"
  | "size"
  | "list"
  | "blockquote"
  | "code-block";

export const QUILL_FORMATS: QuillFormat[] = [
  "header",
  "image",
  "bold",
  "italic",
  "underline",
  "strike",
  "indent",
  "link",
  "image",
  "color",
  "script",
  "font",
  "align",
  "direction",
  "size",
  "list",
  "blockquote",
  "code-block",
];
