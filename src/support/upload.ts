import { storage } from "@/firebase/firebase"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"

export const uploadAvatar = async (file: File, alert: any): Promise<string> => {
    try {
      const storageRef = ref(storage, `lib_management/${file.name}`)
      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)
      return downloadURL
    } catch (error) {
      alert("danger", "Lỗi khi tải ảnh lên Firebase!")
      console.error(error)
      return ""
    }
  }
  