import { AppDataSource } from '../config/database.config';
import { User } from '../entities/user.entity';
import { UserRole } from '../common/enums/role.enum';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const seedAdmin = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Base de données connectée...');

    const userRepository = AppDataSource.getRepository(User);

    const adminEmail = 'admin@apc-agri.org';
    const existingAdmin = await userRepository.findOneBy({ email: adminEmail });

    if (existingAdmin) {
      console.log('Un administrateur avec cet email existe déjà.');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('Admin@2026!', 10);

    const admin = userRepository.create({
      firstName: 'Admin',
      lastName: 'APC',
      email: adminEmail,
      password: hashedPassword,
      role: UserRole.ADMIN,
      isActive: true,
    });

    await userRepository.save(admin);
    console.log('--------------------------------------------------');
    console.log('✅ Compte Administrateur créé avec succès !');
    console.log(`Email : ${adminEmail}`);
    console.log('Mot de passe : Admin@2026!');
    console.log('--------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('Erreur lors du seeding :', error);
    process.exit(1);
  }
};

seedAdmin();
