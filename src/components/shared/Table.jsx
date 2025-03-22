import { Container, Paper, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { darkBorder, darkElevated, darkPaper, darkText, darkTextSecondary, lightBlue } from "../../constants/color";

const Table = ({ rows, columns, heading, rowHeight = 52 }) => {
  return (
    <Container
      sx={{
        height: "100vh",
        paddingTop: "2rem",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: "1rem 2rem",
          borderRadius: "1rem",
          margin: "auto",
          width: "100%",
          overflow: "hidden",
          height: "calc(100% - 2rem)",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
          backgroundColor: darkPaper,
          border: `1px solid ${darkBorder}`,
          backgroundImage: "linear-gradient(rgba(0, 184, 169, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 184, 169, 0.02) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <Typography
          textAlign={"center"}
          variant="h4"
          sx={{
            margin: "1.5rem",
            textTransform: "uppercase",
            color: lightBlue,
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
          }}
        >
          {heading}
        </Typography>
        <DataGrid
          rows={rows}
          columns={columns}
          rowHeight={rowHeight}
          style={{
            height: "80%",
          }}
          sx={{
            border: "none",
            color: darkText,
            fontFamily: "'Poppins', sans-serif",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: darkElevated,
              color: lightBlue,
              fontWeight: 600,
              borderBottom: `1px solid ${darkBorder}`,
            },
            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid ${darkBorder}`,
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: `${lightBlue}10`,
            },
            "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
              width: "8px",
              height: "8px",
            },
            "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-track": {
              background: "rgba(0,0,0,0.2)",
              borderRadius: "10px",
            },
            "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb": {
              background: "rgba(0, 184, 169, 0.3)",
              borderRadius: "10px",
              "&:hover": {
                background: "rgba(0, 184, 169, 0.5)",
              },
            },
            "& .MuiTablePagination-root": {
              color: darkText,
            },
            "& .MuiTablePagination-selectIcon": {
              color: darkTextSecondary,
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: `1px solid ${darkBorder}`,
            },
            "& .MuiButtonBase-root": {
              color: darkText,
            },
          }}
        />
      </Paper>
    </Container>
  );
};

export default Table;