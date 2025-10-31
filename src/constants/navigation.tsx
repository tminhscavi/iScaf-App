import {
  Bell,
  Cog,
  File,
  HelpingHand,
  Home,
  Key,
  Menu,
  Table,
  User,
  UserCog,
} from 'lucide-react';
import { ReactNode } from 'react';

export const MOBILE_NAVIGATION_MENU: {
  label: string;
  path: string;
  icon: ReactNode;
  isDisabled?: boolean;
}[] = [
  {
    label: 'Trang chủ',
    path: '/',
    icon: <Home className="h-5 w-5" />,
  },
  {
    label: 'Danh mục',
    path: '/menu',
    icon: <Menu className="h-5 w-5" />,
  },
  {
    label: 'Thông báo',
    path: '/notifications',
    icon: <Bell className="h-5 w-5" />,
  },
  {
    label: 'Tài khoản',
    path: '/profile',
    icon: <User className="h-5 w-5" />,
  },
];

export const PROFILE_NAVIGATION_MENU: {
  label: string;
  path: string;
  icon: ReactNode;
  isDisabled?: boolean;
}[] = [
  {
    label: 'Cập nhật thông tin cá nhân',
    path: '/profile/cap-nhat-thong-tin-ca-nhan',
    icon: <UserCog />,
  },
  {
    label: 'Đổi mật khẩu',
    path: '/profile/doi-mat-khau',
    icon: <Key />,
  },
  {
    label: 'Phiếu Lương',
    path: '/profile/phieu-luong',
    icon: <File />,
  },
  {
    label: 'Bảng Chấm Công',
    path: '/profile/bang-cham-cong',
    icon: <Table />,
  },
  {
    label: 'Dự Án',
    path: '/profile/du-an',
    icon: <Cog />,
  },
  {
    label: 'Trung tâm hỗ trợ',
    path: '/profile/trung-tam-ho-tro',
    icon: <HelpingHand />,
  },
];

export const MAIN_NAVIGATION_MENU = [
  {
    Title: 'AM',
    Description: ' Quản Lý Tài Sản',
    SubDescription: 'Property Management',
    CPK: 7,
  },
  {
    Title: 'E-Admin',
    Description: 'Quản Lý Hành Chánh',
    SubDescription: 'Administrative Management',
    CPK: 1,
  },
  {
    Title: 'HR',
    Description: 'Quản Lý Nhân Sự',
    SubDescription: 'Human Resource Management',
    CPK: 3,
  },
  {
    Title: 'IT Service',
    Description: ' Dịch Vụ IT',
    SubDescription: 'IT Service',
    CPK: 9,
  },
  {
    Title: 'PM',
    Description: 'Quản Lý Sản Phẩm',
    SubDescription: 'Product Management',
    CPK: 5,
  },
  {
    Title: 'PMS',
    Description: ' Quản Lý  Sản Xuất',
    SubDescription: 'Production Management',
    CPK: 6,
  },
  {
    Title: 'Late Entry Application',
    Description: 'Giấy vào cổng',
    SubDescription: 'Late Entry Application',
    CPK: 10,
  },
];

