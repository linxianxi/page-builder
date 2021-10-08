import { Button, useDisclosure } from "@chakra-ui/react";
import React, { FC, useState } from "react";
import { Modal, Thumbnail, Table } from "@ahri-ui/core";
import { useNode } from "@craftjs/core";
import { useCallback } from "react";
import { useProducts } from "../../../../../hooks";

export const ProductsModal: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selected, setSelected] = useState<React.Key>();
  const [page, setPage] = useState(1);

  const { data, isFetching } = useProducts(
    {
      config: {
        data: { page_size: 20, page: 1, sort: "-date" },
      },
    },
    { enabled: isOpen }
  );

  const {
    actions: { setProp },
  } = useNode();

  const handleSubmit = useCallback(async () => {
    setProp((props) => {
      props.productId = selected;
    });
    onClose();
  }, [onClose, selected, setProp]);

  return (
    <>
      <Button onClick={onOpen}>选择商品</Button>

      <Modal
        size="xl"
        isOpen={isOpen}
        onClose={onClose}
        title="选择商品"
        primaryAction={{ isDisabled: !selected, onClick: handleSubmit }}
        secondaryActions={[{ onClick: onClose }]}
        scrollBehavior="inside"
      >
        <Table
          rowKey="ID"
          loading={isFetching}
          columns={[
            {
              dataIndex: "image",
              render: (_: any, record: any) => (
                <Thumbnail src={record.image} width={60} />
              ),
            },
            {
              dataIndex: "title",
            },
          ]}
          pagination={{
            total: data?.meta.total,
            current: page,
            pageSize: 20,
            showSizeChanger: false,
            onChange: (page, pageSize) => {
              console.log("change", page, pageSize);
              setPage(page);
            },
          }}
          rowSelection={{
            type: "radio",
            onChange: (selectedRowKeys) => {
              setSelected(selectedRowKeys[0]);
            },
          }}
          dataSource={data?.data || []}
        />
      </Modal>
    </>
  );
};
