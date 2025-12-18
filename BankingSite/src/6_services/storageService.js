import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../2_config/firebase.js";

/**
 * Upload une photo de profil dans Storage et retourne l'URL publique.
 * Path: profilePictures/{uid}/avatar.{ext}
 */
export async function uploadProfilePhoto(uid, file) {
  if (!uid) throw new Error("Missing uid");
  if (!file) throw new Error("Missing file");

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const safeExt = ["png", "jpg", "jpeg", "webp"].includes(ext) ? ext : "jpg";

  const storageRef = ref(storage, `profilePictures/${uid}/avatar.${safeExt}`);

  // Upload
  await uploadBytes(storageRef, file, { contentType: file.type || "image/jpeg" });

  const url = await getDownloadURL(storageRef);
  return url;
}

/**
 * Supprime la photo de profil dans Storage.
 * Essaye plusieurs extensions possibles.
 */
export async function deleteProfilePhoto(uid) {
  if (!uid) throw new Error("Missing uid");

  const exts = ["png", "jpg", "jpeg", "webp"];
  let lastErr = null;

  for (const ext of exts) {
    try {
      const storageRef = ref(storage, `profilePictures/${uid}/avatar.${ext}`);
      await deleteObject(storageRef);
      return true;
    } catch (e) {
      lastErr = e;
    }
  }

  return false;
}
