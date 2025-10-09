import React from "react";
import {
  Table,
  Button,
  Input,
  Card,
  Select,
  Modal,
  Space,
  Popconfirm,
  message,
} from "antd";
import type { ColumnsType, TablePaginationConfig, TableProps } from "antd/es/table";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import http from "../../../api/http";
import FormConcernOption from "../../Forms/Concern/FormConcernOption";
import type { ConcernOptionRecord } from "../../Forms/Concern/FormConcernOption";

/** ===== Types ===== */
type QueryParams = { q?: string; concern_id?: number };
type Row = ConcernOptionRecord & { concern?: { id: number; name: string } };

type ServePayload = {
  currentPage: string | number;
  perPage: string | number;
  total: string | number;
  data: (ConcernOptionRecord & { concern?: { id: number; name: string } })[];
};

type ListResponse = {
  data?: { serve: ServePayload };
};

const { Search } = Input;

type Props = {
  /** optional — jika diisi, tabel hanya menampilkan option untuk concern tsb */
  concernId?: number;
  concernName?: string;
};

const TableConcernOption: React.FC<Props> = ({ concernId }) => {
  const [data, setData] = React.useState<
    (ConcernOptionRecord & { concern?: { id: number; name: string } })[]
  >([]);
  const [params, setParams] = React.useState<QueryParams>({
    q: "",
    concern_id: concernId,
  });
  const [pagination, setPagination] = React.useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = React.useState(false);

  const [open, setOpen] = React.useState(false);
  const [current, setCurrent] = React.useState<ConcernOptionRecord | false>(false);

  React.useEffect(() => {
    fetchList({ ...params, concern_id: concernId }, pagination);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [concernId]);

  const fetchList = async (q: QueryParams = params, page?: TablePaginationConfig) => {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (q.q) qs.set("q", q.q);
      if (q.concern_id) qs.set("concern_id", String(q.concern_id));
      qs.set("page", String(page?.current ?? pagination.current));
      qs.set("per_page", String(page?.pageSize ?? pagination.pageSize));

      const resp = (await http.get(`/admin/concern-options?${qs.toString()}`)) as ListResponse;
      const serve = resp?.data?.serve;
      if (serve) {
        setData(serve.data || []);
        setPagination({
          current: Number(serve.currentPage),
          pageSize: Number(serve.perPage),
          total: Number(serve.total),
        });
      }
    } catch (e: any) {
      message.error(e?.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange: TableProps<Row>["onChange"] = (page) => {
  fetchList(params, page as TablePaginationConfig);
    };
  const optimisticRemove = (slug: string) => {
    setData((prev) => prev.filter((x) => x.slug !== slug));
  };

  const columns: ColumnsType<ConcernOptionRecord & { concern?: { id: number; name: string } }> = [
    {
    title: "Concern",
    dataIndex: ["concern", "name"],
    render: (val?: string) => val ?? "-",
    responsive: ["md"],
    } as any,
    { title: "Name", dataIndex: "name" },
    {
      title: "Description",
      dataIndex: "description",
      render: (val?: string) => val || "-",
      responsive: ["md"],
    },
    {
      title: "Position",
      dataIndex: "position",
      width: 110,
      align: "center",
      render: (v?: number) => (typeof v === "number" ? v : "-"),
      responsive: ["md"],
    },
    {
        title: "#",
        width: 170,
        align: "center",
        render: (_: unknown, record: Row) => (      // ⬅️ beri tipe di sini
        <Space>
            <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
                setCurrent(record);
                setOpen(true);
            }}
            >
            Edit
            </Button>
            <Popconfirm
            title="Are you sure want to delete?"
            okText="Yes"
            cancelText="No"
            onConfirm={async () => {
                try {
                await http.delete(`/admin/concern-options/${record.slug}`);
                optimisticRemove(record.slug);
                message.success("Deleted");
                fetchList(params, pagination);
                } catch (e: any) {
                message.error(e?.response?.data?.message || "Delete failed");
                }
            }}
            >
            <Button danger icon={<DeleteOutlined />} />
            </Popconfirm>
        </Space>
        ),
    },
    ];

  return (
    <>
      {!concernId && (
        <Card style={{ marginTop: 10 }}>
          <div className="flex flex-wrap" style={{ width: "100%", alignItems: "flex-end" }}>
            <div className="flex align-center">
              <span style={{ fontSize: 12 }}>Show</span>
              <Select<number>
                style={{ width: 80, marginLeft: 10, marginRight: 10 }}
                value={pagination.pageSize as number}
                onChange={(pageSize) => {
                  const next = {
                    current: pagination.current ?? 1,
                    pageSize,
                    total: pagination.total ?? 0,
                  };
                  setPagination(next);
                  fetchList(params, next);
                }}
                options={[
                  { value: 10, label: "10" },
                  { value: 50, label: "50" },
                  { value: 100, label: "100" },
                  { value: 500, label: "500" },
                ]}
              />
              <span style={{ fontSize: 12 }}>entries</span>
            </div>

            <Space style={{ marginLeft: "auto" }} className="flex align-center mt-2">
              <Search
                placeholder="Search name…"
                allowClear
                onSearch={(val) => {
                  const next = { ...params, q: val };
                  setParams(next);
                  fetchList(next, { ...pagination, current: 1 });
                }}
              />
              <Button
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => {
                  setCurrent(false);
                  setOpen(true);
                }}
              >
                Create New
              </Button>
            </Space>
          </div>
        </Card>
      )}

      <Table<Row>
        rowKey={(r) => r.slug}
        dataSource={data}
        columns={columns}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        />
      <Modal
        centered
        open={open}
        title={current ? "Edit Concern Option" : "Create Concern Option"}
        destroyOnClose
        onCancel={() => {
          setOpen(false);
          setCurrent(false);
        }}
        footer={null}
      >
        <FormConcernOption
          data={current || undefined}
          concernId={concernId}
          handleClose={() => {
            setOpen(false);
            setCurrent(false);
            fetchList(params, pagination);
          }}
        />
      </Modal>
    </>
  );
};

export default TableConcernOption;
