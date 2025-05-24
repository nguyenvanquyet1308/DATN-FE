import { notification, Skeleton } from "antd";
import { getOneOrderByCode } from "apis/order.api";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import logo from "assets/logo.png";
import logo1 from "assets/images/logo.jpg";
import paths from "constant/paths";
import { formatMoney, trunCateText } from "utils/helper";
import { getPaymentByTransId } from "apis/payment";
import Icons from "utils/icons";

function SuccessRentalPayment() {
  const navigate = useNavigate();
  const location = useLocation();

  const [paymentData, setPaymentData] = useState({
    isLoading: false,
    data: null,
  });
  console.log("🚀 ~ SuccessRentalPayment ~ paymentData:", paymentData);
  const queryParams = new URLSearchParams(location.search);
  const appTransId = queryParams.get("apptransid");

  useEffect(() => {
    const fetchRental = async () => {
      setPaymentData((prev) => ({ ...prev, isLoading: true }));
      try {
        const res = await getPaymentByTransId(appTransId);
        setPaymentData((prev) => ({ ...prev, data: res.result }));
      } catch (error) {
        notification.warning({
          message: "Không tìm thấy thông tin đơn hàng...",
          duration: 1,
          placement: "top",
        });
        navigate(paths.HOME);
      }
      setPaymentData((prev) => ({ ...prev, isLoading: false }));
    };
    if (appTransId) fetchRental();
  }, []);

  return (
    <div className="bg-gray-100 ">
      <div className="p-1 bg-green-400 text-center text-lg text-white font-bold italic">
        Uy tín làm nên thương hiệu RT
      </div>
      <div className="flex justify-center items-center  bg-white mt-2">
        <div className="grid grid-cols-10 gap-4 max-w-6xl w-full">
          <div className="col-span-7 px-4 rounded-lg shadow-md ">
            <div className="text-center mb-2">
              <div>
                <img src={logo1} width={90} alt="" />
              </div>

              <div>
                {paymentData.data?.status == "PENDING" &&
                paymentData.data?.method !== "COD" ? (
                  <Icons.BsInfoCircleFill
                    className="text-lg mx-auto text-yellow-400"
                    size={30}
                  />
                ) : (
                  <svg
                    className="w-12 h-12 mx-auto text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <h2
                className={`text-2xl font-semibold  ${
                  paymentData.data?.status == "PENDING" &&
                  paymentData.data?.method !== "COD"
                    ? "text-yellow-400"
                    : "text-green-500"
                }`}
              >
                {paymentData.data?.status == "PENDING" &&
                paymentData.data?.method !== "COD"
                  ? "Đang chờ thanh toán"
                  : "Thuê Thành Công"}
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Cảm ơn bạn đã đặt hàng. FashionShop chân thành cảm ơn!
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-sm font-medium text-gray-600">
                Thời gian vận chuyển
              </p>
              <p className="text-lg font-semibold text-gray-800">3-5 ngày</p>
              <p className="text-sm font-medium text-gray-600">
                Shipping Address
              </p>
              <p className="text-lg font-semibold text-gray-800">
                {paymentData.data?.rental.delivery?.street},{" "}
                {paymentData.data?.rental.delivery?.district},{" "}
                {paymentData.data?.rental.delivery?.city}
              </p>
              <p className="text-sm font-medium text-gray-600">
                Phương thức thanh toán
              </p>
              {paymentData.isLoading ? (
                <Skeleton.Input />
              ) : (
                <p className="text-lg font-semibold text-gray-800">
                  {paymentData.data?.method}
                </p>
              )}
              <p className="text-sm font-medium text-gray-600">Tổng tiền</p>
              {paymentData.isLoading ? (
                <Skeleton.Input />
              ) : (
                <p className="text-lg font-semibold text-gray-800">
                  {formatMoney(paymentData.data?.amount)} vnđ
                </p>
              )}
            </div>
            <div className="mt-8 text-center">
              <button
                type="button"
                class="text-white bg-blue-300 border border-gray-300 focus:outline-none 
                            hover:bg-blue-700 focus:ring-4 focus:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 
                           "
                onClick={() => navigate(paths.HOME)}
              >
                Quay về trang chủ{" "}
              </button>
            </div>
          </div>
          <div className="col-span-3 bg-gradient-to-r sm:h-screen sm:sticky sm:top-0 lg:min-w-[370px] sm:min-w-[180px]">
            <div className="px-4 py-2 bg-gray-100 sm:h-[calc(100vh-80px)] sm:overflow-y-auto">
              <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <p className="text-sm font-medium text-gray-600">
                    Mã đơn hàng
                  </p>
                  <p className="text-lg font-semibold text-gray-800">
                    #{paymentData.data?.rental?.rentalCode}
                  </p>
                </div>
                <p className="text-blue-500 font-bold">Xem đơn thuê</p>
              </div>
              {!!paymentData.data?.rental?.rentalPackage && (
                <div className="my-2 p-2 border rounded bg-white border-primary">
                  <p className="flex justify-between items-center">
                    <span className="text-primary font-bold">
                      {paymentData.data?.rental?.rentalPackage?.name}
                    </span>
                    <span className=" font-bold">
                      {paymentData.data?.rental?.rentalPackage?.durationDays}
                      /ngày
                    </span>
                  </p>
                </div>
              )}

              {paymentData.data?.rental?.rentalDetails.map((el) => (
                <div
                  key={el.id}
                  className="flex items-start gap-4 mb-4 bg-white p-4"
                >
                  <div className="w-28 h-20 flex p-3 shrink-0 bg-gray-300 rounded-md ">
                    <img
                      src={el.sku.images.split(",")[0]}
                      className="w-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-base text-primary font-bold">
                      {trunCateText(el.product.name, 42)}
                    </h3>
                    <ul className=" text-black space-y-2 mt-2">
                      <li>
                        Số lượng{" "}
                        <span className="float-right  text-orange-400">
                          x{el.quantity}
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span>Tổng tiền </span>
                        <span className="float-right  text-blue-500">
                          {formatMoney(el.price)}
                          VND
                        </span>
                      </li>
                    </ul>
                    <div className="flex gap-2 font-bold justify-end items-center">
                      <Icons.MdTimer size={20} />
                      {el.hour > 0 && <div>{el.hour} giờ</div>}
                      {el.day > 0 && <div>{el.day} ngày</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuccessRentalPayment;