export const MAIN_NAVIGATION_MENU_ITEMS = [
  {
    Title: 'AM',
    Description: ' Quản Lý Tài Sản',
    SubDescription: 'ຄຸ້ມຄອງຊັບສິນ',
    CPK: 7,
  },
  {
    Title: 'E-Admin',
    Description: 'Quản Lý Hành Chánh',
    SubDescription: 'ຄຸ້ມຄອງບໍລິຫານ',
    CPK: 1,
  },
  {
    Title: 'HR',
    Description: 'Quản Lý Nhân Sự',
    SubDescription: 'ຄຸ້ນຄອງບຸກຄະລາກອນ',
    CPK: 3,
  },
  {
    Title: 'IT Service',
    Description: ' Dịch Vụ IT',
    SubDescription: 'IT Service',
    CPK: 9,
  },
  {
    Title: 'PM',
    Description: 'Quản Lý Sản Phẩm',
    SubDescription: 'ຄຸມການຜະລິດ',
    CPK: 5,
  },
  {
    Title: 'PMS',
    Description: ' Quản Lý Sản Xuất',
    SubDescription: 'ຄຸມການຜະລິດ',
    CPK: 6,
  },
  {
    Title: 'Overtime Register',
    Description: 'Đăng Ký Tăng Ca',
    SubDescription: 'ລົງທະບຽນເຮັດໂອທີ',
    CPK: 33,
  },
  {
    Title: 'Check In - Out',
    Description: 'Chấm Công',
    SubDescription: 'ສະແກນນີ້ວມື',
    CPK: 19,
  },
  {
    Title: 'Downtime Management',
    Description: 'Quản lý thời gian ngưng việc',
    SubDescription: 'ຄຸ້ມຄອງເວລາຢຸດວຽກ',
    CPK: 53,
  },
  {
    Title: 'Attendance Project',
    Description: 'Điểm Danh Dự Án',
    SubDescription: null,
    CPK: 100,
  },
  {
    Title: 'Timekeeping Confirmation',
    Description: 'Xác Nhận Chấm Công',
    SubDescription: 'ຢືນຢັນການເຮັດວຍກ',
    CPK: 13,
  },
  {
    Title: 'Inventory of Assets',
    Description: 'Kiểm Kê Tài Sản',
    SubDescription: null,
    CPK: 72,
  },
  {
    Title: 'IT Equiment Profile',
    Description: 'Thông Tin Tài Sản IT',
    SubDescription: null,
    CPK: 81,
  },
  {
    Title: 'CheckList',
    Description: 'Đánh giá - Kiểm tra',
    SubDescription: null,
    CPK: 200,
  },
  {
    Title: 'Itinerary tracking',
    Description: 'Ghi nhận lịch làm việc trong ngày & chấm công',
    SubDescription: 'ບັນທືກຕາຕະລາງເຮັດວຽກໃນມື້ແລະສະແກນນີ້ວ',
    CPK: 15,
  },
  {
    Title: 'Overtime Confirm',
    Description: 'Xác Nhận Đăng Ký Tăng Ca',
    SubDescription: 'ຢືນຢັນການລົງທະບຽນເຮັດໂອທີ',
    CPK: 32,
  },
  {
    Title: 'History Attendance Project',
    Description: 'Bảng Chấm Công Dự Án',
    SubDescription: null,
    CPK: 101,
  },
  {
    Title: 'QC End Line',
    Description: 'KSCL cuối Chuyền',
    SubDescription: 'ເສັ້ນສິ້ນສຸດການຄວບຄຸມຄຸນນະພາບ',
    CPK: 51,
  },
  {
    Title: 'Early Leave Application',
    Description: 'Giấy ra cổng',
    SubDescription: 'ເຈົ້າເລີກວຽກ',
    CPK: 11,
  },
  {
    Title: 'Timesheet Approve',
    Description: 'Duyệt Công Trong Tháng',
    SubDescription: 'ອະນຸມັດການເຮັດວຽກໃນເດືອນ',
    CPK: 31,
  },
  {
    Title: 'Sewing-parts Give Back',
    Description: 'Trả Bán Thành Phẩm',
    SubDescription: null,
    CPK: 58,
  },
  {
    Title: 'Bundle Qty',
    Description: 'Ghi nhận Slg SP',
    SubDescription: 'ບັນທືກຈຳນວນເຄື່ອງ',
    CPK: 54,
  },
  {
    Title: 'Timesheet Confirm',
    Description: 'Xác Nhận Bảng Công',
    SubDescription: 'ຢືນຢັນຕາຕະລາງເຮັດວຽກ',
    CPK: 30,
  },
  {
    Title: 'Asset Movement',
    Description: 'Luân Chuyển Tài Sản',
    SubDescription: null,
    CPK: 71,
  },
  {
    Title: 'Delivery Note',
    Description: 'Phiếu Giao Nhận',
    SubDescription: null,
    CPK: 90,
  },
  {
    Title: 'QC in line',
    Description: 'KSCL trong Chuyền',
    SubDescription: 'ກວດກາຄຸນນະພາບໃນລາຍ',
    CPK: 50,
  },
  {
    Title: 'QC In Line Report',
    Description: 'Sổ QC In Line',
    SubDescription: null,
    CPK: 59,
  },
  {
    Title: 'Register for Saturday off',
    Description: 'Đăng ký làm việc tại nhà theo lịch làm việc',
    SubDescription: 'ລົງທະບຽນເພື່ອເຮັດວຽກຈາກບ້ານ',
    CPK: 16,
  },
  {
    Title: 'Leave Application',
    Description: 'Đơn xin nghỉ phép',
    SubDescription: 'ໃບລາພັກ',
    CPK: 12,
  },
  {
    Title: 'Report Recipent Note No',
    Description: 'Báo Cáo Nhận BTP',
    SubDescription: 'ບົດລາຍງານໄດ້ຮັບຜະລິດຕະພັນເຄິ່ງສໍາເລັດຮູບ',
    CPK: 56,
  },
  {
    Title: 'Piecework Handbook',
    Description: 'Số tay Lương SP',
    SubDescription: 'ປື້ມບັນທືກເດືອນຜະລິດ',
    CPK: 52,
  },
  {
    Title: 'Leave Application Without Pay',
    Description: 'Đơn xin nghỉ không lương',
    SubDescription: 'ໃບລາພັກບໍ່ຮັບເງີນເດືອນ',
    CPK: 17,
  },
  {
    Title: 'Ghi Nhan HSTD',
    Description: 'Ghi nhận Hồ Sơ Tuyển Dụng',
    SubDescription: 'ໂປຣໄຟລ໌ການຈ້າງງານ',
    CPK: 35,
  },
  {
    Title: 'Production Information',
    Description: 'Thông Tin Sản Phẩm',
    SubDescription: null,
    CPK: 61,
  },
  {
    Title: 'Car request',
    Description: 'Yêu cầu sử dụng xe',
    SubDescription: 'ຄຳຮ້ອງນຳໃຊ້ລົດ',
    CPK: 14,
  },
  {
    Title: 'Cut-parts Receipt',
    Description: 'Nhận bán thành phẩm',
    SubDescription: 'ຮັບຜະລິດຕະພັນເຄິ່ງສໍາເລັດຮູບ',
    CPK: 55,
  },
  {
    Title: 'Equipment Delivery',
    Description: 'Giao Thiết Bị',
    SubDescription: null,
    CPK: 80,
  },
  {
    Title: 'Late Entry Application',
    Description: 'Giấy vào cổng',
    SubDescription: 'ເຈ້ຍເຂົ້າວຽກ',
    CPK: 10,
  },
  {
    Title: 'Approved to work from home',
    Description: 'Duyệt đăng ký làm việc tại nhà ',
    SubDescription: 'ຊອກຫາວຽກຈາກແອັບພລິເຄຊັນບ້ານ',
    CPK: 20,
  },
  {
    Title: 'Packing List',
    Description: 'Thông Tin Đóng Thùng',
    SubDescription: null,
    CPK: 57,
  },
];
