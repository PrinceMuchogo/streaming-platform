import { create } from 'zustand';
import { persist, PersistOptions, PersistStorage } from 'zustand/middleware';

interface User {
  id?: string;
  email?: string;
  profile_image_url?: string;
  role?: string;
  username?: string;
  image?: string;
} 

interface UserInfoState {
  userInfo: User | null;
  setUserInfo: (userInfo: any) => void;
  clearUserInfo: () => void;
}

type UserInfoStore = UserInfoState;

// Custom storage wrapper to conform to PersistStorage<UserInfoState>
const localStoragePersist: PersistStorage<UserInfoState> = {
  getItem: (name) => {
    const value = localStorage.getItem(name);
    if (value) {
      return JSON.parse(value);
    }
    return null;
  },
  setItem: (name, value) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};

const useUserStore = create<UserInfoState>()(
  persist<UserInfoState>(
    (set) => ({
      userInfo: null,
      setUserInfo: (userInfo) => set({ userInfo }),
      clearUserInfo: () => {
        set({ userInfo: null });
        localStorage.removeItem('user-info');
      },
    }),
    {
      name: 'user-info',
      storage: localStoragePersist,
    }
  )
);

export default useUserStore;
