import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import DisplayScreen from "./displayscreen";
import useGetData from "../../utils/getdata";
import Loading from "../loading/loading";

const DisplayScreenItemsOnly = (props) => {
  const itemsPrintListQuery = useGetData(
    props.guid,
    "/api/v1/ItemSheets/MultiPick?" + props.itemQPath,
  );

  if (itemsPrintListQuery.isLoading)
    return (
      <div>
        <Loading />
      </div>
    );
  if (itemsPrintListQuery.isError) return <div>Error!</div>;

  return (
    <>
      <DisplayScreen
        id={"itemlist"}
        character={null}
        itemList={itemsPrintListQuery.data}
      />
    </>
  );
};

export default DisplayScreenItemsOnly;

DisplayScreenItemsOnly.propTypes = {
  props: PropTypes.object,
  character: PropTypes.object,
  formJSON: PropTypes.object,
  path: PropTypes.string,
  guid: PropTypes.string,
  id: PropTypes.string,
  itemList: PropTypes.array,
};
