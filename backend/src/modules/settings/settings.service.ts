import { AppDataSource } from '@/config/database.config';
import { Settings } from '@/entities/settings.entity';
import { UpdateSettingsDto } from './dto/settings.dto';

export class SettingsService {
  private repository = AppDataSource.getRepository(Settings);

  async getSettings() {
    let settings = await this.repository.findOne({ where: { id: 1 } });
    if (!settings) {
      // Initialiser avec des valeurs par défaut si vide
      settings = this.repository.create({
        id: 1,
        hero: {
          title: "Agir pour la Dignité humaine et la Paix",
          subtitle: "Organisation non gouvernementale engagée dans la protection sociale et le développement agricole.",
          imageUrl: ""
        },
        stats: {
          beneficiaries: "0",
          projects: "0",
          provinces: "0"
        },
        contact: {
          address: "",
          phone: "",
          email: ""
        }
      });
      await this.repository.save(settings);
    }
    return settings;
  }

  async updateSettings(data: UpdateSettingsDto) {
    const settings = await this.getSettings();
    
    if (data.hero) settings.hero = { ...settings.hero, ...data.hero };
    if (data.stats) settings.stats = { ...settings.stats, ...data.stats };
    if (data.contact) settings.contact = { ...settings.contact, ...data.contact };

    return await this.repository.save(settings);
  }
}
