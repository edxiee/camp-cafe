import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL, deleteObject } from '@angular/fire/storage';

@Injectable({ providedIn: 'root' })
export class StorageService {
  constructor(private storage: Storage) {}

  async uploadProfilePhoto(uid: string, file: Blob, fileName: string): Promise<string> {
    if (!uid) {
      throw new Error('Cannot upload profile photo without a user id.');
    }

    const extension = this.inferExtension(file, fileName);
    const safeBaseName = this.sanitizeBaseName(fileName);
    const finalFileName = `${Date.now()}-${safeBaseName}.${extension}`;
    const storageRef = ref(this.storage, `profile-photos/${uid}/${finalFileName}`);

    await uploadBytes(storageRef, file, {
      contentType: file.type || this.inferMimeType(extension),
    });

    return getDownloadURL(storageRef);
  }

  async deleteByUrl(url?: string | null): Promise<void> {
    if (!url) {
      return;
    }
    try {
      const storageRef = ref(this.storage, url);
      await deleteObject(storageRef);
    } catch (error) {
      // Silently ignore deletion errors so the profile update flow is not blocked
      console.warn('Failed to delete storage object:', error);
    }
  }

  private inferExtension(file: Blob, fileName: string): string {
    if (file.type) {
      const map: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
      };
      const ext = map[file.type.toLowerCase()];
      if (ext) {
        return ext;
      }
    }

    const match = /\.([a-z0-9]+)$/i.exec(fileName);
    if (match) {
      return match[1].toLowerCase();
    }

    return 'jpg';
  }

  private inferMimeType(extension: string): string {
    switch (extension.toLowerCase()) {
      case 'png':
        return 'image/png';
      case 'webp':
        return 'image/webp';
      default:
        return 'image/jpeg';
    }
  }

  private sanitizeBaseName(fileName: string): string {
    const base = fileName ? fileName.replace(/\.[^/.]+$/, '') : 'profile';
    return base.replace(/[^a-zA-Z0-9_-]+/g, '_').substring(0, 40) || 'profile';
  }
}
