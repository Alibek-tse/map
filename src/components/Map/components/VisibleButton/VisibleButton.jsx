import React from "react";
import LayersIcon from "@mui/icons-material/Layers";
import CustomButton from "../../../../styles/CustomButton";


const VisibleButton = ({ onClick }) => {
  return (
      <CustomButton onClick={onClick}>
        <LayersIcon />
      </CustomButton>
  );
};

export default VisibleButton;