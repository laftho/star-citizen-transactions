export class Profile {
  public readonly geid: string;
  public readonly accountid: string;
  public readonly name: string;
  public readonly dna: string;
  public readonly sex: string;
  public readonly race: string;

  constructor(geid: string, accountid: string, name: string, dna: string, sex: string, race: string) {
    this.geid = geid;
    this.accountid = accountid;
    this.name = name;
    this.dna = dna;
    this.sex = sex;
    this.race = race;
  }
}
