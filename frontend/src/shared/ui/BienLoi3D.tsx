import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  duPhong: ReactNode
  children: ReactNode
}

/** WebGL có thể mất giữa chừng hoặc khởi tạo thất bại: hiện phương án dự phòng thay vì vỡ cả trang. */
export class BienLoi3D extends Component<Props, { coLoi: boolean }> {
  state = { coLoi: false }

  static getDerivedStateFromError() {
    return { coLoi: true }
  }

  componentDidCatch(loi: Error, thongTin: ErrorInfo) {
    console.warn('Không hiển thị được cảnh 3D', loi, thongTin.componentStack)
  }

  render() {
    return this.state.coLoi ? this.props.duPhong : this.props.children
  }
}
