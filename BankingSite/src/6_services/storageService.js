import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../2_config/firebase.js";

export async function uploadProfilePhoto(uid, file) {
  if (!uid) throw new Error("Missing uid");
  if (!file) throw new Error("Missing file");

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const safeExt = ["png", "jpg", "jpeg", "webp"].includes(ext) ? ext : "jpg";

  const storageRef = ref(storage, `profilePictures/${uid}/avatar.${safeExt}`);

  await uploadBytes(storageRef, file, { contentType: file.type || "image/jpeg" });

  const url = await getDownloadURL(storageRef);
  return url;
}

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