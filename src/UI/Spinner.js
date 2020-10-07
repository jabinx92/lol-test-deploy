import React from "react";
import { css } from "@emotion/core";
import MoonLoader from "react-spinners/MoonLoader";

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

class Spinner extends React.Component {
    state = {
      loading: true
    };

  render() {
    return (
      <div className="sweet-loading">
        <MoonLoader
          css={override}
          size={100}
          color={"#FFFFFF"}
          loading={this.state.loading}
        />
      </div>
    );
  }
}

export default Spinner