import { Skeleton, keyframes, styled } from "@mui/material";
import { Link as LinkComponent } from "react-router-dom";
import { grayColor, lightBlue, matBlack, orange } from "../../constants/color";

const VisuallyHiddenInput = styled("input")({
  border: 0,
  clip: "rect(0 0 0 0)",
  height: 1,
  margin: -1,
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  whiteSpace: "nowrap",
  width: 1,
});

const Link = styled(LinkComponent)`
  text-decoration: none;
  color: ${matBlack};
  padding: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const InputBox = styled("input")`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  padding: 0 3rem;
  border-radius: 1.5rem;
  background-color: ${grayColor};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  &:focus {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
  }
  &::placeholder {
    opacity: 0.8;
  }
`;

const SearchField = styled("input")`
  padding: 1rem 2rem;
  width: 20vmax;
  border: none;
  outline: none;
  border-radius: 1.5rem;
  background-color: ${grayColor};
  font-size: 1.1rem;
  font-family: 'Poppins', sans-serif;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  &:focus {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
  }
`;

const CurveButton = styled("button")`
  border-radius: 1.5rem;
  padding: 1rem 2rem;
  border: none;
  outline: none;
  cursor: pointer;
  background-color: ${orange};
  color: white;
  font-size: 1.1rem;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  &:hover {
    background-color: ${lightBlue};
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
`;

const bounceAnimation = keyframes`
0% { transform: scale(1); }
50% { transform: scale(1.3); }
100% { transform: scale(1); }
`;

const BouncingSkeleton = styled(Skeleton)(() => ({
  animation: `${bounceAnimation} 1.5s infinite`,
  borderRadius: '8px',
}));

export {
    BouncingSkeleton, CurveButton, InputBox,
    Link, SearchField, VisuallyHiddenInput
};

