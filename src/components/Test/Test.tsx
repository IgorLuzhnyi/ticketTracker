// import { type ReactNode, type ElementType } from "react";
import { TextField } from "@mui/material";

// type TestProps = {
//   as: ElementType;
//   children: ReactNode;
// };

// const Test = ({ as: Component, children }: TestProps) => {
//   return <TextField value={children} />;
// };

// export default Test;
type TestProps = {
  label: string;
};

const Test = (props: TestProps) => {
  return (
    <TextField
      {...props}
      variant="outlined"
      sx={{
        backgroundColor: "primary.light",
      }}
    />
  );
};

export default Test;
