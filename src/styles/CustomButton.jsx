import { Button } from "@mui/material";
import styled from "@mui/material/styles/styled";

const CustomButton = styled(Button)({
  // определение стиля
  backgroundColor: "#fff",
  color: "#000",
  "&:hover": {
    backgroundColor: "#979797",
  },
});

export default CustomButton;
