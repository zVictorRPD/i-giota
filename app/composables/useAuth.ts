import type { IUser } from "~/interfaces/user";

export const useAuth = () => {
  const user = useState<IUser | null>("user", () => null);
  const loggedIn = computed(() => !!user.value);
  const setUser = (newUser: IUser | null) => {
    user.value = newUser;
  };

  return {
    user,
    loggedIn,
    setUser,
  };
};
