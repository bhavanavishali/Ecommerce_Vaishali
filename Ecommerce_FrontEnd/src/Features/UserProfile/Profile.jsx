import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, MapPin, Wallet, CreditCard } from "lucide-react"

export default function UserProfile() {
  // Sample user data
  const user = {
    username: "johndoe123",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    displayName: "John D.",
    address: "123 Main Street, New York, NY 10001",
    walletBalance: 2847.5,
    profilePhoto: "/placeholder.svg?height=120&width=120",
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="border-2" style={{ borderColor: "#7a2828" }}>
        <CardHeader className="text-center pb-4" style={{ backgroundColor: "#7a2828" }}>
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-24 h-24 border-4 border-yellow-400">
              <AvatarImage src={user.profilePhoto || "/placeholder.svg"} alt="Profile" />
              <AvatarFallback className="text-2xl font-bold" style={{ backgroundColor: "#7a2828", color: "white" }}>
                {user.firstName[0]}
                {user.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl font-bold text-white">{user.displayName}</CardTitle>
              <p className="text-yellow-300 font-medium">@{user.username}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: "#7a2828" }}>
              <User className="w-5 h-5" />
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">First Name</label>
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <span className="font-medium">{user.firstName}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Last Name</label>
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <span className="font-medium">{user.lastName}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <span className="font-medium">{user.email}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: "#7a2828" }}>
              <MapPin className="w-5 h-5" />
              Address
            </h3>

            <div className="space-y-2">
              <div className="p-3 bg-gray-50 rounded-lg border">
                <span className="font-medium">{user.address}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Wallet Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: "#7a2828" }}>
              <Wallet className="w-5 h-5" />
              Wallet Balance
            </h3>

            <div className="flex items-center justify-between p-4 rounded-lg border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-yellow-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full" style={{ backgroundColor: "#7a2828" }}>
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Balance</p>
                  <p className="text-2xl font-bold" style={{ color: "#7a2828" }}>
                    ${user.walletBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-500">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
