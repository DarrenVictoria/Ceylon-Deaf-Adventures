import { Injectable } from "@angular/core"
import { type Storage, ref, uploadBytesResumable, getDownloadURL, type UploadTask } from "@angular/fire/storage"
import { Observable } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class StorageService {
  constructor(private storage: Storage) {}

  upload(path: string, file: File): Observable<{ progress: number; url?: string }> {
    return new Observable((observer) => {
      const storageRef = ref(this.storage, path)
      const uploadTask: UploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          observer.next({ progress })
        },
        (error) => {
          observer.error(error)
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref)
          observer.next({ progress: 100, url })
          observer.complete()
        },
      )
    })
  }

  async getDownloadUrl(path: string): Promise<string> {
    const storageRef = ref(this.storage, path)
    return await getDownloadURL(storageRef)
  }
}
