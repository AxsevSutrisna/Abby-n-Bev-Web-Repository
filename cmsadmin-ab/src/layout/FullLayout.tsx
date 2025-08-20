import React, { type ReactNode } from "react"
import { Card, Row, Col } from "antd"
import loginLeft from "../assets/img/login-left.png"
import "./FullLayout.css"

interface FullLayoutProps {
  children: ReactNode
}

const FullLayout: React.FC<FullLayoutProps> = ({ children }) => {
  return (
    <Row style={{ height: "100vh" }}>
      {/* Left side */}
      <Col xs={0} sm={0} md={0} lg={12} xl={12}>
        <div
          style={{
            background: "linear-gradient(112.1deg, #E482B9 11.4%, #9B3C6C 70.2%)",
            width: "100%",
            height: "100vh",
            color: "#fff",
            position: "relative",
            padding: "40px",
          }}
        >
          <div style={{ fontWeight: "bold", fontSize: 30, marginBottom: 20 }}>
            Welcome to <br /> Abby n Bev Admin Panel
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.5, maxWidth: "80%" }}>
            Admin panel e-commerce adalah pusat kontrol bagi pengelola untuk
            mengelola produk, pesanan, pelanggan, dan analisis penjualan.
            Platform ini menyediakan alat lengkap untuk mengoptimalkan dan
            memantau operasional toko online secara efisien.
          </div>

          <img
            src={loginLeft}
            alt="Illustration"
            style={{
              position: "absolute",
              bottom: 0,
              left: 20,
              width: "90%",
              height: "auto",
              objectFit: "contain",
            }}
          />
        </div>
      </Col>

      {/* Right side */}
      <Col xs={24} sm={24} md={24} lg={12} xl={12} style={{ height: "100vh" }}>
        <Card
          bordered={false}
          style={{ height: "100%", display: "flex", flexDirection: "column" }}
          bodyStyle={{
            padding: "40px 20px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Row justify="center">
            <Col xs={24} sm={24} md={20} lg={16}>
              {children}
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  )
}

export default FullLayout
