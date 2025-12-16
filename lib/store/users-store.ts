import { create } from "zustand";
import { User } from "../supabase";

interface UsersState {
  users: User[];
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  updateUserApproval: (id: string, approved: boolean) => void;
  removeUser: (id: string) => void;
}

export const useUsersStore = create<UsersState>((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
  addUser: (user) => set((state) => ({ users: [user, ...state.users] })),
  updateUserApproval: (id, approved) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, approved } : u)),
    })),
  removeUser: (id) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== id),
    })),
}));
