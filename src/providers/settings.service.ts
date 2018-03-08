export class SettingsService {
  private sound: boolean = true; //default

  setSound(hasSound: boolean) {
    this.sound = hasSound;
  }

  hasSound() {
    return this.sound;
  }

}
