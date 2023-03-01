import React, { ElementType, FC, useMemo } from "react";

interface RendererProps<Delta = undefined> {
  renderString: string;
  renderer?: (props: Delta) => JSX.Element;
  separators?: { start: string; end: string };
  className?: string;
  couldHaveChunks?: boolean;
}

function Renderer<DeltaType>({
  renderString,
  renderer,
  separators,
  couldHaveChunks = true,
  className,
}: RendererProps<DeltaType>) {
  // Separate out plain html strings from object data.
  const chunkedOutRenderString = couldHaveChunks
    ? chunkOutRenderString<DeltaType>(
        renderString,
        separators?.start,
        separators?.end
      )
    : [renderString];

  const elements = useMemo(() => {
    return chunkedOutRenderString.map((chunk) => {
      if (typeof chunk === "string") {
        return <div dangerouslySetInnerHTML={{ __html: chunk }} />;
      }
      if (renderer) return renderer(chunk);
      else {
        console.error("No renderer given but renderString has chunks.");
        return null;
      }
    });
  }, [chunkedOutRenderString, renderer]);

  return <div className={className}>{elements}</div>;
}

export default Renderer;

/**
 * Separates out html strings and json object containing props for renderer.
 */

function chunkOutRenderString<Delta>(
  renderString: string,
  separatorStart = "{{{",
  separatorEnd = "}}}"
): Array<Delta | string> {
  let chunks: Array<string | Delta> = [];
  let _renderString = renderString;
  while (_renderString.length) {
    console.count("while loop");
    let startIndex = _renderString.indexOf(separatorStart);
    if (startIndex !== -1) {
      let stringChunk = _renderString.substring(0, startIndex);
      chunks.push(stringChunk);
      let temp = _renderString.substring(startIndex + separatorStart.length);
      let endIndex = temp.indexOf(separatorEnd);
      if (endIndex !== -1) {
        let jsonChunk = temp.substring(0, endIndex);
        jsonChunk = JSON.parse(`{${jsonChunk}}`);
        chunks.push(jsonChunk);
        _renderString = temp.substring(endIndex + separatorEnd.length);
      } else {
        // assuming the rest to be jsonChunk.
        let jsonChunk = temp;
        jsonChunk = JSON.parse(`{${jsonChunk}}`);
        chunks.push(jsonChunk);
        _renderString = "";
      }
    } else {
      chunks = [_renderString];
      _renderString = "";
    }
  }
  console.log({ chunks });
  return chunks.filter((item) => !!item);
}
