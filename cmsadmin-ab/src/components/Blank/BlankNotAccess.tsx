import type { FC } from "react"
import Result from "antd/es/result"
import Button from "antd/es/button"
import history from "../../utils/history"

const BlankNotAccess: FC = () => {
  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you cannot access this page."
      extra={
        <Button type="primary" onClick={() => history.back()}>
          Back
        </Button>
      }
    />
  )
}

export default BlankNotAccess
