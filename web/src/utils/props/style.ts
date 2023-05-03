import memoize from "lodash/memoize";

export type CSSNumber = `${0 | 1 | 2 | 3}`;

type Margin =
  | "auto"
  | CSSNumber
  | `${CSSNumber} ${CSSNumber}`
  | `${CSSNumber} ${CSSNumber} ${CSSNumber}`
  | `${CSSNumber} ${CSSNumber} ${CSSNumber} ${CSSNumber}`;

export interface StyleProps {
  margin?: Margin;
}

const _marginToClasses = (
  margin: Margin | "" = ""
): Array<`margin-${"top" | "right" | "bottom" | "left"}-${CSSNumber}` | "margin-auto"> => {
  if (margin === "auto") return ["margin-auto"];
  const [top, right, bottom, left] = margin.split(" ") as CSSNumber[];
  if (left)
    return [
      `margin-top-${top}`,
      `margin-left-${left}`,
      `margin-right-${right}`,
      `margin-bottom-${bottom}`,
    ];
  else if (bottom)
    return [
      `margin-top-${top}`,
      `margin-left-${right}`,
      `margin-bottom-${bottom}`,
      `margin-right-${right}`,
    ];
  else if (right)
    return [
      `margin-top-${top}`,
      `margin-right-${right}`,
      `margin-bottom-${top}`,
      `margin-left-${right}`,
    ];
  else if (top)
    return [
      `margin-top-${top}`,
      `margin-right-${top}`,
      `margin-bottom-${top}`,
      `margin-left-${top}`,
    ];
  else return [];
};
export const marginToClasses = memoize(_marginToClasses);

export interface FontVariantProps {
  variant: "v1" | "v2" | "v3" | "v4" | "v5";
}
