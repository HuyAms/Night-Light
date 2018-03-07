export class SettingsService {
  private sound: boolean = false;
  private contactMe: boolean = false;

  setSound(hasSound: boolean) {
    this.sound = hasSound;
  }

  hasSound() {
    return this.sound;
  }

  setContactMe(allowContactMe: boolean) {
    this.contactMe = allowContactMe;
  }

  allowContactMe() {
    return this.contactMe;
  }
}
