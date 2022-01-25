import { useEditor } from "@craftjs/core";
import React from "react";
import { Button, Dropdown, Menu, Space, Tooltip } from "antd";
import {
  RedoOutlined,
  UndoOutlined,
  DesktopOutlined,
  TableOutlined,
  MobileOutlined,
} from "@ant-design/icons";

import { usePreviewMode } from "../../hooks/usePreviewMode";

const previewModeOptions = [
  { name: "桌面", icon: <DesktopOutlined />, value: "desktop" },
  { name: "平板", icon: <TableOutlined />, value: "tablet" },
  { name: "移动", icon: <MobileOutlined />, value: "mobile" },
];

const TopBar = () => {
  const { query, canUndo, canRedo, actions } = useEditor((state, query) => ({
    enabled: state.options.enabled,
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo(),
  }));

  const [previewMode, setPreviewMode] = usePreviewMode();

  return (
    <>
      <div>Low code demo</div>

      <Space>
        <Dropdown
          overlay={
            <Menu>
              {previewModeOptions.map((item) => (
                <Menu.Item
                  key={item.name}
                  icon={item.icon}
                  onClick={() => setPreviewMode(item.value)}
                >
                  {item.name}
                </Menu.Item>
              ))}
            </Menu>
          }
        >
          <Button
            icon={
              previewModeOptions.find((item) => item.value === previewMode).icon
            }
            style={{ display: "flex", alignItems: "center" }}
          >
            {previewModeOptions.find((item) => item.value === previewMode).name}
          </Button>
        </Dropdown>

        <Button.Group>
          <Tooltip title="撤销">
            <Button
              disabled={!canUndo}
              icon={<UndoOutlined />}
              onClick={() => actions.history.undo()}
            />
          </Tooltip>
          <Tooltip title="重做">
            <Button
              disabled={!canRedo}
              icon={<RedoOutlined />}
              onClick={() => actions.history.redo()}
            />
          </Tooltip>
        </Button.Group>
        <Button
          onClick={() => {
            const data = query.serialize();
            localStorage.setItem("data", data);
            console.log(data);
          }}
          type="primary"
        >
          保存
        </Button>
      </Space>
    </>
  );
};

export default TopBar;
