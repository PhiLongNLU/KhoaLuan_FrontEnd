import axiosInstance from "@/lib/api";
import response from "@/types/response";
import { User, UserAuth } from "@/types/user";
import { useTranslations } from "next-intl";

class AuthService {
  private static instance: AuthService;
  private t = useTranslations();

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
      switch (error.status) {
        case 401:
          throw new Error(this.t("welcome.invalidCredentials"));
        default:
          throw new Error(error.message);
      }
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
      switch (error.status) {
        case 409:
          throw new Error(this.t("welcome.accountAlreadyExist"));
        default:
          throw new Error(this.t("welcome.accountCreateFailed"));
      }
    }
  };

  public logout = async () => {
    alert("auth service: logout");
  };

  public getAccount = async (token: string) => {
    console.log(`auth service: getAccount: ${token}`);

    try {
      const response = await axiosInstance.get("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("data: ", response.data);

      return {
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        phone: response.data.phone,
        avatar: response.data.avatar,
        lastLogin: response.data.lastLogin,
        lastUpdated: response.data.lastUpdated,
      };
    } catch (error) {
      console.error(error);
    }
  };

  public verify = async () => {
    alert("auth service: verify");
  };
}
export default AuthService;
