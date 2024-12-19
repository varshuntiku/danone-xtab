import { useEffect, useState } from "react";
import clsx from "clsx";
import { Typography, TextField, Card } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import CodxCircularLoader from "src/components/CodxCircularLoader";
import { updateTreeView } from "store";
import { CheckCircleOutline, NotInterested } from "@material-ui/icons";

function BrowseBluePrintLists({ classes }) {
  const solutionBluePrintData = useSelector((state) => state.solutionBluePrint);
  const dispatch = useDispatch();
  const {
    collapse_browse_blueprint_screen,
    loading_blueprint,
    directories_list,
    all_treeview_nodes,
  } = solutionBluePrintData;
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState([]);

  useEffect(() => {
    if (directories_list && directories_list.length > 0) {
      setSelectedId(directories_list[0].id);
    }
  }, [loading_blueprint, directories_list]);

  const onEnvCardClicked = (el, clickedItem) => {
    const itemId = el.target.getAttribute("itemId");
    directories_list.forEach((item) => {
      if (item.id === +itemId) {
        setSelectedId(itemId);
      }
    });
    all_treeview_nodes.forEach((treeNode) => {
      if (treeNode.name === clickedItem.name) {
        dispatch(updateTreeView([treeNode]));
      }
    });
  };

  return (
    <div
      className={clsx(classes.main, classes.browseBlueprintSideBarContainer)}
    >
      {loading_blueprint ? (
        <div className={classes.browseBlueprintSideBarLoadingContainer}>
          <CodxCircularLoader size={40} />
        </div>
      ) : (
        <>
          <TextField
            variant="outlined"
            placeholder="Search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              // handleSearch(e.target.value);
            }}
            InputProps={{
              startAdornment: <Search className="searchIcon" />,
            }}
            className={classes.searchField}
          />
          <Typography className={classes.textLink} variant="h4">
            Default Blueprint
          </Typography>

          {/* <Typography
                        variant="h4"
                        style={{ marginTop: '2rem' }}
                    >{`Showing results for "Projects"`}</Typography> */}
          <ul
            className={`${
              collapse_browse_blueprint_screen
                ? clsx(classes.list, classes.expandedList)
                : classes.list
            }`}
          >
            {directories_list.map((item, index) => {
              return (
                <Card
                  elevation={0}
                  component={"li"}
                  key={index}
                  onClick={(el) => onEnvCardClicked(el, item)}
                  itemId={item.id}
                  className={clsx(
                    classes.listItem,
                    item.id === +selectedId ? classes.selectedListItem : ""
                  )}
                  // className={classes.listItem}
                >
                  <Typography itemId={item.id} variant="body1">
                    {item.name}
                  </Typography>
                  {item.status.toLowerCase() === "verified" ? (
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
                </Card>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

BrowseBluePrintLists.propTypes = {
  classes: PropTypes.object,
};

export default BrowseBluePrintLists;
