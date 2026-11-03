export const ROUTES = {
  home: '/',
  catalog: '/ca-bay-mau',
  fish: (slug: string) => `/ca-bay-mau/${slug}`,
  cart: '/gio-hang',
  checkout: '/thanh-toan',
  lookup: '/tra-cuu-don',
  auth: '/dang-nhap',
  admin: '/quan-tri',
} as const
