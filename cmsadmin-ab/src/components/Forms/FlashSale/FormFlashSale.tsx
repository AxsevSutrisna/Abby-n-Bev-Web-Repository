import React from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  DatePicker,
  Switch,
  Card,
  Space,
  Select,
  Divider,
  message,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import http from "../../../api/http";

type FlashSaleProductInput = {
  product_id: number;
  flash_price: number;
  stock: number;
};

export type FlashSaleRecord = {
  id: number;
  title?: string | null;
  description?: string | null;
  hasButton?: boolean | null;
  buttonText?: string | null;
  buttonUrl?: string | null;
  startDatetime: string;
  endDatetime: string;
  isPublish?: boolean | null;
  products?: Array<{
    id: number;
    name: string;
    pivot?: { flash_price: number; stock: number };
  }>;
};

type Props = {
  data?: FlashSaleRecord | null;
  handleClose: () => void;
};

type FormValues = {
  title?: string;
  description?: string;
  has_button?: boolean;
  button_text?: string;
  button_url?: string;
  start_datetime: Dayjs;
  end_datetime: Dayjs;
  is_publish?: boolean;
  products: FlashSaleProductInput[];
};

const DATE_FMT = "YYYY-MM-DD HH:mm:ss";
const BASE_URL = "/admin/flashsales";

