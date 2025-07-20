"use client"

interface DashboardProps {
  user: string
  onNavigate: (view: "dashboard" | "paper" | "contribution") => void
  onLogout: () => void
}

export default function Dashboard({ user, onNavigate, onLogout }: DashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div className="px-4 py-2 text-center bg-green-400">
          You are Welcome: <strong>Elviz Ismayilov!</strong>
        </div>
        <div className="px-4 py-2 flex flex-wrap justify-center space-x-4 text-sm">
          <button onClick={() => onNavigate("dashboard")} className="hover:underline">
            My Home
          </button>
          <span>My Profile</span>
          <button onClick={() => onNavigate("paper")} className="hover:underline">
            Submit a Paper
          </button>
          <span>Submit Camera Ready</span>
          <button onClick={() => onNavigate("contribution")} className="hover:underline">
            Submit a Contribution
          </button>
          <span>My All Submissions</span>
          <span>Change Password</span>
          <button onClick={onLogout} className="hover:underline">
            Sign Out
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h1 className="text-xl font-bold text-orange-600 border-b border-blue-200 pb-2 mb-6">MY HOME</h1>

          {/* Submitted Papers Section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-orange-600 mb-4">Submitted Papers:</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-600 text-white">
                    <th className="border border-gray-400 px-4 py-2 text-left">No</th>
                    <th className="border border-gray-400 px-4 py-2 text-left">PaperID</th>
                    <th className="border border-gray-400 px-4 py-2 text-left">Paper Title</th>
                    <th className="border border-gray-400 px-4 py-2 text-left">Status</th>
                    <th className="border border-gray-400 px-4 py-2 text-left">Docs</th>
                    <th className="border border-gray-400 px-4 py-2 text-left">View</th>
                    <th className="border border-gray-400 px-4 py-2 text-left">Edit</th>
                    <th className="border border-gray-400 px-4 py-2 text-left">Withdraw</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-400 px-4 py-2" colSpan={8}>
                      <em className="text-gray-500">No papers submitted yet</em>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* My other Contributions Section */}
          <div>
            <h2 className="text-lg font-medium text-orange-600 mb-4">My other Contributions:</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-600 text-white">
                    <th className="border border-gray-400 px-4 py-2 text-left">No</th>
                    <th className="border border-gray-400 px-4 py-2 text-left">Contribution type</th>
                    <th className="border border-gray-400 px-4 py-2 text-left">Title</th>
                    <th className="border border-gray-400 px-4 py-2 text-left">Status</th>
                    <th className="border border-gray-400 px-4 py-2 text-left">View</th>
                    <th className="border border-gray-400 px-4 py-2 text-left">Edit</th>
                    <th className="border border-gray-400 px-4 py-2 text-left">Withdraw</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-400 px-4 py-2" colSpan={7}>
                      <em className="text-gray-500">No contributions submitted yet</em>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-8 text-gray-700">
          <p className="mb-4">
            Ondan sonra Submit a Paper vurduqda aşağıdakı şəkildə sistemə məqalələri göndərmək pəncərəsi çıxsın.
          </p>
          <p className="mb-4">
            Məqalələri doldurandə aşağıdakı informasiyaları doldurmaq lazımdır. Burda olan zəruri məlumatlardan
            öncmildir. Aşağıda konfransın mövzuları admin paneldən dəyişən olmalıdır. Çünki konfransın mövzusu
            dəyişdikdə orda onun alt məlumatları update olmalıdır.
          </p>
          <h3 className="font-bold mb-2">Add Co-author</h3>
          <p>
            Burada məqalənin bir neçə həmmüəllifi olmalıdır. Onun həmmüəllifləri əlavə etmək olsun. Düyməni vurduqdan
            sonra.
          </p>
        </div>
      </div>
    </div>
  )
}
