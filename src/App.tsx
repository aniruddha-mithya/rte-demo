import React, { FC, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { Editor, Renderer } from "@mithya-team/rich-text-editor";
import { Box, Card, CardContent, Paper, Typography } from "@material-ui/core";
import EmbedHandler from "./EmbedHandler";

function App() {
  const [currentValue, setCurrentValue] = useState("");
  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <Box style={{ width: 600, marginRight: 20 }}>
        <Editor
          className="editor"
          // imageUploader={async () => {
          //   return new Promise((res) => {
          //     res("https://picsum.photos/512");
          //   });
          // }}
          ImageUploadHandler={({ onFinish }) => {
            return (
              <button onClick={() => onFinish("https://picsum.photos/512")}>
                Add random Image
              </button>
            );
          }}
          onChange={setCurrentValue}
          AddEmbedHandler={EmbedHandler}
          EmbedPlaceholder={(props) => {
            if ((props as CardProps).isCard) {
              const { title = "", subtitle = "" } = props as {
                title?: string;
                subtitle?: string;
              };
              return (
                <Card>
                  <CardContent>
                    <Typography variant="h1">{title}</Typography>
                    <Typography variant="subtitle1">{subtitle}</Typography>
                  </CardContent>
                </Card>
              );
            }
            if ((props as { isImg: boolean }).isImg)
              return (
                <img
                  src={(props as { img: string }).img}
                  className="img-placeholder"
                />
              );
            return <></>;
          }}
        />
      </Box>

      <Box style={{ width: 600, marginLeft: 20 }}>
        <Renderer<CardProps | ImgProps>
          renderString={currentValue}
          EmbedRenderer={(props: CardProps | ImgProps) => {
            if (objIsCardProps(props))
              return (
                <div
                  style={{
                    border: "1px solid lightgray",
                    borderRadius: 8,
                    padding: 8,
                    display: "flex",
                  }}
                >
                  <div style={{}}>
                    <h1 style={{ textAlign: "left" }}>{props.title}</h1>
                    <span>{props.subtitle}</span>
                    <br />
                    <span>{props.text}</span>
                  </div>
                </div>
              );
            else return <img src={props.img} className="img" />;
          }}
        />
      </Box>
      {/*<Formik
        initialValues={{}}
        onSubmit={function (
          values: FormikValues,
          formikHelpers: FormikHelpers<FormikValues>
        ): void | Promise<any> {
          throw new Error("Function not implemented.");
        }}
      >
        {(formikProps) => (
          <>
            <RFReactQuill
              formikProps={formikProps}
              fieldProps={{
                name: "biography",
                label: "Biography",
              }}
              fieldConfig={{ type: "", valueKey: "biography", fieldProps: {} }}
            />
          </>
        )}
      </Formik> */}
    </Box>
  );
}

export default App;

interface CardProps {
  title: string;
  subtitle: string;
  text: string;
  isCard: boolean;
}

interface ImgProps {
  img: string;
  isImg: boolean;
}

const objIsCardProps = (obj: unknown): obj is CardProps => {
  const _obj = obj as CardProps;
  return !!_obj.title && !!_obj.subtitle && !!_obj.text;
};
