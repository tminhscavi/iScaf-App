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
