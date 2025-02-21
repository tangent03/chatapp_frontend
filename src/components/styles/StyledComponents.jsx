import { styled } from "@mui/material";
import { Link as LinkComponent } from "react-router-dom";
import { grayColor } from "../../constants/color";

export const VisuallyHiddenInput = styled('input')({
    border:0,
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)', // Safari
    height: 1,
    margin:-1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
    padding: 0,
  });

export const Link = styled(LinkComponent)
`
    text-decoration:none;
    color:black;
    padding:1rem;
    &:hover {
    background-color: rgba(0,0,0,0.1);
    }
`;


export const InputBox = styled("input")`
    padding: 0 3rem;
    border-radius: 1.5rem;
    border: 1px solid #ccc;
    width: 100%;
    outline: none;
    height: 100%;
    background-color:${grayColor};
`;

