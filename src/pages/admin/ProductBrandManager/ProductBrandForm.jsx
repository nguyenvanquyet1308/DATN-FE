import { notification, Form, Input, Button, Typography, Upload, Card, Space, Divider } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import logo from "assets/images/logo.jpg";
import InputForm from "components/InputForm";
import { convertBase64ToImage, convertImageToBase64 } from "utils/helper";
import MarkdownEditor from "components/MarkdownEditor";
import { changeLoading } from "store/slicers/common.slicer";
import { useDispatch } from "react-redux";
import { createProductBrand, updateProductBrand } from "apis/productBrand.api";
import { PlusOutlined, UploadOutlined, SaveOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

function ProductBrandForm({ closeModal, fetchData, brandCurrent }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  const dispatch = useDispatch();

  const [previewImg, setPreviewImg] = useState(null);
  const [imgUpload, setImageUpload] = useState(null);
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const handleFillToForm = async () => {
      setValue("name", brandCurrent["name"]);
      setDescription(brandCurrent?.description);
      if (brandCurrent?.image) {
        setPreviewImg(brandCurrent?.image);
        let file = await convertBase64ToImage(brandCurrent?.image);
        setImageUpload(file);
      }
    };

    handleResetForm();

    if (brandCurrent?.id) handleFillToForm();
  }, [brandCurrent]);

  const handleResetForm = () => {
    reset();
    setImageUpload(null);
    setPreviewImg(null);
  };

  const handleUpdate = async (data) => {
    if (description) data = { ...data, description };

    if (!imgUpload) {
      notification.error({ 
        message: "Vui lòng tải lên hình ảnh",
        placement: "top" 
      });
      return;
    }

    const formData = new FormData();
    formData.append("image", imgUpload);
    formData.append("brandData", JSON.stringify(data));

    try {
      setIsUploading(true);
      dispatch(changeLoading());
      if (brandCurrent?.id) {
        await updateProductBrand(brandCurrent.id, formData);
        notification.success({
          message: "Cập nhật thành công",
          placement: "top"
        });
      } else {
        await createProductBrand(formData);
        notification.success({
          message: "Tạo thành công",
          placement: "top"
        });
      }
      await fetchData();
      closeModal();
      handleResetForm();
    } catch (error) {
      const errorMessage = brandCurrent?.id
        ? "Cập nhật không thành công ..."
        : "Tạo không thành công...";
      notification.error({
        message: `${errorMessage}: ${error.message}`,
        placement: "top"
      });
    } finally {
      dispatch(changeLoading());
      setIsUploading(false);
    }
  };

  const handleOnchangeThumb = async (file) => {
    if (file.type !== "image/png" && file.type !== "image/jpeg") {
      notification.error({ 
        message: "Chỉ hỗ trợ file PNG hoặc JPEG",
        placement: "top"
      });
      return;
    }
    let base64 = await convertImageToBase64(file);
    setPreviewImg(base64);
    setImageUpload(file);
  };

  return (
    <div className="brand-form p-4">
      <Card className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          <img src={logo} alt="logo" className="w-10 h-10 object-contain" />
          <Title level={4} className="m-0">
            {brandCurrent ? "Cập nhật thương hiệu" : "Tạo thương hiệu mới"}
          </Title>
        </div>
        <Divider />

        <Form
          layout="vertical"
          onFinish={handleSubmit(handleUpdate)}
          className="mt-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 flex flex-col items-center">
              <Text strong className="mb-2">Hình ảnh</Text>
              <div className="mb-4 w-full">
                <Upload.Dragger
                  className="upload-thumbnail"
                  showUploadList={false}
                  beforeUpload={(file) => {
                    handleOnchangeThumb(file);
                    return false;
                  }}
                  accept=".jpg,.jpeg,.png"
                >
                  {previewImg ? (
                    <div className="relative group">
                      <img
                        src={previewImg}
                        alt="Brand thumbnail"
                        className="max-h-[200px] w-auto mx-auto object-contain"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <UploadOutlined className="text-white text-2xl" />
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <p className="ant-upload-drag-icon">
                        <PlusOutlined className="text-primary text-2xl" />
                      </p>
                      <p className="ant-upload-text">
                        Nhấn hoặc kéo thả hình ảnh vào đây
                      </p>
                      <p className="ant-upload-hint text-xs">
                        Hỗ trợ file: JPG, JPEG, PNG
                      </p>
                    </div>
                  )}
                </Upload.Dragger>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <div className="mb-4">
                <Text strong className="mb-2">Tên thương hiệu</Text>
                <Input
                  placeholder="Nhập tên thương hiệu"
                  {...register("name", {
                    required: "Vui lòng nhập tên thương hiệu",
                  })}
                  status={errors.name ? "error" : ""}
                  className="w-full"
                />
                {errors.name && (
                  <Text type="danger" className="mt-1">
                    {errors.name.message || "Vui lòng nhập trường này"}
                  </Text>
                )}
              </div>

              <div>
                <Text strong className="mb-2">Mô tả</Text>
                <MarkdownEditor
                  height={200}
                  name="description"
                  id="description"
                  value={description}
                  register={register}
                  validate={{}}
                  errors={errors}
                  setValue={setDescription}
                />
              </div>
            </div>
          </div>

          <Divider />
          
          <div className="flex justify-end gap-3 mt-4">
            <Button onClick={closeModal}>
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={isUploading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {brandCurrent ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
        </Form>
      </Card>

      <style jsx global>{`
        .upload-thumbnail .ant-upload-drag {
          border-radius: 8px;
          border: 2px dashed #d9d9d9;
          transition: all 0.3s ease;
        }
        
        .upload-thumbnail .ant-upload-drag:hover {
          border-color: #1890ff;
        }
        
        @media (max-width: 768px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default ProductBrandForm;
