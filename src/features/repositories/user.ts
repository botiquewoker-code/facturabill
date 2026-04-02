import {
  hashLocalAccountPassword,
  readLocalAccountCredentials,
  writeLocalAccountCredentials,
  type LocalAccountCredentials,
} from "@/features/account/credentials";
import {
  readUserProfile,
  writeUserProfile,
  type UserProfile,
} from "@/features/account/profile";

export type UserRepository = {
  readProfile(): UserProfile | null;
  saveProfile(profile: UserProfile): void;
  readCredentials(): LocalAccountCredentials | null;
  saveCredentials(credentials: LocalAccountCredentials): void;
  hashPassword(password: string): Promise<string>;
};

export const localUserRepository: UserRepository = {
  readProfile: readUserProfile,
  saveProfile: writeUserProfile,
  readCredentials: readLocalAccountCredentials,
  saveCredentials: writeLocalAccountCredentials,
  hashPassword: hashLocalAccountPassword,
};