const FormFlashSale: React.FC<Props> = ({ data, handleClose }) => {
  const [form] = Form.useForm<FormValues>();
  const isCreate = !data?.id;
  const [loading, setLoading] = React.useState(false);

  // product options for select
  const [productOptions, setProductOptions] = React.useState<
    Array<{ value: number; label: string }>
  >([]);

  const loadProducts = React.useCallback(async (q?: string) => {
    try {
      // sesuaikan jika endpoint produk berbeda
      const resp = await http.get(
        `/admin/products?q=${encodeURIComponent(q ?? "")}&page=1&per_page=50`
      );
      const list = resp?.data?.serve?.data ?? resp?.data?.serve ?? [];
      const opts = list.map((p: any) => ({ value: p.id, label: p.name }));
      setProductOptions(opts);
    } catch {
      /* ignore */
    }
  }, []);

  React.useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  React.useEffect(() => {
    if (!data) {
      form.setFieldsValue({
        title: "",
        description: "",
        has_button: false,
        button_text: "",
        button_url: "",
        start_datetime: dayjs(),
        end_datetime: dayjs().add(1, "day"),
        is_publish: false,
        products: [],
      });
      return;
    }

    form.setFieldsValue({
      title: data.title ?? "",
      description: data.description ?? "",
      has_button: Boolean(data.hasButton),
      button_text: data.buttonText ?? "",
      button_url: data.buttonUrl ?? "",
      start_datetime: dayjs(data.startDatetime),
      end_datetime: dayjs(data.endDatetime),
      is_publish: Boolean(data.isPublish),
      products:
        data.products?.map((p) => ({
          product_id: p.id,
          flash_price: p.pivot?.flash_price ?? 1,
          stock: p.pivot?.stock ?? 0,
        })) ?? [],
    });
  }, [data, form]);

  const onFinish = async (values: FormValues) => {
    try {
      setLoading(true);
      if (!values.products || values.products.length === 0) {
        message.error("Minimal 1 produk untuk Flash Sale.");
        setLoading(false);
        return;
      }

      const payload = {
        title: values.title || null,
        description: values.description || null,
        has_button: values.has_button ?? false,
        button_text: values.button_text || null,
        button_url: values.button_url || null,
        start_datetime: values.start_datetime.format(DATE_FMT),
        end_datetime: values.end_datetime.format(DATE_FMT),
        is_publish: values.is_publish ?? false,
        products: values.products.map((p) => ({
          product_id: p.product_id,
          flash_price: Number(p.flash_price),
          stock: Number(p.stock),
        })) as FlashSaleProductInput[],
      };

      if (data?.id) {
        await http.put(`${BASE_URL}/${data.id}`, payload);
        message.success("Flash Sale updated");
      } else {
        await http.post(BASE_URL, payload, {
          headers: { "Content-Type": "application/json" },
        });
        message.success("Flash Sale created");
      }

      form.resetFields();
      handleClose();
    } catch (e: any) {
      message.error(e?.response?.data?.message || "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} disabled={loading}>
      <Form.Item
        label="Title"
        name="title"
        rules={
          isCreate
            ? [{ required: true, message: "Title is required" }]
            : undefined
        }
      >
        <Input placeholder="Flash sale title" />
      </Form.Item>

      <Form.Item label="Description" name="description">
        <Input.TextArea rows={4} placeholder="Description (optional)" />
      </Form.Item>

      <Space size="middle" style={{ display: "flex" }}>
        <Form.Item label="Has Button" name="has_button" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item label="Publish" name="is_publish" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Space>

      <Space size="middle" style={{ display: "flex" }}>
        <Form.Item label="Button Text" name="button_text" style={{ flex: 1 }}>
          <Input placeholder="e.g. Shop Now (optional)" />
        </Form.Item>
        <Form.Item label="Button URL" name="button_url" style={{ flex: 1 }}>
          <Input placeholder="https://example.com (optional)" />
        </Form.Item>
      </Space>

      <Space size="middle" style={{ display: "flex" }}>
        <Form.Item
          label="Start Date"
          name="start_datetime"
          rules={[{ required: true, message: "Start date is required" }]}
          style={{ flex: 1 }}
        >
          <DatePicker showTime style={{ width: "100%" }} format={DATE_FMT} />
        </Form.Item>

        <Form.Item
          label="End Date"
          name="end_datetime"
          style={{ flex: 1 }}
          rules={[
            { required: true, message: "End date is required" },
            // End > Start
            ({ getFieldValue }) => ({
              validator(_, value: Dayjs) {
                const start = getFieldValue("start_datetime") as Dayjs | undefined;
                if (!value || !start) return Promise.resolve();
                if (value.isAfter(start)) return Promise.resolve();
                return Promise.reject(
                  new Error("End date must be after Start date")
                );
              },
            }),
          ]}
        >
          <DatePicker showTime style={{ width: "100%" }} format={DATE_FMT} />
        </Form.Item>
      </Space>

      <Divider orientation="left">Products</Divider>

      <Form.List
        name="products"
        rules={[
          {
            validator: async (_, list?: FlashSaleProductInput[]) => {
              if (Array.isArray(list) && list.length > 0) return Promise.resolve();
              return Promise.reject(new Error("Minimal 1 produk"));
            },
          },
        ]}
      >
        {(fields, { add, remove }, { errors }) => (
          <Card size="small" bordered>
            {fields.map((field) => (
              <Card key={field.key} size="small" style={{ marginBottom: 8 }}>
                <Space align="start" style={{ display: "flex" }} wrap>
                  <Form.Item
                    {...field}
                    label="Product"
                    name={[field.name, "product_id"]}
                    rules={[{ required: true, message: "Product is required" }]}
                    style={{ minWidth: 260 }}
                  >
                    <Select
                      showSearch
                      placeholder="Select product"
                      options={productOptions}
                      optionFilterProp="label"
                      onSearch={(v) => loadProducts(v)}
                    />
                  </Form.Item>

                  <Form.Item
                    {...field}
                    label="Flash Price"
                    name={[field.name, "flash_price"]}
                    rules={[{ required: true, message: "Flash price is required" }]}
                  >
                    <InputNumber min={1} style={{ width: 160 }} />
                  </Form.Item>

                  <Form.Item
                    {...field}
                    label="Stock"
                    name={[field.name, "stock"]}
                    rules={[{ required: true, message: "Stock is required" }]}
                  >
                    <InputNumber min={0} style={{ width: 120 }} />
                  </Form.Item>

                  <Button danger onClick={() => remove(field.name)}>
                    Remove
                  </Button>
                </Space>
              </Card>
            ))}

            <Form.ErrorList errors={errors} />

            <Button type="dashed" onClick={() => add()} block>
              Add Product
            </Button>
          </Card>
        )}
      </Form.List>

      <Form.Item style={{ marginTop: 16 }}>
        <Button type="primary" htmlType="submit" block shape="round" loading={loading}>
          Save & Close
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormFlashSale;
