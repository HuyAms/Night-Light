export class SettingsService {
  private sound: boolean = true; //default
  private grid: boolean = false; //default


  setSound(hasSound: boolean) {
    this.sound = hasSound;
  }

  hasSound() {
    return this.sound;
  }

  setGrid(isGrid: boolean) {
    this.grid = isGrid;
  }

  isGrid() {
    return this.grid;
  }

}
