import FullLayout from "../layout/FullLayout"
import { FormLogin } from "../components/Forms/Auth/FormLogin"

function LoginPage() {
  return (
    <FullLayout>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <img src="/logo.png" alt="Icon" style={{ width: 30, height: "auto" }} />
        <div
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "var(--ant-primary-color)",
          }}
        >
          Abby n Bev
        </div>
      </div>

      <div
        style={{
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        Sign In to your account
      </div>

      <div
        style={{
          fontSize: 12,
          color: "#404040",
          marginBottom: 20,
        }}
      >
        Welcome back! Please sign in with the account you’ve registered
      </div>

      <FormLogin />
    </FullLayout>
  )
}

export default LoginPage
