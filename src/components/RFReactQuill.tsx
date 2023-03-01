import {
  FormHelperText,
  FormHelperTextProps,
  InputLabel,
  InputLabelProps,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { FormikProps } from "formik";
import _ from "lodash";
import React, { FC, useEffect, useRef } from "react";
import { getFieldError, IFieldProps } from "react-forms";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import QuillToolbar, { QuillToolbarProps } from "./QuillToolbar";
import { DEFAULT_FONT_SIZE } from "./Constants";

export interface QuillFontSizeOption {
  label: string;
  value: string;
}

export interface ReactQuillFieldProps {
  name: string;
  label: string;
  labelProps?: InputLabelProps;
  helperText?: string;
  helperTextProps?: FormHelperTextProps;
  sizes?: QuillFontSizeOption[];
  customImageUploadAdapter?: (file: any) => Promise<string>;
  toolbarProps?: Omit<QuillToolbarProps, "customSizes" | "id">;
}

export interface RichTextEditorProps extends IFieldProps {
  fieldProps?: ReactQuillFieldProps;
}

const RichTextEditor: FC<RichTextEditorProps> = (props) => {
  const {
    fieldConfig,
    formikProps = {} as FormikProps<any>,
    fieldProps = {} as ReactQuillFieldProps,
  } = props;
  const {
    label,
    labelProps,
    helperText,
    helperTextProps,
    sizes,
    toolbarProps = {},
    name,
    ...restFieldProps
  } = fieldProps;

  const classes = useStyles();
  useEffect(() => {
    const Size = Quill.import("attributors/style/size");
    const Align = Quill.import("attributors/style/align");
    Size.whitelist = sizes?.map((size) => size.value) || [
      "11px",
      "12px",
      "14px",
      "16px",
      "18px",
      "20px",
      "24px",
      "34px",
    ];

    Quill.register(Size, true);
    Quill.register(Align, true);
  }, [sizes]);

  const quillRef = useRef<ReactQuill | null>(null);

  const value = _.get(formikProps, `values.${name}`) || "";
  const errorText = getFieldError(name, formikProps);

  const showColorPicker = (value: any) => {
    const quill = quillRef.current?.getEditor();
    if (value === "color-picker") {
      var picker = document.getElementById("color-picker") as HTMLInputElement;
      if (!picker) {
        picker = document.createElement("input");
        picker.id = "color-picker";
        picker.type = "color";
        picker.style.display = "none";
        picker.value = "#FF0000";
        document.body.appendChild(picker);

        picker.addEventListener(
          "change",
          function () {
            quill?.format("color", picker.value);
          },
          false
        );
      }
      picker.click();
    } else {
      quill?.format("color", value);
    }
  };

  function imageHandler() {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    // Listen upload local image and save to server
    input.onchange = () => {
      const file = input?.files?.[0];
      let reader = new FileReader();
      if (file) {
        reader.onload = () => {
          let fileInfo = {
            name: file.name,
            type: file.type,
            size: Math.round(file.size / 1000) + " kB",
            base64: reader.result,
            file: file,
          };
          saveToServer(fileInfo);
        };
        reader["readAsDataURL"](file);
      }
    };
  }

  const saveToServer = async <T extends {}>(file?: T) => {
    if (fieldProps.customImageUploadAdapter) {
      const url = await fieldProps.customImageUploadAdapter(file);
      const quill = quillRef.current?.getEditor();
      const range = quill?.getSelection();
      if (range) quill?.insertEmbed(range.index, "image", url);
    }
  };

  useEffect(() => {
    const quill = quillRef.current?.getEditor();
    var toolbar = quill?.getModule("toolbar");
    toolbar.addHandler("color", showColorPicker);
    if (fieldProps.customImageUploadAdapter)
      toolbar.addHandler("image", imageHandler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  let { toolbarId } = React.useMemo(
    () => ({
      toolbarId: (name + Math.random().toString(36)).replace(/[^\w]/gi, ""),
    }),
    [name]
  );
  // If toolbarId has any special characters, then the ReactQuill editor won't be able to find it and the page will fail to load.
  // Also pad an alphanumeric random string of 0-11 characters that make sure that toolbarId is unique for about 70M entries
  // https://stackoverflow.com/a/12502559/10032950


  return (
    <>
      <InputLabel {...labelProps} error={!!errorText}>
        {label}
      </InputLabel>
      <QuillToolbar {...toolbarProps} customSizes={sizes} id={toolbarId} />
      <ReactQuill
        ref={(ref) => {
          quillRef.current = ref;
        }}
        modules={getQuillModule(toolbarId)}
        className={classes.rte}
        value={value}
        onChange={(data) => {
          // console.log({ data });
          // console.count("onChange");
          formikProps?.setFieldValue(fieldConfig?.valueKey ?? "", data);
        }}
        onFocus={() => {
          formikProps.setFieldTouched(fieldConfig?.valueKey ?? "");
        }}
        {...restFieldProps}
      />
      <FormHelperText {...helperTextProps} error={!!errorText}>
        {errorText || helperText}{" "}
      </FormHelperText>
    </>
  );
};

const useStyles = makeStyles<Theme>(() => {
  return createStyles({
    rte: {
      "& .ql-editor": {
        minHeight: 160,
        fontSize: DEFAULT_FONT_SIZE, // documentation: https://github.com/quilljs/quill/issues/1493 (.ql-editor works better than using .ql-container as suggested in the comments)
      },
      "& .ql-color .ql-picker-options [data-value=color-picker]:before": {
        content: "Pick Color",
      },
      "& .ql-color .ql-picker-options [data-value=color-picker]": {
        background: "none !important",
        width: "100% !important",
        height: "25px !important",
        textAlign: "center",
        color: "blue",
        textDecoration: "underline",
      },
    },
  });
});

export default RichTextEditor;

export const getQuillModule = (toolbarId: string) => {
  return {
    toolbar: `#${toolbarId}`,
  };
};
