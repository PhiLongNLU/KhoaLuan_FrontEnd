import axiosInstance from "@/lib/api";
import { UserAuth } from "@/types/user";

class AuthService {
  private static instance: AuthService;

  public static getInstance() {
    if (!AuthService.instance) AuthService.instance = new AuthService();
    return AuthService.instance;
  }

  public login = async (form: UserAuth) => {
    const params = new URLSearchParams();
    params.append("username", form.email);
    params.append("password", form.password);

    try {
      const response = await axiosInstance.post("/auth/login", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      return response.data;
    } catch (error: any) {
      const status = error?.response?.status ?? error?.status;
      const e = new Error(error?.message ?? "Request failed");
      (e as any).status = status;
      throw e;
    }
  };

  public register = async (form: UserAuth) => {
    const params = new URLSearchParams();
    params.append("username", form.email);
    params.append("password", form.password);

    try {
      await axiosInstance.post("/auth/register", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
    } catch (error: any) {
      const status = error?.response?.status ?? error?.status;
      const e = new Error(error?.message ?? "Request failed");
      (e as any).status = status;
      throw e;
    }
  };

  public logout = async () => {
    alert("auth service: logout");
  };

  public getAccount = async (token: string) => {
    try {
      const response = await axiosInstance.get("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return {
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        phone: response.data.phone,
        avatar: response.data.avatar,
        lastLogin: response.data.lastLogin,
        lastUpdated: response.data.lastUpdated,
      };
    } catch (error:any) {
      const status = error?.response?.status ?? error?.status;
      const e = new Error(error?.message ?? "Request failed");
      (e as any).status = status;
      throw e;
    }
  };

  public verify = async (token: string): Promise<boolean> => {
    try {
      const response = await axiosInstance.get("/auth/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && typeof response.data.data === "boolean") {
        console.log("Auth Service: Kết quả xác thực:", response.data.data);
        return response.data.data;
      } else {
        return false;
      }
    } catch (error:any) {
      const status = error?.response?.status ?? error?.status;
      const e = new Error(error?.message ?? "Request failed");
      (e as any).status = status;
      throw e;
    }
  };
}
export default AuthService;
