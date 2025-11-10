import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-update-profile-modal',
  standalone: false,
  templateUrl: './update-profie.modal.html',
  styleUrls: ['./update-profile.modal.scss'],
})
export class UpdateProfileModal {
  @Input() currentName = '';
  @Input() currentPhotoURL: string | null = null;
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  newName = '';
  photoPreview: string | null = null;
  selectedImageName = '';
  private pendingPhotoDataUrl?: string;
  private photoRemoved = false;
  isSaving = false;

  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService,
    private userService: UserService
  ) {}

  // Initialize newName. If currentName isn't provided, load the user's profile
  // and set newName to "firstName lastName".
  async ngOnInit() {
    if (this.currentName?.trim()) {
      this.newName = this.currentName.trim();
    }

    this.photoPreview = this.currentPhotoURL ?? null;

    try {
      const user = await this.authService.getCurrentUser();
      if (user?.uid) {
        const profile = await firstValueFrom(this.userService.getUserProfile(user.uid));
        if (profile) {
          if (!this.newName) {
            const first = profile.firstName ?? '';
            const last = profile.lastName ?? '';
            this.newName = `${first} ${last}`.trim();
            this.currentName = this.newName;
          }
          this.photoPreview = profile.photoURL ?? this.photoPreview;
        }
        // Fall back to Firebase Auth displayName if Firestore profile has no name yet
        if (!this.newName) {
          this.newName = user.displayName || '';
        }
        if (!this.photoPreview) {
          this.photoPreview = user.photoURL ?? null;
        }
      }
    } catch (err) {
      console.error('Error loading user profile for default name:', err);
      // fallback: leave newName as empty string
    }

    this.currentPhotoURL = this.photoPreview;
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    if (file.size > 5 * 1024 * 1024) {
      alert('Image file is too large. Please choose an image smaller than 5MB.');
      this.resetFileInput();
      return;
    }

    const previousPreview = this.photoPreview;

    try {
      const dataUrl = await this.compressImage(file, 1024, 1024, 0.72);

      this.pendingPhotoDataUrl = dataUrl;
      this.photoPreview = dataUrl;
      this.selectedImageName = file.name;
      this.photoRemoved = false;
    } catch (error) {
      console.error('Failed to process selected image:', error);
      const message = error instanceof Error ? error.message : 'Failed to process image. Please try a different file.';
      alert(message);
      this.pendingPhotoDataUrl = undefined;
      this.photoPreview = previousPreview ?? this.currentPhotoURL ?? null;
      this.selectedImageName = '';
    } finally {
      this.resetFileInput();
    }
  }

  removePhoto() {
    this.photoPreview = null;
    this.pendingPhotoDataUrl = undefined;
    this.selectedImageName = '';
    this.photoRemoved = true;
    this.resetFileInput();
  }

  // Save: update Firebase Auth displayName and the Firestore user document (username, firstName, lastName)
  async save() {
    if (this.isSaving) {
      return;
    }

    if (!this.newName.trim()) {
      alert('Name cannot be empty.');
      return;
    }

    try {
      this.isSaving = true;
      // Normalize name and split into first/last parts
      const full = this.newName.trim();
      const parts = full.split(/\s+/);
      const firstName = parts.shift() || '';
      const lastName = parts.join(' ') || '';

      const user = await this.authService.getCurrentUser();
      if (!user?.uid) {
        throw new Error('No authenticated user found.');
      }

      let photoURLUpdate: string | null | undefined;

      if (this.photoRemoved) {
        photoURLUpdate = null;
      } else if (this.pendingPhotoDataUrl) {
        photoURLUpdate = this.pendingPhotoDataUrl;
      }

      const profilePayload: { username: string; firstName: string; lastName: string; photoURL?: string | null } = {
        username: full,
        firstName,
        lastName,
      };

      if (photoURLUpdate !== undefined) {
        profilePayload.photoURL = photoURLUpdate;
      }

      await this.userService.updateUserProfile(user.uid, profilePayload);

      // Update Firebase Auth displayName only (photoURL stored locally in Firestore)
      await this.authService.updateName(full);

      this.photoRemoved = false;
      this.pendingPhotoDataUrl = undefined;
      this.selectedImageName = '';

      if (photoURLUpdate !== undefined) {
        this.currentPhotoURL = photoURLUpdate;
        this.photoPreview = photoURLUpdate;
      }

      const result: { newName: string; photoURL?: string | null } = { newName: full };
      if (photoURLUpdate !== undefined) {
        result.photoURL = photoURLUpdate;
      }

      // Return the updated values to the caller
      this.modalCtrl.dismiss(result);
    } catch (error) {
      console.error('Failed to update profile name:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      this.isSaving = false;
    }
  }

  private resetFileInput() {
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  private compressImage(file: File, maxW: number, maxH: number, quality = 0.72): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Unable to read image file.'));
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          const ratio = Math.min(maxW / width, maxH / height, 1);
          const targetW = Math.round(width * ratio);
          const targetH = Math.round(height * ratio);

          const canvas = document.createElement('canvas');
          canvas.width = targetW;
          canvas.height = targetH;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context not available.'));
            return;
          }

          ctx.drawImage(img, 0, 0, targetW, targetH);

          const isPng = (file.type || '').toLowerCase().includes('png');
          const mime = isPng ? 'image/png' : 'image/jpeg';
          const dataUrl = canvas.toDataURL(mime, isPng ? undefined : quality);

          if (dataUrl.length > 500 * 1024) {
            reject(new Error('Image is too large after compression. Please choose a smaller image.'));
            return;
          }

          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error('Unable to load image for processing.'));
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  }
}
