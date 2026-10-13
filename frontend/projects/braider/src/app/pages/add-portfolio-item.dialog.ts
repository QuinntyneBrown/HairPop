import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ApiError, BRAIDER_PROFILE_API } from '@hairpop/api';
import { Alert, Button, Dialog, DialogClose } from '@hairpop/components';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'hp-add-portfolio-item-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Alert, Button, Dialog, DialogClose],
  template: `
    <hp-dialog
      heading="Add a portfolio photo"
      description="Show customers an example of your work."
      [busy]="saving()"
      busyLabel="Adding photo…"
    >
      @if (error()) {
        <hp-alert tone="danger" announce heading="We couldn’t add this photo"
          ><p>{{ error() }}</p></hp-alert
        >
      }
      <div class="field">
        <label class="field__label" for="portfolio-photo">Photo</label>
        <input
          class="input"
          id="portfolio-photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          (change)="pick($event)"
        />
        <span class="field__help">JPG, PNG or WebP, up to 5 MB.</span>
      </div>
      <div class="field">
        <label class="field__label" for="portfolio-caption">Caption</label>
        <input
          class="input"
          id="portfolio-caption"
          type="text"
          maxlength="120"
          [value]="caption()"
          (input)="caption.set($any($event.target).value)"
        />
      </div>
      <div class="field">
        <label class="field__label" for="portfolio-style">Style</label>
        <select
          class="select"
          id="portfolio-style"
          [value]="styleSlug()"
          (change)="styleSlug.set($any($event.target).value)"
        >
          <option value="">No style</option>
          @for (style of styles; track style.slug) {
            <option [value]="style.slug">{{ style.name }}</option>
          }
        </select>
      </div>
      <button hp-button slot="footer" type="button" hpDialogClose>Cancel</button>
      <button
        hp-button
        slot="footer"
        variant="primary"
        type="button"
        [busy]="saving()"
        (click)="add()"
      >
        Add photo
      </button>
    </hp-dialog>
  `,
})
export class AddPortfolioItemDialog {
  protected readonly styles = inject<readonly { slug: string; name: string }[]>(DIALOG_DATA);
  private readonly ref = inject<DialogRef<boolean>>(DialogRef);
  private readonly api = inject(BRAIDER_PROFILE_API);
  protected readonly photo = signal<File | null>(null);
  protected readonly caption = signal('');
  protected readonly styleSlug = signal(this.styles[0]?.slug ?? '');
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  protected pick(event: Event): void {
    this.photo.set((event.target as HTMLInputElement).files?.item(0) ?? null);
    this.error.set(null);
  }

  protected async add(): Promise<void> {
    const photo = this.photo();
    if (
      !photo ||
      !['image/jpeg', 'image/png', 'image/webp'].includes(photo.type) ||
      photo.size > 5 * 1024 * 1024
    ) {
      this.error.set('Choose a JPG, PNG or WebP photo up to 5 MB.');
      return;
    }
    if (!this.caption().trim()) {
      this.error.set('Enter a caption for the photo.');
      return;
    }
    this.saving.set(true);
    this.error.set(null);
    try {
      await firstValueFrom(this.api.addPhoto(photo, this.caption().trim(), this.styleSlug()));
      this.ref.close(true);
    } catch (error) {
      this.error.set(
        ApiError.from(error).status === 422
          ? 'Choose a supported photo and enter a caption.'
          : 'Check your connection and try again.',
      );
    } finally {
      this.saving.set(false);
    }
  }
}
