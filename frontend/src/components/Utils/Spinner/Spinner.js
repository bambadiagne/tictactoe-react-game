import React from "react";
import Loading from "react-fullscreen-loading";

function Spinner({ loading }) {
  return <Loading loading={loading} loaderColor="#3498db" />;
}
export default Spinner;
