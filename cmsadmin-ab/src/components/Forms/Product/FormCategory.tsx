import React from "react";
import { Form, Select } from "antd";
import http from "../../../api/http";

type TagType = { id: number | string; name: string };
type BrandType = { id: number | string; name: string };
type PersonaType = { id: number | string; name: string };
type ConcernOptionType = { id: number | string; name: string };
type ProfileCategoryOptionType = { id: number | string; label: string };

const extractList = <T,>(res: any): T[] => {
  const serve = res?.data?.serve;
  if (Array.isArray(serve)) return serve as T[];
  if (Array.isArray(serve?.data)) return serve.data as T[];
  return [];
};

const FormCategory: React.FC = () => {
  const [tags, setTags] = React.useState<TagType[]>([]);
  const [brands, setBrands] = React.useState<BrandType[]>([]);
  const [personas, setPersonas] = React.useState<PersonaType[]>([]);
  const [concernOptions, setConcernOptions] = React.useState<ConcernOptionType[]>([]);
  const [profileCategoryOptions, setProfileCategoryOptions] = React.useState<ProfileCategoryOptionType[]>([]);

  React.useEffect(() => {
    fetchTags();
    fetchBrands();
    fetchPersonas();
    fetchConcernOptions();
    fetchProfileCategoryOptions();
  }, []);

  const fetchTags = async () => {
    try {
      const res = await http.get(`/admin/tags`);
      setTags(extractList<TagType>(res));
    } catch (err) {
      console.error("Failed to fetch tags:", err);
      setTags([]);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await http.get(`/admin/brands`);
      setBrands(extractList<BrandType>(res));
    } catch (err) {
      console.error("Failed to fetch brands:", err);
      setBrands([]);
    }
  };

  const fetchPersonas = async () => {
    try {
      const res = await http.get(`/admin/personas`);
      setPersonas(extractList<PersonaType>(res));
    } catch (err) {
      console.error("Failed to fetch personas:", err);
      setPersonas([]);
    }
  };

  const fetchConcernOptions = async () => {
    try {
      const res = await http.get(`/admin/concern-options`);
      setConcernOptions(extractList<ConcernOptionType>(res));
    } catch (err) {
      console.error("Failed to fetch Concern Option:", err);
      setConcernOptions([]);
    }
  };

  const fetchProfileCategoryOptions = async () => {
    try {
      const res = await http.get(`/admin/profile-category-options`);
      setProfileCategoryOptions(extractList<ProfileCategoryOptionType>(res));
    } catch (err) {
      console.error("Failed to fetch Profile Category Option:", err);
      setProfileCategoryOptions([]);
    }
  };

  return (
    <>
      <div style={{ fontWeight: "bold", fontSize: 14, marginBottom: 10 }}>
        Organization
      </div>

      {/* Status */}
      <Form.Item
        label="Status"
        name="status"
        rules={[{ required: true, message: "Status required." }]}
      >
        <Select placeholder="Select status">
         <Select.Option value={1}>War Product</Select.Option>
         <Select.Option value={2}>Normal Product</Select.Option>
         <Select.Option value={3}>Draft</Select.Option>
        </Select>
      </Form.Item>

      {}
      <Form.Item
        label="Flashsale"
        name="is_flashsale"
        rules={[{ required: true, message: "Flashsale required." }]}
      >
        <Select placeholder="Select Flashsale">
          <Select.Option value={true}>Ya</Select.Option>
          <Select.Option value={false}>Tidak</Select.Option>
        </Select>
      </Form.Item>

      {}
      <Form.Item
        label="Tag"
        name="tag_id"
        rules={[{ required: true, message: "Tag required." }]}
      >
        <Select placeholder="Please select tag" loading={!tags.length}>
          {(tags ?? []).map((tag) => (
            <Select.Option key={String(tag.id)} value={tag.id}>
              {tag.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {}
      <Form.Item
        label="Brand"
        name="brand_id"
        rules={[{ required: true, message: "Brand required." }]}
      >
        <Select placeholder="Please select Brand" loading={!brands.length}>
          {(brands ?? []).map((brand) => (
            <Select.Option key={String(brand.id)} value={brand.id}>
              {brand.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {}
      <Form.Item
        label="Persona"
        name="persona_id"
        rules={[{ required: true, message: "Personas required." }]}
      >
        <Select placeholder="Please select Persona" loading={!personas.length}>
          {(personas ?? []).map((persona) => (
            <Select.Option key={String(persona.id)} value={persona.id}>
              {persona.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {}
      <Form.Item
        label="Concern Options"
        name="concern_option_ids"
        rules={[{ required: true, message: "Concern Option required." }]}
      >
        <Select
          mode="multiple"
          placeholder="Please select Concern Option"
          loading={!concernOptions.length}
        >
          {(concernOptions ?? []).map((concern) => (
            <Select.Option key={String(concern.id)} value={concern.id}>
              {concern.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {}
      <Form.Item
        label="Profile Category Options"
        name="profile_category_option_ids"
        rules={[{ required: true, message: "Profile Category Option required." }]}
      >
        <Select
          mode="multiple"
          placeholder="Please select Profile Category Option"
          loading={!profileCategoryOptions.length}
        >
          {(profileCategoryOptions ?? []).map((profileCategoryOptions) => (
            <Select.Option key={String(profileCategoryOptions.id)} value={profileCategoryOptions.id}>
              {profileCategoryOptions.label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </>
  );
};

export default FormCategory;
