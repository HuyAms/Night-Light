export class SettingsService {
  private sound: boolean = true; //default
  private altBackground : boolean = false; //default

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
    return this.altBackground;
  }
}
