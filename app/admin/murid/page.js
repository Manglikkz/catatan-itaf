import { Users, Search } from "lucide-react";
import { db } from "@/lib/db";
import { users, catatan } from "@/lib/schema";
import { eq, sql, desc } from "drizzle-orm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { AdminDeleteUserButton } from "@/components/admin/delete-user-button";

async function getAllUsers() {
  // Menggunakan LEFT JOIN untuk mengambil user sekaligus menghitung jumlah catatannya
  // dalam SATU kali query database.
  const results = await db
    .select({
      id: users.id,
      name: users.name,
      role: users.role,
      createdAt: users.createdAt,
      // Hitung jumlah id catatan, cast ke Number agar aman
      catatanCount: sql`count(${catatan.id})`.mapWith(Number),
    })
    .from(users)
    // Hubungkan tabel users dengan catatan
    .leftJoin(catatan, eq(users.id, catatan.userId))
    // Grouping berdasarkan ID user (wajib untuk fungsi agregasi count)
    .groupBy(users.id)
    .orderBy(desc(users.createdAt));

  // Formatting hasil agar sesuai dengan struktur yang diharapkan component
  return results.map((user) => ({
    id: user.id,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
    _count: {
      catatan: user.catatanCount,
    },
  }));
}

export default async function AdminMuridPage() {
  const userList = await getAllUsers();
  const muridList = userList.filter((u) => u.role === "murid");
  const adminList = userList.filter((u) => u.role === "admin");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-primary-500" />
          Kelola Murid
        </h1>
        <p className="text-gray-500">
          Total {muridList.length} murid terdaftar
        </p>
      </div>

      {/* Admin List */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900">Administrator</h2>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {adminList.map((admin) => (
              <div
                key={admin.id}
                className="flex items-center justify-between p-3 bg-primary-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={admin.name} size="md" />
                  <div>
                    <p className="font-medium text-gray-900">{admin.name}</p>
                    <p className="text-sm text-gray-500">
                      {admin._count.catatan} catatan
                    </p>
                  </div>
                </div>
                <Badge className="bg-primary-500 text-white">Admin</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Murid List */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900">Daftar Murid</h2>
        </CardHeader>
        <CardContent className="pt-0">
          {muridList.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Belum ada murid terdaftar
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                      Nama
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500 hidden sm:table-cell">
                      Bergabung
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                      Catatan
                    </th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {muridList.map((murid) => (
                    <tr key={murid.id} className="hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          <Avatar name={murid.name} size="sm" />
                          <span className="font-medium text-gray-900">
                            {murid.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-sm text-gray-500 hidden sm:table-cell">
                        {formatDate(murid.createdAt)}
                      </td>
                      <td className="py-3 px-2">
                        <Badge variant="outline">{murid._count.catatan}</Badge>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <AdminDeleteUserButton
                          userId={murid.id}
                          userName={murid.name}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
