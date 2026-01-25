"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PhoneInput } from "@/components/ui/phone-input";
import {
    Plus,
    Search,
    Trash2,
    User,
    Mail,
    Phone,
    Loader2,
    AlertTriangle,
    Shield,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { usersAPI, type User as UserType } from "@/lib/api/users";
import { ordersAPI, checkAPI } from "@/lib/api";
import { toast } from "sonner";

export default function AdminUsersPage() {
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [userOrders, setUserOrders] = useState<any[]>([]);

    // Add user form
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("+998");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"user" | "admin">("user");

    // Check exists states
    const [emailChecking, setEmailChecking] = useState(false);
    const [emailExists, setEmailExists] = useState<boolean | null>(null);
    const [emailCheckTimeout, setEmailCheckTimeout] =
        useState<NodeJS.Timeout | null>(null);
    const [phoneChecking, setPhoneChecking] = useState(false);
    const [phoneExists, setPhoneExists] = useState<boolean | null>(null);
    const [phoneCheckTimeout, setPhoneCheckTimeout] =
        useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await usersAPI.getAll();
            setUsers(data);
        } catch (error) {
            console.error("Failed to load users:", error);
            toast.error(
                t(
                    "Foydalanuvchilarni yuklashda xatolik",
                    "Ошибка загрузки пользователей",
                ),
            );
        } finally {
            setLoading(false);
        }
    };

    const checkUserOrders = async (userId: string) => {
        try {
            const orders = await ordersAPI.getAllOrders();
            const userOrdersList = orders.filter(
                (order) => order.userId === userId,
            );
            setUserOrders(userOrdersList);
            return userOrdersList;
        } catch (error) {
            console.error("Failed to check user orders:", error);
            return [];
        }
    };

    const handleDeleteClick = async (user: UserType) => {
        setSelectedUser(user);
        await checkUserOrders(user.id);
        setShowDeleteDialog(true);
    };

    const handleDelete = async () => {
        if (!selectedUser) return;

        // Check if user has active orders
        const activeOrders = userOrders.filter(
            (order) =>
                order.status !== "delivered" && order.status !== "cancelled",
        );

        if (activeOrders.length > 0) {
            toast.error(
                t(
                    "Foydalanuvchining faol buyurtmalari bor! Avval buyurtmalarni tugatish kerak.",
                    "У пользователя есть активные заказы! Сначала завершите заказы.",
                ),
            );
            return;
        }

        setDeleteLoading(true);
        try {
            await usersAPI.delete(selectedUser.id);
            toast.success(t("Foydalanuvchi o'chirildi", "Пользователь удален"));
            setShowDeleteDialog(false);
            setSelectedUser(null);
            loadUsers();
        } catch (error) {
            console.error("Failed to delete user:", error);
            toast.error(
                t(
                    "Foydalanuvchini o'chirishda xatolik",
                    "Ошибка удаления пользователя",
                ),
            );
        } finally {
            setDeleteLoading(false);
        }
    };

    // Email mavjudligini tekshirish
    const checkEmailExists = async (emailValue: string) => {
        if (!emailValue || emailValue.length < 5) {
            setEmailExists(null);
            return;
        }
        if (emailCheckTimeout) clearTimeout(emailCheckTimeout);
        setEmailChecking(true);
        const timeout = setTimeout(async () => {
            try {
                const result = await checkAPI.user.email(emailValue);
                setEmailExists(result.exists);
            } catch (error) {
                console.error("Email check error:", error);
                setEmailExists(null);
            } finally {
                setEmailChecking(false);
            }
        }, 500);
        setEmailCheckTimeout(timeout);
    };

    // Phone mavjudligini tekshirish
    const checkPhoneExists = async (phoneValue: string) => {
        if (!phoneValue || phoneValue.length < 13) {
            setPhoneExists(null);
            return;
        }
        if (phoneCheckTimeout) clearTimeout(phoneCheckTimeout);
        setPhoneChecking(true);
        const timeout = setTimeout(async () => {
            try {
                const result = await checkAPI.user.phone(phoneValue);
                setPhoneExists(result.exists);
            } catch (error) {
                console.error("Phone check error:", error);
                setPhoneExists(null);
            } finally {
                setPhoneChecking(false);
            }
        }, 500);
        setPhoneCheckTimeout(timeout);
    };

    const handleAddUser = async () => {
        // Phone majburiy, email majburiy emas
        if (!firstName || !lastName || !phone || !password) {
            toast.error(
                t(
                    "Ism, familiya, telefon va parol majburiy",
                    "Имя, фамилия, телефон и пароль обязательны",
                ),
            );
            return;
        }

        // Phone validation - must be complete
        if (phone.replace(/\D/g, "").length !== 12) {
            toast.error(
                t(
                    "To'liq telefon raqamini kiriting",
                    "Введите полный номер телефона",
                ),
            );
            return;
        }

        setAddLoading(true);
        try {
            await usersAPI.register({
                firstName,
                lastName,
                email: email.trim() || undefined,
                phone,
                password,
                role,
            });
            toast.success(
                t("Foydalanuvchi qo'shildi", "Пользователь добавлен"),
            );
            setShowAddDialog(false);
            // Reset form
            setFirstName("");
            setLastName("");
            setEmail("");
            setPhone("+998");
            setPassword("");
            setRole("user");
            loadUsers();
        } catch (error) {
            console.error("Failed to add user:", error);
            toast.error(
                t(
                    "Foydalanuvchi qo'shishda xatolik",
                    "Ошибка добавления пользователя",
                ),
            );
        } finally {
            setAddLoading(false);
        }
    };

    const getRoleBadge = (role: string) => {
        if (role === "admin") {
            return (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-500">
                    {t("Admin", "Админ")}
                </span>
            );
        }
        return (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500">
                {t("Foydalanuvchi", "Пользователь")}
            </span>
        );
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("uz-UZ", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    const filteredUsers = users.filter(
        (user) =>
            `${user.firstName} ${user.lastName}`
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.phone && user.phone.includes(searchQuery)),
    );

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-black">
                            {t("Foydalanuvchilar", "Пользователи")}
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            {t(
                                "Barcha foydalanuvchilarni boshqarish",
                                "Управление всеми пользователями",
                            )}
                        </p>
                    </div>
                    <Button
                        className="gap-2 h-11"
                        onClick={() => setShowAddDialog(true)}
                    >
                        <Plus className="h-5 w-5" />
                        {t("Yangi foydalanuvchi", "Новый пользователь")}
                    </Button>
                </div>

                {/* Search */}
                <Card>
                    <CardContent className="p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder={t(
                                    "Foydalanuvchi qidirish...",
                                    "Поиск пользователя...",
                                )}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-12"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Users Table */}
                <Card>
                    <CardContent className="p-6">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="text-center py-12">
                                <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                <p className="text-xl text-muted-foreground">
                                    {t(
                                        "Foydalanuvchilar topilmadi",
                                        "Пользователи не найдены",
                                    )}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>
                                                {t(
                                                    "Foydalanuvchi",
                                                    "Пользователь",
                                                )}
                                            </TableHead>
                                            <TableHead>
                                                {t("Aloqa", "Контакты")}
                                            </TableHead>
                                            <TableHead>
                                                {t("Rol", "Роль")}
                                            </TableHead>
                                            <TableHead>
                                                {t(
                                                    "Ro'yxatdan o'tgan",
                                                    "Регистрация",
                                                )}
                                            </TableHead>
                                            <TableHead className="text-right">
                                                {t("Amallar", "Действия")}
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUsers.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                            <User className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold">
                                                                {user.firstName}{" "}
                                                                {user.lastName}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                ID:{" "}
                                                                {user.id.slice(
                                                                    0,
                                                                    8,
                                                                )}
                                                                ...
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                                            {user.email}
                                                        </div>
                                                        {user.phone && (
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <Phone className="h-4 w-4 text-muted-foreground" />
                                                                {user.phone}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {getRoleBadge(user.role)}
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {formatDate(user.createdAt)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-red-500 hover:text-red-600"
                                                        onClick={() =>
                                                            handleDeleteClick(
                                                                user,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Add User Dialog */}
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {t(
                                "Yangi foydalanuvchi qo'shish",
                                "Добавить нового пользователя",
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            {t(
                                "Yangi foydalanuvchi ma'lumotlarini kiriting",
                                "Введите данные нового пользователя",
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="firstName"
                                    className="text-sm font-medium"
                                >
                                    {t("Ism", "Имя")}{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="firstName"
                                    value={firstName}
                                    onChange={(e) =>
                                        setFirstName(e.target.value)
                                    }
                                    placeholder={t("Ismingiz", "Ваше имя")}
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="lastName"
                                    className="text-sm font-medium"
                                >
                                    {t("Familiya", "Фамилия")}{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="lastName"
                                    value={lastName}
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                    placeholder={t(
                                        "Familiyangiz",
                                        "Ваша фамилия",
                                    )}
                                    className="h-11"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="email"
                                className="text-sm font-medium"
                            >
                                {t("Email", "Email")}{" "}
                                <span className="text-muted-foreground text-xs">
                                    ({t("ixtiyoriy", "необязательно")})
                                </span>
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setEmail(value);
                                    checkEmailExists(value);
                                }}
                                placeholder="email@example.com"
                                className={`h-11 ${emailExists ? "border-red-500" : ""}`}
                            />
                            {emailChecking && (
                                <p className="text-xs text-muted-foreground">
                                    {t("Tekshirilmoqda...", "Проверка...")}
                                </p>
                            )}
                            {emailExists && (
                                <p className="text-xs text-red-500">
                                    {t(
                                        "Bu email serverda mavjud",
                                        "Этот email уже существует на сервере",
                                    )}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="phone"
                                className="text-sm font-medium"
                            >
                                {t("Telefon", "Телефон")}{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <PhoneInput
                                id="phone"
                                value={phone}
                                onChange={(value) => {
                                    setPhone(value);
                                    checkPhoneExists(value);
                                }}
                                className={`h-11 ${phoneExists ? "border-red-500" : ""}`}
                            />
                            {phoneChecking && (
                                <p className="text-xs text-muted-foreground">
                                    {t("Tekshirilmoqda...", "Проверка...")}
                                </p>
                            )}
                            {phoneExists && (
                                <p className="text-xs text-red-500">
                                    {t(
                                        "Bu telefon raqam serverda mavjud",
                                        "Этот номер телефона уже существует на сервере",
                                    )}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="password"
                                className="text-sm font-medium"
                            >
                                {t("Parol", "Пароль")}{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="role"
                                className="text-sm font-medium"
                            >
                                {t("Rol", "Роль")}{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={role}
                                onValueChange={(value: "user" | "admin") =>
                                    setRole(value)
                                }
                            >
                                <SelectTrigger id="role" className="h-11">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="user">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-blue-500" />
                                            <span>
                                                {t(
                                                    "Foydalanuvchi",
                                                    "Пользователь",
                                                )}
                                            </span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="admin">
                                        <div className="flex items-center gap-2">
                                            <Shield className="h-4 w-4 text-purple-500" />
                                            <span>{t("Admin", "Админ")}</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowAddDialog(false)}
                            disabled={addLoading}
                        >
                            {t("Bekor qilish", "Отмена")}
                        </Button>
                        <Button onClick={handleAddUser} disabled={addLoading}>
                            {addLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t("Qo'shilmoqda...", "Добавление...")}
                                </>
                            ) : (
                                t("Qo'shish", "Добавить")
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {t(
                                "Foydalanuvchini o'chirish",
                                "Удалить пользователя",
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedUser && (
                                <div className="space-y-4 mt-4">
                                    <p>
                                        {t(
                                            "Haqiqatan ham bu foydalanuvchini o'chirmoqchimisiz?",
                                            "Вы действительно хотите удалить этого пользователя?",
                                        )}
                                    </p>
                                    <div className="p-4 bg-muted rounded-lg">
                                        <p className="font-semibold">
                                            {selectedUser.firstName}{" "}
                                            {selectedUser.lastName}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {selectedUser.email}
                                        </p>
                                    </div>
                                    {userOrders.length > 0 && (
                                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                            <div className="flex items-start gap-2">
                                                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                                                <div>
                                                    <p className="font-semibold text-yellow-700 dark:text-yellow-500">
                                                        {t(
                                                            "Ogohlantirish",
                                                            "Предупреждение",
                                                        )}
                                                    </p>
                                                    <p className="text-sm mt-1">
                                                        {t(
                                                            `Foydalanuvchida ${userOrders.length} ta buyurtma bor. Faol buyurtmalar: ${userOrders.filter((o) => o.status !== "delivered" && o.status !== "cancelled").length} ta`,
                                                            `У пользователя ${userOrders.length} заказов. Активных заказов: ${userOrders.filter((o) => o.status !== "delivered" && o.status !== "cancelled").length}`,
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteDialog(false)}
                            disabled={deleteLoading}
                        >
                            {t("Bekor qilish", "Отмена")}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t("O'chirilmoqda...", "Удаление...")}
                                </>
                            ) : (
                                t("O'chirish", "Удалить")
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
