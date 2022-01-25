import { Collapse } from "antd";
import styled from "styled-components";

const StyledCollapse = styled(Collapse)`
  border: none;

  .ant-collapse-item,
  .ant-collapse-header {
    border-radius: 0 !important;
  }

  > .ant-collapse-item > .ant-collapse-header {
    padding: 5px 16px;
  }

  > .ant-collapse-item > .ant-collapse-header {
    display: flex;
    align-items: center;

    > div {
      display: flex;
      align-items: center;
    }
  }
`;

export { StyledCollapse };
export { default as ColorPicker } from "./components/ColorPicker";
