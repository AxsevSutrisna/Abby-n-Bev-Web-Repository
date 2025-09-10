export const RoleEnum = {
  Admin: 1,
  Customer: 2,
  Gudang: 3,
  Finance: 4,
  Media: 5,
  Cashier: 6,
} as const

export type RoleEnumType = typeof RoleEnum[keyof typeof RoleEnum]

interface SessionData {
  token?: string
  [key: string]: any
}

export default {
  isAuthenticated(): SessionData | false {
    const session = localStorage.getItem("session")
    if (session) {
      try {
        const parsed: SessionData = JSON.parse(session)
        if (parsed?.token) return parsed
      } catch (e) {
        console.error("Invalid session data", e)
      }
    }
    return false
  },

  truncString(str: string, max: number, add: string = "..."): string {
    return typeof str === "string" && str.length > max
      ? str.substring(0, max) + add
      : str
  },

  formatRupiah(angka: number | string, prefix?: string): string {
    const number_string = angka
      ? angka.toString().replace(/[^,\d]/g, "").toString()
      : ""

    const split = number_string.split(",")
    const sisa = split[0].length % 3
    let rupiah = split[0].substr(0, sisa)
    const ribuan = split[0].substr(sisa).match(/\d{3}/gi)

    if (ribuan) {
      const separator = sisa ? "." : ""
      rupiah += separator + ribuan.join(".")
    }

    rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah
    return prefix === undefined ? rupiah : rupiah ? "Rp. " + rupiah : ""
  },

  formatN(num: number, digits: number): string {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "G" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" },
    ]
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
    const item = lookup
      .slice()
      .reverse()
      .find((item) => num >= item.value)

    return item
      ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
      : "0"
  },

  isHTML(str: string): boolean {
    const a = document.createElement("div")
    a.innerHTML = str
    for (let i = a.childNodes.length; i--; ) {
      if (a.childNodes[i].nodeType === 1) return true
    }
    return false
  },

  hasAnyPermission(roleId: number, allowedRole: number[]): boolean {
    if (!roleId) return false
    if (roleId === RoleEnum.Admin) return true
    return allowedRole.includes(roleId)
  },

  RoleEnum,
}
