import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import { withStyles, IconButton } from "@material-ui/core";
import TablePagination from "@material-ui/core/TablePagination";
import Paper from "@material-ui/core/Paper";
import { CheckCircleOutline, NotInterested } from "@material-ui/icons";
import { solutionBluePrintListStyles } from "src/components/style/listStyles";
import { solutionBluePrintStyles } from "src/components/style/solutionBluePrintStyles";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { setAddBlueprint, editBlueprint } from "store";
import PropTypes from "prop-types";

function SolutionBlueprintList({ classes }) {
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const solutionBluePrintData = useSelector((state) => state.solutionBluePrint);
  const { directories_list } = solutionBluePrintData;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onEditBlueprint = (row) => {
    dispatch(
      editBlueprint({
        bpName: row.name,
      })
    );
    dispatch(
      setAddBlueprint({
        getSbList: true,
        blueprintName: row.name,
      })
    );
  };

  const getTableBody = () => {
    return (
      directories_list && (
        <TableBody>
          {directories_list
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row) => (
              <StyledTableRow key={row.name}>
                <StyledTableCell>{row.name}</StyledTableCell>
                <StyledTableCell
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "3.5rem 2rem",
                  }}
                >
                  {row.status.toLowerCase() === "verified" ? (
                    <CheckCircleOutline
                      className={`verified`}
                      fontSize="large"
                    />
                  ) : (
                    <NotInterested
                      className={`not_verified`}
                      fontSize="large"
                    />
                  )}
                  {row.status}
                </StyledTableCell>
                <StyledTableCell>
                  <IconButton
                    title="Edit Blueprint"
                    onClick={() => onEditBlueprint(row)}
                  >
                    <EditOutlinedIcon fontSize="large" />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
        </TableBody>
      )
    );
  };

  return (
    <>
      <div
        className={classes.title1}
        style={{ textAlign: "center", fontSize: "2rem", marginTop: "2rem" }}
      >
        {"Solution Blueprint List"}
      </div>
      <div className={classes.main}>
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell>Solution Blueprint Name</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Actions </StyledTableCell>
              </TableRow>
            </TableHead>
            {getTableBody()}
          </Table>
        </TableContainer>
        <TablePagination
          className={classes.pagination}
          classes={{
            actions: classes.paginationActions,
            caption: classes.paginationCaptions,
            select: classes.paginationSelect,
            selectIcon: classes.paginationSelectIcon,
            selectRoot: classes.paginationSelectRoot,
            menuItem: classes.paginationMenu,
            toolbar: classes.paginationToolBar,
          }}
          component="div"
          rowsPerPageOptions={[5, 10, 25]}
          count={directories_list?.length || 1}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </>
  );
}

const StyledTableRow = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.dark,
    "& td": {
      height: "3rem",
      "& .verified": {
        color: "green",
        marginRight: "1rem",
      },
      "& .not_verified": {
        color: "red",
        marginRight: "1rem",
      },
    },
  },
}))(TableRow);

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.background.tableHeader,
    color: theme.palette.text.titleText,
    fontSize: theme.layoutSpacing(16),
    borderBottom: `1px solid ${theme.palette.separator.grey}`,
    fontFamily: theme.title.h1.fontFamily,
    height: theme.spacing(7.5),
    border: "none",
    padding: theme.spacing(0.5, 2),
  },
  body: {
    fontSize: theme.layoutSpacing(14),
    border: "none",
    color: theme.palette.text.titleText,
    fontFamily: theme.body.B5.fontFamily,
    padding: theme.spacing(2, 2),
    "& .disabled svg": {
      opacity: "0.4",
    },
  },
}))(TableCell);

SolutionBlueprintList.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(
  (theme) => ({
    ...solutionBluePrintListStyles(theme),
    ...solutionBluePrintStyles(theme),
  }),
  { withTheme: true }
)(SolutionBlueprintList);
