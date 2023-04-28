import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import CustomButton from "../../../../styles/CustomButton";

const HomeButton = ({ onClick }) => {
  return (
    <CustomButton onClick={onClick}>
      <HomeIcon />
    </CustomButton>
  );
};

export default HomeButton;
