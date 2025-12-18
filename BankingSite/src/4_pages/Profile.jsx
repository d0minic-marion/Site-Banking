import { useEffect, useMemo, useState } from "react";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";

import { useAuth } from "../3_context/AuthContext.jsx";
import { db } from "../2_config/firebase.js";
import { uploadProfilePhoto, deleteProfilePhoto } from "../6_services/storageService.js";

export default function Profile() {
  const { user } = useAuth();
  const uid = user?.uid;

  const [profile, setProfile] = useState(null);
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const userRef = useMemo(() => (uid ? doc(db, "users", uid) : null), [uid]);

  // charger / créer le profil Firestore si pas encore présent
  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!userRef || !user) return;

      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        await setDoc(userRef, {
          email: user.email || "",
          name: user.displayName || "Utilisateur",
          role: "user",
          photoURL: user.photoURL || "",
          createdAt: serverTimestamp(),
        });
      }

      const snap2 = await getDoc(userRef);
      if (mounted) setProfile({ id: snap2.id, ...snap2.data() });
    })();

    return () => {
      mounted = false;
    };
  }, [userRef, user]);

  const avatarSrc =
    profile?.photoURL ||
    user?.photoURL ||
    "https://dummyimage.com/96x96/1f2a3a/ffffff&text=N";

  // upload avatar
  const onUpload = async () => {
    if (!uid || !file || !userRef) return;

    setBusy(true);
    setMsg("");
    try {
      const url = await uploadProfilePhoto(uid, file);

      // sauvegarder l'URL dans Firestore
      await updateDoc(userRef, {
        photoURL: url,
        updatedAt: serverTimestamp(),
      });

      // refresh local
      const snap = await getDoc(userRef);
      setProfile({ id: snap.id, ...snap.data() });

      setFile(null);
      setMsg("Photo de profil mise à jour ✅");
    } catch (e) {
      setMsg("Erreur lors de l'upload ❌");
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  // supprimer avatar
  const onDelete = async () => {
    if (!uid || !userRef) return;

    setBusy(true);
    setMsg("");
    try {
      await deleteProfilePhoto(uid);

      await updateDoc(userRef, {
        photoURL: "",
        updatedAt: serverTimestamp(),
      });

      const snap = await getDoc(userRef);
      setProfile({ id: snap.id, ...snap.data() });

      setMsg("Photo supprimée ✅");
    } catch (e) {
      setMsg("Erreur lors de la suppression ❌");
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  if (!user) {
    return (
      <div className="section">
        <h1 className="title">Profil</h1>
        <p>Veuillez vous connecter.</p>
      </div>
    );
  }

  return (
    <div className="section">
      <h1 className="title">Profil</h1>

      <div className="box" style={{ maxWidth: 720 }}>
        <div className="columns is-vcentered">
          <div className="column is-narrow">
            <figure className="image is-96x96">
              <img
                src={avatarSrc}
                alt="Avatar"
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 16,
                  objectFit: "cover",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              />
            </figure>
          </div>

          <div className="column">
            <p className="title is-5">{profile?.name || user.displayName || "Utilisateur"}</p>
            <p className="has-text-grey">{profile?.email || user.email}</p>
            <p className="has-text-grey-light" style={{ marginTop: 6 }}>
              UID: {uid}
            </p>
          </div>
        </div>

        <hr />

        <div className="field">
          <label className="label">Changer la photo de profil (Storage)</label>
          <div className="control">
            <input
              className="input"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
          <p className="help">Formats conseillés: PNG/JPG/WEBP (≤ 2MB).</p>
        </div>

        <div className="buttons">
          <button
            className={`button is-primary ${busy ? "is-loading" : ""}`}
            onClick={onUpload}
            disabled={!file || busy}
          >
            Upload (Storage)
          </button>

          <button
            className={`button is-light ${busy ? "is-loading" : ""}`}
            onClick={onDelete}
            disabled={busy}
          >
            Supprimer photo
          </button>
        </div>

        {msg && <p style={{ marginTop: 10 }}>{msg}</p>}
      </div>
    </div>
  );
}