import { Modal, notification, Tooltip, Table, Card, Typography, Space, Button as AntButton, Popconfirm, Input } from "antd";
import { deleteProductBrand, getProductBrands } from "apis/productBrand.api";
import { deleteProductCate } from "apis/productCate.api";
import DOMPurify from "dompurify";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { changeLoading } from "store/slicers/common.slicer";
import Icons from "utils/icons";
import Pagination from "../components/Pagination";
import ProductBrandForm from "./ProductBrandForm";
import moment from "moment";
import logo from "assets/images/logo.jpg";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, DownOutlined, RightOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

function ProductBrandManager() {
  const dispatch = useDispatch();

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [brands, setBrands] = useState([]);
  const [dataEdit, setDataEdit] = useState(null);
  const [isShowModal, setIsShowModal] = useState(false);
  const [searchText, setSearchText] = useState("");

  const fetchBrands = async () => {
    dispatch(changeLoading());
    try {
      const params = {
        limit,
        page,
      };
      const res = await getProductBrands(params);
      setBrands(res?.result?.content || []);
      setTotalPages(res?.result?.totalPages || 0);
      setTotalElements(res?.result?.totalElements || 0);
    } catch (message) {
      notification.error({ message, duration: 2 });
    }
    dispatch(changeLoading());
  };

  useEffect(() => {
    fetchBrands();
  }, [page, limit]);

  const handleDelete = async (id) => {
    dispatch(changeLoading());
    try {
      await deleteProductBrand(id);
      notification.success({ message: "Xóa thành công" });
      fetchBrands();
    } catch (error) {
      const message =
        error.code == 1009
          ? "Thương hiệu đang có sản phẩm"
          : "Lỗi vui lòng thử lại...";

      notification.error({
        message,
        duration: 2,
      });
    }
    dispatch(changeLoading());
  };

  const openFormUpdate = (data) => {
    setDataEdit(data);
    setIsShowModal(true);
  };

  // Filter data based on search text
  const filteredData = brands.filter(brand => 
    !searchText || 
    brand.name?.toLowerCase().includes(searchText.toLowerCase()) || 
    brand.slug?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Table columns definition
  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      render: (_, __, index) => index + 1,
      width: 70,
    },
    {
      title: 'Tên thương hiệu',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center">
          {record.image && (
            <Tooltip title={<img src={record.image} alt={text} className="max-h-40" />}>
              <img 
                src={record.image} 
                alt={text} 
                className="w-10 h-10 object-contain mr-3 rounded-md border border-gray-200"
              />
            </Tooltip>
          )}
          <Text strong>{text}</Text>
        </div>
      ),
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
    },
    {
      title: 'Cập nhật vào',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date) => date ? moment(date).format("DD/MM/YYYY") : 'N/A',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <AntButton 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => openFormUpdate(record)}
            className="flex items-center"
          >
            Sửa
          </AntButton>
          <Popconfirm
            title="Bạn có chắc muốn xóa thương hiệu này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            placement="left"
          >
            <AntButton 
              danger 
              icon={<DeleteOutlined />}
              className="flex items-center"
            >
              Xóa
            </AntButton>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <Modal
        title={dataEdit ? "Cập nhật thương hiệu" : "Thêm thương hiệu mới"}
        width={800}
        open={isShowModal}
        onCancel={() => setIsShowModal(false)}
        footer={null}
        destroyOnClose
      >
        <ProductBrandForm
          closeModal={() => setIsShowModal(false)}
          fetchData={fetchBrands}
          brandCurrent={dataEdit}
        />
      </Modal>

      <Card className="shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <img
              src={logo}
              alt="logo"
              className="w-12 h-12 object-contain"
            />
            <Title level={3} className="m-0">Quản lý thương hiệu</Title>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <Input 
              placeholder="Tìm kiếm theo tên hoặc slug" 
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="md:w-64"
              allowClear
            />
            <AntButton
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => openFormUpdate()}
              className="flex items-center bg-green-600 hover:bg-green-700"
            >
              Thêm mới
            </AntButton>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={false}
          bordered
          className="brand-table"
          size="middle"
          loading={brands.length === 0}
          expandable={{
            expandedRowRender: record => (
              <div className="p-3">
                <Text strong>Mô tả:</Text>
                {record.description ? (
                  <div 
                    className="mt-2 p-3 bg-gray-50 rounded border"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(record.description)
                    }}
                  />
                ) : (
                  <Text type="secondary" italic className="ml-2">Không có mô tả</Text>
                )}
              </div>
            ),
            expandRowByClick: true,
            expandIcon: ({ expanded, onExpand, record }) => 
              record.description ? (
                expanded ? 
                <AntButton type="text" icon={<DownOutlined />} onClick={e => onExpand(record, e)} /> : 
                <AntButton type="text" icon={<RightOutlined />} onClick={e => onExpand(record, e)} />
              ) : null
          }}
        />
        
        <div className="flex justify-end mt-4">
          <Pagination
            listLimit={[10, 25, 40, 100]}
            limitCurrent={limit}
            setLimit={setLimit}
            totalPages={totalPages}
            setPage={setPage}
            pageCurrent={page}
            totalElements={totalElements}
          />
        </div>
      </Card>

      <style jsx global>{`
        .brand-table .ant-table-cell {
          vertical-align: middle;
        }
        
        .ant-table-row:hover {
          background-color: #f0f7ff !important;
          transition: all 0.3s ease;
        }
        
        .ant-table-row-expand-icon-cell {
          padding: 0 !important;
        }
        
        @media (max-width: 768px) {
          .ant-table {
            overflow-x: auto;
          }
        }
      `}</style>
    </div>
  );
}

export default ProductBrandManager;
