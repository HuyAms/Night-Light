export class SettingsService {
  private sound: boolean = false;
  private altBackground : boolean = false;

  setSound(hasSound: boolean) {
    this.sound = hasSound;
  }

  hasSound() {
    return this.sound;
  }

  setIsAltTheme(isAltTheme: boolean) {
    this.altBackground  = isAltTheme;
  }

  isAltTheme() {
    return this.isAltTheme;
  }
}
