import { ChangeDetectionStrategy, Component, afterNextRender, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ApiError,
  BRAIDER_PROFILE_API,
  BraiderProfileContent,
  ManagedPortfolioItem,
} from '@hairpop/api';
import {
  Alert,
  Button,
  Card,
  DialogService,
  EmptyState,
  PageHeader,
  Spinner,
} from '@hairpop/components';
import { firstValueFrom } from 'rxjs';
import { BraiderSignOutDialog } from './braider-sign-out.dialog';
import { AddPortfolioItemDialog } from './add-portfolio-item.dialog';

@Component({
  selector: 'hp-braider-profile-content-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Alert, Button, Card, EmptyState, PageHeader, ReactiveFormsModule, Spinner],
  template: `
    <hp-page-header
      eyebrow="HairPop for braiders"
      heading="Your public profile"
      subtitle="What customers see before they request an appointment."
    >
      <button hp-button slot="actions" type="button" (click)="openSignOut()">Sign out</button>
    </hp-page-header>
    @if (loading()) {
      <hp-spinner label="Loading your profile" />
    } @else if (failed()) {
      <hp-empty-state
        variant="error"
        heading="We couldn’t load your profile"
        text="Check your connection and try again."
      >
        <button hp-button slot="actions" variant="primary" type="button" (click)="load()">
          Try again
        </button>
      </hp-empty-state>
    } @else if (profile()) {
      <div class="stack">
        @if (saved()) {
          <hp-alert tone="success" announce heading="Profile changes saved" />
        }
        @if (error() === 'stale') {
          <hp-alert tone="warning" announce heading="Your profile has changed">
            <p>Refresh the profile before saving again. Your entered details are still here.</p>
            <button hp-button slot="actions" type="button" (click)="load()">Refresh profile</button>
          </hp-alert>
        } @else if (error()) {
          <hp-alert tone="danger" announce heading="We couldn’t save your profile">
            <p>
              {{
                error() === 'invalid'
                  ? 'Check the profile details and try again.'
                  : 'Check your connection and try again.'
              }}
            </p>
          </hp-alert>
        }
        <section hp-card class="stack" aria-labelledby="profile-details-title">
          <h2 id="profile-details-title">Profile details</h2>
          <form class="stack" [formGroup]="form" (ngSubmit)="save()">
            <div class="field">
              <label class="field__label" for="profile-bio">About you</label>
              <textarea
                class="textarea"
                id="profile-bio"
                formControlName="bio"
                maxlength="600"
              ></textarea>
            </div>
            <div class="field">
              <label class="field__label" for="profile-area">Service area</label>
              <input
                class="input"
                id="profile-area"
                type="text"
                formControlName="area"
                maxlength="120"
              />
            </div>
            <div class="field">
              <label class="field__label" for="profile-address">Studio address</label>
              <input
                class="input"
                id="profile-address"
                type="text"
                formControlName="studioAddress"
                maxlength="1000"
              />
              <span class="field__help">Private. Shared only after you accept a request.</span>
            </div>
            <div class="field">
              <label class="field__label" for="profile-preparation">Preparation guidance</label>
              <textarea
                class="textarea"
                id="profile-preparation"
                formControlName="preparation"
                maxlength="1000"
              ></textarea>
            </div>
            <div class="field">
              <label class="field__label" for="profile-changes">Change policy</label>
              <textarea
                class="textarea"
                id="profile-changes"
                formControlName="changePolicy"
                maxlength="1000"
              ></textarea>
            </div>
            <div class="field">
              <label class="field__label" for="profile-cancellation">Cancellation policy</label>
              <textarea
                class="textarea"
                id="profile-cancellation"
                formControlName="cancellationPolicy"
                maxlength="1000"
              ></textarea>
            </div>
            <div class="form-actions">
              <button hp-button variant="primary" type="submit" [busy]="saving()">
                Save changes
              </button>
            </div>
          </form>
        </section>
        <section hp-card class="stack" aria-labelledby="portfolio-title">
          <div class="card__header">
            <h2 id="portfolio-title">Portfolio</h2>
            <button hp-button type="button" (click)="openAddPhoto()">Add photo</button>
          </div>
          @if (photoError()) {
            <hp-alert tone="danger" announce heading="We couldn’t remove this photo">
              <p>Check your connection and try again.</p>
            </hp-alert>
          }
          @if (profile()?.portfolio?.length) {
            <ul class="gallery">
              @for (item of profile()!.portfolio; track item.id) {
                <li class="gallery__item">
                  <figure>
                    @if (item.image) {
                      <img class="gallery__photo" [src]="item.image.src" [alt]="item.image.alt" />
                    }
                    <figcaption class="gallery__caption">{{ item.caption }}</figcaption>
                  </figure>
                  <button
                    hp-button
                    variant="ghost"
                    size="sm"
                    type="button"
                    [disabled]="removing() === item.id"
                    (click)="removePhoto(item)"
                  >
                    Remove<span class="visually-hidden"> {{ item.caption }}</span>
                  </button>
                </li>
              }
            </ul>
          } @else {
            <p>No portfolio photos yet.</p>
          }
        </section>
      </div>
    }
  `,
})
export class BraiderProfileContentPage {
  private readonly api = inject(BRAIDER_PROFILE_API);
  private readonly dialogs = inject(DialogService);
  private readonly router = inject(Router);
  protected readonly profile = signal<BraiderProfileContent | null>(null);
  protected readonly loading = signal(true);
  protected readonly failed = signal(false);
  protected readonly saving = signal(false);
  protected readonly saved = signal(false);
  protected readonly error = signal<'stale' | 'invalid' | 'failed' | null>(null);
  protected readonly removing = signal<string | null>(null);
  protected readonly photoError = signal(false);
  protected readonly form = new FormGroup({
    bio: new FormControl('', { nonNullable: true }),
    area: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(120)],
    }),
    studioAddress: new FormControl('', { nonNullable: true }),
    preparation: new FormControl('', { nonNullable: true }),
    changePolicy: new FormControl('', { nonNullable: true }),
    cancellationPolicy: new FormControl('', { nonNullable: true }),
  });

  constructor() {
    afterNextRender(() => void this.load());
  }

  protected openSignOut(): void {
    this.dialogs
      .open<BraiderSignOutDialog, void, boolean>(BraiderSignOutDialog, { variant: 'destructive' })
      .closed.subscribe((signedOut) => {
        if (signedOut) void this.router.navigateByUrl('/sign-in');
      });
  }

  protected openAddPhoto(): void {
    this.dialogs
      .open<AddPortfolioItemDialog, readonly { slug: string; name: string }[], boolean>(
        AddPortfolioItemDialog,
        { data: this.profile()?.styles ?? [] },
      )
      .closed.subscribe((added) => {
        if (added) void this.load();
      });
  }

  protected async removePhoto(item: ManagedPortfolioItem): Promise<void> {
    if (this.removing()) return;
    this.removing.set(item.id);
    this.photoError.set(false);
    try {
      await firstValueFrom(this.api.removePhoto(item.id));
      await this.load();
    } catch {
      this.photoError.set(true);
    } finally {
      this.removing.set(null);
    }
  }

  protected async load(): Promise<void> {
    this.loading.set(true);
    this.failed.set(false);
    try {
      const profile = await firstValueFrom(this.api.get());
      this.profile.set(profile);
      this.form.setValue({
        bio: profile.bio,
        area: profile.area,
        studioAddress: profile.studioAddress,
        preparation: profile.preparation,
        changePolicy: profile.changePolicy,
        cancellationPolicy: profile.cancellationPolicy,
      });
      this.error.set(null);
    } catch {
      this.failed.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  protected async save(): Promise<void> {
    const current = this.profile();
    if (!current || this.saving()) return;
    this.saved.set(false);
    if (this.form.invalid) {
      this.error.set('invalid');
      return;
    }
    this.saving.set(true);
    this.error.set(null);
    try {
      const updated = await firstValueFrom(
        this.api.save({ ...this.form.getRawValue(), version: current.version }),
      );
      this.profile.set(updated);
      this.saved.set(true);
    } catch (error) {
      const api = ApiError.from(error);
      this.error.set(api.status === 409 ? 'stale' : api.status === 422 ? 'invalid' : 'failed');
    } finally {
      this.saving.set(false);
    }
  }
}
