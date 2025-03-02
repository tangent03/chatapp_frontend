import { styled } from "@mui/material";
import { Link as LinkComponent } from "react-router-dom";
import { grayColor, matBlack } from "../../constants/color";

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

export const SearchField = styled("input")`
padding: 1rem 3rem;
width:20vmax;
border:none;
outline:none;
border-radius: 1.5rem;
background-color: ${grayColor};
font-size:1.1rem
`;

export const CurveButton = styled("button")`
border-radius: 1.5rem;
padding: 1rem 2rem;
outline:none;
background-color: ${matBlack};
color: white;
border: none;
font-size: 1.1rem;
cursor: pointer;
&:hover{
background-color:rgba(0,0,0,0.8)
}
`;